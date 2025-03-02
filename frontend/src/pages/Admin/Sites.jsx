import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";

import AdminLayout from "../../layouts/AdminLayout";

import SitesList from "../../components/sites/SitesList";
import SiteForm from "../../components/sites/SiteForm";

const Sites = () => {
  return (
    <div>
      <DefaultLayout />
      <div className="container-fluid">
        <AdminLayout />

        <div className="row">
          <div className="mt-1 col-sm-12 col-md-4 ">
            <SiteForm />
          </div>

          <div className="mt-1 col-sm-12 col-md-8 ">
            <SitesList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sites;
