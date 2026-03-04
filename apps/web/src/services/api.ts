const API_BASE_URL = "http://localhost:3000/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = true,
  } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("accessToken");

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    // Important: force logout on auth failure
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API error ${response.status}: ${errorText}`
    );
  }

  return response.json();
}