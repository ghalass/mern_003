import React from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <div className="d-flex justify-content-between mt-3">
      <button
        className="btn btn-sm btn-outline-primary"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        <LuArrowLeft className="mb-1" />
      </button>
      <span>
        Page {currentPage} sur {totalPages}
      </span>
      <button
        className="btn btn-sm btn-outline-primary"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        <LuArrowRight className="mb-1" />
      </button>
    </div>
  );
};

export default Pagination;
