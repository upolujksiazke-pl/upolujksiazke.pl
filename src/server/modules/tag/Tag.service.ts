import {Injectable} from '@nestjs/common';
import {EntityManager, In, Repository} from 'typeorm';
import {plainToClass} from 'class-transformer';
import * as R from 'ramda';

import {findByName} from '@shared/helpers/findByProp';

import {TagEntity} from './Tag.entity';
import {CreateTagDto} from './dto/CreateTag.dto';

@Injectable()
export class TagService {
  /**
   * Creates single tag
   *
   * @param {CreateTagDto} dto
   * @returns {Promise<TagEntity>}
   * @memberof TagService
   */
  create(dto: CreateTagDto): Promise<TagEntity> {
    return TagEntity.save(
      TagEntity.create(dto),
    );
  }

  /**
   * Updates array of tags
   *
   * @param {CreateTagDto[]} dto
   * @param {EntityManager} [entityManager]
   * @returns {Promise<TagEntity[]>}
   * @memberof TagService
   */
  async upsertList(dto: CreateTagDto[], entityManager?: EntityManager): Promise<TagEntity[]> {
    if (!dto?.length)
      return [];

    let savedEntities = await TagEntity.find(
      {
        name: In(R.pluck('name', dto)),
      },
    );

    const toBeInserted = dto.reduce(
      (acc, item) => {
        if (!findByName(item.name)(savedEntities))
          acc.push(item);

        return acc;
      },
      [] as CreateTagDto[],
    );

    if (toBeInserted.length) {
      const repo = (entityManager.getRepository(TagEntity) || TagEntity) as Repository<TagEntity>;

      const r = await repo
        .createQueryBuilder()
        .insert()
        .into(TagEntity)
        .values(toBeInserted)
        .execute();

      savedEntities = [
        ...savedEntities,
        ...plainToClass(TagEntity, r.generatedMaps),
      ];
    }

    return savedEntities;
  }
}