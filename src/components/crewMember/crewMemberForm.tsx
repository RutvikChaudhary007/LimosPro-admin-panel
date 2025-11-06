//@ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import IntlTelInput from "intl-tel-input/react";
import { useForm } from "react-hook-form";
import z from "zod";
import useFetchAllAffiliate from "@/api/getAllAffiliate.api";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import isFieldDisabled from "@/utils/disableFormField";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import "intl-tel-input/styles";

const formSchema = z.object({
	firstName: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "First name cannot be empty or just whitespace.",
		})
		.min(3, { message: "First name must be at least 3 characters" }),
	lastName: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "Last name cannot be empty or just whitespace.",
		})
		.min(3, { message: "Last name must be at least 3 characters" }),
	description: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "Description cannot be empty or just whitespace.",
		})
		.min(3, { message: "Description must be at least 3 characters" }),
	password: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "Password cannot be empty or just whitespace.",
		})
		.min(3, { message: "Password must be at least 3 characters" }),
	email: z.email(),
	affiliateId: z
		.string()
		.min(3, { message: "Affiliate ID must be at least 3 characters" }),
	phone: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "phone cannot be empty or just whitespace.",
		})
		.min(8)
		.max(32),
});

export type TCrewMemberForm = z.infer<typeof formSchema>;
const CrewMemberForm = ({
	initialData,
	onSubmit,
	disabledFields,
	type,
}: {
	initialData?: object;
	onSubmit: (data: TCrewMemberForm) => void;
	disabledFields?: [];
	type: string;
}) => {
	const { data: affiliateData, isFetching: isFetchingAffiliate } =
		useFetchAllAffiliate({ DateRange: {} });
	const transformInitialData = (data?: z.infer<typeof formSchema>) => {
		if (!data) return undefined;
		// console.log("edit chauffeur formdata:>",data)
		return {
			firstName: data?.firstName,
			lastName: data?.lastName,
			description: data?.description,
			email: data?.email,
			phone: data?.phone,
			password: data?.password,
			affiliateId: data?.affiliateId ?? "",
		};
	};
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: transformInitialData(initialData) || {
			firstName: "",
			lastName: "",
			description: "",
			email: "",
			phone: "",
			password: "",
			affiliateId: "",
		},
	});
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(async (data: TCrewMemberForm) => {
					try {
						await onSubmit(data);
					} catch (error) {
						console.error(error);
					}
				})}
			>
				<Card className="rounded  overflow-auto bg-[#FDFDFD] hover:outline-none shadow-[#F1F1F1] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
					<CardHeader>
						<CardTitle>{type}</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-5">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-3 mb-[31px] ">
									<FormControl>
										<Input
											type="text"
											className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
											placeholder="Frist Name"
											disabled={isFieldDisabled(disabledFields, "firstName")}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-3 mb-[31px]  ">
									<FormControl>
										<Input
											type="text"
											className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
											placeholder="Last Name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-3 mb-[31px]">
									<FormControl>
										<Input
											type="text"
											className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
											placeholder="Description"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-3 mb-[31px]">
									<FormControl>
										<Input
											type="text"
											className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
											placeholder="Email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-3 mb-[31px]">
									<FormControl>
										{/* <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='phone' {...field} /> */}
										<div className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 border  px-3 py-1 text-base  transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-[#FFFFFF] rounded shadow shadow-[#D9D9D9] p-[2px]">
											<IntlTelInput
												containerClassName="w-full h-full"
												className="w-full"
												inputClassName="min-w-full"
												initialValue={field.value}
												// onChangeNumber={setNumber}
												// onChangeValidity={setIsValid}
												// onChangeErrorCode={setErrorCode}
												// any initialisation options from the readme will work here

												initOptions={{
													initialCountry: "us",

													loadUtils: () =>
														import(
															"https://cdn.jsdelivr.net/npm/intl-tel-input@25.12.1/build/js/utils.js"
														),
												}}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-3 mb-[31px]">
									<FormControl>
										<Input
											type="text"
											className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
											placeholder="password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{isFetchingAffiliate ? (
							<p>Loading...</p>
						) : affiliateData?.affiliates.length > 0 ? (
							<FormField
								control={form.control}
								name="affiliateId"
								render={({ field }) => (
									<FormItem className="w-full col-span-2 col-start-1">
										<FormLabel className="placeholder-[#E6E6E6] font-medium">
											Select Affiliate
										</FormLabel>
										<Select
											value={field.value}
											onValueChange={(v) => {
												field.onChange(v);
												// setStatusValue({ ...statusValue, affiliate: v })
											}}
											defaultValue={field.value}
										>
											<FormControl className="w-full min-w-full rounded">
												<SelectTrigger className="cursor-pointer w-full placeholder-[#E6E6E6] font-medium">
													<SelectValue
														className="before:placeholder:text-[#E6E6E6] font-medium"
														placeholder="select affiliate"
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent className="">
												{affiliateData?.affiliates?.map((option) => (
													<SelectItem
														className="cursor-pointer"
														key={option.id}
														value={option.id}
													>
														{option.companyName}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage
											className={`mt-1 h-5 ${
												form.formState.errors.affiliateId
													? "visible text-red-600"
													: "invisible"
											} `}
										>
											{form.formState.errors.affiliateId?.message}
										</FormMessage>
									</FormItem>
								)}
							/>
						) : (
							<Link to={constant.ROUTING_URLS.CREATE_AFFILIATE}>
								<Label>Add Affiliate</Label>
							</Link>
						)}
					</CardContent>
					<Button
						disabled={form.formState.isSubmitting}
						type="submit"
						variant="secondary"
						className="text-[#515151] rounded text-center px-2.5 py-6 bg-[#E4E4E4] text-sm font-medium w-[124px] h-[39px] border-none cursor-pointer select-none mx-6"
					>
						{form.formState.isSubmitting ? "Saving..." : "Save Staff Member"}
					</Button>
				</Card>
			</form>
		</Form>
	);
};

export default CrewMemberForm;
