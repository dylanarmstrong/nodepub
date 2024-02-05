# CHANGE LOG
## 2024-02-05 - v4.1.5
- **FIX**: Fix resources not being buffers due to structuredClone

## 2024-02-05 - v4.1.4
- Version updates
- Better ESM support

## 2023-07-05 - v4.1.3
- Move `@dylanarmstrong/tsconfig` to devDependencies

## 2023-07-04 - v4.1.2
- Publish with types

## 2023-07-04 - v4.1.1
- Allow overriding all `Resource` properties
- Cast `defaults` to `Required<T>` instead of having messy type guards
  - This is hopefully temporary, pending this PR: https://github.com/sindresorhus/node-defaults/pull/6
- Switch to shared tsconfig `@dylanarmstrong/tsconfig`

## 2023-07-04 - v4.1.0
- Use `mime` for handling mime types, to support mp3 and such
- Example converted to typescript
- Pug files now prettified, so they can be read in an editor easier
- ID now defaults to uuid
- **FIX**: Output language correctly
- **FIX**: Consider cover as a duplicate image as well
- **BREAKING**: Resources must now be passed with `{ data: Buffer; name: string }`
- **BREAKING**: `images` -> `resources` in constructor options

## 2023-07-03 - v4.0.2
- **FIX**: Do not add duplicate images

## 2023-07-03 - v4.0.1
- Publishing over unpublished broken v4.0.0 version

## 2023-07-03 - v4.0.0
- Generates EPUB v3.3
- Project converted to Typescript
- Support non-image text covers
- Pug for templates instead of string concatenation
- Forked by [@dylanarmstrong](https://github.com/dylanarmstrong)
- Tests changed from mocha -> jest
- **BREAKING**: Now exports default class `Epub`.
- **BREAKING**: Only available as an ES Module
- **BREAKING**: Removed ability to write individual files
- **BREAKING**: Removed generate TOC callback
- **BREAKING**: Sections / Images / CSS / Options must be in options passed to `Epub` constructor.

## 2022-03-03 - v3.0.8

- #23 indent breaks `pre` tag
  - Removed automatic indent
- Updated dependencies

## 2021-10-05 - v3.0.7

- Contents page can be suppressed
  - New `showContents` metadata item

## 2021-10-05 - v3.0.6

- Section filename override
  - Optionally rename content files
  - Allows internal linking

## 2021-10-04 - v3.0.5

- `Genre` now optional
- Image collection now optional
  - Cover still required

## 2021-10-03 - v3.0.4

- Correct the mimetype for `.jpg` cover images
  - Thanks to bmaupin
- `npm audit` updates for transitive dependencies
  - Avoid `lodash` command injection
  - Avoid regex denials of service

## 2021-04-11 - v3.0.2

- Wait for file descriptor before returning from writeEPUB

## 2021-02-22 - v3.0.0, v3.0.1

- Included [Wallaby.js](https://wallabyjs.com/) configuration
  - Contributors can use a free OSS license (I have a paid one, it's worth supporting)
- Switched to `async`/`await` rather than callbacks
- Updated documentation
- Bumped version to update the documentation on *npm*

## 2021-02-17

- Now developed against Node v15.6.0
  - Node v10.3 or later should work fine
- Updated dependencies
  - Updated Sinon stub syntax in tests
- Moved `cover` into document metadata
  - Now supports multiple image types (`png`, `jpg`, etc)
  - Any type whose file extention fits a mimetype like `image/png` or `image/jpg`

---

## BREAKING CHANGES

---

## 2020-04-14

- Merged `RELEASES.md` into here

## 2020-04-13 - v2.2.0

- Updated various package versions
- Added a change log file

## 2019-03-20 - v2.1.1

- Updated `package.json` to add `src` folder to `start` entry

## 2019-03-20 - v2.1.0

- Updated dependencies
- Restructured source folders
- Switched from Jasmine tests to Mocha
- Added *npm* scripts for running `eslint` and the example

Breaking changes:

- The `makeContentsPage` callback function will no longer receive the default markup as a second parameter.

---

## v2.0.7

- Thanks to [Harold Treen](https://github.com/haroldtreen) the API has switched to being asynchronous

## v1.0.7

- This version introduces stability at the expense of minor breaking changes, consisting almost entirely of renames from chapter to section but with some of the pre-generated pages of earlier versions eliminated. The result is more abstracted but also more flexible, whilst also retaining most of it's simplicity.
