import z from "zod";

const formSchema = z.object({
    firstName: z.string().refine(value => value.trim() !== "", {
        message: "First name cannot be empty or just whitespace.",
    }).min(3, { message: "First name must be at least 3 characters" }),
    lastName: z.string().refine(value => value.trim() !== "", {
        message: "Last name cannot be empty or just whitespace.",
    }).min(3, { message: "Last name must be at least 3 characters" }),
    location: z.object({
        latitude: z.number(),
        longitude: z.number(),
    }),
    businessAddress: z.string().refine(value => value.trim() !== "", {
        message: "Business Address cannot be empty or just whitespace.",
    }).min(3, { message: "Business Address must be at least 3 characters" }),
    email: z.email(),
    // businessContactNumber: z
    //     .string()
    //     .min(1, { message: "Phone is required" })
    //     .regex(/^\d+$/, { message: "Must be number" })
    //     .transform((v) => Number(v))
    //     .refine((n) => n >= 0, { message: "Must be non‑negative" }),
    affiliateId: z.string().refine(value => value.trim() !== "", {
        message: "Affiliate Id cannot be empty or just whitespace.",
    }),
    panNumber: z.string().refine(value => value.trim() !== "", {
        message: "Pan Number cannot be empty or just whitespace.",
    }),
    licenseNumber: z.string().refine(value => value.trim() !== "", {
        message: "License Number cannot be empty or just whitespace.",
    }),
    vehicleId: z.string().refine(value => value.trim() !== "", {
        message: "Vehicle Id cannot be empty or just whitespace.",
    }),
    availability: z.boolean(),
    password: z.string().refine(value => value.trim() !== "", {
        message: "Password cannot be empty or just whitespace.",
    }).min(8).max(32),
    gratuity: z.string().refine(value => value.trim() !== "", {
        message: "Gratuity cannot be empty or just whitespace.",
    }),

    status: z.string().optional(), 
});

export type TCrewMemberForm = z.infer<typeof formSchema>;
const crewMemberForm = ({ initialData, onSubmit, disabledFields, type }) => {
  return (
    
  )
}

export default crewMemberForm
