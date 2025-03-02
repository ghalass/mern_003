import React, { useState, useEffect } from "react";
import { useCrudStore } from "../../../store/crudStore";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import InputForm from "../../commun/InputForm";
import FormSelect from "../../commun/FormSelect";
import { BsExclamationCircle } from "react-icons/bs";
import { LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";

const SaisieRjeList = () => {
  const [hrmError, setHrmError] = useState(null);
  const [panneError, setPanneError] = useState(null);

  const selectedItem = useCrudStore((state) => state.selectedItem);

  const [selectedPanne, setSelectedPanne] = useState("");

  const getAllSaisieRje = async () => {
    if (!selectedItem?.du || !selectedItem?.enginId) return [];
    const response = await axiosInstance.post(
      API_PATHS.SAISIE_RJE.GET_SAISIE_RJE,
      { du: selectedItem.du, enginId: selectedItem.enginId }
    );
    return response?.data || [];
  };

  const { isLoading: saisierjeIsLoading, data: saisierje = [] } = useQuery({
    queryKey:
      selectedItem?.du && selectedItem?.enginId
        ? ["saisierjeList", selectedItem.du, selectedItem.enginId]
        : ["saisierjeList"],
    queryFn: getAllSaisieRje,
    enabled: !!selectedItem?.du && !!selectedItem?.enginId,
  });

  const [hrm, setHrm] = useState("");
  // Met à jour `hrm` lorsque `saisierje` change
  useEffect(() => {
    setHrm(saisierje[0]?.hrm || "");
  }, [saisierje]);

  const getAllPannes = async () => {
    const response = await axiosInstance.get(API_PATHS.PANNES.GET_ALL_PANNES);
    return response?.data?.pannes || [];
  };
  const { isLoading: pannesIsLoading, data: pannes = [] } = useQuery({
    queryKey: ["pannesList"],
    queryFn: getAllPannes,
  });

  const [him, setHim] = useState("");
  const [ni, setNi] = useState("");

  const dynamicMutation = async ({ fun, info = null }) => {
    setHrmError("");
    setPanneError("");

    if (!selectedItem?.du) {
      setHrmError("Choisir une date");
      return;
    }
    if (!selectedItem?.siteId) {
      setHrmError("Choisir un site.");
      return;
    }
    if (!selectedItem?.enginId) {
      setHrmError("Choisir un engin");
      return;
    }
    if (!hrm) {
      setHrmError("Saisir HRM");
      return;
    }

    switch (fun) {
      case "saiseHRM":
        if (saisierje && saisierje.length > 0 && saisierje[0]) {
          // update saiseHRM
          const data = {
            id: saisierje[0]?.id,
            // du: saisierje[0]?.du,
            // enginId: saisierje[0]?.enginId,
            // siteId: saisierje[0]?.siteId,
            hrm: hrm,
          };
          // console.log("update saiseHRM", data);
          // CALL API ==> ADD PANNE HIM
          const res = await axiosInstance.put(
            API_PATHS.SAISIE_RJE.UPDATE_SAISIE_RJE_HRM(data?.id),
            data
          );
          console.log(res);
        } else {
          // add saiseHRM
          const data = {
            du: selectedItem?.du,
            enginId: selectedItem?.enginId,
            siteId: selectedItem?.siteId,
            hrm: hrm,
          };
          await axiosInstance.post(
            API_PATHS.SAISIE_RJE.ADD_SAISIE_RJE_HRM,
            data
          );
        }
        break;
      case "saiseHIM":
        if (!saisierje[0]?.id) {
          setPanneError("Sauvegarder la Saisir HRM d'abord.");
          return;
        }
        if (!selectedPanne) {
          setPanneError("Choisir une panne");
          return;
        }
        if (!him) {
          setPanneError("Saisir HIM");
          return;
        }
        if (!ni) {
          setPanneError("Saisir NI");
          return;
        }

        const data = {
          saisiehrmId: saisierje[0]?.id || "",
          panneId: selectedPanne,
          him: him,
          ni: ni,
        };
        // CALL API ==> ADD PANNE HIM
        await axiosInstance.post(
          API_PATHS.SAISIE_RJE.ADD_SAISIE_RJE_PANNE_HIM,
          data
        );
        break;
      case "deletePanne":
        // CALL API ==> DELETE PANNE HIM
        await axiosInstance.delete(
          API_PATHS.SAISIE_RJE.DELETE_SAISIE_RJE_PANNE_HIM(info?.id)
        );
        break;

      default:
        throw new Error("Invalid mutation typeOp");
    }
  };
  // Mutation for HRM
  const queryClient = useQueryClient();
  const hrmMutation = useMutation({
    mutationFn: () => dynamicMutation({ fun: "saiseHRM" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisierjeList"] });
      if (!hrmError) {
        toast.success("HRM sauvegardé avec succès.");
      }
    },

    onError: (err) => setHrmError(err?.response?.data?.error),
  });
  // Mutation for HIM
  const himMutation = useMutation({
    mutationFn: () => dynamicMutation({ fun: "saiseHIM" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisierjeList"] });
      if (!panneError) {
        setHim("");
        setNi("");
        toast.success("Panne ajoutée avec succès.");
      }
    },
    onError: (err) => setPanneError(err?.response?.data?.error),
  });
  // Mutation for deleting panne
  const deleteMutation = useMutation({
    mutationFn: (item) => dynamicMutation({ fun: "deletePanne", info: item }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisierjeList"] });
      if (!panneError) {
        setHim("");
        setNi("");
        toast.success("Panne supprimée avec succès.");
      }
    },
    onError: (err) => setPanneError(err?.response?.data?.error),
  });

  useEffect(() => {
    setHrmError("");
    setPanneError("");
  }, [selectedItem]);

  // Check if any mutation is pending
  const isAnyPending =
    hrmMutation.isPending || himMutation.isPending || deleteMutation.isPending;
  return (
    <div className="row">
      <div className="col-sm-12 col-md-4 ">
        <div className="card">
          <div className="card-body">
            <InputForm
              type="number"
              disabled={saisierjeIsLoading}
              id="hrm"
              placeholder="HRM"
              value={hrm}
              onChange={({ target }) => setHrm(target.value)}
              label="HRM"
            />

            <button
              // onClick={() => mutation.mutate({ fun: "saiseHRM" })}
              onClick={() => hrmMutation.mutate()}
              type="submit"
              className={`btn btn-sm btn-outline-success mt-2 w-100`}
              disabled={isAnyPending}
            >
              {hrmMutation.isPending && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
              )}

              {hrmMutation.isPending ? "Traitement..." : "Sauvegarder"}
            </button>

            <div className="mt-2">
              {hrmError && (
                <div
                  className="d-flex align-items-center alert alert-danger w-100 py-2"
                  role="alert"
                >
                  <BsExclamationCircle className="me-2" />
                  <small className="text-danger-emphasis fst-italic fw-light">
                    {hrmError}
                  </small>
                </div>
              )}
            </div>

            <FormSelect
              id="panneId"
              disabled={pannesIsLoading}
              title="Choisir une panne"
              label="Pannes"
              options={pannes}
              value={selectedPanne}
              onChange={({ target }) => setSelectedPanne(target.value)}
            />

            <div className="d-flex gap-1">
              <InputForm
                type="number"
                disabled={saisierjeIsLoading}
                id="him"
                placeholder="HIM"
                value={him}
                onChange={({ target }) => setHim(target.value)}
                label="HIM"
              />
              <InputForm
                type="number"
                disabled={saisierjeIsLoading}
                id="ni"
                placeholder="NI"
                value={ni}
                onChange={({ target }) => setNi(target.value)}
                label="NI"
              />
            </div>

            <button
              disabled={isAnyPending}
              // onClick={() => mutation.mutate({ fun: "saiseHIM" })}
              onClick={() => himMutation.mutate()}
              type="submit"
              className={`btn btn-sm btn-outline-success mt-2 w-100`}
            >
              {himMutation.isPending && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
              )}

              {himMutation.isPending ? "Traitement..." : "Ajouter"}
            </button>

            <div className="mt-2">
              {panneError && (
                <div
                  className="d-flex align-items-center alert alert-danger w-100 py-2"
                  role="alert"
                >
                  <BsExclamationCircle className="me-2" />
                  <small className="text-danger-emphasis fst-italic fw-light">
                    {panneError}
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-md-8 ">
        <div className="card">
          <div className="card-body">
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Panne</th>
                  <th>Type</th>
                  <th>HIM</th>
                  <th>NI</th>
                  <th className="text-end">
                    {deleteMutation.isPending ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Actions"
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {saisierje[0]?.Saisiehim?.length > 0 &&
                  saisierje[0].Saisiehim.map((item, index) => (
                    <tr key={index}>
                      <td>#{item.id}</td>
                      <td>{item.Panne?.name || "N/A"}</td>
                      <td>{item.Panne?.Typepanne?.name || "N/A"}</td>
                      <td>{item.him}</td>
                      <td>{item.ni}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger border border-danger-subtle rounded-pill"
                          disabled={
                            deleteMutation.isPending ||
                            himMutation.isPending ||
                            hrmMutation.isPending
                          }
                          onClick={() => deleteMutation.mutate(item)}
                        >
                          <LuTrash2 className="mb-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaisieRjeList;
