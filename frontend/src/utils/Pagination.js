import React, { useState, useEffect } from "react";
import styles from "./Pagination.module.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const [inputValue, setInputValue] = useState(currentPage);

  useEffect(() => {
    setInputValue(currentPage); // Sync input value with currentPage when it changes externally
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page); // Trigger page change immediately
      setInputValue(page); // Update the input value to reflect the new page
    }
  };

  const handleInputChange = (event) => {
    const inputPage = parseInt(event.target.value, 10);
    setInputValue(event.target.value); // Update the input field as user types

    if (isNaN(inputPage)) return;

    if (inputPage > totalPages) {
      alert(`Please enter a number between 1 and ${totalPages}`);
      setInputValue(currentPage); // Reset to the last valid page
    } else if (inputPage >= 1) {
      onPageChange(inputPage); // Trigger page change if within range
    }
  };

  return (
    <div className={styles.paginationContainer}>
      <button
        className={styles.paginationButton}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        First
      </button>
      <button
        className={styles.paginationButton}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Prev
      </button>

      {/* Page input and total pages display */}
      <span className={styles.pageInfo}>
        Page
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          className={styles.pageInput}
          min="1"
          max={totalPages}
        />
        of {totalPages}
      </span>

      <button
        className={styles.paginationButton}
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
      <button
        className={styles.paginationButton}
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
      >
        Last
      </button>
    </div>
  );
}

export default Pagination;
