import {BookReviewEntity} from '@server/modules/book/modules/review/BookReview.entity';
import {CreateBookReviewDto} from '@server/modules/book/modules/review/dto/CreateBookReview.dto';

export class BookReviewImportedEvent {
  constructor(
    public readonly book: BookReviewEntity,
    public readonly dto: CreateBookReviewDto,
  ) {}
}
