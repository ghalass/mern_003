import React from "react";
import { useCrudStore } from "../../store/crudStore";
import { LuPlus, LuX } from "react-icons/lu";

const AddOrCancelBtn = () => {
  const setSelectedItem = useCrudStore((state) => state.setSelectedItem);
  const setOp = useCrudStore((state) => state.setOp);

  return (
    <div className="d-flex gap-1">
      <button
        onClick={() => {
          setSelectedItem(null);
          setOp("add");
        }}
        className="btn btn-sm btn-outline-success rounded-pill pb-1 pt-0 px-2"
      >
        <LuPlus />
      </button>
      <button
        onClick={() => {
          setSelectedItem(null);
          setOp(null);
        }}
        className="btn btn-sm btn-outline-danger rounded-pill pb-1 pt-0 px-2"
      >
        <LuX />
      </button>
    </div>
  );
};

export default AddOrCancelBtn;
