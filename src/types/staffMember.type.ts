type TStaffData = 
{ 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
    role: string[]; 
    region: string[]; 
} | undefined
export type TStaffMemberForm = {
    initialData?: TStaffData, 
    onSubmit: (data:object)=>void, 
    disabledFields?: string[], 
    type: string,
} 