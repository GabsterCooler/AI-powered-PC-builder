export async function POST(req) {
    try {
        const { usage } = await req.json();

        const prompt = `
User wants a PC for: ${usage}.
Generate a JSON object with recommended PC components only, format:

{
  "CPU": "",
  "GPU": "",
  "RAM": "",
  "Storage": "",
  "Motherboard": "",
  "PSU": "",
  "Cooling": "",
  "Case": ""
}

Do not include any extra text.
`;

        // const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        //   method: "POST",
        //   headers: {
        //     "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     model: "openai/gpt-4o",
        //     messages: [{ role: "user", content: prompt }],
        //     max_tokens: 300,
        //   }),
        // });

        // const data = await response.json();

        // const build = data.choices?.[0]?.message.content || "Error generating build";

        let build = '{\n' +
            '  "CPU": "Intel Core i5-13400",\n' +
            '  "GPU": "Integrated Graphics",\n' +
            '  "RAM": "16GB DDR4 3200MHz",\n' +
            '  "Storage": "512GB NVMe SSD",\n' +
            '  "Motherboard": "ASUS Prime B760M-A",\n' +
            '  "PSU": "550W 80+ Bronze",\n' +
            '  "Cooling": "Cooler Master Hyper 212",\n' +
            '  "Case": "NZXT H510"\n' +
            '}'

        try {
            build = JSON.parse(build);
        } catch (err) {
            console.error("Failed to parse AI response as JSON:", err);
            build = { error: "Failed to parse AI response" };
        }

        return new Response(JSON.stringify({ build }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "AI request failed" }), { status: 500 });
    }
}
