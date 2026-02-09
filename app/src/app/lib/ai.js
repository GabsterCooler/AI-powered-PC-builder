function cleanAIResponse(str) {
    str = str.replace(/```json|```/gi, "").trim();

    str = str.replace(/^\s+|\s+$/g, "");

    return str;
}

export async function promptAI(prompt) {
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

    // let build = data.choices?.[0]?.message.content || "Error generating build";

    let build = '{\n' +
        '  "CPU": "AMD Ryzen 5 5600X",\n' +
        '  "GPU": "NVIDIA GeForce RTX 4070",\n' +
        '  "RAM": "Corsair Vengeance LPX 16GB DDR4 3200MHz",\n' +
        '  "Storage": "Samsung 970 Evo Plus 1TB NVMe SSD",\n' +
        '  "Motherboard": "MSI B550-A Pro",\n' +
        '  "PSU": "Corsair RM650x 650W"\n' +
        '}'


    try {
        build = cleanAIResponse(build);
        return JSON.parse(build);
    } catch (err) {
        console.error("Failed to parse AI response as JSON:", err);
        return { error: "Failed to parse AI response" };
    }
}