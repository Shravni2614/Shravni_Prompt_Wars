const API_BASE_URL = import.meta.env.VITE_API_URL || "https://shravni-prompt-wars-1.onrender.com";

export async function analyzeDecision(decisionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(decisionData),
    });

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          errorMessage = typeof errorJson.detail === "string" 
            ? errorJson.detail 
            : JSON.stringify(errorJson.detail);
        }
      } catch (e) {
        // Ignore json parse error
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API error during decision analysis:", err);
    throw err;
  }
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (response.ok) {
      return await response.json();
    }
    return { status: "offline" };
  } catch (e) {
    return { status: "offline" };
  }
}
