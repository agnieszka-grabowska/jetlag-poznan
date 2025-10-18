import { headers } from "next/headers";

export async function serverFetch(url: string, requestInit?: RequestInit) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";

  return fetchWithBaseUrl(url, {
    ...requestInit,
    headers: {
      Cookie: cookieHeader, // Forward cookies here
    },
  });
}

function fetchWithBaseUrl(url: string, requestInit?: RequestInit) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error("Environment variable NEXT_PUBLIC_API_URL is not defined.");
  }

  return fetch(`${API_URL}${url}`, { ...requestInit });
}
