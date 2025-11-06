import Header from "@/components/layouts/BreadCramb";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/user/UserForm";
import { constant } from "@/lib/constant";
import type { IUserFormData } from "@/types/user.type";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreateUserPage = () => {
	const handleCreateUser = async (data: IUserFormData) => {
		return new Promise((res) =>
			setTimeout(() => res(console.log("IUserFormData:", data)), 5000),
		);
	};
	return (
		<>
			<div className="p-6 space-y-6 md:p-8 md:space-y-8">
				<Link to={constant.ROUTING_URLS.USERS}>
					<Button
						variant="outline"
						className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
					>
						<ArrowLeft /> Back
					</Button>
				</Link>
				<Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
					<div className="w-full h-full flex items-center justify-between">
						<div>
							<h2 className="font-medium text-xl text-black">User</h2>
							<h4>
								{" "}
								<span className="text-[#959595] w-[116px] h-4 text-xs">
									User
								</span>{" "}
								<span className="text-xs text-[#3A3A3A] w-[50px] h-4">
									/ Create User
								</span>
							</h4>
						</div>
					</div>
				</Header>
				<UserForm onSubmit={handleCreateUser} type={"Create User"} />
			</div>
		</>
	);
};

export default CreateUserPage;
