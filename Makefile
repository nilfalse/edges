.DELETE_ON_ERROR:                   # a failed recipe removes its half-written output
.SUFFIXES:
MAKEFLAGS += --no-builtin-rules

-include .env                       # optional; plain KEY=value lines only
export FASTLY_KEY

CURL := curl -fsSL --retry 3 --create-dirs

.PHONY: all typecheck clean distclean
all: edges.json


# ---- 1. raw downloads: no prerequisites, each is fetched once and cached ----
.data/airports.csv:    ; $(CURL) -o $@ https://raw.githubusercontent.com/davidmegginson/ourairports-data/refs/heads/main/airports.csv
.data/cloudflare.json: ; $(CURL) -o $@ https://www.cloudflarestatus.com/api/v3/components
.data/aws.json:        ; $(CURL) -o $@ https://static.cloudping.cloud/cdn/cloudfront-edge-locations.json
.data/fastly.json:     ; $(CURL) -o $@ https://api.fastly.com/datacenters $${FASTLY_KEY:+-H "Fastly-Key: $$FASTLY_KEY"}


# ---- 2. supporting data (not published) ----
# IATA code → whole CSV row. yq types scalar cells (52.3 → number, empty → null);
.data/airports.json: .data/airports.csv
	yq 'map(select(.iata_code)) | with_entries(.key = .value.iata_code)' \
  -p csv -o json --indent 0 \
  $< > $@
# JSON → TS module with literal types, so tsc can check values like "CPH" against ThreeUppercaseLetters
.build/%.ts: .data/%.json
	@mkdir -p $(@D)
	{ printf 'export default (' && cat $< && printf ') as const;\n'; } > $@


# ---- 3. all CDNs ----
BUILD := .build/airports.ts .build/aws.ts .build/cloudflare.ts .build/fastly.ts

# tsc is the test suite: the data is imported as literal types, so upstream drift fails here
typecheck: $(BUILD)
	npm run typecheck

edges.json: bin/main.ts $(wildcard lib/*.ts) $(BUILD) | typecheck
	node $< > $@


clean:           ; - rm -r .build edges.json
distclean: clean ; - rm -r .data
