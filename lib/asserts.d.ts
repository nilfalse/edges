/*
 * Copyright 2026 nilfalse.com
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

type Assert<T extends true> = T;

type AtLeast<N extends number, A extends readonly unknown[]> =
  [unknown, ...A] extends Record<N, unknown>
    ? true
    : `expected at least ${N}, got ${A['length']}`;
