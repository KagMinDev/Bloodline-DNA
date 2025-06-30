import { CalendarIcon } from "lucide-react";
import { Button } from "../sample/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { cn } from "../../../../lib/utils";
import { format } from "date-fns";
import { Calendar } from "../../../../components/ui/calendar";


export default function DatePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date;
  onChange: (v: Date) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "dd/MM/yyyy") : "Chọn ngày"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar mode="single" selected={value} onSelect={(date) => date && onChange(date)} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
