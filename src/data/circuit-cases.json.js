import "dotenv/config";

// Circuit court IDs in CourtListener
const circuitCourts = [
  { id: "ca1", name: "First Circuit" },
  { id: "ca2", name: "Second Circuit" },
  { id: "ca3", name: "Third Circuit" },
  { id: "ca4", name: "Fourth Circuit" },
  { id: "ca5", name: "Fifth Circuit" },
  { id: "ca6", name: "Sixth Circuit" },
  { id: "ca7", name: "Seventh Circuit" },
  { id: "ca8", name: "Eighth Circuit" },
  { id: "ca9", name: "Ninth Circuit" },
  { id: "ca10", name: "Tenth Circuit" },
  { id: "ca11", name: "Eleventh Circuit" },
  { id: "cadc", name: "DC Circuit" },
  { id: "cafc", name: "Federal Circuit" }
];

const API_KEY = process.env.COURTLISTENER_API_KEY;

if (!API_KEY) {
  console.error("ERROR: COURTLISTENER_API_KEY not set in .env file");
  process.exit(1);
}

// Fetch both recent and most cited cases from each circuit
async function fetchCircuitCases() {
  const recentCases = [];
  const citedCases = [];

  for (const circuit of circuitCourts) {
    try {
      // 1. Fetch most recent cases
      const recentUrl = new URL("https://www.courtlistener.com/api/rest/v4/search/");
      recentUrl.searchParams.set("type", "o");
      recentUrl.searchParams.set("court", circuit.id);
      recentUrl.searchParams.set("filed_after", "2024-01-01");
      recentUrl.searchParams.set("order_by", "dateFiled desc");
      recentUrl.searchParams.set("page_size", "20");
      recentUrl.searchParams.set("q", "*");
      recentUrl.searchParams.set("format", "json");

      const recentResponse = await fetch(recentUrl, {
        headers: { "Authorization": `Token ${API_KEY}` }
      });

      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        const recent = (recentData.results || []).map(opinion => ({
          circuit: circuit.name,
          circuitId: circuit.id,
          caseName: opinion.caseName,
          dateFiled: opinion.dateFiled,
          docketNumber: opinion.docketNumber,
          status: opinion.status,
          citeCount: opinion.citeCount || 0,
          snippet: (opinion.opinions && opinion.opinions[0]?.snippet) || "",
          url: `https://www.courtlistener.com${opinion.absolute_url}`
        }));
        recentCases.push(...recent);
        console.error(`Fetched ${recent.length} recent cases from ${circuit.name}`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. Fetch most cited cases
      const citedUrl = new URL("https://www.courtlistener.com/api/rest/v4/search/");
      citedUrl.searchParams.set("type", "o");
      citedUrl.searchParams.set("court", circuit.id);
      citedUrl.searchParams.set("order_by", "citeCount desc");
      citedUrl.searchParams.set("page_size", "20");
      citedUrl.searchParams.set("q", "*");
      citedUrl.searchParams.set("format", "json");

      const citedResponse = await fetch(citedUrl, {
        headers: { "Authorization": `Token ${API_KEY}` }
      });

      if (citedResponse.ok) {
        const citedData = await citedResponse.json();
        const cited = (citedData.results || []).map(opinion => ({
          circuit: circuit.name,
          circuitId: circuit.id,
          caseName: opinion.caseName,
          dateFiled: opinion.dateFiled,
          docketNumber: opinion.docketNumber,
          status: opinion.status,
          citeCount: opinion.citeCount || 0,
          snippet: (opinion.opinions && opinion.opinions[0]?.snippet) || "",
          url: `https://www.courtlistener.com${opinion.absolute_url}`
        }));
        citedCases.push(...cited);
        console.error(`Fetched ${cited.length} most cited cases from ${circuit.name}`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`Error fetching ${circuit.name}:`, error.message);
    }
  }

  return { recent: recentCases, cited: citedCases };
}

const { recent, cited } = await fetchCircuitCases();
console.error(`\nTotal recent cases: ${recent.length}`);
console.error(`Total cited cases: ${cited.length}`);

// Add metadata with fetch timestamp
const output = {
  lastUpdated: new Date().toISOString(),
  recentCases: recent,
  mostCitedCases: cited,
  totalRecent: recent.length,
  totalCited: cited.length
};

process.stdout.write(JSON.stringify(output, null, 2));
