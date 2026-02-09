import { promptAI } from "@/app/lib/ai";
import { filterDataInJSON } from "@/app/lib/excel";

export async function POST(req) {
    const data = await req.json();

    const prompt = `
        You are a PC hardware expert.

A user wants a PC with the following requirements:

- Usage: ${data.usage}
- Approximate Budget: $${data.overallBudget}
- Target Resolution: ${data.resolution}
- Performance Preference: ${data.performance}

Recommend a COMPLETE and REALISTIC PC build using REAL consumer parts that exist on the market.

IMPORTANT RULES:

- Stay within the total budget.
- Prioritize component balance (no extreme bottlenecks).
- Ensure all parts are compatible.
- Prefer high value-per-dollar components.
- Do NOT recommend integrated graphics for video editing.
- Do NOT invent product names.
- The currency is in USD.
- Do NOT include wattage, efficiency, certifications, commas, parentheses, or extra specs.

OUTPUT RULES (CRITICAL):

- Output ONLY valid JSON.
- No markdown.
- No explanations.
- No extra text.
- No comments.

Format EXACTLY like this:

{
  "CPU": "",
  "GPU": "",
  "RAM": "",
  "Storage": "",
  "Motherboard": "",
  "PSU": ""
}

If the budget is too low to build a functional PC, output EXACTLY:

Not enough budget for the recommendation.
        `;

    const build = await promptAI(prompt);

    const filteredBuild = filterDataInJSON(build);

    if (build?.error) {
        return new Response(
            JSON.stringify({ error: build.error }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

    return new Response(
        JSON.stringify({ build: filteredBuild }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );

}
