import defaults from 'defaults';
import mime from 'mime';
import { basename, resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';

import type { Resource } from './types.js';

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

const uniqueResources = (acc: Resource[], cur: Resource) => {
  if (!acc.some(({ name }) => name === cur.name)) {
    acc.push(cur);
  }
  return acc;
};

// Checks if a type already has been added manually by user
const addResourceDetails = (resource: Resource): Required<Resource> => {
  const { name } = resource;
  return defaults(resource, {
    base: basename(name),
    properties: '',
    type: mime.getType(name) || '',
  });
};

export { addResourceDetails, makeFolder, uniqueResources };
