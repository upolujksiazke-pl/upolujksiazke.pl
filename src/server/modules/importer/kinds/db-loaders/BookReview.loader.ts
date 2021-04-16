import {Injectable, Logger} from '@nestjs/common';
import {EventEmitter2} from 'eventemitter2';
import {plainToClass} from 'class-transformer';
import * as R from 'ramda';
import chalk from 'chalk';

import {BookEntity} from '@server/modules/book/entity/Book.entity';
import {CreateBookReviewDto} from '@server/modules/book/modules/review/dto/CreateBookReview.dto';
import {InlineMetadataObject, MetadataDbLoader} from '@db-loader/MetadataDbLoader.interface';
import {FuzzyBookSearchService} from '@server/modules/book/services/search';
import {BookReviewService} from '@server/modules/book/modules/review/BookReview.service';
import {ScrapperService} from '../../modules/scrapper/service/Scrapper.service';
import {BookDbLoaderService} from './Book.loader';
import {BookReviewImportedEvent} from './events';

import {normalizeBookDTO} from '../scrappers/helpers';

@Injectable()
export class BookReviewDbLoaderService implements MetadataDbLoader {
  private readonly logger = new Logger(BookReviewDbLoaderService.name);

  constructor(
    private readonly scrapperService: ScrapperService,
    private readonly bookDbLoader: BookDbLoaderService,
    private readonly fuzzyBookSearchService: FuzzyBookSearchService,
    private readonly bookReviewService: BookReviewService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * @inheritdoc
   */
  async extractMetadataToDb(metadata: InlineMetadataObject) {
    const {logger, bookReviewService, eventEmitter} = this;

    if (!metadata?.content) {
      logger.warn('Missing metadata content!');
      return;
    }

    const dto = await this.parseAndAssignBook(metadata);
    if (!dto)
      return;

    const [reviewEntity] = await bookReviewService.upsert([dto]);
    await eventEmitter.emitAsync(
      'loader.review.imported',
      new BookReviewImportedEvent(reviewEntity, dto),
    );
  }

  /**
   * Converts json to review dto and search book attached to it
   *
   * @param {InlineMetadataObject} metadata
   * @returns
   * @memberof BookReviewDbLoaderService
   */
  async parseAndAssignBook(metadata: InlineMetadataObject) {
    const {
      fuzzyBookSearchService,
      scrapperService,
      bookDbLoader,
      logger,
    } = this;

    // deserialize and normalize search data
    let review = plainToClass(CreateBookReviewDto, metadata.content);
    review = new CreateBookReviewDto(
      {
        ...review,
        book: normalizeBookDTO(review.book),
      },
    );

    // lookup in cache
    let book: BookEntity = await fuzzyBookSearchService.findAlreadyCachedReviewBook(review);
    if (!book) {
      book = await bookDbLoader.searchAndExtractToDb(
        review.book,
        {
          skipIfAlreadyInDb: true,
          skipCacheLookup: true,
          skipDtoMerge: true,
        },
      );
    } else
      logger.warn(`Book with title "${chalk.bold(review.book.title)}" matched to ID: ${chalk.bold(book.id)}!`);

    if (!book) {
      logger.warn(`Unable to match review book with title "${review.book.title}"!`);
      return null;
    }

    if (R.isNil(review.releaseId)) {
      const isbn = review.getReleaseISBN();
      if (!R.isNil(isbn)) {
        review = new CreateBookReviewDto(
          {
            ...review,
            releaseId: (
              book.releases?.find(R.propEq('isbn', isbn))?.id
            ),
          },
        );
      }
    }

    return new CreateBookReviewDto(
      {
        ...review,
        bookId: book.id,
        websiteId: (
          metadata.websiteId
            ?? (await scrapperService.findOrCreateWebsiteByUrl(review.url))?.id
        ),
      },
    );
  }
}
