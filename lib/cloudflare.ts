/*
 * Copyright 2026 nilfalse.com
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import cloudflare from '../.build/cloudflare.ts';

const components = cloudflare.result.components;

export const locations = components.filter(
  (component) => component.type === 'location',
);
export type Code = (typeof locations)[number]['location']['iata_code'];

// Fewer than 400 components fails to compile.
// Services are counted too, since filtering loses the tuple length.
void components[399];
