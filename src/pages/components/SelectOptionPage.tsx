import { useState } from "react";
import { SelectDropDown } from "@/components/ui/select";

export default function SelectOptionPage() {
  const [value, setValue] = useState("de");
  const [secondValue, setSecondValue] = useState("");
  const [thirdValue, setThirdValue] = useState("");
  console.log(value);
  return (
    <div className="p-6 h-screen space-y-2">
      {/* First Select */}
      <SelectDropDown
        size="default"
        placeholder="Select a country"
        classname="w-full max-w-[277px]"
        items={[
          { value: "in", label: "India" },
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
          { value: "de", label: "Germany" },
          { value: "au", label: "Australia", disabled: true },
        ]}
        value={value}
        setSelectedItem={setValue}
      />

      {/* Second Select */}
      <SelectDropDown
        size="md"
        placeholder="Select a country"
        variant="secondary"
        classname="w-full max-w-[277px]"
        items={[
          { value: "in", label: "India" },
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
          { value: "de", label: "Germany" },
          { value: "au", label: "Australia", disabled: true },
        ]}
        value={secondValue}
        setSelectedItem={setSecondValue}
      />
      {/* Third Select */}
      <SelectDropDown
        size="sm"
        placeholder="Select a country"
        variant="dark"
        classname="w-full max-w-[277px]"
        items={[
          { value: "in", label: "India" },
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
          { value: "de", label: "Germany" },
          { value: "au", label: "Australia", disabled: true },
        ]}
        value={thirdValue}
        setSelectedItem={setThirdValue}
      />
    </div>
  );
}
