import {ScrapperMetadataEntity} from '../scrapper/entity';

export interface MetadataDbLoader {
  /**
   * Insert metadata info to DB
   *
   * @param {ScrapperMetadataEntity} metadata
   * @returns {Promise<void>}
   * @memberof MetadataDbLoader
   */
  extractMetadataToDb(metadata: ScrapperMetadataEntity): Promise<void>
}