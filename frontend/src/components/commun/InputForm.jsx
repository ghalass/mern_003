import React from "react";

const InputForm = ({
  type = "text",
  id,
  placeholder,
  value,
  onChange,
  label,
  icon,
}) => {
  return (
    <div className="form-floating mb-2">
      <input
        type={type}
        className={`form-control`}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <label htmlFor={type}>
        {icon}
        {label}
      </label>
    </div>
  );
};

export default InputForm;
