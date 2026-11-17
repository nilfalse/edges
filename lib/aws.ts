/*
 * Copyright 2026 nilfalse.com
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import aws from '../.build/aws.ts';

export const locations = aws.edge_locations;
export type Code = (typeof locations)[number]['iata_code'];

// Fewer than 100 locations fails to compile.
void locations[99];
