import {readFile, writeFile} from "node:fs/promises";

// Load circuit data
const circuitsGeoJSON = JSON.parse(
  await readFile("src/data/circuits.json", "utf-8")
);

const toSlug = (name) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const circuits = circuitsGeoJSON.features.map(f => ({
  name: f.properties.Name,
  slug: toSlug(f.properties.Name)
}));

const template = (circuit) => `# ${circuit.name}

\`\`\`js
// Load all circuits data
const allCircuits = await FileAttachment("../data/circuits.json.js").json();
const circuitsGeoJSON = await FileAttachment("../data/circuits.json").json();
\`\`\`

\`\`\`js
// Find this circuit
const circuitSlug = "${circuit.slug}";
const circuit = allCircuits.find(c => c.slug === circuitSlug);
const circuitFeature = circuitsGeoJSON.features.find(f =>
  f.properties.Name === circuit.name
);
\`\`\`

## \${circuit.name}

<div class="circuit-header">
  <p class="circuit-intro">
    The \${circuit.name} is one of the thirteen United States Courts of Appeals.
  </p>
</div>

\`\`\`js
// Create map showing just this circuit
const width = 600;
const height = 400;

const projection = d3.geoAlbersUsa()
  .fitSize([width, height], circuitFeature);

const path = d3.geoPath().projection(projection);

const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; background: #f9f9f9;");

// Add the circuit boundary
svg.append("path")
  .datum(circuitFeature)
  .attr("d", path)
  .attr("fill", "#d4e6f1")
  .attr("stroke", "#2874a6")
  .attr("stroke-width", 2);

display(svg.node());
\`\`\`

## Information

<div class="info-grid">
  <div class="info-card">
    <h3>Member Districts</h3>
    <p>Information about member districts will be added here.</p>
  </div>

  <div class="info-card">
    <h3>Circuit Judges</h3>
    <p>Judge information will be added here.</p>
  </div>

  <div class="info-card">
    <h3>Court Locations</h3>
    <p>Court location information will be added here.</p>
  </div>
</div>

---

[← Back to all circuits](./index)
`;

for (const circuit of circuits) {
  const filename = `src/circuits/${circuit.slug}.md`;
  await writeFile(filename, template(circuit));
  console.log(`Fixed: ${filename}`);
}

console.log(`\n✅ Fixed ${circuits.length} circuit pages`);
