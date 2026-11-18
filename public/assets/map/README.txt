Local cartographic extract for the Habitalia contact map.

Data: © OpenStreetMap contributors, Open Database License 1.0 (ODbL).
https://www.openstreetmap.org/copyright
https://opendatacommons.org/licenses/odbl/1-0/

osm-context.json: small unmodified Overpass extract of roads, building footprints,
parks and railway geometry near the owner-supplied office address.
Source endpoint: https://overpass-api.de/api/interpreter
Bounding box: 41.3410,1.6970,41.3467,1.7063
Query: ways tagged highway, building, leisure=park or railway=rail; out tags geom.

location-source.json: cached result of a single Nominatim address lookup.
No recurring lookups, search, autocomplete or map tile requests are included in
the website. The LocationMap Astro component renders a local SVG from this data.
The live page displays OpenStreetMap attribution and a link to the data license.
No data or code was copied from Google Maps.
