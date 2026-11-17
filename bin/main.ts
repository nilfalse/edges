#!/usr/bin/env node
import assert from 'node:assert/strict';

import type { Airport } from '../lib/airports.ts';
import { airports, nearest } from '../lib/airports.ts';
import * as aws from '../lib/aws.ts';
import * as cloudflare from '../lib/cloudflare.ts';
import { errata } from '../lib/errata.ts';
import * as fastly from '../lib/fastly.ts';
import type { Coordinates } from '../lib/geography.ts';

function toEdge(airport: Airport): Edge {
  return { country: airport.iso_country, region: airport.iso_region };
}

function locate(code: ThreeUppercaseLetters, coordinates?: Coordinates): Edge {
  const airport = airports[code];
  if (airport) {
    return toEdge(airport);
  }

  const erratum = errata[code];
  if (typeof erratum === 'string') {
    return locate(erratum);
  }
  if (erratum) {
    return erratum;
  }

  // The type of errata leaves only Fastly codes here, and those have coordinates.
  assert(coordinates, `${code}: no airport, no erratum, no coordinates`);
  return toEdge(nearest(coordinates));
}

const edges: LookupTable<Edge> = {};

for (const { iata_code } of aws.locations) {
  edges[iata_code] = locate(iata_code);
}

for (const { location } of cloudflare.locations) {
  edges[location.iata_code] = locate(location.iata_code);
}

for (const { code, coordinates } of fastly.datacenters) {
  edges[code] = locate(code, coordinates);
}

const sorted = Object.entries(edges).sort(([a], [b]) => a.localeCompare(b));
console.log(JSON.stringify(Object.fromEntries(sorted), null, 2));
