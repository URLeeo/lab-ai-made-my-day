"use client";

import { useEffect, useState } from "react";
import { formatPokemonId, getPokemonId, getPokemonImage } from "../lib/pokeapi";
import styles from "./PokemonDetail.module.css";

const TYPE_CLASS_BY_NAME = {
  normal: "typeNormal",
  fire: "typeFire",
  water: "typeWater",
  electric: "typeElectric",
  grass: "typeGrass",
  ice: "typeIce",
  fighting: "typeFighting",
  poison: "typePoison",
  ground: "typeGround",
  flying: "typeFlying",
  psychic: "typePsychic",
  bug: "typeBug",
  rock: "typeRock",
  ghost: "typeGhost",
  dragon: "typeDragon",
  dark: "typeDark",
  steel: "typeSteel",
  fairy: "typeFairy",
};

function getTypeClassName(typeName) {
  const typeClass = TYPE_CLASS_BY_NAME[typeName] || "typeDefault";
  return `${styles.typeBadge} ${styles[typeClass]}`;
}

// Expanded "detail card" shown on top of the page when a Pokémon is clicked.
// It fetches the full details (types, stats, height, weight) for that Pokémon.
export default function PokemonDetail({ pokemon, onClose }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadDetails() {
      const res = await fetch(pokemon.url);
      const data = await res.json();

      if (!ignore) {
        setDetails(data);
      }
    }

    loadDetails();

    return () => {
      ignore = true;
    };
  }, [pokemon]);

  const id = getPokemonId(pokemon.url);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <img className={styles.image} src={getPokemonImage(id)} alt={pokemon.name} />

        <h2 className={styles.name}>{pokemon.name}</h2>
        <p className={styles.id}>#{formatPokemonId(id)}</p>

        {!details ? (
          <p className={styles.loadingText}>Loading details…</p>
        ) : (
          <div className={styles.details}>
            <div className={styles.types}>
              {details.types.map((t) => (
                <span key={t.type.name} className={getTypeClassName(t.type.name)}>
                  {t.type.name}
                </span>
              ))}
            </div>

            <p className={styles.measurement}>
              <strong>Height:</strong> {details.height / 10} m
            </p>
            <p className={styles.measurement}>
              <strong>Weight:</strong> {details.weight / 10} kg
            </p>

            <h3 className={styles.statsTitle}>Base stats</h3>
            {details.stats.map((s) => (
              <div key={s.stat.name} className={styles.statRow}>
                <span className={styles.statName}>{s.stat.name}</span>
                <span className={styles.statValue}>{s.base_stat}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
