# US Federal Courts Map

An interactive visualization of US federal judicial districts and circuit courts.

## Overview

Explore the federal court system:
- **94 District Courts** - Trial-level federal courts
- **13 Circuit Courts** - Appellate courts (11 numbered circuits + DC + Federal)
- **Judge Information** - Who appointed them and when
- **Caseload Statistics** - Cases filed, pending, and resolved
- **SCOTUS Origins** - Where Supreme Court cases come from

```js
// Load boundary data
const districts = FileAttachment("data/districts.json").json();
const circuits = FileAttachment("data/circuits.json").json();
```

```js
// Create layer toggle control
const viewLayer = view(Inputs.radio(
  ["Districts", "Circuits"],
  {label: "View:", value: "Districts"}
));
```

```js
// Map dimensions and setup
const width = 975;
const height = 610;

// Create Albers USA projection
const projection = d3.geoAlbersUsa()
  .scale(1300)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Select data based on layer toggle
const mapData = viewLayer === "Districts" ? districts : circuits;
const isDistrictView = viewLayer === "Districts";

// Create SVG
const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto;");

// Create tooltip div
const tooltip = d3.select("body").append("div")
  .attr("class", "map-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden")
  .style("background-color", "rgba(0, 0, 0, 0.8)")
  .style("color", "white")
  .style("padding", "8px 12px")
  .style("border-radius", "4px")
  .style("font-size", "14px")
  .style("pointer-events", "none")
  .style("z-index", "1000");

// Add map features with interactivity
svg.append("g")
  .selectAll("path")
  .data(mapData.features)
  .join("path")
    .attr("d", path)
    .attr("fill", isDistrictView ? "#e0e0e0" : "#d4e6f1")
    .attr("stroke", "#fff")
    .attr("stroke-width", isDistrictView ? 0.5 : 1.5)
    .attr("class", isDistrictView ? "district" : "circuit")
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      d3.select(this)
        .attr("fill", isDistrictView ? "#4a90e2" : "#2874a6")
        .attr("stroke-width", isDistrictView ? 1.5 : 2.5);

      const name = isDistrictView ? d.properties.JD_NAME : d.properties.Name;
      tooltip
        .style("visibility", "visible")
        .text(name);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .attr("fill", isDistrictView ? "#e0e0e0" : "#d4e6f1")
        .attr("stroke-width", isDistrictView ? 0.5 : 1.5);

      tooltip.style("visibility", "hidden");
    })
    .on("click", function(event, d) {
      const name = isDistrictView ? d.properties.JD_NAME : d.properties.Name;
      // Convert name to URL slug
      const slug = name.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      // Navigate to detail page (no trailing slash for .html files)
      const basePath = isDistrictView ? "districts" : "circuits";
      window.location.href = `./${basePath}/${slug}`;
    });

display(svg.node());
```

<div class="map-info">
  <strong>${viewLayer === "Districts" ? "District Courts" : "Circuit Courts"}</strong>:
  Showing ${mapData.features.length} ${viewLayer === "Districts" ? "federal judicial districts" : "circuit courts of appeals"}.
  ${viewLayer === "Districts" ? "Hover over a district to see its name, click to view details." : "Hover over a circuit to see its name, click to view details."}
</div>

## District Courts

The 94 federal district courts are the general trial courts of the federal court system. Each district court has at least one United States District Judge, appointed by the President and confirmed by the Senate for a life term.

## Circuit Courts

The 13 circuit courts are appellate courts that hear appeals from district courts within their geographic boundaries. They also hear appeals from decisions of federal administrative agencies.

---

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Districts</h3>
    <p>Browse all 94 federal judicial districts.</p>
    <a href="./districts/">Explore Districts →</a>
  </div>
  <div class="card">
    <h3>Circuits</h3>
    <p>View the 13 circuit courts of appeals.</p>
    <a href="./circuits/">Explore Circuits →</a>
  </div>
</div>
