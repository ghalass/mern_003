import React from "react";

const InputForm = ({
  type = "text",
  id,
  placeholder,
  value,
  onChange,
  label,
  icon,
  disabled = false,
}) => {
  return (
    <div className="form-floating mb-2">
      <input
        type={type}
        className={`form-control`}
        id={`FormInput-${id}`}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
      <label htmlFor={`FormInput-${id}`}>
        {icon}
        {label}
      </label>
    </div>
  );
};

export default InputForm;
