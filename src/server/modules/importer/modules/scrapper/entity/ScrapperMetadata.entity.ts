import {Column, Index} from 'typeorm';
import {RemoteRecordEntity, RemoteRecordFields} from '@server/modules/remote/entity';

export enum ScrapperMetadataKind {
  URL = 0,
  BOOK_REVIEW = 1,
  BOOK = 2,
  BOOK_AUTHOR = 3,
  BOOK_PUBLISHER = 4,
  BOOK_SUMMARY = 5,
}

export enum ScrapperMetadataStatus {
  IMPORTED = 1,
  NEW = 2,
}

/**
 * Saves already scrapped records (in case of improve scrappers)
 *
 * @export
 * @class ScrapperMetadataEntity
 * @extends {RemoteRecordFields}
 */
@RemoteRecordEntity(
  {
    name: 'scrapper_metadata',
  },
)
@Index(['kind'])
@Index(['status'])
export class ScrapperMetadataEntity extends RemoteRecordFields {
  @Column('text', {nullable: true})
  parserSource: string;

  @Column('jsonb', {nullable: true})
  content: any;

  @Column(
    {
      type: 'enum',
      enum: ScrapperMetadataKind,
      default: ScrapperMetadataKind.BOOK_REVIEW,
    },
  )
  kind: ScrapperMetadataKind;

  @Column(
    {
      type: 'enum',
      enum: ScrapperMetadataStatus,
      default: ScrapperMetadataStatus.NEW,
    },
  )
  status: ScrapperMetadataStatus;

  @Column(
    {
      type: 'timestamp',
    },
  )
  processedAt: Date = new Date;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(partial: Partial<ScrapperMetadataEntity>) {
    super(partial);
  }
}
