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

type Body = {};

export async function fetcher(
  url: string,
  options?: {
    arg?: Body;
    method?: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  }
) {
  return fetch(url, {
    method: options?.method ?? "GET",
    body: JSON.stringify(options?.arg),
    headers: {
      "Content-Type": "application/json",
    },
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

export function fetcherPost(url: string, options?: { arg?: Body }) {
  return fetcher(url, { arg: options?.arg, method: "POST" });
}

export function fetcherPut(url: string, options?: { arg?: Body }) {
  return fetcher(url, { arg: options?.arg, method: "PUT" });
}

export function fetcherDelete(url: string, options?: { arg?: Body }) {
  return fetcher(url, { arg: options?.arg, method: "DELETE" });
}

export function fetcherPatch(url: string, options?: { arg?: Body }) {
  return fetcher(url, { arg: options?.arg, method: "PATCH" });
}
