import React from "react";
import { LuTrash2, LuPencil } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const SitesList = () => {
  const getAll = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SITES.GET_ALL_SITES);
      if (response?.data?.sites) {
        return response?.data?.sites;
      } else {
        return [];
      }
    } catch (error) {}
  };

  const {
    isLoading,
    error,
    data: sites,
    isError,
  } = useQuery({
    queryKey: ["sitesList"],
    queryFn: getAll,
    retry: 1, // Reduce retries for faster error detection
    retryDelay: 2000, // Wait before retrying
  });

  return (
    <div className="card-body">
      <h6>Liste des sites ({sites?.length})</h6>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Site</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sites) &&
            sites?.map((site, index) => (
              <tr key={index}>
                <td>{site.id}</td>
                <td>{site.name}</td>
                <td>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-danger rounded-pill pb-1 pt-0 px-2">
                      <LuTrash2 />
                    </button>
                    <button className="btn btn-sm btn-outline-success rounded-pill pb-1 pt-0 px-2">
                      <LuPencil />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isLoading && <div className="text-center">Chargement...</div>}

      {!isLoading && !isError && sites?.length === 0 && (
        <p>Aucune données disponible.</p>
      )}
      {isError && error && <Error error={error.message} />}
    </div>
  );
};

export default SitesList;
