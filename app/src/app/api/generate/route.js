import { promptAI } from "@/app/lib/ai";
import { filterDataInJSON } from "@/app/lib/excel";

export async function POST(req) {
    const data = await req.json();

    const allowedUsage = ["gaming", "work", "video_editing", "3d", "streaming", "general"];
    const allowedResolution = ["1080p", "1440p", "4k"];
    const allowedPerformance = ["best_value", "high_end", "future_proof"];

    function isValidNumber(value) {
        return typeof value === "number" && Number.isFinite(value) && value >= 0;
    }

    const isFormGood =
        data &&
        typeof data === "object" &&
        allowedUsage.includes(data.usage) &&
        isValidNumber(data.budget) &&
        allowedResolution.includes(data.resolution) &&
        allowedPerformance.includes(data.performance);

    if (!isFormGood) {
        return new Response(
            JSON.stringify({ error: "Invalid form data" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const prompt = `
        You are a PC hardware expert.

A user wants a PC with the following requirements:

- Usage: ${data.usage}
- Budget: $${data.budget}
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

    //const build = await promptAI(prompt);

    let build = '{\n' +
        '  "CPU": "AMD Ryzen 5 5600X",\n' +
        '  "GPU": "NVIDIA GeForce RTX 4070",\n' +
        '  "RAM": "Corsair Vengeance LPX 16GB DDR4 3200MHz",\n' +
        '  "Storage": "Samsung 970 Evo Plus 1TB NVMe SSD",\n' +
        '  "Motherboard": "MSI B550-A Pro",\n' +
        '  "PSU": "Corsair RM650x 650W"\n' +
        '}'

    build = JSON.parse(build)

    if (build?.error) {
        return new Response(
            JSON.stringify({ error: build.error }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

    const filteredBuild = filterDataInJSON(build);

    return new Response(
        JSON.stringify({ build: filteredBuild }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );

}