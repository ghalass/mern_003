import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import AdminLayout from "../../layouts/AdminLayout";

const Parcs = () => {
  return (
    <div>
      <DefaultLayout />
      <div className="container-lg">
        <AdminLayout />

        <div className="row">
          <div className="mt-1 col-sm-12 col-md-4 ">Form</div>

          <div className="mt-1 col-sm-12 col-md-8 ">List</div>
        </div>
      </div>
    </div>
  );
};

export default Parcs;
