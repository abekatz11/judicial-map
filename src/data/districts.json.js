import {readFile} from "node:fs/promises";

// Load district GeoJSON
const districtsGeoJSON = JSON.parse(
  await readFile("src/data/districts.json", "utf-8")
);

// Transform into a simpler format for pages
const districts = districtsGeoJSON.features.map(feature => ({
  name: feature.properties.JD_NAME,
  // Create URL-safe slug from name
  slug: feature.properties.JD_NAME
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, ""),
  geometry: feature.geometry,
  properties: feature.properties
}));

process.stdout.write(JSON.stringify(districts, null, 2));
