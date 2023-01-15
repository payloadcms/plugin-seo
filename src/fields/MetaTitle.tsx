import React, { useCallback, useState } from 'react';
import { Props as TextFieldType } from 'payload/dist/admin/components/forms/field-types/Text/types';
import { useLocale } from 'payload/components/utilities';
import TextInputField from 'payload/dist/admin/components/forms/field-types/Text/Input';
import { useAllFormFields, useField } from 'payload/components/forms';
import { FieldType as FieldType, Options } from 'payload/dist/admin/components/forms/useField/types';
import { LengthIndicator } from '../ui/LengthIndicator';
import { defaults } from '../defaults';
import { PluginConfig } from '../types';
import { generateAIMetaTitleClient } from '../ai/Generator';
import { reduceFieldsToValues } from 'payload/components/forms'

const {
  minLength,
  maxLength,
} = defaults.title;

type TextFieldWithProps = TextFieldType & {
  path: string
  pluginConfig: PluginConfig
  slug?: string
};

export const MetaTitle: React.FC<TextFieldWithProps | {}> = (props) => {
  const {
    label,
    name,
    path,
    pluginConfig,
    slug
  } = props as TextFieldWithProps || {}; // TODO: this typing is temporary until payload types are updated for custom field props

  const field: FieldType<string> = useField({
    label,
    name,
    path
  } as Options);

  const locale = useLocale();
  const [fields] = useAllFormFields();

  const {
    value,
    setValue,
    showError,
  } = field;

  const [readOnly, setReadOnly] = useState(false);

  const regenerateTitle = useCallback(() => {
    const { generateTitle } = pluginConfig;

    const getTitle = async () => {
      setReadOnly(true);
      let generatedTitle;
      const fieldsReduced = reduceFieldsToValues({...fields}, true);
      if (typeof generateTitle === 'function') {
        generatedTitle = await generateTitle({ doc: fieldsReduced, locale, slug });
      }
      setValue(generatedTitle);
      setReadOnly(false);
    }
    getTitle();
  }, [
    fields,
    setValue,
    pluginConfig,
    locale,
  ]);

  const regenerateTitleWithAI = useCallback(() => {
    const { ai } = pluginConfig;

    const getTitle = async () => {
      setReadOnly(true);
      setValue("Generating...")

      let pageContent: string|undefined;
      const fieldsReduced = reduceFieldsToValues({...fields}, true);
      if (typeof ai?.getPageContent === 'function') {
        pageContent = await ai?.getPageContent({ doc: fieldsReduced, locale, slug });
      }
      if(pageContent) {
        setValue(await generateAIMetaTitleClient({ doc: fieldsReduced, pageContent, locale, slug }));
      }else{
        setValue("Error: No page content found.")
      }
      setReadOnly(false);
    }
    getTitle();
  }, [
    fields,
    setValue,
    pluginConfig,
    locale,
  ]);

  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          marginBottom: '5px',
          position: 'relative',
        }}
      >
        <div>
          {label}
          &nbsp;
          &mdash;
          &nbsp;
          <button
            onClick={regenerateTitle}
            type="button"
            style={{
              padding: 0,
              background: 'none',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              textDecoration: 'underline',
              color: 'currentcolor',
            }}
          >
            Auto-generate
          </button>
          {pluginConfig.ai && (
            <>
              &nbsp;
              &mdash;
              &nbsp;
              <button
                onClick={regenerateTitleWithAI}
                type="button"
                style={{
                  padding: 0,
                  background: 'none',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  color: 'currentcolor',
                }}
              >
                AI-generate
              </button>
            </>
          )}
        </div>
        <div
          style={{
            color: '#9A9A9A',
          }}
        >
          {`This should be between ${minLength} and ${maxLength} characters. Auto-generation will format a title using the page title. For help in writing quality meta titles, see `}
          <a
            href="https://developers.google.com/search/docs/advanced/appearance/title-link#page-titles"
            rel="noopener noreferrer"
            target="_blank"
          >
            best practices
          </a>
          .
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          marginBottom: '10px',
        }}
      >
        <TextInputField
          path={name}
          name={name}
          onChange={setValue}
          value={value}
          showError={showError}
          readOnly={readOnly}
          style={{
            marginBottom: 0
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <LengthIndicator
          text={value as string}
          minLength={minLength}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};

export const getMetaTitleField = (props: any) => (
  <MetaTitle {...props} />
)

