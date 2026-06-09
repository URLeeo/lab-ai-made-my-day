import styles from "./Pagination.module.css";

// Prev / Next pagination controls.
export default function Pagination({ page, onPrev, onNext }) {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        onClick={onPrev}
        disabled={page === 1}
      >
        Previous
      </button>

      <span className={styles.pageText}>Page {page}</span>

      <button className={styles.button} onClick={onNext}>
        Next
      </button>
    </div>
  );
}
