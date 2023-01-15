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
      generateTitle: ({ doc }: any) => `Website.com — ${doc?.title?.value}`,
      generateDescription: ({ doc }: any) => doc?.excerpt?.value,
      generateURL: ({ doc }: any) => `https://yoursite.com/${doc?.slug?.value || ''}`,
      ai: {
        gpt3: {
          apiKeySecret: process.env.GPT3_SECRET
        },
        getPageContent: ({doc, locale}: {doc: any, locale: string}) => {
          if(doc?.content?.value) { // richText field
            return doc?.content.value.map(n => Node.string(n)).join('\n');
          }
          return doc?.excerpt?.value; // text field
        },
        metaTitle: {
          prefix: ({pageContent, locale}) => {
            return `Website.com - `;
          },
          suffix: ({pageContent, locale}) => {
            return ` | 2033`;
          },
          postProcess: ( {generatedTitle, pageContent, locale} ) => generatedTitle
        }
      }
    }),
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
});
