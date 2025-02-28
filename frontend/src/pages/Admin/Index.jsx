import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";

import AdminLayout from "../../layouts/AdminLayout";

const Index = () => {
  return (
    <div>
      <DefaultLayout />
      <div className="container-lg">
        <AdminLayout />
      </div>
    </div>
  );
};

export default Index;
