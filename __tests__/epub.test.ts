import { jest } from '@jest/globals';

jest.useFakeTimers().setSystemTime(new Date('2023-06-03 00:00:00'));

const Epub = (await import('../src/epub.js')).default;

describe('epub', () => {
  const sections = [
    {
      content: 'Title Page for My First Book',
      excludeFromContents: true,
      filename: 'title-page',
      isFrontMatter: true,
      title: 'Title Page',
    },
    {
      content: '<h1>One</h1>This is the first chapter',
      title: 'Chapter 1',
    },
    {
      content:
        '<h1>Two</h1>This is the second chapter, and is excluded from the TOC.',
      excludeFromContents: true,
      title: 'Chapter 2',
    },
  ];

  const metadata = {
    author: 'Dylan',
    contents: 'Chapters',
    copyright: 'Dylan, 2023',
    cover: {
      data: Buffer.from([0]),
      name: 'example/cover.png',
    },
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

  const css = 'body { margin: 5px; }';

  // Checks that duplicate is removed
  const resources = [
    {
      data: Buffer.from([0]),
      name: 'example/hat.png',
    },
    {
      data: Buffer.from([0]),
      name: 'example/hat.png',
    },
  ];

  it('Forms Valid Internal Data Structure', () => {
    const epub = new Epub({
      css,
      metadata,
      resources,
      sections,
    });

    expect(epub.data).toEqual({
      cover: {
        base: 'cover.png',
        data: expect.any(Buffer),
        name: 'example/cover.png',
        properties: 'cover-image',
        type: 'image/png',
      },
      css: `
#toc ol {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

body { margin: 5px; }`,
      metadata: {
        author: 'Dylan',
        contents: 'Chapters',
        copyright: 'Dylan, 2023',
        cover: {
          data: expect.any(Buffer),
          name: 'example/cover.png',
        },
        description: 'A test book.',
        fileAs: 'Dylan',
        genre: 'Non-Fiction',
        id: '1234',
        language: 'en',
        modified: '2023-06-02T22:00:00Z',
        published: '1992-06-17',
        publisher: 'My Fake Publisher',
        sequence: 1,
        series: 'My Series',
        source: 'https://dylan.is',
        tags: ['Sample', 'Example', 'Test'],
        title: 'My First Book',
      },
      options: {
        coverType: 'image',
        showContents: true,
      },
      resources: [
        {
          base: 'cover.png',
          data: expect.any(Buffer),
          name: 'example/cover.png',
          properties: 'cover-image',
          type: 'image/png',
        },
        {
          base: 'hat.png',
          data: expect.any(Buffer),
          name: 'example/hat.png',
          properties: '',
          type: 'image/png',
        },
      ],
      sections: [
        {
          content: 'Title Page for My First Book',
          excludeFromContents: true,
          filename: 'title-page.xhtml',
          index: 1,
          isFrontMatter: true,
          title: 'Title Page',
        },
        {
          content: '<h1>One</h1>This is the first chapter',
          excludeFromContents: false,
          filename: 's2.xhtml',
          index: 2,
          isFrontMatter: false,
          title: 'Chapter 1',
        },
        {
          content:
            '<h1>Two</h1>This is the second chapter, and is excluded from the TOC.',
          excludeFromContents: true,
          filename: 's3.xhtml',
          index: 3,
          isFrontMatter: false,
          title: 'Chapter 2',
        },
      ],
    });
  });

  it('Gets List of Files for EPUB', async () => {
    const epub = new Epub({
      css,
      metadata,
      resources,
      sections,
    });

    const files = epub.getFiles();

    expect(files).toStrictEqual([
      {
        compress: false,
        content: 'application/epub+zip',
        folder: '',
        name: 'mimetype',
      },
      {
        compress: true,
        content: expect.any(String),
        folder: 'META-INF',
        name: 'container.xml',
      },
      {
        compress: true,
        content: expect.any(String),
        folder: 'OPS',
        name: 'ebook.opf',
      },
      {
        compress: true,
        content: expect.any(String),
        folder: 'OPS',
        name: 'cover.xhtml',
      },
      {
        compress: true,
        content: expect.any(String),
        folder: 'OPS/css',
        name: 'ebook.css',
      },
      {
        compress: true,
        content: expect.any(String),
        folder: 'OPS/content',
        name: 'title-page.xhtml',
      },
      {
        compress: true,
        content: expect.any(String),
        folder: 'OPS/content',
        name: 's2.xhtml',
      },
      {
        compress: true,
        content: expect.any(String),
        folder: 'OPS/content',
        name: 's3.xhtml',
      },
      {
        compress: true,
        content: expect.any(String),
        folder: 'OPS/content',
        name: 'toc.xhtml',
      },
      {
        compress: true,
        content: expect.any(Buffer),
        folder: 'OPS/resources',
        name: 'cover.png',
      },
      {
        compress: true,
        content: expect.any(Buffer),
        folder: 'OPS/resources',
        name: 'hat.png',
      },
    ]);
  });

  it('Handles text cover correctly', () => {
    const epub = new Epub({
      css,
      metadata: { ...metadata, cover: '<h1>Cover</h1>' },
      options: {
        coverType: 'text' as const,
      },
      resources,
      sections,
    });

    expect(epub.data.options.coverType).toBe('text');
    expect(epub.data.cover).toBe('<h1>Cover</h1>');
    expect(epub.data.metadata.cover).toBe('<h1>Cover</h1>');
    const files = epub.getFiles();
    expect(
      files.filter(({ folder }) => folder === 'OPS/resources').length,
    ).toBe(1);
  });
});
