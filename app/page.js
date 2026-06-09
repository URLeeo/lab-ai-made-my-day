"use client";

import { useEffect, useMemo, useState } from "react";
import { POKE_API, PAGE_SIZE } from "./lib/pokeapi";
import PokemonCard from "./components/PokemonCard";
import PokemonDetail from "./components/PokemonDetail";
import Pagination from "./components/Pagination";
import styles from "./page.module.css";

export default function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch a page of Pokémon every time the page number changes.
  useEffect(() => {
    async function loadPokemon() {
      setLoading(true);
      setError(null);

      try {
        const offset = (page - 1) * PAGE_SIZE;
        const res = await fetch(`${POKE_API}?limit=${PAGE_SIZE}&offset=${offset}`);

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        setPokemon(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, [page]);

  const filteredPokemon = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return pokemon;
    }

    return pokemon.filter((p) => p.name.toLowerCase().includes(query));
  }, [pokemon, search]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pokédex</h1>
        <p className={styles.subtitle}>Click on a Pokémon to see its details.</p>
      </header>

      <label className={styles.searchLabel} htmlFor="pokemon-search">
        Search current page
      </label>
      <input
        id="pokemon-search"
        className={styles.searchInput}
        type="search"
        placeholder="Try pikachu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && (
        <div className={styles.grid} aria-label="Loading Pokémon cards">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div className={styles.skeletonCard} key={index}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonLineShort} />
              <div className={styles.skeletonLine} />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          <strong>Oops! We couldn&apos;t load the Pokémon.</strong>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredPokemon.length > 0 ? (
            <div className={styles.grid}>
              {filteredPokemon.map((p) => (
                <PokemonCard key={p.name} pokemon={p} onSelect={setSelected} />
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>No Pokémon matched your search.</p>
          )}

          <Pagination
            page={page}
            onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setPage((prev) => prev + 1)}
          />
        </>
      )}

      {selected && (
        <PokemonDetail key={selected.name} pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
