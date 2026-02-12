import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { InputGroup, InputGroupInput } from "../ui/input-group";

interface FeaturesAddonInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function FeaturesAddonInput({
  value = [],
  onChange,
  placeholder = "Add a feature...",
}: FeaturesAddonInputProps) {
  const [localInput, setLocalInput] = useState("");

  const handleAdd = () => {
    const trimmed = localInput.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setLocalInput("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupInput
            placeholder={placeholder}
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
        </InputGroup>
        <Button
          type="button"
          className="bg-base-primary text-white rounded"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((item, idx) => (
          <Badge key={idx} className="flex items-center gap-1 py-1 px-2">
            <span className="text-xs">{item}</span>
            <button
              type="button"
              className="ml-1 h-auto p-0 hover:text-red-500 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(value.filter((_, i) => i !== idx));
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
