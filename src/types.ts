import { Field } from 'payload/dist/fields/config/types';

export type GenerateTitle = <T = any>(args: { doc: T; locale?: string }) => string | Promise<string>
export type GenerateDescription = <T = any>(args: {
  doc: T
  locale?: string
}) => string | Promise<string>
export type GenerateImage = <T = any>(args: { doc: T; locale?: string }) => string | Promise<string>
export type GenerateURL = <T = any>(args: { doc: T; locale?: string }) => string | Promise<string>

export type AIOptions = {
  gpt3?: GPTAIOptions
  getPageContent: <T = any>(args: { doc: T; locale?: string }) => string | Promise<string>
  metaTitle?: {
    postProcess?:  (args: { generatedTitle: string, pageContent: string, locale: string}) => string
    prefix?: (args: { pageContent: string, locale: string}) => string
    suffix?: (args: { pageContent: string, locale: string}) => string
  },
  metaDescription?: {
    postProcess?:  (args: { generatedDescription: string, pageContent: string, locale: string}) => string
    prefix?: (args: { pageContent: string, locale: string}) => string
    suffix?: (args: { pageContent: string, locale: string}) => string
  }
}

export type GPT3Model = 'text-davinci-003' | 'text-curie-001' | 'text-babbage-001' | 'text-ada-001' | string;

export type GPTAIOptions = {
  apiKeySecret: string
  apiOrganization?: string // Optional
  metaTitle?: {
    maxTokens?: number // Default: 20
    temperature?: number // The creativity of the AI. Default: 0.4
    model?: GPT3Model // Default: text-davinci-003
    prompt?: (args: { pageContent: string, locale: string }) => string // Optional
    stop?: string // Optional
  },
  metaDescription?: {
    maxTokens?: number // Default: 50
    temperature?: number // The creativity of the AI. Default: 0.4
    model?: GPT3Model // Default: text-davinci-003
    prompt?: (args: { pageContent: string, locale: string }) => string // Optional
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
