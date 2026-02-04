import {readFile, writeFile} from "node:fs/promises";

// Load district data
const districtsGeoJSON = JSON.parse(
  await readFile("src/data/districts.json", "utf-8")
);

// Generate slug from district name
const toSlug = (name) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const districts = districtsGeoJSON.features.map(f => ({
  name: f.properties.JD_NAME,
  slug: toSlug(f.properties.JD_NAME)
}));

const template = (district) => `# ${district.name}

\`\`\`js
// Load all districts data
const allDistricts = FileAttachment("../data/districts.json.js").json();
const districtsGeoJSON = FileAttachment("../data/districts.json").json();

// Find this district
const districtSlug = "${district.slug}";
const district = allDistricts.find(d => d.slug === districtSlug);
const districtFeature = districtsGeoJSON.features.find(f =>
  f.properties.JD_NAME === district.name
);
\`\`\`

## \${district.name}

<div class="district-header">
  <p class="district-intro">
    The \${district.name} is one of the 94 federal judicial districts in the United States.
  </p>
</div>

\`\`\`js
// Create map showing just this district
const width = 600;
const height = 400;

const projection = d3.geoAlbersUsa()
  .fitSize([width, height], districtFeature);

const path = d3.geoPath().projection(projection);

const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; background: #f9f9f9;");

// Add the district boundary
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

[← Back to all districts](./)
`;

// Generate all district pages
for (const district of districts) {
  const filename = `src/districts/${district.slug}.md`;
  await writeFile(filename, template(district));
  console.log(`Created: ${filename}`);
}

console.log(`\n✅ Generated ${districts.length} district pages`);
