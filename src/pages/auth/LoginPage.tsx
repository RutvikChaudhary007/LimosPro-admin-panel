import { BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm, type LoginFormValues } from "@/components/login-form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

export default function LoginPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Check if user is already logged in (must not navigate during render)
	useEffect(() => {
		const role = localStorage.getItem("role");
		if (role && ["Super Admin", "SEO Agent", "Affiliate"].includes(role)) {
			navigate(constant.ROUTING_URLS.DASHBOARD);
		}
	}, [navigate]);

	const loginMutation = queries.useLoginMutation();
	const onSubmit = async (data: LoginFormValues) => {
		setLoading(true);
		setError(null);
		setSuccess(false);
		try {
			const response = await loginMutation.mutateAsync(data);
			if (response?.status === true) {
				setSuccess(response.status);
				navigate(constant.ROUTING_URLS.DASHBOARD);
			}
			console.log("response:", response);
		} catch (error) {
			// Error handling is done in onError callback
			if (error instanceof Error) {
				setError(error.message);
				// console.error('Login error:', error?.message);
			}
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="grid min-h-[calc(100svh-66px)] lg:grid-cols-2">
			<div className="bg-base-background-light flex flex-1 items-center justify-center">
				<div className="bg-base-white shadow-base-light w-full max-w-[480px] rounded-[12px] p-8 py-8">
					<LoginForm onSubmit={onSubmit} loading={loading} />
				</div>
			</div>
			<div className="bg-muted relative hidden lg:block">
				<img
					src="/auth/login-form-bg.png"
					alt="Background Image"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				<div className="relative z-10 mx-auto flex h-full w-full max-w-[376px] flex-col justify-center">
					<div className="mb-6 size-20">
						<img
							src="/logo/limospro-logo.png"
							alt="Image"
							className="size-full object-cover"
						/>
					</div>
					<div className="text-base-white font-montserrat space-y-4 leading-[100%] font-bold tracking-normal">
						<h4 className="text-3xl">Introducing Limospro™ Fleet System</h4>
						<p className="text-lg">
							Lorem Ipsum is simply dummy text of the printing and typesetting
							industry. Lorem Ipsum has been the industry&apos;s standard dummy
							text ever since the 1500s.
						</p>
					</div>
				</div>
			</div>
			<div className="absolute right-10 bottom-10 z-10 max-w-[416px]">
				{(success || error) && (
					<Alert
						variant={success ? "solidSuccess" : "solidDanger"}
						className="shadow-base-light"
					>
						<BadgeCheck />
						<AlertTitle>
							{error
								? error
								: "Thank you for using Limospro. We will redirect you in few seconds."}
						</AlertTitle>
					</Alert>
				)}
			</div>
		</div>
	);
}
