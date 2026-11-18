/*
 * Copyright 2026 nilfalse.com
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import type { Iata } from './airports.ts';
import type * as aws from './aws.ts';
import type * as cloudflare from './cloudflare.ts';
import type * as fastly from './fastly.ts';

/**
 * Codes that OurAirports does not know.
 *
 * `LookupTable` is what lookups see; `satisfies` is what type-checks the keys.
 */
export const errata: LookupTable<Erratum> = {
  // AWS
  YTO: 'YYZ', // metropolitan area code

  // AWS and Cloudflare
  TXL: { country: 'DE', region: 'DE-BE' }, // closed in 2020; BER would give DE-BR

  // Cloudflare
  KIV: 'RMO',
  FRU: 'BSZ',
  JXG: 'JNH',
  QWJ: { country: 'BR', region: 'BR-SP' },

  // Fastly
  // "Berhampur": coordinates are Baharampur, West Bengal; nearest is across the border in Bangladesh.
  QAJ: { country: 'IN', region: 'IN-WB' },
} satisfies Unresolved & Misplaced;

type Erratum = Iata | Edge;

/** AWS and Cloudflare codes have no fallback: every unknown one must be listed. */
type Unresolved = Record<Exclude<aws.Code | cloudflare.Code, Iata>, Erratum>;

/** Fastly codes fall back to the nearest airport: list only where it picks the wrong place. */
type Misplaced = Partial<Record<Exclude<fastly.Code, Iata>, Erratum>>;
