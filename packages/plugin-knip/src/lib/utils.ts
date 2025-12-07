import type { CategoryRef } from '@code-pushup/models';
import {
  KNIP_PLUGIN_SLUG,
  type KnipAudits,
  type KnipGroups,
} from './constants.js';

export function knipCategoryAuditRef(
  slug: KnipAudits,
  weight = 1,
): CategoryRef {
  return knipCategoryRef(slug, weight, 'audit');
}

export function knipCategoryGroupRef(slug: KnipGroups, weight = 1) {
  return knipCategoryRef(slug, weight, 'group');
}

function knipCategoryRef(
  slug: KnipAudits | KnipGroups,
  weight: number,
  type: 'audit' | 'group',
): CategoryRef {
  return {
    plugin: KNIP_PLUGIN_SLUG,
    slug,
    type,
    weight,
  };
}
