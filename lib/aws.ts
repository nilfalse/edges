/*
 * Copyright 2026 nilfalse.com
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import aws from '../.build/aws.ts';

export type Code = (typeof locations)[number]['iata_code'];
export const locations = aws.edge_locations;

// Fewer than 100 locations fails to compile.
type _ = Assert<AtLeast<100, typeof locations>>;
