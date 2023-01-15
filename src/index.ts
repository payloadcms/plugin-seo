import { Config, Endpoint } from 'payload/config';
import { getMetaDescriptionField } from './fields/MetaDescription';
import { Overview } from './ui/Overview';
import { getMetaTitleField } from './fields/MetaTitle';
import { getPreviewField } from './ui/Preview';
import { getMetaImageField } from './fields/MetaImage';
import { PluginConfig } from './types';
import { Field, GroupField, TabsField } from 'payload/dist/fields/config/types';
import { generateAIMetaDescriptionServer, generateAIMetaTitleServer } from './ai/Generator';

const seo = (pluginConfig: PluginConfig) => (config: Config): Config => {
  const seoFields: (slug?: string) => GroupField[] = (slug?: string) => [
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: [
        {
          name: 'overview',
          label: 'Overview',
          type: 'ui',
          admin: {
            components: {
              Field: Overview,
            },
          },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          admin: {
            components: {
              Field: (props) => getMetaTitleField({ ...props, pluginConfig, slug }),
            },
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          admin: {
            components: {
              Field: (props) => getMetaDescriptionField({ ...props, pluginConfig, slug }),
            },
          },
        },
        ...pluginConfig?.uploadsCollection ? [{
          name: 'image',
          label: 'Meta Image',
          type: 'upload',
          localized: true,
          relationTo: pluginConfig?.uploadsCollection,
          admin: {
            description: 'Maximum upload file size: 12MB. Recommended file size for images is <500KB.',
            components: {
              Field: (props) => getMetaImageField({ ...props, pluginConfig, slug }),
            },
          },
        } as Field] : [],
        {
          name: 'preview',
          label: 'Preview',
          type: 'ui',
          admin: {
            components: {
              Field: (props) => getPreviewField({ ...props, pluginConfig, slug }),
            },
          },
        },
      ]
    }
  ]

  const endpoints: Endpoint[] = [];

  if(pluginConfig?.ai?.gpt3) {
    endpoints.push({
      path: '/plugin-seo/ai/gpt3/generateAIMetaTitle',
      method: 'post',
      handler: async (req, res, next) => {
        return generateAIMetaTitleServer({handler: { req, res, next }, pluginConfig})
      }
    });

    endpoints.push({
      path: '/plugin-seo/ai/gpt3/generateAIMetaDescription',
      method: 'post',
      handler: async (req, res, next) => {
        return generateAIMetaDescriptionServer({handler: { req, res, next }, pluginConfig})
      }
    });
  }


  return ({
    ...config,
    endpoints: endpoints,
    collections: config.collections?.map((collection) => {
      const { slug } = collection;
      const isEnabled = pluginConfig?.collections?.includes(slug);

      if (isEnabled) {
        if (pluginConfig?.tabbedUI) {
          const seoFieldsAsTabs: TabsField[]  =  [{
            type: 'tabs',
            tabs: [
              // if the collection is already tab-enabled, spread them into this new tabs field
              // otherwise create a new tab to contain this collection's fields
              // either way, append a new tab for the SEO fields
              ...collection?.fields?.[0].type === 'tabs'
                ? collection?.fields?.[0]?.tabs : [{
                  label: collection?.labels?.singular || 'Content',
                  fields: [...(collection?.fields || [])]
                }],
              {
                label: 'SEO',
                fields: seoFields(slug),
              }
            ]
          }]

          return ({
            ...collection,
            fields: seoFieldsAsTabs,
          })
        }

        return ({
          ...collection,
          fields: [
            ...collection?.fields || [],
            ...seoFields(slug),
          ],
        })
      }

      return collection;
    }) || [],
    globals: config.globals?.map((global) => {
      const { slug } = global;
      const isEnabled = pluginConfig?.globals?.includes(slug);

      if (isEnabled) {
        if (pluginConfig?.tabbedUI) {
          const seoFieldsAsTabs: TabsField[]  =  [{
            type: 'tabs',
            tabs: [
              // if the global is already tab-enabled, spread them into this new tabs field
              // otherwise create a new tab to contain this global's fields
              // either way, append a new tab for the SEO fields
              ...global?.fields?.[0].type === 'tabs'
                ? global?.fields?.[0]?.tabs : [{
                  label: global?.label || 'Content',
                  fields: [...(global?.fields || [])]
                }],
              {
                label: 'SEO',
                fields: seoFields(slug),
              }
            ]
          }]

          return ({
            ...global,
            fields: seoFieldsAsTabs,
          })
        }

        return ({
          ...global,
          fields: [
            ...global?.fields || [],
            ...seoFields(slug),
          ],
        })
      }

      return global;
    }) || []
  })
};

export default seo;
