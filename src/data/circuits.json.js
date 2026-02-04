import {readFile} from "node:fs/promises";

// Load circuit GeoJSON
const circuitsGeoJSON = JSON.parse(
  await readFile("src/data/circuits.json", "utf-8")
);

// Transform into a simpler format for pages
const circuits = circuitsGeoJSON.features.map(feature => ({
  name: feature.properties.Name,
  // Create URL-safe slug from name
  slug: feature.properties.Name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, ""),
  geometry: feature.geometry,
  properties: feature.properties
}));

process.stdout.write(JSON.stringify(circuits, null, 2));
