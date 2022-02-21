import { useWatchForm } from 'payload/components/forms';
import React from 'react';
import { Field } from 'payload/dist/admin/components/forms/Form/types';

export const Preview: React.FC = () => {
  const { fields } = useWatchForm();

  const {
    'meta.title': {
      value: metaTitle,
    } = {} as Field,
    'meta.description': {
      value: metaDescription,
    } = {} as Field,
  } = fields;

  return (
    <div>
      <div>
        Preview
      </div>
      <div
        style={{
          marginBottom: '5px',
          color: '#9A9A9A',
        }}
      >
        Exact result listings may vary based on content and search relevancy.
      </div>
      <div
        style={{
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          pointerEvents: 'none',
          maxWidth: '600px',
          width: '100%'
        }}
      >
        <div>
          <a
            href="/"
            style={{
              color: '#202124', // #4d5156 light version
              textDecoration: 'none',
            }}
          >
            https://...
          </a>
        </div>
        <h4
          style={{
            margin: 0,
          }}
        >
          <a
            href="/"
            style={{
              color: '#1a0dab', // dark mode: '#8ab4f8',
              textDecoration: 'none',
            }}
          >
            {metaTitle as string}
          </a>
        </h4>
        <p
          style={{
            margin: 0,
            color: '#202124',
          }}
        >
          {metaDescription as string}
        </p>
      </div>
    </div>
  );
};
