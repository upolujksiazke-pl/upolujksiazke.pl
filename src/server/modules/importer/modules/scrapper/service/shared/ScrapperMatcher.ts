import * as R from 'ramda';

import {parseAsyncURLIfOK} from '@server/common/helpers/fetchAsyncHTML';
import {concatUrls} from '@shared/helpers/concatUrls';

import {CanBePromise} from '@shared/types';
import {ScrapperGroupChild} from './Scrapper';
import {MatchRecordAttrs, WebsiteScrappersGroup} from './WebsiteScrappersGroup';

export type ScrapperMatcherResult<T> = {
  cached?: boolean,
  result: T,
};

export interface ScrapperMatchable<Type> {
  searchRemoteRecord(attrs: MatchRecordAttrs<Type>): CanBePromise<ScrapperMatcherResult<Type>>;
}

/**
 * Search over resource for book
 *
 * @export
 * @abstract
 * @class ScrapperMatcher
 * @implements {ScrapperGroupChild}
 * @implements {ScrapperMatchable<Type>}
 * @template Type
 */
export abstract class ScrapperMatcher<Type> implements ScrapperGroupChild, ScrapperMatchable<Type> {
  protected group: WebsiteScrappersGroup<any>;

  setParentGroup?(group: WebsiteScrappersGroup<any>): void {
    this.group = group;
  }

  get matchers() {
    return this.group.matchers;
  }

  abstract searchRemoteRecord(attrs: MatchRecordAttrs<Type>): CanBePromise<ScrapperMatcherResult<Type>>;
}

export type BaseWebsiteMatcherConfig = {
  homepageURL?: string,
};

/**
 * Search over website
 *
 * @export
 * @abstract
 * @class WebsiteScrapperMatcher
 * @extends {ScrapperMatcher<Type>}
 * @template Type
 * @template ConfigType
 */
export abstract class WebsiteScrapperMatcher<
  Type,
  ConfigType extends BaseWebsiteMatcherConfig = BaseWebsiteMatcherConfig,
> extends ScrapperMatcher<Type> {
  constructor(
    protected config: ConfigType,
  ) {
    super();
  }

  /**
   * Concats urls with root page url and fetches page
   *
   * @protected
   * @param {string} path
   * @returns
   * @memberof WebsiteScrapperMatcher
   */
  protected async searchByPath(path: string) {
    const {config: {homepageURL}} = this;

    if (!path)
      return null;

    return parseAsyncURLIfOK(
      R.unless(
        R.startsWith(homepageURL),
        R.partial(concatUrls, [homepageURL]),
      )(path),
    );
  }
}