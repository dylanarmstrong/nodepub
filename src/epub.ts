import defaults from 'defaults';
import zip from 'archiver';
import { createWriteStream } from 'node:fs';

import type { Data, Document, Metadata, Options, Section } from './types.js';
import {
  defaultCss,
  defaultMetadata,
  defaultOptions,
  defaultSection,
} from './constants.js';
import {
  getContainer,
  getContents,
  getCover,
  getOPF,
  getSection,
} from './pug.js';
import { addResourceDetails, makeFolder, uniqueResources } from './utils.js';

class Epub {
  data: Data;

  constructor({
    css: overrideCss = '',
    metadata: partialMetadata,
    options: partialOptions = {},
    resources = [],
    sections: partialSections,
  }: Document) {
    const metadata: Required<Metadata> = defaults(
      partialMetadata,
      defaultMetadata,
    );

    // Buffer being lost by defaults
    if (typeof metadata.cover !== 'string' && typeof partialMetadata.cover !== 'string') {
      metadata.cover.data = partialMetadata.cover.data;
    }

    const options: Required<Options> = defaults(
      partialOptions,
      defaultOptions,
    );

    const sections: Required<Section>[] = [];
    partialSections.forEach((section, index) => {
      const requiredSection: Required<Section> = defaults(
        section,
        defaultSection,
      );

      const sectionIndex = index + 1;
      const filename = `${section.filename || `s${sectionIndex}`}.xhtml`;

      requiredSection.index = sectionIndex;
      requiredSection.filename = filename;

      sections.push(requiredSection);
    });

    const { cover } = metadata;

    const css = [defaultCss, overrideCss].join('\n');

    const dataCover =
      typeof cover === 'string'
        ? cover
        : addResourceDetails({ ...cover, properties: 'cover-image' });
    const initialResources = typeof dataCover === 'string' ? [] : [dataCover];

    this.data = {
      cover: dataCover,
      css,
      metadata,
      options,
      resources: resources
        .reduce(uniqueResources, initialResources)
        .map(addResourceDetails),
      sections,
    };
  }

  // Gets the files needed for the EPUB, as an array of objects.
  // Note that 'compress:false' MUST be respected for valid EPUB files.
  getFiles() {
    const { data } = this;

    const files = [];

    // Required files.
    files.push({
      compress: false,
      content: 'application/epub+zip',
      folder: '',
      name: 'mimetype',
    });

    files.push({
      compress: true,
      content: getContainer(),
      folder: 'META-INF',
      name: 'container.xml',
    });

    files.push({
      compress: true,
      content: getOPF(data),
      folder: 'OPS',
      name: 'ebook.opf',
    });

    files.push({
      compress: true,
      content: getCover(data),
      folder: 'OPS',
      name: 'cover.xhtml',
    });

    // Optional files.
    files.push({
      compress: true,
      content: data.css,
      folder: 'OPS/css',
      name: 'ebook.css',
    });

    const { sections } = data;
    for (let i = 0, len = sections.length; i < len; i += 1) {
      const section = sections[i];
      files.push({
        compress: true,
        content: getSection(data, section),
        folder: 'OPS/content',
        name: section.filename,
      });
    }

    // Table of contents markup.
    if (data.options.showContents) {
      files.push({
        compress: true,
        content: getContents(data),
        folder: 'OPS/content',
        name: 'toc.xhtml',
      });
    }

    data.resources.forEach((resource) => {
      files.push({
        compress: true,
        content: resource.data,
        folder: 'OPS/resources',
        name: resource.base,
      });
    });

    // Return with the files.
    return files;
  }

  async write(folder: string, filename: string) {
    const files = this.getFiles();

    const fullFilename = filename.endsWith('.epub')
      ? filename
      : `${filename}.epub`;

    // Start creating the zip.
    await makeFolder(folder);
    const output = createWriteStream(`${folder}/${fullFilename}`);
    const archive = zip('zip', { store: false });
    archive.on('error', (archiveErr) => {
      throw archiveErr;
    });

    await new Promise<void>((resolveWrite) => {
      // Wait for file descriptor to be written.
      archive.pipe(output);
      output.on('close', () => resolveWrite());

      // Write the file contents.
      files.forEach((file) => {
        if (file.folder.length > 0) {
          archive.append(file.content, {
            name: `${file.folder}/${file.name}`,
            store: !file.compress,
          });
        } else {
          archive.append(file.content, {
            name: file.name,
            store: !file.compress,
          });
        }
      });

      // Done.
      archive.finalize();
    });
  }
}

export default Epub;
