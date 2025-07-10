// components/StatusSelect.tsx
import { Select } from "antd";
import type { StatusOption } from "../constants/statusMapping";

interface StatusSelectProps {
  value: string;
  options: (StatusOption & { disabled?: boolean })[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  options,
  onChange,
  disabled,
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{ minWidth: 160 }}
    >
      {options.map((option) => (
        <Select.Option
          key={option.value}
          value={option.label}
          disabled={option.disabled}
        >
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default StatusSelect;
