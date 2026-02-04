# New York Western

```js
const districtsGeoJSON = await FileAttachment("../data/districts.json").json();
const districtFeature = districtsGeoJSON.features.find(f =>
  f.properties.JD_NAME === "New York Western"
);
```

<div class="district-header">
  <p class="district-intro">
    The New York Western is one of the 94 federal judicial districts in the United States.
  </p>
</div>

```js
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
```

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
