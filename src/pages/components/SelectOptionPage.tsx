import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function SelectOptionPage() {
  const [firstValue, setFirstValue] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const [thirdValue, setThirdValue] = useState("");

  return (
    <div className="p-6 h-screen space-y-2">
      {/* First Select */}
      <Select value={firstValue} onValueChange={setFirstValue}>
        <SelectTrigger
          className="w-full max-w-[277px]"
          data-has-value={firstValue ? "true" : undefined}
        >
          <SelectValue placeholder="Select Option Primary" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana" disabled>
              Banana
            </SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Second Select */}
      <Select
        value={secondValue}
        onValueChange={setSecondValue}
        variant="secondary"
      >
        <SelectTrigger
          className="w-full max-w-[277px]"
          data-has-value={secondValue ? "true" : undefined}
        >
          <SelectValue placeholder="Select Option Secondary" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana" disabled>
              Banana
            </SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Third Select */}
      <Select value={thirdValue} onValueChange={setThirdValue} variant="dark">
        <SelectTrigger
          className="w-full max-w-[277px]"
          data-has-value={thirdValue ? "true" : undefined}
        >
          <SelectValue placeholder="Select Option Dark" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana" disabled>
              Banana
            </SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
