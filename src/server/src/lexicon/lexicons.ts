/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { LexiconDoc, Lexicons } from '@atproto/lexicon'

export const schemaDict = {
  LinkPastesphereSnippet: {
    lexicon: 1,
    id: 'link.pastesphere.snippet',
    defs: {
      main: {
        type: 'record',
        description: 'Record representing a text snippet.',
        key: 'tid',
        record: {
          type: 'object',
          required: ['title', 'type', 'body', 'createdAt'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxGraphemes: 256,
              maxLength: 2560,
            },
            description: {
              type: 'string',
              maxGraphemes: 256,
              maxLength: 2560,
            },
            type: {
              type: 'string',
              minLength: 1,
              maxGraphemes: 100,
              maxLength: 1000,
            },
            body: {
              type: 'string',
              minLength: 1,
              maxLength: 256000,
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
}
export const schemas: LexiconDoc[] = Object.values(schemaDict) as LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)
export const ids = { LinkPastesphereSnippet: 'link.pastesphere.snippet' }
