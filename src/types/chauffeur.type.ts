import type { TChauffeurForm } from "@/components/chauffeur/ChauffeurForm";
export interface IChauffeurFormProps {
	initialData?: TChauffeurForm;
	onSubmit: (data: TChauffeurForm) => Promise<unknown>;
	disabledFields?: string[];
	type: string;
}
