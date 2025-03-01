import React, { useEffect, useState } from "react";
import AddOrCancelBtn from "../../commun/AddOrCancelBtn";
import FormSelect from "../../commun/FormSelect";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { useQuery } from "@tanstack/react-query";
import InputForm from "../../commun/InputForm";
import { useCrudStore } from "../../../store/crudStore";

const SaisieRjeForm = () => {
  const [du, setDu] = useState("");
  const [hrm, setHrm] = useState("");

  const [selectedSite, setSelectedSite] = useState("");
  const [selectedParc, setSelectedParc] = useState("");
  const [selectedEngin, setSelectedEngin] = useState("");

  const selectedItem = useCrudStore((state) => state.selectedItem);
  const setSelectedItem = useCrudStore((state) => state.setSelectedItem);
  const setOp = useCrudStore((state) => state.setOp);
  const op = useCrudStore((state) => state.op);

  const getAllSite = async () => {
    const response = await axiosInstance.get(API_PATHS.SITES.GET_ALL_SITES);
    return response?.data?.sites || [];
  };
  const { isLoading: sitesIsLoading, data: sites = [] } = useQuery({
    queryKey: ["sitesList"],
    queryFn: getAllSite,
  });

  const getAllEngins = async () => {
    const response = await axiosInstance.get(API_PATHS.ENGINS.GET_ALL_ENGINS);
    return response?.data?.engins || [];
  };
  const { isLoading: enginsIsLoading, data: engins = [] } = useQuery({
    queryKey: ["enginsList"],
    queryFn: getAllEngins,
  });

  useEffect(() => {
    getSaisieHrm();
  }, [selectedEngin, du]);

  const getSaisieHrm = () => {
    const data = { du, enginId: selectedEngin };
    if (du && selectedEngin) {
      setSelectedItem(data);
    }
  };

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

        {/* <FormSelect
          id="siteId"
          disabled={sitesIsLoading}
          title="Choisir un site"
          label="Sites"
          options={sites}
          value={selectedSite}
          onChange={({ target }) => setSelectedSite(target.value)}
        /> */}

        {/* <FormSelect
          id="parcId"
          disabled={sitesIsLoading}
          title="Choisir un parc"
          label="Sites"
          options={[]}
          value={selectedParc}
          onChange={({ target }) => setSelectedParc(target.value)}
        /> */}

        <FormSelect
          id="enginId"
          disabled={enginsIsLoading}
          title="Choisir un engin"
          label="Engins"
          options={engins}
          value={selectedEngin}
          onChange={({ target }) => setSelectedEngin(target.value)}
        />
      </div>
    </div>
  );
};

export default SaisieRjeForm;
