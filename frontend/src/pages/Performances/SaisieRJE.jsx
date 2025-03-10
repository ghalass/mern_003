import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import PerformancesLayout from "../../layouts/PerformancesLayout";
import SaisieRjeForm from "../../components/performances/saisierje/SaisieRjeForm";
import SaisieRjeList from "../../components/performances/saisierje/SaisieRjeList";

const SaisieRJE = () => {
  return (
    <div>
      <DefaultLayout />
      <div className="container-fluid">
        <PerformancesLayout />

        <div className="row">
          <div className="mt-1 col-sm-12 col-md-4 ">
            <SaisieRjeForm />
          </div>

          <div className="mt-1 col-sm-12 col-md-8 ">
            <SaisieRjeList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaisieRJE;
