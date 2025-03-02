import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import PerformancesLayout from "../../layouts/PerformancesLayout";

const IndexPerformance = () => {
  return (
    <div>
      <DefaultLayout />
      <div className="container-fluid">
        <PerformancesLayout />
      </div>
    </div>
  );
};

export default IndexPerformance;
