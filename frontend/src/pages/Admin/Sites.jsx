import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";

import AdminLayout from "../../layouts/AdminLayout";

const Sites = () => {
  return (
    <div>
      <DefaultLayout />
      <div className="container-lg">
        <AdminLayout />

        <div className="mt-2 card">
          <div className="card-body">
            <h6>Liste des sites</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sites;
