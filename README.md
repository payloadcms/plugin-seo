# Payload SEO Plugin

[![NPM](https://img.shields.io/npm/v/@payloadcms/plugin-seo)](https://www.npmjs.com/package/@payloadcms/plugin-seo)

A plugin for [Payload CMS](https://github.com/payloadcms/payload) to auto-generate SEO meta data based on the content of your documents.

Core features:
  - Adds a `meta` field to every SEO-enabled collection that:
    - Includes title, description, and image subfields
    - Auto-generates meta data from your document's content
    - Displays hints and indicators to help content editors
    - Renders a snippet of what a search engine might display
    - Soon: variable injection

## Installation

```bash
  yarn add @payloadcms/plugin-seo
  # OR
  npm i @payloadcms/plugin-seo
```

## Basic Usage

In the `plugins` array of your [Payload config](https://payloadcms.com/docs/configuration/overview), call the plugin with [options](#options):

```js
import { buildConfig } from 'payload/config';
import seo from '@payloadcms/plugin-seo';

const config = buildConfig({
  collections: [
    {
      slug: 'pages',
      fields: []
    },
    {
      slug: 'media',
      upload: {
        staticDir: // path to your static directory,
      },
      fields: []
    }
  ],
  plugins: [
    seo({
      collections: [
        'pages',
      ],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `Website.com — ${doc.title.value}`,
      generateDescription: ({ doc }) => doc.excerpt
    })
  ]
});

export default config;
```

### Options

- `collections`

    An array of collections slugs to enable SEO. Enabled collections receive a `meta` field which is an object of title, description, and image subfields.


- `uploadsCollection`

    An upload-enabled collection slug, for the meta image to access.

- `generateTitle`

    A function that allows you to return any meta title, including from document's content.

    ```js
    seo({
      ...
      generateTitle: ({ doc, locale }) => `Website.com — ${doc?.title?.value}`,
    })
    ```

  - `generateDescription`

    A function that allows you to return any meta description, including from document's content.

    ```js
    seo({
      ...
      generateDescription: ({ doc, locale }) => doc?.excerpt?.value
    })
    ```

  - `generateURL`

    A function called by the search preview component to display the actual URL of your page.

    ```js
    seo({
      ...
      generateURL: ({ doc, locale }) => `https://yoursite.com/${doc?.slug?.value}`
    })
    ```

  ## TypeScript

  All types can be directly imported:

  ```js
  import {
    SEOConfig,
    GenerateTitle,
    GenerateDescription
    GenerateURL
   } from '@payloadcms/plugin-seo/dist/types';
  ```

  ## Screenshots
  ![image](https://user-images.githubusercontent.com/70709113/163850633-f3da5f8e-2527-4688-bc79-17233307a883.png)

  <!-- ![screenshot 1](https://github.com/@payloadcms/plugin-seo/blob/main/images/screenshot-1.jpg?raw=true) -->
