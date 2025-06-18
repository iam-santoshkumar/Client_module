export const registerUser = async ({ username, email, password, role }) => {
  const response = await fetch("http://localhost:8000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, role }),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Get error text for better debugging
    console.error("Registration error response:", errorText);
    throw new Error(`Failed to register user: ${errorText}`);
  }

  return await response.json();
};
