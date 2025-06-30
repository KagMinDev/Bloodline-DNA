import React from 'react';

interface Props {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const StatusSelect: React.FC<Props> = ({ value, options, onChange, disabled = false }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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