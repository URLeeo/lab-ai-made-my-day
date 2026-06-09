import { formatPokemonId, getPokemonId, getPokemonImage } from "../lib/pokeapi";
import styles from "./PokemonCard.module.css";

// A single Pokémon card in the grid. Clicking it opens the detail view.
export default function PokemonCard({ pokemon, onSelect }) {
  const id = getPokemonId(pokemon.url);
  const image = getPokemonImage(id);

  return (
    <button className={styles.card} onClick={() => onSelect(pokemon)}>
      <img className={styles.image} src={image} alt={pokemon.name} />
      <p className={styles.id}>#{formatPokemonId(id)}</p>
      <p className={styles.name}>{pokemon.name}</p>
    </button>
  );
}
