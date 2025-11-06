import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Import Form UI components from shadcn/ui
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { login } from "@/api/login";
// import { useMutation } from "@tanstack/react-query";
import { toastPromise, useToast } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const loginSchema = z.object({
	email: z.email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
	remember: z.boolean().default(false).optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function AdminLoginPage() {
	const { toast } = useToast();
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			remember: false,
			password: "",
			email: localStorage.getItem("Email") || "",
		},
	});

	// Check if user is already logged in (must not navigate during render)
	useEffect(() => {
		const role = localStorage.getItem("role");
		if (role && ["Super Admin", "SEO Agent", "Affiliate"].includes(role)) {
			navigate(constant.ROUTING_URLS.DASHBOARD);
		}
	}, [navigate]);

	const loginMutation = queries.useLoginMutation();
	const onSubmit = async (data: LoginFormValues) => {
		try {
			// Remove remember field before sending to API
			const { remember, ...loginData } = data;
			console.log("remember me:", remember);
			if (remember) {
				localStorage.setItem("remember", "true");
			} else {
				localStorage.removeItem("remember");
			}
			// await loginMutation.mutateAsync(loginData);
			toastPromise(loginMutation.mutateAsync({ ...loginData }), {
				loading: "Logging in...",
				success: () => {
					// const staySignedInMessage = data.remember
					//   ? "You will stay signed in"
					//   : "You will be logged out after session expires";

					// return `Welcome back! ${staySignedInMessage}`;
					return `Welcome back! `;
				},
				error: (e) => {
					// normalized in onError above
					return e instanceof Error ? e.message : "Login failed";
				},
			});
		} catch (error) {
			// Error handling is done in onError callback
			toast({
				title: "Delete failed",
				description:
					error instanceof Error ? error.message : "Failed to delete affiliate",
				variant: "destructive",
			});
			// console.error('Login error:', error);
		}
	};
	return (
		<>
			<PageTitle title={generatePageTitle("Login")} />
			<div className="flex items-center justify-center h-screen min-h-screen ">
				<div className="w-[597px] h-[618px] min-w-[597px] min-h-[618px] flex flex-col gap-[63px] shadow-lg shadow-[#F1F1F1] rounded-[6px]">
					<div
						style={{ background: "#F1F1F1" }}
						className="min-w-full h-[146px] pl-8 pr-8 w-full flex gap-[231px] rounded-t-[6px]"
					>
						<div className="flex flex-col mt-8 items-start gap-3 w-[195px] h-[61px]">
							<p className="w-full font-['Akatab'] font-medium text-xl  text-black h-[27px]">
								Welcome Back!
							</p>
							<p className="w-full font-['Akatab'] font-medium text-[#3A3A3A] h-[22px]">
								Sign in to continue to CMS.
							</p>
						</div>
						<div className="w-[74px] h-[58px] mt-11 mb-11">
							<img
								src={`/ProfilePic.jpg`}
								className="w-full h-full object-cover"
								alt="profile pic"
							/>
						</div>
					</div>

					{/* Use shadcn ui's Form wrapper and pass react-hook-form instance */}
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="relative px-8"
						>
							{/* Logo / Header above form */}
							<div className=" bg-[#FAFAFA] absolute w-[195px] h-[72px] p-5 -top-[99px] rounded z-50 shadow-inner shadow-[#E7E7E7] ">
								<div className="flex gap-2 w-[140px] h-8">
									<img
										src="/LoginLogo.jpg"
										alt="logo"
										className="w-full h-full object-cover"
									/>
									<img
										src="/Frame.jpg"
										alt="logo"
										className="w-full h-full object-cover"
									/>
								</div>
							</div>

							<div className="w-[533px] h-[377px]">
								{/* Email Field */}
								<FormField
									control={form.control}
									name="email"
									render={({ field, fieldState }) => (
										<FormItem className="mb-5">
											<FormLabel htmlFor="email" className="font-['Akatab']">
												Email
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													id="email"
													type="email"
													placeholder="name@email.com"
													className="h-[54px] rounded font-['Akatab']"
												/>
											</FormControl>
											<FormMessage>{fieldState.error?.message}</FormMessage>
										</FormItem>
									)}
								/>

								{/* Password Field */}
								<FormField
									control={form.control}
									name="password"
									render={({ field, fieldState }) => (
										<FormItem className="relative mb-5">
											<FormLabel htmlFor="password" className="">
												Password
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													id="password"
													type={showPassword ? "text" : "password"}
													className="h-[54px] rounded font-['Akatab']"
												/>
											</FormControl>
											<img
												className="absolute right-[21px] top-[44px] w-4 h-4 min-h-4 min-w-4 cursor-pointer"
												src={showPassword ? "/eye.svg" : "/eye-off.svg"}
												alt="Toggle password visibility"
												onClick={() => setShowPassword(!showPassword)}
											/>
											<FormMessage>{fieldState.error?.message}</FormMessage>
										</FormItem>
									)}
								/>

								{/* Remember Me Checkbox */}
								<FormField
									control={form.control}
									name="remember"
									render={({ field }) => (
										<FormItem className="flex items-center gap-2.5 mt-8 h-[19px] cursor-pointer">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
													ref={field.ref}
													id="remember"
													className="data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:w-2.5 [&_[data-state=checked]>svg]:h-2.5 [&_[data-state=checked]>svg]:text-[#5A5A5A]"
												/>
											</FormControl>
											<FormLabel
												htmlFor="remember"
												className="text-sm font-['Akatab'] text-[#5A5A5A] cursor-pointer"
											>
												Remember me
											</FormLabel>
										</FormItem>
									)}
								/>

								{/* Submit Button */}
								<div className="flex h-[46px] mt-[34px] w-full items-center justify-center gap-2.5 rounded ">
									<Button
										type="submit"
										disabled={
											form.formState.isSubmitting || loginMutation.isPending
										}
										className="w-full h-full pl-6 pr-6 pt-5 pb-5 text-[#515151] font-['Akatab'] font-medium hover:text-white bg-[#E4E4E4] cursor-pointer"
									>
										{form.formState.isSubmitting || loginMutation.isPending
											? "Loading..."
											: "Log In"}
									</Button>
								</div>

								{/* Forgot Password */}
								<div className="flex mt-[34px] h-5 items-center justify-center gap-2.5">
									<img src="/lock-closed.jpg" className="h-full" alt="lock" />
									<p className="text-sm text-[#5A5A5A] font-['Akatab']">
										<Link to={"#"}>Forgot Password?</Link>
									</p>
								</div>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</>
	);
}

export default AdminLoginPage;
