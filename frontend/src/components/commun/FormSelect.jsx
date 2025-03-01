const FormSelect = ({
  label,
  title,
  options,
  value,
  onChange,
  disabled = false,
  id,
}) => {
  return (
    <div className="form-floating mb-2">
      <select
        className="form-select"
        id={`FormSelect-${id}`}
        aria-label="Floating label select example"
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">{title}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <label htmlFor={`FormSelect-${id}`}>{label}</label>
    </div>
  );
};

export default FormSelect;
