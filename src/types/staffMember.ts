type TStaffData = 
{ 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
    role: string[]; 
} | undefined
export type TStaffMemberForm = {
    initialData?: TStaffData, 
    onSubmit: (data:unknown)=>void, 
    disabledFields?: string[], 
    type: string,
} 