export const loginUser = async ({ username, password }) => {
  const response = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Login error response:", errorText);
    throw new Error(`Failed to log in: ${errorText}`);
  }

  return await response.json();
};
