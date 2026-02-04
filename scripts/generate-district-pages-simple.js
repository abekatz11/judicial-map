import {readFile, writeFile} from "node:fs/promises";

const districtsGeoJSON = JSON.parse(await readFile("src/data/districts.json", "utf-8"));
const toSlug = (name) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
const districts = districtsGeoJSON.features.map(f => ({
  name: f.properties.JD_NAME,
  slug: toSlug(f.properties.JD_NAME)
}));

const template = (district) => `# ${district.name}

\`\`\`js
const districtsGeoJSON = await FileAttachment("../data/districts.json").json();
const districtFeature = districtsGeoJSON.features.find(f =>
  f.properties.JD_NAME === "${district.name}"
);
\`\`\`

<div class="district-header">
  <p class="district-intro">
    The ${district.name} is one of the 94 federal judicial districts in the United States.
  </p>
</div>

\`\`\`js
// Create map showing just this district
const width = 600;
const height = 400;

// Add padding around the feature
const projection = d3.geoAlbersUsa()
  .fitExtent([[20, 20], [width - 20, height - 20]], districtFeature);

const path = d3.geoPath().projection(projection);

const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto;");

svg.append("path")
  .datum(districtFeature)
  .attr("d", path)
  .attr("fill", "#e0e0e0")
  .attr("stroke", "#4a90e2")
  .attr("stroke-width", 2);

display(svg.node());
\`\`\`

## Information

<div class="info-grid">
  <div class="info-card">
    <h3>District Judges</h3>
    <p>Judge information will be added here.</p>
  </div>

  <div class="info-card">
    <h3>Circuit Court</h3>
    <p>Parent circuit information will be added here.</p>
  </div>

  <div class="info-card">
    <h3>Court Locations</h3>
    <p>Courthouse location information will be added here.</p>
  </div>

  <div class="info-card">
    <h3>Caseload Statistics</h3>
    <p>Case statistics will be added here.</p>
  </div>
</div>

---

[← Back to all districts](./index)
`;

for (const district of districts) {
  await writeFile(`src/districts/${district.slug}.md`, template(district));
}

console.log(`✅ Regenerated ${districts.length} district pages`);
