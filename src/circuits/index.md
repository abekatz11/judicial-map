# Federal Circuit Courts

The United States Courts of Appeals consist of 13 appellate courts:
- **First through Eleventh Circuits** - Geographic regions
- **DC Circuit** - District of Columbia
- **Federal Circuit** - Nationwide jurisdiction for specialized cases

```js
const circuits = FileAttachment("../data/circuits.json.js").json();
const caseData = FileAttachment("../data/circuit-cases.json").json();
```

## Circuit List

<div style="color: #666; font-size: 0.9rem; margin-bottom: 1rem; font-style: italic;">
  Showing most recent and most cited cases from each circuit. Last updated: ${new Date(caseData.lastUpdated).toLocaleString()}
</div>

<div class="grid grid-cols-2" style="gap: 1rem;">
${circuits.map(circuit => {
  const recentCount = caseData.recentCases.filter(c => c.circuit === circuit.name).length;
  const citedCount = caseData.mostCitedCases.filter(c => c.circuit === circuit.name).length;
  return `
  <div class="card">
    <h3>${circuit.name}</h3>
    <p style="color: #666; font-size: 0.9rem; margin: 0.5rem 0;">
      ${recentCount} recent + ${citedCount} most cited
    </p>
    <a href="./${circuit.slug}">View Details →</a>
  </div>
`;
}).join('')}
</div>

Individual circuit pages will show:
- States/districts within the circuit
- Circuit judges
- Court locations
- Notable cases
