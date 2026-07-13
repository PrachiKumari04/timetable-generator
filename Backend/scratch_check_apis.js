const testApis = async () => {
  try {
    const semsRes = await fetch("http://localhost:4000/api/v1/semesters?limit=100");
    const sems = await semsRes.json();
    console.log("SEMESTERS API STATUS:", semsRes.status);
    console.log("SEMESTERS API RESPONSE:", JSON.stringify(sems, null, 2));

    const progsRes = await fetch("http://localhost:4000/api/v1/programmes?limit=100");
    const progs = await progsRes.json();
    console.log("PROGRAMMES API STATUS:", progsRes.status);
    console.log("PROGRAMMES API RESPONSE:", JSON.stringify(progs, null, 2));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
};

testApis();
