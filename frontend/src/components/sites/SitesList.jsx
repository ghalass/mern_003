import React, { useState } from "react";
import { LuTrash2, LuPencil, LuPlus, LuDownload } from "react-icons/lu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useCrudStore } from "../../store/crudStore";

const SitesList = () => {
  const setSelectedItem = useCrudStore((state) => state.setSelectedItem);
  const setOp = useCrudStore((state) => state.setOp);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getAll = async () => {
    const response = await axiosInstance.get(API_PATHS.SITES.GET_ALL_SITES);
    return response?.data?.sites || [];
  };

  const {
    isLoading,
    error,
    data: sites = [],
    isError,
  } = useQuery({
    queryKey: ["sitesList"],
    queryFn: getAll,
    retry: 1,
    retryDelay: 2000,
  });

  const upload = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SITES.DOWNLOAD_SITES, {
        responseType: "blob", // Ensure response is a binary file
      });

      // Convert response to blob
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sites_list.xlsx"; // File name
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // Mutations;
  const mutation = useMutation({
    mutationFn: upload,
    onSuccess: () => {},
  });

  // Filtered sites based on search term
  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredSites.length / itemsPerPage);
  const paginatedSites = filteredSites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-1">
          <h6>Liste des sites ({filteredSites.length})</h6>

          <button
            disabled={mutation.isPending}
            onClick={() => {
              mutation.mutate();
            }}
            className="btn btn-sm btn-outline-success rounded-pill pb-1 pt-0 px-2"
          >
            {mutation.isPending ? (
              <span
                className="spinner-border spinner-border-sm"
                aria-hidden="true"
              ></span>
            ) : (
              <LuDownload />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="search"
          className="form-control mb-3"
          placeholder="Rechercher un site..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="table table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Site</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSites.map((site, index) => (
              <tr key={index}>
                <td>{site.id}</td>
                <td>{site.name}</td>
                <td>
                  <div className="d-flex justify-content-end gap-1">
                    <button
                      onClick={() => {
                        setSelectedItem(site);
                        setOp("update");
                      }}
                      className="btn btn-sm btn-outline-success rounded-pill pb-1 pt-0 px-2"
                    >
                      <LuPencil />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedItem(site);
                        setOp("delete");
                      }}
                      className="btn btn-sm btn-outline-danger rounded-pill pb-1 pt-0 px-2"
                    >
                      <LuTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isLoading && <div className="text-center">Chargement...</div>}
        {!isLoading && !isError && filteredSites.length === 0 && (
          <p>Aucune donnée disponible.</p>
        )}
        {isError && error && <Error error={error.message} />}

        {/* Pagination Controls */}
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Précédent
          </button>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default SitesList;
