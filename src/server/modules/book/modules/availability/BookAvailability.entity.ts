import {
  Column, Index, JoinColumn,
  ManyToOne, RelationId, Unique,
} from 'typeorm';

import {RemoteRecordEntity, RemoteRecordFields} from '@server/modules/remote/entity/RemoteRecord.entity';
import {BookEntity} from '../../Book.entity';
import {BookReleaseEntity} from '../release/BookRelease.entity';

/**
 * @todo Add book type to unique
 *
 * @export
 * @class BookAvailabilityEntity
 * @extends {RemoteRecordFields}
 */
@RemoteRecordEntity(
  {
    name: 'book_availability',
  },
)
@Index(['book'])
@Index(['book', 'releaseId'])
@Unique(
  'book_availability_unique_book_website',
  ['book', 'website', 'release'],
)
export class BookAvailabilityEntity extends RemoteRecordFields {
  @Column(
    'decimal',
    {
      precision: 5,
      scale: 2,
      nullable: true,
    },
  )
  prevPrice: number;

  @Column(
    'decimal',
    {
      precision: 5,
      scale: 2,
      nullable: true,
    },
  )
  price: number;

  @Column('float', {nullable: true})
  avgRating: number;

  @Column('integer', {nullable: true})
  totalRatings: number;

  @ManyToOne(() => BookEntity, (entity) => entity.availability, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'bookId'})
  book: BookEntity;

  @Column()
  @RelationId((entity: BookAvailabilityEntity) => entity.book)
  bookId: number;

  @ManyToOne(() => BookReleaseEntity, (entity) => entity.availability, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'releaseId'})
  release: BookReleaseEntity;

  @Column()
  @RelationId((entity: BookAvailabilityEntity) => entity.book)
  releaseId: number;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(partial: Partial<BookAvailabilityEntity>) {
    super(partial);
  }
}
