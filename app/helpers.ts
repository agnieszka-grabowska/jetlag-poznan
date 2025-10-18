export function formatTime(ms: number, options: { showHours: boolean } = { showHours: false }) {
  const ss = Math.floor(ms / 1000) % 60;
  const mm = Math.floor(ms / 1000 / 60) % 60;
  const hh = Math.floor(ms / 1000 / 60 / 60);

  const formatedSeconds = ss.toString().padStart(2, "0");
  const formatedMinutes = mm.toString().padStart(2, "0");
  const formatedHours = hh.toString().padStart(2, "0");

  if (hh || options.showHours) {
    return `${formatedHours}:${formatedMinutes}:${formatedSeconds}`;
  }

  return `${formatedMinutes}:${formatedSeconds}`;
}

type Body = object | undefined;

export async function fetcher(
  url: string,
  options?: {
    body: Body;
    method?: "POST" | "GET" | "PUT" | "DELETE";
  }
) {
  return fetch(url, {
    method: options?.method ?? "GET",
    body: JSON.stringify(options?.body),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (!res.ok) {
      const { error } = await res.json();
      if (error) {
        throw new Error(error);
      }
      throw new Error(res.statusText);
    }

    return res.json();
  });
}

export function fetcherPost(url: string, options?: { body: Body }) {
  return fetcher(url, { body: options?.body, method: "POST" });
}

export function fetcherPut(url: string, options?: { body: Body }) {
  return fetcher(url, { body: options?.body, method: "PUT" });
}

export function fetcherDelete(url: string, options?: { body: Body }) {
  return fetcher(url, { body: options?.body, method: "DELETE" });
}
