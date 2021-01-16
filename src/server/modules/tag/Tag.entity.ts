import {
  Entity, Column,
  BeforeInsert, BeforeUpdate,
} from 'typeorm';

import {DatedRecordEntity} from '../database/DatedRecord.entity';

@Entity(
  {
    name: 'tag',
  },
)
export class TagEntity extends DatedRecordEntity {
  @Column('citext', {unique: true})
  name: string;

  constructor(partial: Partial<TagEntity>) {
    super();
    Object.assign(this, partial);
  }

  @BeforeInsert()
  @BeforeUpdate()
  transformFields() {
    const {name} = this;
    if (name)
      this.name = name.toLowerCase();
  }
}
