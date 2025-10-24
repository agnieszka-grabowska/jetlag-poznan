const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Environment variable NEXT_PUBLIC_API_URL is not defined.");
}

export async function fetcher(
  url: string,
  options?: {
    arg?: {};
    method?: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  }
) {
  return fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: options?.arg ? JSON.stringify(options?.arg) : null,
    method: options?.method,
  }).then(async (res) => {
    if (!res.ok) {
      if (String(res.status)[0] === "4") {
        const { error } = await res.json();
        if (error) {
          throw new Error(error);
        }
      }

      throw new Error(res.statusText);
    }

    return res.json();
  });
}
