import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { uid } from "@/utils/pagebuilder.utils";
import { generateSlug } from "@/utils/slug";
import { Button } from "../ui/button";
import { InputGroup, InputGroupInput } from "../ui/input-group";

interface RouteItem {
  id?: string;
  name: string;
  url?: string;
}

interface RouteItemsInputProps {
  value?: RouteItem[];
  onChange: (value: RouteItem[]) => void;
  placeholderName?: string;
  placeholderUrl?: string;
}

export function RouteItemsInput({
  value = [],
  onChange,
  placeholderName = "Route Name (e.g. Houston IAH Airport Transfer)",
  placeholderUrl = "Route URL (e.g. /houston-iah-airport-transfer)",
}: RouteItemsInputProps) {
  const [localName, setLocalName] = useState("");
  const [localUrl, setLocalUrl] = useState("");

  const handleNameChange = (name: string) => {
    setLocalName(name);
    // Auto-fill URL if it's currently empty or was previously auto-filled
    const slug = generateSlug(name);
    setLocalUrl(slug ? `/${slug}` : "");
  };

  const handleAdd = () => {
    const trimmedName = localName.trim();
    const trimmedUrl = localUrl.trim();
    if (trimmedName) {
      onChange([...value, { id: uid(), name: trimmedName, url: trimmedUrl }]);
      setLocalName("");
      setLocalUrl("");
    }
  };

  const handleRemove = (id?: string, index?: number) => {
    if (id) {
      onChange(value.filter((item) => item.id !== id));
    } else if (index !== undefined) {
      onChange(value.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 p-3 border rounded-lg bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <InputGroup>
            <InputGroupInput
              placeholder={placeholderName}
              value={localName}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupInput
              placeholder={placeholderUrl}
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
            />
          </InputGroup>
        </div>
        <Button
          type="button"
          variant="outlinePrimary"
          size="sm"
          className="w-full mt-1"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item to Route
        </Button>
      </div>

      <div className="space-y-2">
        {value.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex items-center justify-between p-2 pl-3 border rounded-md bg-white shadow-sm group hover:border-base-primary transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
              {item.url && (
                <span className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-md">
                  {item.url}
                </span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => handleRemove(item.id, idx)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {value.length === 0 && (
          <p className="text-xs text-center text-gray-400 py-2">
            No items added yet.
          </p>
        )}
      </div>
    </div>
  );
}
