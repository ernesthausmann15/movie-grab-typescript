"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import MovieGrid from "@/components/MovieGrid";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { searchMovies } from "@/lib/api";
import { getErrorMessage, isAbortError } from "@/lib/errors";
import type { Movie } from "@/types/movie";

type SearchStatus = "idle" | "loading" | "success" | "error";

const SUGGESTIONS = ["Arrival", "The Godfather", "Inception"] as const;
// Opening catalogue. OMDb has no "trending" feed, so a title search fills the grid on first paint.
const FEATURED_TITLE = "Star Wars";

export default function HomePage() {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [error, setError] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    let active = true;

    async function loadFeatured() {
      setStatus("loading");
      setError("");
      try {
        const data = await searchMovies(FEATURED_TITLE, 1, controller.signal);
        // A newer search may have aborted this request. Don't overwrite those results.
        if (!active || controller.signal.aborted) return;
        setMovies(data.Search ?? []);
        setActiveQuery(FEATURED_TITLE);
        setIsFeatured(true);
        setStatus("success");
      } catch (requestError: unknown) {
        if (!active || isAbortError(requestError)) return;
        setMovies([]);
        setError(
          getErrorMessage(requestError, "Couldn't load movies. Please try again."),
        );
        setStatus("error");
      }
    }

    void loadFeatured();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  async function handleSearch(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setTerm(trimmed);
    setActiveQuery(trimmed);
    setIsFeatured(false);
    setStatus("loading");
    setError("");

    try {
      const data = await searchMovies(trimmed, 1, controller.signal);
      if (controller.signal.aborted) return;
      const results: Movie[] = data.Search ?? [];
      setMovies(results);
      setStatus("success");
    } catch (requestError: unknown) {
      if (isAbortError(requestError)) return;
      setMovies([]);
      setError(getErrorMessage(requestError, "Search failed. Please try again."));
      setStatus("error");
    }
  }

  function openBrowse() {
    try {
      sessionStorage.setItem(
        "moviegrab-browse",
        JSON.stringify({ movies, term: activeQuery || term }),
      );
    } catch {
      // sessionStorage may be unavailable; browse page has its own fallback fetch
    }
    router.push("/movies");
  }

  return (
    <main className="home-page page-shell relative z-10">
      <section className="hero-section animate-in-fade">
        <div className="hero-copy">
          <span className="eyebrow tracking-[0.18em]">Your personal film index</span>
          <h1 className="text-balance">Find the next story worth your time.</h1>
          <p className="max-w-xl text-pretty leading-relaxed text-[var(--text-muted)]">
            Search a living catalogue of cinema, then follow the threads from
            one film to the next — crafted for a premium, distraction-free
            watchlist ritual.
          </p>
          <SearchBar
            value={term}
            onChange={setTerm}
            onSubmit={handleSearch}
            isLoading={status === "loading"}
          />
        </div>
        <div className="hero-stat">
          <strong>01</strong>
          <span>
            Search
            <br />
            discover
            <br />
            repeat
          </span>
        </div>
      </section>

      <section
        className="results-section"
        aria-live="polite"
        aria-busy={status === "loading"}
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">Instant discovery</span>
            <h2 className="text-balance">
              {status === "success" && isFeatured
                ? "Featured titles"
                : status === "success" && activeQuery
                  ? `Results for “${activeQuery}”`
                  : status === "loading"
                    ? "Searching the catalogue…"
                    : status === "error"
                      ? "We hit a snag"
                      : "Start with a classic"}
            </h2>
          </div>
          {status === "success" && movies.length > 0 ? (
            <button className="text-button" type="button" onClick={openBrowse}>
              Open full browser →
            </button>
          ) : null}
        </div>

        {status === "loading" ? (
          <SkeletonGrid count={6} label="Searching movie results" />
        ) : null}

        {status === "error" ? (
          <div className="empty-state" role="alert">
            <span className="empty-number">!</span>
            <div>
              <p className="status-message error-text">{error}</p>
              <button
                className="text-button"
                type="button"
                onClick={() => void handleSearch(activeQuery || term)}
              >
                Try again →
              </button>
            </div>
          </div>
        ) : null}

        {status === "idle" ? (
          <div className="empty-state">
            <p>
              Try{" "}
              {SUGGESTIONS.map((title, index) => (
                <span key={title}>
                  {index > 0
                    ? index === SUGGESTIONS.length - 1
                      ? ", or "
                      : ", "
                    : null}
                  <button
                    className="inline-button"
                    type="button"
                    onClick={() => void handleSearch(title)}
                  >
                    {title}
                  </button>
                </span>
              ))}
              .
            </p>
          </div>
        ) : null}

        {status === "success" && movies.length === 0 ? (
          <div className="empty-state">
            <span className="empty-number">—</span>
            <p>No titles matched “{activeQuery}”. Try another search.</p>
          </div>
        ) : null}

        {status === "success" && movies.length > 0 ? (
          <MovieGrid movies={movies.slice(0, 6)} />
        ) : null}
      </section>
    </main>
  );
}
