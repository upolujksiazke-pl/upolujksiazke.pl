import {
  Column, Entity, JoinTable,
  ManyToMany, OneToMany,
} from 'typeorm';

import {ImageAttachmentEntity} from '@server/modules/attachment/entity';
import {DatedRecordEntity} from '../../../database/DatedRecord.entity';
import {BookReleaseEntity} from '../release/BookRelease.entity';

@Entity(
  {
    name: 'book_publisher',
  },
)
export class BookPublisherEntity extends DatedRecordEntity {
  constructor(partial: Partial<BookPublisherEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column('text', {unique: true})
  name: string;

  @Column('text', {nullable: true})
  websiteURL: string;

  @Column('text', {nullable: true})
  description: string;

  @Column('text', {nullable: true})
  address: string;

  @OneToMany(() => BookReleaseEntity, (entity) => entity.publisher)
  releases: BookReleaseEntity[];

  @ManyToMany(
    () => ImageAttachmentEntity,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinTable(
    {
      name: 'book_publisher_logo_image_attachments',
    },
  )
  logo: ImageAttachmentEntity[];
}