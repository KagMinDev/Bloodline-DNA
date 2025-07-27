import React from "react";

interface Props {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const StatusSelect: React.FC<Props> = ({
  value,
  options,
  onChange,
  disabled = false,
}) => {
  return (
    <select
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      disabled={disabled}
      className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default StatusSelect;
