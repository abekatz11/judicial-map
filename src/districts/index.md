# Federal Judicial Districts

The United States has 94 federal judicial districts, with at least one district in each state, the District of Columbia, and Puerto Rico.

```js
const districts = FileAttachment("../data/districts.json.js").json();
```

## District List (${districts.length} districts)

<div class="grid grid-cols-3" style="gap: 0.75rem; font-size: 0.9rem;">
${districts.map(district => `
  <div class="card" style="padding: 0.75rem;">
    <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${district.name}</h4>
    <a href="./${district.slug}" style="font-size: 0.85rem;">View Details →</a>
  </div>
`).join('')}
</div>

Individual district pages show:
- Judges serving in the district
- Caseload statistics
- Geographic boundaries
- Court locations
