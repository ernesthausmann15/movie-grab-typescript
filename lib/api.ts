import type {
  OmdbDetailParams,
  OmdbDetailSuccess,
  OmdbSearchParams,
  OmdbSearchSuccess,
} from "@/types/omdb";

// Empty env values must fall back too. `??` would keep "" and every search would fail.
const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY?.trim() || "21079115";
const API_URL = "https://www.omdbapi.com/";
const API_DELAY_MS = 650;

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(
        Object.assign(new Error("Request cancelled."), { name: "AbortError" }),
      );
      return;
    }

    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(
          Object.assign(new Error("Request cancelled."), {
            name: "AbortError",
          }),
        );
      },
      { once: true },
    );
  });
}

async function request<T extends OmdbSearchSuccess | OmdbDetailSuccess>(
  params: Record<string, string | number>,
  signal?: AbortSignal,
): Promise<T> {
  try {
    const query = new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)]),
      ),
      apikey: API_KEY,
    });

    const [response] = await Promise.all([
      fetch(`${API_URL}?${query}`, { signal }),
      delay(API_DELAY_MS, signal),
    ]);

    if (!response.ok) {
      throw new Error("The movie service is unavailable.");
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new Error("Received an invalid response from the movie service.");
    }

    if (
      typeof data !== "object" ||
      data === null ||
      !("Response" in data) ||
      (data as { Response: string }).Response === "False"
    ) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "Error" in data &&
        typeof (data as { Error: unknown }).Error === "string"
          ? (data as { Error: string }).Error
          : "No movie data found.";
      throw new Error(message);
    }

    return data as T;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new Error("Network error. Check your connection and try again.");
    }
    throw error;
  }
}

export function searchMovies(
  query: string,
  page = 1,
  signal?: AbortSignal,
): Promise<OmdbSearchSuccess> {
  // OMDb `s` matches the title text. `type=movie` keeps series and games out of the grid.
  const params: OmdbSearchParams = { s: query, page, type: "movie" };
  return request<OmdbSearchSuccess>(
    {
      s: params.s,
      page: params.page ?? 1,
      type: params.type ?? "movie",
    },
    signal,
  );
}

export function getMovie(
  id: string,
  signal?: AbortSignal,
): Promise<OmdbDetailSuccess> {
  const params: OmdbDetailParams = { i: id, plot: "full" };
  return request<OmdbDetailSuccess>(
    {
      i: params.i,
      plot: params.plot ?? "full",
    },
    signal,
  );
}

export function searchByDirector(
  director: string,
  signal?: AbortSignal,
): Promise<OmdbSearchSuccess> {
  return request<OmdbSearchSuccess>(
    {
      s: director,
      type: "movie",
    },
    signal,
  );
}
