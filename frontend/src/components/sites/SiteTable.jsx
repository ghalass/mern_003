import React from "react";
import { useCrudStore } from "../../store/crudStore";
import { LuPencil, LuTrash2 } from "react-icons/lu";

const SiteTable = ({ paginatedSites }) => {
  const setSelectedItem = useCrudStore((state) => state.setSelectedItem);
  const setOp = useCrudStore((state) => state.setOp);

  return (
    <>
      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Site</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSites.map((site, index) => (
            <tr key={index}>
              <td>{site.id}</td>
              <td>{site.name}</td>
              <td>
                <div className="d-flex justify-content-end gap-1">
                  <button
                    onClick={() => {
                      setSelectedItem(site);
                      setOp("update");
                    }}
                    className="btn btn-sm btn-outline-success rounded-pill pb-1 pt-0 px-2"
                  >
                    <LuPencil />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedItem(site);
                      setOp("delete");
                    }}
                    className="btn btn-sm btn-outline-danger rounded-pill pb-1 pt-0 px-2"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default SiteTable;
