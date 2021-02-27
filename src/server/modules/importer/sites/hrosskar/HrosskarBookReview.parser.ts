import * as R from 'ramda';

import {
  normalizeISBN,
  normalizeParsedText,
} from '@server/common/helpers';

import {VotingStatsEmbeddable} from '@server/modules/shared/VotingStats.embeddable';
import {WebsiteScrapperParser} from '@scrapper/service/shared';
import {AsyncURLParseResult} from '@server/common/helpers/fetchAsyncHTML';
import {CreateBookDto} from '@server/modules/book/dto/CreateBook.dto';
import {CreateBookReviewDto} from '@server/modules/book/modules/review/dto/CreateBookReview.dto';
import {CreateBookAuthorDto} from '@server/modules/book/modules/author/dto/CreateBookAuthor.dto';
import {CreateBookReleaseDto} from '@server/modules/book/modules/release/dto/CreateBookRelease.dto';
import {CreateBookReviewerDto} from '@server/modules/book/modules/reviewer/dto/CreateBookReviewer.dto';

export class HrosskarBookReviewParser extends WebsiteScrapperParser<CreateBookReviewDto> {
  parse({$, url}: AsyncURLParseResult): CreateBookReviewDto {
    const blogPost = $('[itemprop="blogPost"]');
    const postBody = $(blogPost).find('.post-body');

    const description = postBody.text();
    const bookInfo = $(postBody).find('div').text();
    const header = $(blogPost).find('h3.post-title[itemprop=\'name\']').text();
    let [title, author] = R.map(R.trim, header.split(' - '));

    [title] = title.split(',');
    if (!author)
      author = normalizeParsedText(bookInfo.match(/Autor:\s*(.*)\n/i)?.[1]);

    const isbn = normalizeISBN(bookInfo.match(/ISBN:\s*([\w-]+)/i)?.[1]);
    const book = new CreateBookDto(
      {
        defaultTitle: title,
        releases: [
          new CreateBookReleaseDto(
            {
              isbn,
              title,
            },
          ),
        ],
        authors: [
          new CreateBookAuthorDto(
            {
              name: author,
            },
          ),
        ],
      },
    );

    const rating = description.match(/(?:Ocena:|Moja ocena)\s*(\d+)\s*\/\s*(\d+)/i)?.slice(1, 3);
    return new CreateBookReviewDto(
      {
        book,
        url,
        description: normalizeParsedText(description),
        rating: (
          rating?.length === 2
            ? ((+rating[0]) / (+rating[1])) * 10
            : null
        ),
        remoteId: $(blogPost).find('[itemprop=\'postId\']').attr('content'),
        publishDate: new Date($('a.timestamp-link [itemprop=\'datePublished\']').attr('title')),
        stats: new VotingStatsEmbeddable(
          {
            comments: $('#comment-holder .comment').length,
          },
        ),
        reviewer: new CreateBookReviewerDto(
          {
            name: $(blogPost).find('[itemprop="author"] [itemprop="name"]').text() || 'hrosskar',
          },
        ),
      },
    );
  }
}