import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";

import AdminLayout from "../../layouts/AdminLayout";

import SitesList from "../../components/sites/SitesList";
import SiteForm from "../../components/sites/SiteForm";

const Sites = () => {
  return (
    <div>
      <DefaultLayout />
      <div className="container-lg">
        <AdminLayout />

        <div className="d-flex gap-1">
          <div className="mt-2 card col col-md-4">
            <SiteForm />
          </div>

          <div className="mt-2 card col col-md-8">
            <SitesList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sites;
