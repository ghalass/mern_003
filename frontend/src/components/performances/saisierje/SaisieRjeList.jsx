import React from "react";
import { useCrudStore } from "../../../store/crudStore";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { useQuery } from "@tanstack/react-query";

const SaisieRjeList = () => {
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

  return (
    <div className="card">
      <div className="card-body">
        <h6>Date : {selectedItem?.du}</h6>
        <h6>Engin : {}</h6>
        <h6>HRM : {}</h6>
      </div>
    </div>
  );
};

export default SaisieRjeList;
