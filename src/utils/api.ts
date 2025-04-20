export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Try to get token from localStorage first, then cookies
  const token =
    localStorage.getItem("accessToken") ||
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

  if (!token) {
    // If no token is found, redirect to login
    window.location.replace("/login");
    throw new Error("No authentication token found");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.replace("/login");
      throw new Error("Unauthorized access");
    }

    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
