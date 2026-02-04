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

// Fetch recent cases from each circuit
async function fetchCircuitCases() {
  const allCases = [];

  // Fetch from 2024-2025 (adjust as needed)
  const filedAfter = "2024-01-01";

  for (const circuit of circuitCourts) {
    try {
      // Search for opinions in this circuit
      const url = new URL("https://www.courtlistener.com/api/rest/v4/search/");
      url.searchParams.set("type", "o"); // opinions
      url.searchParams.set("court", circuit.id);
      url.searchParams.set("filed_after", filedAfter);
      url.searchParams.set("order_by", "dateFiled desc");
      url.searchParams.set("page_size", "20"); // Limit per circuit
      url.searchParams.set("format", "json");

      const response = await fetch(url, {
        headers: {
          "Authorization": `Token ${API_KEY}`
        }
      });

      if (!response.ok) {
        console.error(`Failed to fetch ${circuit.name}: ${response.status}`);
        continue;
      }

      const data = await response.json();

      // Transform and add circuit info
      const cases = (data.results || []).map(opinion => ({
        circuit: circuit.name,
        circuitId: circuit.id,
        caseName: opinion.caseName,
        dateField: opinion.dateFiled,
        court: opinion.court,
        docketNumber: opinion.docketNumber,
        status: opinion.status,
        // Extract nature of suit if available
        natureOfSuit: opinion.natureOfSuit,
        // URL to full opinion
        url: `https://www.courtlistener.com${opinion.absolute_url}`,
        // Judge/panel info if available
        judge: opinion.judge,
        panel: opinion.panel_names
      }));

      allCases.push(...cases);
      console.error(`Fetched ${cases.length} cases from ${circuit.name}`);

      // Rate limiting - be nice to the API
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`Error fetching ${circuit.name}:`, error.message);
    }
  }

  return allCases;
}

const cases = await fetchCircuitCases();
console.error(`\nTotal cases fetched: ${cases.length}`);

// Add metadata with fetch timestamp
const output = {
  lastUpdated: new Date().toISOString(),
  totalCases: cases.length,
  cases: cases
};

process.stdout.write(JSON.stringify(output, null, 2));
