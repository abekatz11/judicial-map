# Second Circuit

```js
const circuitsGeoJSON = await FileAttachment("../data/circuits.json").json();
const circuitFeature = circuitsGeoJSON.features.find(f =>
  f.properties.Name === "Second Circuit"
);
```

```js
// Load circuit court cases (data loader outputs JSON)
const caseData = await FileAttachment("../data/circuit-cases.json").json();
const circuitCases = caseData.cases.filter(c => c.circuit === "Second Circuit");
```

<div class="circuit-header">
  <p class="circuit-intro">
    The Second Circuit is one of the thirteen United States Courts of Appeals.
  </p>
  <p style="color: #666; font-size: 0.95rem;">
    <strong>${circuitCases.length} most recent cases</strong> filed in this circuit
  </p>
  <p style="color: #999; font-size: 0.85rem; font-style: italic;">
    Data last updated: ${new Date(caseData.lastUpdated).toLocaleString()}
  </p>
</div>

```js
// Create map showing just this circuit
const width = 600;
const height = 400;

// Add padding around the feature
const projection = d3.geoAlbersUsa()
  .fitExtent([[20, 20], [width - 20, height - 20]], circuitFeature);

const path = d3.geoPath().projection(projection);

const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto;");

svg.append("path")
  .datum(circuitFeature)
  .attr("d", path)
  .attr("fill", "#d4e6f1")
  .attr("stroke", "#2874a6")
  .attr("stroke-width", 2);

display(svg.node());
```

## Recent Cases

```js
display(html`<div style="margin: 2rem 0;">
  ${circuitCases.length === 0 ?
    html`<p style="color: #666;">No recent cases found for this circuit.</p>` :
    circuitCases.map(c => html`
      <div class="case-card" style="border-left: 3px solid #2874a6; padding: 1rem; margin: 1rem 0; background: #f9f9f9;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">
          <a href="${c.url}" target="_blank" rel="noopener" style="color: #2874a6; text-decoration: none;">
            ${c.caseName}
          </a>
        </h4>
        <div style="font-size: 0.9rem; color: #666;">
          <strong>Docket:</strong> ${c.docketNumber} |
          <strong>Filed:</strong> ${new Date(c.dateField).toLocaleDateString()} |
          <strong>Status:</strong> ${c.status}
        </div>
      </div>
    `)
  }
</div>`);
```

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
