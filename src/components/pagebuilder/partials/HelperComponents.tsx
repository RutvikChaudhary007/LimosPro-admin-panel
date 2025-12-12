import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import type {
  LabeledEditorProps,
  LabeledTextareaProps,
} from "@/types/pagebuilder.types";
import { Input } from "../../ui/input";

/**
 * Helper component for labeled inputs
 */
export function LabeledInput({ label, ...props }: any) {
  const id = props.name || `input-${Math.random()}`;
  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

/**
 * Helper component for TinyEditor with label
 */
export function LabeledEditor({
  label,
  value,
  onChange,
  onBlur,
  name,
  ...props
}: LabeledEditorProps) {
  const id = name || `editor-${Math.random()}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <TinyEditorRHF
        value={value || ""}
        onChange={(val: any) => {
          onChange(val);
        }}
        onBlur={onBlur}
        name={name}
        {...props}
      />
    </div>
  );
}

/**
 * Helper component for simple textarea
 */
export function LabeledTextarea({
  label,
  value,
  onChange,
  onBlur,
  name,
  ...props
}: LabeledTextareaProps) {
  const id = name || `textarea-${Math.random()}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        rows={4}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        name={name}
        {...props}
      />
    </div>
  );
}
