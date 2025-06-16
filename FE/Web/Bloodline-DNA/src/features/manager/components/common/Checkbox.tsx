import { FaCheckSquare, FaRegSquare } from 'react-icons/fa';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label }) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="focus:outline-none"
      aria-pressed={checked}
    >
      {checked ? (
        <FaCheckSquare className="text-blue-600 text-2xl" />
      ) : (
        <FaRegSquare className="text-gray-400 text-2xl" />
      )}
    </button>
    {label && (
      <label
        className="text-blue-800 font-medium select-none cursor-pointer"
        onClick={() => onChange(!checked)}
      >
        {label}
      </label>
    )}
  </div>
);

export default Checkbox;