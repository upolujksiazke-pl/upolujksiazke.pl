import {ScrapperMetadataKind} from '../../entity/ScrapperMetadata.entity';
import {
  ScrappersGroupInitializer,
  URLPathMatcher,
  WebsiteInfoScrapper,
  WebsiteScrappersGroup,
} from '../shared';

import {SpiderQueueProxyScrapper} from './SpiderQueueProxy.scrapper';

export type BookShopUrlsConfig = {
  homepageURL?: string,
  searchURL?: string,
};

export type BookShopScrappersGroupConfig = ScrappersGroupInitializer & BookShopUrlsConfig;

/**
 * Object that groups matchers, scrappers and parsers
 *
 * @export
 * @abstract
 * @class BookShopScrappersGroup
 * @extends {WebsiteScrappersGroup}
 * @implements {URLPathMatcher}
 */
export abstract class BookShopScrappersGroup extends WebsiteScrappersGroup implements URLPathMatcher {
  constructor({scrappers, ...config}: BookShopScrappersGroupConfig) {
    super(
      {
        websiteInfoScrapper: new WebsiteInfoScrapper(config.homepageURL),
        ...config,
        scrappers: scrappers ?? SpiderQueueProxyScrapper.createKindProxy(),
      },
    );
  }

  /**
   * @inheritdoc
   */
  abstract matchResourceKindByPath(path: string): ScrapperMetadataKind;
}