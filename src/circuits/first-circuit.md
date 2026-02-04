# First Circuit

```js
const circuitsGeoJSON = await FileAttachment("../data/circuits.json").json();
const circuitFeature = circuitsGeoJSON.features.find(f =>
  f.properties.Name === "First Circuit"
);
```

```js
// Load circuit court cases (data loader outputs JSON)
const caseData = await FileAttachment("../data/circuit-cases.json").json();
const recentCases = caseData.recentCases.filter(c => c.circuit === "First Circuit");
const citedCases = caseData.mostCitedCases.filter(c => c.circuit === "First Circuit");
```

<div class="circuit-header">
  <p class="circuit-intro">
    The First Circuit is one of the thirteen United States Courts of Appeals.
  </p>
  <p style="color: #666; font-size: 0.95rem;">
    <strong>${recentCases.length} most recent</strong> and <strong>${citedCases.length} most cited</strong> cases
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

## Most Recent Cases

```js
display(html`<div style="margin: 2rem 0;">
  ${recentCases.length === 0 ?
    html`<p style="color: #666;">No recent cases found for this circuit.</p>` :
    recentCases.map(c => html`
      <div class="case-card" style="border-left: 3px solid #2874a6; padding: 1rem; margin: 1rem 0; background: #f9f9f9;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">
          <a href="${c.url}" target="_blank" rel="noopener" style="color: #2874a6; text-decoration: none;">
            ${c.caseName}
          </a>
        </h4>
        <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
          <strong>Docket:</strong> ${c.docketNumber} |
          <strong>Filed:</strong> ${new Date(c.dateFiled).toLocaleDateString()} |
          <strong>Status:</strong> ${c.status} |
          <strong>Citations:</strong> ${c.citeCount}
        </div>
        ${c.snippet ? html`<p style="font-size: 0.85rem; color: #444; margin: 0.5rem 0 0 0; font-style: italic;">${c.snippet}</p>` : ''}
      </div>
    `)
  }
</div>`);
```

## Most Cited Cases

```js
display(html`<div style="margin: 2rem 0;">
  ${citedCases.length === 0 ?
    html`<p style="color: #666;">No citation data available for this circuit.</p>` :
    citedCases.map(c => html`
      <div class="case-card" style="border-left: 3px solid #c27ba0; padding: 1rem; margin: 1rem 0; background: #faf9fb;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">
          <a href="${c.url}" target="_blank" rel="noopener" style="color: #8b4869; text-decoration: none;">
            ${c.caseName}
          </a>
          <span style="background: #c27ba0; color: white; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.8rem; margin-left: 0.5rem;">
            ${c.citeCount} citations
          </span>
        </h4>
        <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
          <strong>Docket:</strong> ${c.docketNumber} |
          <strong>Filed:</strong> ${new Date(c.dateFiled).toLocaleDateString()} |
          <strong>Status:</strong> ${c.status}
        </div>
        ${c.snippet ? html`<p style="font-size: 0.85rem; color: #444; margin: 0.5rem 0 0 0; font-style: italic;">${c.snippet}</p>` : ''}
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
