import cheerio from 'cheerio';

import {
  AsyncScrapper,
  ScrapperResult,
} from './AsyncScrapper';

export type HTMLParserAttrs = {
  $: cheerio.Root,
};

/**
 * Basic HTML scrapper, fetches HTML and parses it
 *
 * @export
 * @abstract
 * @class HTMLScrapper
 * @implements {Scrapper<T>}
 * @template T
 */
export abstract class HTMLScrapper<T> extends AsyncScrapper<T, string> {
  constructor(
    public readonly url: string,
  ) {
    super();
  }

  /**
   * Fetches HTML, parses it and returns iterator
   *
   * @private
   * @param {string} url
   * @returns
   * @memberof HTMLScrapper
   */
  protected async process(url: string) {
    const html = await this.fetchHTML(url);

    return this.parsePage(
      {
        $: cheerio.load(html),
      },
    );
  }

  /**
   * Returns HTML
   *
   * @protected
   * @param {string} url
   * @returns
   * @memberof HTMLScrapper
   */
  protected async fetchHTML(url: string) {
    return fetch(url).then((r) => r.text());
  }

  /**
   * Parses fetched page
   *
   * @protected
   * @param {HTMLParserAttrs} attrs
   * @returns {AsyncIterator<T>}
   * @memberof HTMLScrapper
   */
  protected abstract parsePage(attrs: HTMLParserAttrs): Promise<ScrapperResult<T, string>>;
}
