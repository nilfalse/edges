# edges

Where CDN points of presence are, built for easy lookup by code.

Cloudflare, AWS CloudFront and Fastly name their points of presence (POPs) after the IATA code of a nearby airport. This repository turns those codes into a country and region, so the [CTF](https://nilfalse.com/addons/ctf) browser extension can show the flag of the place a website was served from.

The result is one committed file, `edges.json`:

```json
{
  "CPH": { "country": "DK", "region": "DK-84" },
  "TXL": { "country": "DE", "region": "DE-BE" }
}
```

`country` is ISO 3166-1 alpha-2 and `region` is ISO 3166-2. A code that no CDN uses is absent.

## Usage

Reference the repository as a git dependency:

```json
{
  "dependencies": {
    "edges": "github:nilfalse/edges"
  }
}
```

The package's `main` is `edges.json`, so `import.meta.resolve('edges')` gives the path of the file to serve as is.

## Why a separate repository

This data refreshes on its own schedule. If an update fails, the last good `edges.json` stays committed and the extension keeps using it until the problem is fixed here. The IP-to-country database lives in another repository with its own workflow, so a failure here does not stop that one.

## How it works

1. **Download.** The Makefile fetches the [OurAirports](https://github.com/davidmegginson/ourairports-data) CSV and each provider's POP list into `.data/`.
2. **Wrap as types.** Each JSON file becomes a TypeScript module in `.build/` that ends in `as const`, so the compiler sees every value as a literal.
3. **Typecheck.** `tsc` checks the data against the code. This is the test suite.
4. **Resolve.** `bin/main.ts` looks each code up and writes `edges.json`.

A code is resolved in this order:

1. The airport with that IATA code.
2. An entry in `lib/errata.ts`: either the code of another airport, or a country and region.
3. For Fastly only, the nearest airport within 100 km of the datacenter's coordinates.

### Layout

| File                                               | What it holds                                                    |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| `bin/main.ts`                                      | Resolves every code and prints the dictionary                    |
| `lib/aws.ts`, `lib/cloudflare.ts`, `lib/fastly.ts` | Each provider's rows, its `Code` type and its minimum-size check |
| `lib/errata.ts`                                    | Corrections for codes not in OurAirports                         |
| `lib/airports.ts`                                  | The airport table, its row validation and the nearest lookup     |
| `lib/geography.ts`                                 | Distance between coordinates                                     |

## Building

Requirements:

- Make (any GNU Make, including the 3.81 that ships with macOS)
- Node.js 24 or newer, which runs TypeScript files directly
- [`yq`](https://github.com/mikefarah/yq) and `curl`

```sh
npm i
make            # typecheck, then write edges.json
make distclean  # drop the downloads, so the next run fetches fresh data
```

Downloads are cached in `.data/` and fetched only when missing. A `FASTLY_KEY` in `.env` is sent to the Fastly API when present.

An updater should commit `edges.json` only when the build succeeds. A failed build deletes the working copy of the file.

## What the compiler checks

Because the data is typed as literals, these fail `tsc` and stop the build before anything is written:

- A provider renames or removes a field the code reads.
- A provider publishes a code that is not three uppercase letters.
- A provider's list is shorter than its floor (`void locations[99]` does not compile for a tuple of fewer than 100 rows).
- AWS or Cloudflare uses a code that is neither an airport nor in the errata.
- The errata list a code that is a real airport, or that no provider uses.
- An erratum points at a code that is not a real airport.
- An airport row has a country that is not two uppercase letters, a region that does not start with its country, or coordinates that are not numbers.

## When the build fails

**`Property 'XYZ' is missing` in `lib/errata.ts`.** AWS or Cloudflare started using a code OurAirports does not know. Add it to the errata, as the code of the airport that stands in for it or as a country and region.

**`'XYZ' does not exist in type` in `lib/errata.ts`.** An erratum is no longer needed: the provider dropped the code, or OurAirports added it. Remove the entry.

**`expected at least N, got M`.** A provider returned fewer rows than expected. Check whether the response is truncated before lowering the floor.

**`No airport within 100 km`.** A Fastly datacenter is far from any airport. Add an erratum for its code.

## Known limits

- **New Fastly codes are placed automatically.** Fastly invents codes freely, so they fall back to the nearest airport instead of blocking the update. Near a border this can pick the wrong country, as it did for `QAJ`, and nothing detects that. Review the diff of `edges.json` after an update and add an erratum where needed.
- **Real codes are trusted.** If a provider uses a real IATA code for a site far from that airport, the airport's country is used as is.
- **The Cloudflare floor is approximate.** It counts all status-page components, services included, not only locations.
- **No coordinates and no provider.** The file says where a code is, not which CDN uses it or its exact position.
- **Airport codes are not validated as keys.** Rows are checked, but not that every key in the airport table is three uppercase letters.
- **One pipeline.** A failure in any provider stops the update for all three.

## License

MPL-2.0
