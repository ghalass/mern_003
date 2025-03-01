import React, { useState } from "react";
import AddOrCancelBtn from "../../commun/AddOrCancelBtn";
import FormSelect from "../../commun/FormSelect";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { useQuery } from "@tanstack/react-query";
import InputForm from "../../commun/InputForm";

const SaisieRjeForm = () => {
  const [du, setDu] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedParc, setSelectedParc] = useState("");
  const [selectedEngin, setSelectedEngin] = useState("");

  const getAll = async () => {
    const response = await axiosInstance.get(API_PATHS.SITES.GET_ALL_SITES);
    return response?.data?.sites || [];
  };

  const { isLoading: sitesIsLoading, data: sites = [] } = useQuery({
    queryKey: ["sitesList"],
    queryFn: getAll,
  });

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-1">
          <h6>Gestion d'un site</h6>
          <AddOrCancelBtn />
        </div>

        <InputForm
          type="date"
          disabled={sitesIsLoading}
          id="du"
          placeholder="Date de saisie"
          value={du}
          onChange={({ target }) => setDu(target.value)}
          label="date"
        />

        <FormSelect
          id="siteId"
          disabled={sitesIsLoading}
          title="Choisir un site"
          label="Sites"
          options={sites}
          value={selectedSite}
          onChange={({ target }) => setSelectedSite(target.value)}
        />

        <FormSelect
          id="parcId"
          disabled={sitesIsLoading}
          title="Choisir un parc"
          label="Sites"
          options={[]}
          value={selectedParc}
          onChange={({ target }) => setSelectedParc(target.value)}
        />

        <FormSelect
          id="enginId"
          disabled={sitesIsLoading}
          title="Choisir un engin"
          label="Engins"
          options={[]}
          value={selectedEngin}
          onChange={({ target }) => setSelectedEngin(target.value)}
        />
      </div>
    </div>
  );
};

export default SaisieRjeForm;
