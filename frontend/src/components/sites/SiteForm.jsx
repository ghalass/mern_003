import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { BsExclamationCircle } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";
import { useCrudStore } from "../../store/crudStore";
import { LuPin, LuPlus, LuX } from "react-icons/lu";
import InputForm from "../commun/InputForm";
import AddOrCancelBtn from "../commun/AddOrCancelBtn";

const SiteForm = () => {
  const selectedItem = useCrudStore((state) => state.selectedItem);
  const setSelectedItem = useCrudStore((state) => state.setSelectedItem);
  const setOp = useCrudStore((state) => state.setOp);
  const op = useCrudStore((state) => state.op);

  const [name, setName] = useState("");

  const [error, setError] = useState(null);

  const [btnSubmit, setBtnSubmit] = useState({
    text: "Ajouter",
    cls: "primary",
    icon: "",
  });

  useEffect(() => {
    setName(selectedItem?.name ?? "");
    switch (op) {
      case "add":
        setBtnSubmit({ text: "Créer", cls: "primary" });
        break;

      case "update":
        setBtnSubmit({ text: "Mofifier", cls: "success" });
        break;

      case "delete":
        setBtnSubmit({ text: "Supprimer", cls: "danger" });
        break;

      default:
        break;
    }
  }, [op, selectedItem]);

  const dynamicMutation = async ({ typeOp, data }) => {
    switch (typeOp) {
      case "add":
        const responseAdd = await axiosInstance.post(
          API_PATHS.SITES.ADD_SITE,
          data
        );
        if (responseAdd?.data?.message)
          toast.success(responseAdd?.data?.message);
        return responseAdd;

      case "delete":
        const responseDelete = await axiosInstance.delete(
          API_PATHS.SITES.DELETE_SITE(selectedItem?.id)
        );
        if (responseDelete?.data?.message)
          toast.success(responseDelete?.data?.message);
        return responseDelete;

      case "update":
        const responseUpdate = await axiosInstance.put(
          API_PATHS.SITES.UPDATE_SITE(selectedItem?.id),
          data
        );
        if (responseUpdate?.data?.message)
          toast.success(responseUpdate?.data?.message);
        return responseUpdate;
      default:
        throw new Error("Invalid mutation typeOp");
    }
  };

  // Mutations;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: dynamicMutation,
    onSuccess: () => {
      setName("");
      setOp(null);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ["sitesList"] });
    },
  });

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Entrer le nom du site.");
      return;
    }
    setError("");
    // Login API Call
    mutation.mutate({ typeOp: op, data: { name } });
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-1">
          <h6>Gestion d'un site</h6>
          <AddOrCancelBtn />
        </div>

        <form onSubmit={handleSubmit}>
          <InputForm
            id={"name"}
            placeholder={"Nom du site"}
            value={name}
            onChange={({ target }) => setName(target.value)}
            label={"Nom du site"}
            icon={<LuPin className="me-1" />}
          />

          <button
            disabled={mutation.isPending}
            hidden={!op}
            type="submit"
            className={`btn btn-sm btn-outline-${btnSubmit.cls} mt-2 w-100`}
          >
            <div className="d-flex justify-content-center align-items-center">
              {mutation.isPending && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
              )}
              {mutation.isPending ? "Traitement..." : `${btnSubmit.text}`}
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
    </div>
  );
};

export default SiteForm;
