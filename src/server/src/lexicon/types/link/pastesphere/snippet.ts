/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../lexicons'
import { isObj, hasProp } from '../../../util'
import { CID } from 'multiformats/cid'

export interface Record {
  title: string
  description?: string
  type: string
  body: string
  createdAt: string
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'link.pastesphere.snippet#main' ||
      v.$type === 'link.pastesphere.snippet')
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate('link.pastesphere.snippet#main', v)
}
