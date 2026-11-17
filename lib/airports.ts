/*
 * Copyright 2026 nilfalse.com
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import _airports from '../.build/airports.ts';
import type { Coordinates } from './geography.ts';
import { Point } from './geography.ts';

export type Airport<C extends TwoUppercaseLetters = TwoUppercaseLetters> =
  C extends TwoUppercaseLetters
    ? {
        type: string;
        iso_country: C;
        iso_region: `${C}-${string}`;
        latitude_deg: number;
        longitude_deg: number;
      }
    : never;

export type Iata = keyof airports;

type airports = typeof _airports;
export const airports: LookupTable<Airport> = _airports;
export default airports;

const excludeTypes = new Set([
  'heliport',
  'seaplane_base',
  'balloonport',
  'closed',
]);

const MAX_KM = 100;

export function nearest(coordinates: Coordinates): Airport {
  interface Candidate {
    airport?: Airport;
    distance: number;
  }

  const point = Point.of(coordinates);
  const match = Object.values(airports).reduce<Candidate>(
    function (previous, next) {
      if (excludeTypes.has(next.type)) {
        return previous;
      }

      const km = point.distance(next.latitude_deg, next.longitude_deg);
      if (km > MAX_KM || km >= previous.distance) {
        return previous;
      }

      return { airport: next, distance: km };
    },
    { distance: +Infinity },
  );

  if (!match.airport) {
    throw new Error(
      `No airport within ${MAX_KM} km of ${coordinates.latitude}, ${coordinates.longitude}`,
    );
  }
  return match.airport;
}
