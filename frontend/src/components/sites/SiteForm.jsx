import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { BsKey, BsPerson, BsExclamationCircle } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";

const SiteForm = () => {
  const [name, setName] = useState("");

  const [error, setError] = useState(null);

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Entrer le nom du site.");
      return;
    }

    setError("");

    // Login API Call
    mutation.mutate({ name });
  };

  const create = async (data) => {
    try {
      const response = await axiosInstance.post(API_PATHS.SITES.ADD_SITE, data);
      if (response?.data?.message) {
        toast.success(response?.data?.message);
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur s'est produite, veuillez réessayer.");
      }
    }
  };

  // Mutations;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: create,
    onSuccess: () => {
      setName("");
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["sitesList"] });
    },
  });

  return (
    <div className="card-body">
      <h6>Gestion d'un site</h6>

      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-2">
          <input
            type="text"
            className={`form-control`}
            id="name"
            placeholder="Nom du site"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
          <label htmlFor="naemailme">
            <BsPerson className="me-1" />
            Nom du site
          </label>
        </div>

        <button
          disabled={mutation.isPending}
          type="submit"
          className={`btn btn-sm btn-outline-primary mt-2 w-100`}
        >
          <div className="d-flex justify-content-center align-items-center">
            {mutation.isPending && (
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              ></span>
            )}
            {mutation.isPending ? "Processing..." : "Ajouter"}
          </div>
        </button>

        <div className="mt-2" style={{ height: "60px" }}>
          {error && (
            <div
              className="d-flex align-items-center alert alert-danger w-100 py-2"
              role="alert"
            >
              <BsExclamationCircle className="me-2" />
              <small className="text-danger-emphasis fst-italic fw-light">
                {error}
              </small>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SiteForm;
