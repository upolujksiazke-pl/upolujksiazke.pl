import {
  normalizeISBN,
  normalizeURL,
  normalizeParsedText,
} from '@server/common/helpers';

import {Language} from '@server/constants/language';
import {CreateBookAuthorDto} from '@server/modules/book/modules/author/dto/CreateBookAuthor.dto';
import {CreateBookDto} from '@server/modules/book/dto/CreateBook.dto';
import {CreateBookReleaseDto} from '@server/modules/book/modules/release/dto/CreateBookRelease.dto';
import {CreateBookPublisherDto} from '@server/modules/book/modules/publisher/dto/BookPublisher.dto';
import {CreateImageAttachmentDto} from '@server/modules/attachment/dto';
import {CreateBookAvailabilityDto} from '@server/modules/book/modules/availability/dto/CreateBookAvailability.dto';
import {CreateBookCategoryDto} from '@server/modules/book/modules/category/dto/CreateBookCategory.dto';

import {AsyncURLParseResult} from '@server/common/helpers/fetchAsyncHTML';
import {WebsiteScrapperParser} from '../../modules/scrapper/service/shared';
import {BookAvailabilityParser} from '../../modules/scrapper/service/scrappers/Book.scrapper';

export class GraniceBookParser
  extends WebsiteScrapperParser<CreateBookDto>
  implements BookAvailabilityParser<AsyncURLParseResult> {
  /**
   * @inheritdoc
   */
  parseAvailability({$, url}: AsyncURLParseResult) {
    const remoteId = $('#book_id.detailsbig').attr('book-id');

    return Promise.resolve(
      {
        result: [
          new CreateBookAvailabilityDto(
            {
              showOnlyAsQuote: true,
              remoteId,
              url,
            },
          ),
        ],
      },
    );
  }

  /**
   * @inheritdoc
   */
  /* eslint-disable @typescript-eslint/dot-notation */
  async parse(bookPage: AsyncURLParseResult) {
    if (!bookPage)
      return null;

    const {$} = bookPage;
    const $content = $('.web > .sub > .column1');
    const $details = $content.find('#book_id.detailsbig');
    const [detailsText, detailsHTML] = [$details.text(), $details.html()];

    const title = normalizeParsedText($content.find('h1 > [itemprop="name"]').text());

    const categories = (
      (normalizeParsedText(detailsText.match(/Kategoria: ([\S]+)/)?.[1]) || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((name) => new CreateBookCategoryDto(
          {
            name,
          },
        ))
    );

    const authors = $details.find('[itemprop="author"]').text().split(',').map(
      (name) => new CreateBookAuthorDto(
        {
          name: normalizeParsedText(name),
        },
      ),
    );

    const release = new CreateBookReleaseDto(
      {
        title,
        lang: Language.PL,
        description: normalizeParsedText($content.find('> .desc > p:not(:empty):not(.tags)').text()),
        totalPages: +$details.find('span[itemprop="numberOfPages"]').text() || null,
        publishDate: normalizeParsedText(detailsText.match(/Data wydania: ([\S]+)/)?.[1]),
        availability: (await this.parseAvailability(bookPage)).result,
        isbn: normalizeISBN(
          $details.find('isbn[itemprop="isbn"]').text(),
        ),
        publisher: new CreateBookPublisherDto(
          {
            name: normalizeParsedText($details.find('[itemprop="publisher"] > a').text()),
          },
        ),
        cover: new CreateImageAttachmentDto(
          {
            originalUrl: normalizeURL(
              $details.find('[itemprop="image"]').attr('src'),
            ),
          },
        ),
      },
    );

    return new CreateBookDto(
      {
        defaultTitle: title,
        originalTitle: normalizeParsedText(detailsHTML.match(/Tytuł oryginału: ([^\n<>]+)/)?.[1]),
        authors,
        releases: [release],
        categories,
      },
    );
  }
  /* eslint-enable @typescript-eslint/dot-notation */
}