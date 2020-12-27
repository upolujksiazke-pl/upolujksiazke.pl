import {ID} from '@shared/types';
import {EntityData, FilterQuery, wrap} from '@mikro-orm/core';
import {EntityRepository} from '@mikro-orm/postgresql';

export type UpsertAttrs<T> = {
  repository: EntityRepository<T>,
  where?: FilterQuery<T>,
  data: EntityData<T>,
  update?: boolean,
};

/**
 * Updates or creates object based on data.id or where condition.
 *
 * @export
 * @template T
 * @param {UpsertAttrs<T>} attrs
 * @returns
 */
export async function upsert<T extends {id?: ID}>(
  {
    update = true,
    repository,
    where,
    data,
  }: UpsertAttrs<T>,
) {
  const prevEntity = await repository.findOne(
    where ?? data.id,
  );

  // update
  if (prevEntity) {
    if (update) {
      wrap(prevEntity).assign(data);
      await repository.persistAndFlush(prevEntity);
    }

    return prevEntity;
  }

  // create new
  await repository.persistAndFlush(
    repository.create(data),
  );
  return data;
}