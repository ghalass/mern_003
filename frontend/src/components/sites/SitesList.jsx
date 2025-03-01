import React, { useState } from "react";
import { LuDownload } from "react-icons/lu";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { downloadExcel } from "../../utils/helpers";
import SiteList from "./SiteList";
import Pagination from "../commun/Pagination";

const SitesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const getAll = async () => {
    const response = await axiosInstance.get(API_PATHS.SITES.GET_ALL_SITES);
    return response?.data?.sites || [];
  };

  const {
    isLoading,
    isPending,
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

      downloadExcel(response.data);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // Mutations;
  const mutation = useMutation({
    mutationFn: upload,
    onSuccess: () => {
      toast.success("Téléchargé avec succès.");
    },
  });

  // Filtered sites based on search term
  const filteredSites = sites.filter(
    (site) =>
      site.id.toString().includes(searchTerm.toLowerCase()) ||
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
          <h6>
            Liste des sites ({filteredSites.length})
            {isPending && "Chargement..."}
          </h6>

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

        <div className="d-flex gap-1 justify-content-between">
          <input
            type="search"
            className="form-control mb-3"
            placeholder="Rechercher un site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type="number"
            className="form-control mb-3 w-25"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
          />
        </div>

        <SiteList paginatedSites={paginatedSites} />

        {isLoading && <div className="text-center">Chargement...</div>}
        {!isLoading && !isError && filteredSites.length === 0 && (
          <p>Aucune donnée disponible.</p>
        )}
        {isError && error && <Error error={error.message} />}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default SitesList;
