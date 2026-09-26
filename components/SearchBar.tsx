"use client";

import type { FormEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  isLoading?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search by title",
  buttonLabel = "Search",
  isLoading = false,
}: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search by title"
        disabled={isLoading}
        autoComplete="off"
      />
      <button
        className="primary-button"
        type="submit"
        disabled={isLoading || !value.trim()}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            Searching
            <span className="search-spinner" aria-hidden="true" />
          </>
        ) : (
          <>
            {buttonLabel} <span aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  );
}
