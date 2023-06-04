![IDPF](https://img.shields.io/badge/idpf-valid-success)

# Nodepub

Create valid Epub 3.3 ebooks with metadata, contents, cover, and images.

*This is a utility module, not a user-facing one. In other words it is assumed that the caller has already validated the inputs. Only basic sanity checks are performed.*

## Contents

- [About Nodepub](#about-nodepub)
- [Installation](#installation)
- [Creating an Epub](#creating-an-epub)
  - [Setting the Metadata](#setting-the-metadata)
    - [Example Metadata](#example-metadata)
  - [Adding Contents](#adding-contents)
  - [Including Images](#including-images)
  - [Changing the Styling](#changing-the-styling)
  - [Custom Table of Contents](#custom-table-of-contents)
  - [Generating Output](#generating-output)
- [A Full Example](#a-full-example)
- [Changelog](#changelog)
- [Previous Work](#previous-work)

## About Nodepub

Nodepub is a **Node** module which can be used to create **Epub 3** documents.

- Files pass validation via [epubcheck](https://github.com/w3c/epubcheck)
- Files open fine in iBooks and Calibre
- PNG/JPEG cover images (or text)
- Inline resources within the Epub
  - See [Including Resources](#including-resources) for supported formats
- Custom CSS can be provided
- Front matter before the contents page
- Exclude sections from auto contents page and metadata-based navigation
- OPS and other 'expected' subfolders within the Epub

Development is done against Node v16.20.0 since v4.0.0 (June 2023).
*Node v16.0 or later* should work fine.

## About @dylanarmstrong/nodepub

This is a continuation of the work by [kartlidge](https://github.com/kcartlidge/nodepub)
and is a complete rewrite targeting Epub v3.3.

## Installation

It's an [npm package](https://www.npmjs.com/package/@dylanarmstrong/nodepub).
To install it:

``` sh
npm install @dylanarmstrong/nodepub
# or
pnpm add @dylanarmstrong/nodepub
```

Then import it for use:

``` javascript
import Epub from '@dylanarmstrong/nodepub';
```

## Creating an Epub

- Documents consist of *metadata*, *sections*, *resources*, *css*, and *options*
  - `metadata` is provided in the form of an object with various properties detailing the book
  - `sections` are chunks of HTML where each represent a chapter, front/back matter, or similar
  - `resources` are inlined image / mp3 files that can appear within the body of the Epub
    - The cover is a special resource which is declared within the metadata
  - `css` is for appending to the book `css`
  - `options` are for general options that control some formatting of the book

``` javascript
const metadata = {
  author: 'Dylan',
  contents: 'Chapters',
  copyright: 'Dylan, 2023',
  cover: 'example/cover.png',
  description: 'A test book.',
  fileAs: 'Dylan',
  genre: 'Non-Fiction',
  id: '1234',
  language: 'en',
  published: '1992-06-17',
  publisher: 'My Fake Publisher',
  sequence: 1,
  series: 'My Series',
  source: 'https://dylan.is',
  tags: ['Sample', 'Example', 'Test'],
  title: 'My First Book',
};

const resources = ['../example/hat.png'];

const sections = [
  {
    content: 'This is a libre book with no copyright',
    excludeFromContents: true,
    filename: 'copyright-page',
    isFrontMatter: true,
    title: 'Copyright',
  },
  {
    content: 'Chapter 1',
    title: '<h1>Chapter One</h1><p>...</p>',
  },
  {
    content: 'Chapter 2',
    title: '<h1>Chapter Two</h1><p>...</p>',
  },
];

const css = `
  table {
    border: 3px double #ccc;
    margin-left: auto;
    margin-right: auto;
    padding: 0.5em;
  }
`;

const options = {
  showContents: true,
  coverType: 'image', // Possible types are 'image' and 'text'
};

const epub = new Epub({
  metadata,
  sections,
  // Optional
  css,
  options,
  resources,
});
```

### Regarding Metadata

- `cover` should be the filename of an image - recommendation is 600x800, 600x900, or similar
- `fileAs` is the sortable version of the `author`, which is usually by last name
- `genre` becomes the main subject in the final Epub
- `language` is the short *ISO* language name (`en`, `fr`, `de` etc)
- `published` is the data published - note the *year-month-day* format
- `series` and `sequence` are not recognised by many readers (it sets the properties used by *Calibre*)
- `showContents` (default is `true`) lets you suppress the contents page
- `tags` also become subjects in the final Epub

### Regarding Sections

| PARAMETER           | PURPOSE                          | DEFAULT |
| ------------------- | -------------------------------- | ------- |
| title (required)    | Table of contents entry text     |         |
| content (required)  | HTML body text                   |         |
| excludeFromContents | Hide from contents/navigation    | `false` |
| isFrontMatter       | Place before the contents page   | `false` |
| overrideFilename    | Section filename inside the Epub |         |

### Including Resources

Resources include images and mp3s.

In the example above:

``` javascript
const resources = ['../example/hat.png'];
```

This part of the metadata is an array of filenames which locate the source resources on your system.
(I strongly recommend you use relative paths in order to allow for documents being produced on different systems having different folder layouts.)

These resources are automatically added into the Epub when it is generated. They always go in an `resources` folder internally. As they all go into the same folder they *should have unique filenames*.

To include the resources in your content the HTML should refer to this internal folder rather than the original source folder, so for example `<img src="../resources/hat.png" />` in the above example.

### Changing the Styling

You can inject basic CSS into your book. This allows you to override the basic styling to change how it looks.
You should use this sparingly - there is inconsistent CSS support across ereader devices/software.

Modify the `css` parameter of `createEpub`.

```javascript
const css = `p { text-indent: 0; } p+p { text-indent: 0.75em; }`);
const epub = new Epub({
  css,
  resources,
  metadata,
  sections,
});
```

### Advanced Options

You can also modify the book with advanced options.

| PARAMETER           | PURPOSE                           | DEFAULT   |
| ------------------- | --------------------------------- | --------- |
| showContents        | Whether or not to include the TOC | `true`    |
| coverType           | Is the cover 'image' or 'text'?   | `'image'` |

```javascript
const options = {
  showContents: true, // Whether or not to include the TOC page (default: true)
  coverType: 'image', // Possible types are 'image' and 'text'  (default: 'image')
};

const epub = createEpub({
  metadata,
  options,
  sections,
});
```

### Generating Output

Having defined your document generating an Epub is as simple as:

``` javascript
await epub.write(folder, filename);
```

## A Full Example

In the top folder (the one containing the `package.json` file) run the following:

``` javascript
pnpm run example
```

This runs in [the `example` folder](./example) using the code in [`example/example.js`](./example/example.js) to generate a final Epub.

## Changelog

- [You can view the change log here.](./CHANGELOG.md)

## Previous Work & Credits

* [Original](https://github.com/kcartlidge/nodepub)
* [Original Fork with Pug Templates](https://github.com/fholzer/nodepub).
* [Nodepub3 with MP3](https://gitee.com/taolt/nodepub3/tree/master)
