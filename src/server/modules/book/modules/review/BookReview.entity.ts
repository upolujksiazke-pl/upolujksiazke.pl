import {
  Column, ManyToOne,
  JoinColumn, RelationId, Index,
} from 'typeorm';

import {RemoteRecordEntity, RemoteRecordFields} from '@server/modules/remote/entity/RemoteRecord.entity';
import {VotingStatsEmbeddable} from '@server/modules/shared/VotingStats.embeddable';

import {BookReviewerEntity} from '../reviewer/BookReviewer.entity';
import {BookEntity} from '../../Book.entity';
import {BookReleaseEntity} from '../release/BookRelease.entity';

@RemoteRecordEntity(
  {
    name: 'book_review',
  },
)
@Index(['book'])
export class BookReviewEntity extends RemoteRecordFields {
  @Column('timestamp')
  publishDate: Date;

  @ManyToOne(() => BookReviewerEntity, (entity) => entity.reviews)
  reviewer: BookReviewerEntity;

  @Column('text')
  description: string;

  @Column('smallint', {nullable: true})
  rating: number;

  @ManyToOne(() => BookEntity, (book) => book.reviews)
  book: BookEntity;

  @Column(() => VotingStatsEmbeddable)
  stats: VotingStatsEmbeddable;

  @ManyToOne(() => BookReleaseEntity, (entity) => entity.reviews, {onDelete: 'SET NULL'})
  @JoinColumn({name: 'releaseId'})
  release: BookReleaseEntity;

  @Column()
  @RelationId((entity: BookReviewEntity) => entity.release)
  releaseId: number;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(partial: Partial<BookReviewEntity>) {
    super(partial);
  }
}
