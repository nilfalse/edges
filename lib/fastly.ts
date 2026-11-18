/*
 * Copyright 2026 nilfalse.com
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import fastly from '../.build/fastly.ts';

export type Code = (typeof datacenters)[number]['code'];
export const datacenters = fastly;

// Fewer than 180 datacenters fails to compile.
type _ = Assert<AtLeast<180, typeof datacenters>>;
