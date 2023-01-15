import { buildConfig } from 'payload/config';
import path from 'path';
// import seo from '../../dist';
import seo from '../../src'
import Users from './collections/Users'
import Pages from './collections/Pages'
import Media from './collections/Media'
import HomePage from './globals/Settings'
import Posts from './collections/Posts'
import { Node } from 'slate'

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
    webpack: (config) => {
      const newConfig = {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve.alias,
            react: path.join(__dirname, "../node_modules/react"),
            "react-dom": path.join(__dirname, "../node_modules/react-dom"),
            "payload": path.join(__dirname, "../node_modules/payload"),
          },
        },
      };

      return newConfig;
    },
  },
  collections: [
    Users,
    Pages,
    Posts,
    Media
  ],
  globals: [
    HomePage
  ],
  localization: {
    locales: [
      'en',
      'es',
      'de',
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    seo({
      collections: [
        'pages',
        'posts'
      ],
      globals: [
        'settings',
      ],
      tabbedUI: true,
      uploadsCollection: 'media',
      generateTitle: ({ doc } ) => `Website.com — ${doc?.title?.value }`,
      generateDescription: ({ doc } ) => doc?.excerpt?.value,
      generateURL: ({ doc } ) => `https://yoursite.com/${doc?.slug?.value || ''}`,
      ai: {
        gpt3: {
          apiKeySecret: process.env.GPT3_SECRET
        },
        getPageContent: ({doc, locale, slug}) => {
          if(doc?.content?.value) { // richText field. Alternatively we can check for if(slug === 'pages')
            return doc?.content.value.map(n => Node.string(n)).join('\n');
          }
          return doc?.excerpt?.value; // text field
        },
        metaTitle: {
          prefix: ({doc, pageContent, locale, slug}) => {
            return `Website.com - `;
          },
          suffix: ({doc, pageContent, locale, slug}) => {
            return ` | 2023`;
          },
          postProcess: ( {doc, generatedTitle, pageContent, locale} ) => generatedTitle
        }
      }
    }),
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
});
