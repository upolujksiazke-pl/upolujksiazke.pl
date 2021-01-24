import * as fs from 'fs';
import * as util from 'util';
import {pipeline} from 'stream';

import {convertBytesToKilobytes} from '@shared/helpers/convert';

const streamPipeline = util.promisify(pipeline);

export type RemoteFileStats = {
  type: string,
  size: {
    bytes: number,
    kilobytes: number,
  },
};

export type FileDownloaderAttrs = {
  url: string,
  outputPath: string,
  headerValidatorFn?(stats: RemoteFileStats): boolean,
};

/**
 * Performs HEAD to remote server and fetches size and type
 *
 * @export
 * @param {string} url
 * @returns {Promise<RemoteFileStats>}
 */
export async function fetchRemoteFileStats(url: string): Promise<RemoteFileStats> {
  const {headers} = await fetch(
    url,
    {
      method: 'HEAD',
    },
  );

  const contentLength = +headers.get('content-length');

  return {
    type: headers.get('content-type'),
    size: {
      bytes: contentLength,
      kilobytes: convertBytesToKilobytes(contentLength),
    },
  };
}

/**
 * Saves remote file to disk
 *
 * @export
 * @param {FileDownloaderAttrs} attrs
 * @returns
 */
export async function downloadFile(
  {
    url,
    outputPath,
    headerValidatorFn,
  }: FileDownloaderAttrs,
) {
  if (headerValidatorFn) {
    if (!headerValidatorFn(await fetchRemoteFileStats(url)))
      return undefined;
  }

  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`unexpected response ${res.statusText}`);

  await streamPipeline(
    res.body as any,
    fs.createWriteStream(outputPath),
  );

  return {
    outputPath,
  };
}