const run = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: "admin",
        password: "admin123"
      })
    });
    
    const data = await response.json();
    console.log("STATUS:", response.status);
    console.log("RESPONSE:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("ERROR:", error.message);
  }
};

run();
