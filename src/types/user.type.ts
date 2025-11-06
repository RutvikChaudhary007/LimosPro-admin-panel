export interface IUserFormData {
	firstName: string;
	lastName: string;
	gender: "male" | "female" | "other";
	dateOfBirth: Date;
	email: string;
	phone: string;
	status: "active" | "inactive" | "suspended";
	address: string;
	password?: string;
}
export type TUserFormProps = {
	initialData?: IUserFormData;
	onSubmit: (data: IUserFormData) => Promise<unknown>;
	disabledFields?: string[];
	type: string;
};
