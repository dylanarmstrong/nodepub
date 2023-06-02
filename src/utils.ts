import { mkdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

// Create a folder, throwing an error only if the error is not that
// the folder already exists. Effectively creates if not found.
const makeFolder = async (topPath: string) => {
  await mkdir(topPath).catch((err) => {
    if (err && err.code !== 'EEXIST') {
      throw err;
    }
    resolve();
  });
};

// Get the image mimetype based on the file name.
const getImageType = (filename: string) => {
  const imageExt = extname(filename).toLowerCase();
  switch (imageExt) {
    case '.svg':
      return 'image/svg+xml';

    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';

    case '.gif':
      return 'image/gif';

    case '.tif':
    case '.tiff':
      return 'image/tiff';

    case '.png':
      return 'image/png';

    // This will cause epub validation error
    default:
      return '';
  }
};

export { getImageType, makeFolder };
