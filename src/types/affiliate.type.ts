type TBusinessLocation = {
	latitude: number | null | undefined;
	longitude: number | null | undefined;
};

export interface IAffiliate {
	businessAddress: string;
	businessContactNumber: string;
	businessEmail: string;
	commissionRate: number;
	companyName: string;
	documents: File[];
	email: string;
	entityType: string;
	firstName: string;
	isChauffer: boolean;
	lastName: string;
	businessLocation: TBusinessLocation;
	password: string;
	status: string;
	taxId: string;
}
