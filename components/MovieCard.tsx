"use client";

import { useState } from "react";
import Link from "next/link";
import type { Movie } from "@/types/movie";

const FALLBACK_POSTER =
  "https://placehold.co/600x900/121216/e8e8ec?text=No+Poster";

interface MovieCardProps {
  movie: Movie;
  onSelect?: (movie: Movie) => void;
}

export default function MovieCard({ movie, onSelect }: MovieCardProps) {
  const resolvedPoster =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;
  // Remember which URL failed so a later movie doesn't stay stuck on the placeholder.
  const [failedPoster, setFailedPoster] = useState<string | null>(null);
  const poster = failedPoster === resolvedPoster ? FALLBACK_POSTER : resolvedPoster;

  return (
    <article
      className="movie-card group relative min-w-0 border border-[var(--line)] bg-[var(--bg-elevated)] p-2.5 pb-3
        transition-all duration-300 ease-out will-change-transform
        hover:-translate-y-2 hover:scale-[1.035] hover:border-accent
        hover:shadow-[0_18px_48px_rgba(0,0,0,0.55),0_0_32px_rgba(229,9,20,0.28)]"
    >
      <Link
        href={`/movie/${encodeURIComponent(movie.imdbID)}`}
        className="movie-card-link block"
      >
        <div className="poster-wrap relative aspect-[2/3] overflow-hidden border border-[var(--line)] bg-obsidian">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt={`${movie.Title} poster`}
            loading="lazy"
            className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            onError={() => {
              if (poster !== FALLBACK_POSTER) setFailedPoster(resolvedPoster);
            }}
          />
          <span className="poster-badge absolute left-2.5 top-2.5 border border-[var(--line)] bg-[rgba(10,10,12,0.92)] px-1.5 py-1 font-mono text-[0.58rem] font-medium uppercase tracking-wide text-white">
            {movie.Type || "film"}
          </span>
          <span
            className="pointer-events-none absolute inset-0 border border-accent/0 opacity-0 transition-all duration-300 group-hover:border-accent/60 group-hover:opacity-100 group-hover:shadow-[inset_0_0_40px_rgba(229,9,20,0.18)]"
            aria-hidden="true"
          />
        </div>
        <div className="movie-card-copy px-0 pb-1 pt-3">
          <h3 className="m-0 text-[0.94rem] font-semibold leading-snug text-[var(--text)]">
            {movie.Title}
          </h3>
          <p className="mt-1.5 font-mono text-[0.72rem] font-medium text-[var(--text-muted)]">
            {movie.Year}
          </p>
        </div>
      </Link>
      {onSelect ? (
        <button
          className="card-action border-0 bg-transparent p-0 font-mono text-[0.68rem] font-medium uppercase tracking-wide text-[var(--accent-text)] transition-opacity duration-300 hover:opacity-90"
          type="button"
          onClick={() => onSelect(movie)}
        >
          Quick view
        </button>
      ) : null}
      <span
        className="pointer-events-none absolute bottom-[-6px] left-[10%] right-[10%] h-px origin-center scale-x-0 bg-accent opacity-0 shadow-[0_0_12px_rgba(229,9,20,0.85)] transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"
        aria-hidden="true"
      />
    </article>
  );
}
