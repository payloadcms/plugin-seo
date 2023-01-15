import { Field } from 'payload/dist/fields/config/types';

export type GenerateTitle = (args: { doc: any; locale?: string, slug?: string }) => string | Promise<string>
export type GenerateDescription = (args: {
  doc: any
  locale?: string
  slug?: string
}) => string | Promise<string>
export type GenerateImage = (args: { doc: any; locale?: string, slug?: string }) => string | Promise<string>
export type GenerateURL = (args: { doc: any; locale?: string, slug?: string }) => string | Promise<string>

export type AIOptions = {
  gpt3?: GPTAIOptions
  getPageContent: (args: { doc: any; locale?: string, slug?: string }) => string | Promise<string>
  metaTitle?: {
    postProcess?:  (args: { doc: any, generatedTitle: string, pageContent: string, locale: string, slug?: string}) => string
    prefix?: (args: { doc: any, pageContent: string, locale: string, slug?: string}) => string
    suffix?: (args: { doc: any, pageContent: string, locale: string, slug?: string}) => string
    maxInputPageContentLength?: number // Default: 10000
  },
  metaDescription?: {
    postProcess?:  (args: { doc: any, generatedDescription: string, pageContent: string, locale: string, slug?: string}) => string
    prefix?: (args: { doc: any, pageContent: string, locale: string, slug?: string}) => string
    suffix?: (args: { doc: any, pageContent: string, locale: string, slug?: string}) => string
    maxInputPageContentLength?: number // Default: 10000
  }
}

export type GPT3Model = 'text-davinci-003' | 'text-curie-001' | 'text-babbage-001' | 'text-ada-001' | string;

export type GPTAIOptions = {
  apiKeySecret: string
  apiOrganization?: string // Optional
  metaTitle?: {
    maxTokens?: number // Default: 25
    temperature?: number // The creativity of the AI. Default: 0.5
    model?: GPT3Model // Default: text-davinci-003
    prompt?: (args: { pageContent: string, locale: string, slug?: string }) => string // Optional
    stop?: string // Optional
  },
  metaDescription?: {
    maxTokens?: number // Default: 50
    temperature?: number // The creativity of the AI. Default: 0.5
    model?: GPT3Model // Default: text-davinci-003
    prompt?: (args: { pageContent: string, locale: string, slug?: string }) => string // Optional
    stop?: string // Optional
  }
}

export type PluginConfig = {
  collections?: string[]
  globals?: string[]
  uploadsCollection?: string
  fields?: Partial<Field>[]
  tabbedUI?: boolean
  generateTitle?: GenerateTitle
  generateDescription?: GenerateDescription
  generateImage?: GenerateImage
  generateURL?: GenerateURL
  ai?: AIOptions
}

export type Meta = {
  title?: string
  description?: string
  keywords?: string
  image?: any // TODO: type this
}
