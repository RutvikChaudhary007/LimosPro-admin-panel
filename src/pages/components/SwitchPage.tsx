import { Switch } from "@/components/ui/switch";

export default function SwitchPage() {
  return (
    <div className="flex flex-wrap gap-4 p-2">
      <Switch size="md" labelChecked="On" labelUnchecked="On" />
      <Switch
        size="md"
        variant="secondary"
        labelChecked="On"
        labelUnchecked="On"
      />
      <Switch size="md" variant="dark" labelChecked="On" labelUnchecked="On" />
      <Switch
        size="md"
        variant="danger"
        labelChecked="On"
        labelUnchecked="On"
      />
      <Switch
        size="md"
        variant="success"
        labelChecked="On"
        labelUnchecked="On"
      />

      <Switch size="lg" labelChecked="Active" labelUnchecked="Inactive" />
    </div>
  );
}
