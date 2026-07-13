const testGenerate = async () => {
  try {
    const res = await fetch("http://localhost:4000/api/v1/timetables/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        semester_id: "S002",
        academicYear: "2025-2026",
        generatedBy: "ADMIN",
        program_id: "P001"
      })
    });
    const data = await res.json();
    console.log("GENERATE API STATUS:", res.status);
    console.log("GENERATE API RESPONSE:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
};
testGenerate();
