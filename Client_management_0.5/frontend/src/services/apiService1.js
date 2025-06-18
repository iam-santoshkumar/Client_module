export const saveProtocol = async (data) => {
  const response = await fetch("http://localhost:8000/api/saveProtocol", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Get error text for better debugging
    console.error("Error response:", errorText);
    throw new Error(`Failed to save protocol: ${errorText}`);
  }

  return await response.json();
};
