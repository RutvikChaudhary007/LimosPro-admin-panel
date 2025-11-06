// @ts-nocheck

import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import UsefetchAffiliateById from "@/api/getAffiliateById.api";
import AffiliateForm from "@/components/affiliate/AffiliateForm";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import type { IAffiliate } from "@/types/affiliate.type";
import { env } from "@/utils/env";
import { geoDecoding } from "@/utils/googleMaps";
import { generatePageTitle } from "@/utils/seo";

const libraries = ["places", "geocoding"];

function EditAffiliatePage() {
	const { id } = useParams();
	const navigate = useNavigate();
	// console.log("id:",id)
	const [googleMapsApiKey] = useState<string | null>(env.VITE_GOOGLE_MAP_KEY);
	const [businessAddress, setBusinessAddress] = useState<string | undefined>(
		undefined,
	);
	// Load Google Maps script
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: googleMapsApiKey || "",
		libraries: libraries as Libraries,
	});

	const { data, isFetching, error } = UsefetchAffiliateById({ id });
	// Initialize Places Autocomplete
	useEffect(() => {
		let isMounted = true;

		const fetchAddress = async () => {
			if (isLoaded && data && !loadError) {
				try {
					const address = await geoDecoding({
						lat: data?.businessLocation?.latitude,
						lng: data?.businessLocation?.longitude,
					});
					if (isMounted) {
						console.log("Decoded Address:", address);
						if (address) {
							setBusinessAddress(address as string);
						}
					}
				} catch (err) {
					console.error("Geocoding failed:", err);
				}
			}
		};

		fetchAddress();

		return () => {
			isMounted = false;
		};
	}, [isLoaded, loadError, data]);
	const editAffiliateMutation = queries.useEditAffiliateMutation();
	const handleEditAffiliate = async (data: unknown) => {
		// console.log("called handleCreateAffiliate")
		try {
			toastPromise(editAffiliateMutation.mutateAsync({ data, id }), {
				loading: "Updating affiliate...",
				success: (res) => {
					if (res) navigate(constant.ROUTING_URLS.AFFILIATE);
					return "Yeah! Affiliate updated successfully";
				},
				error: (e) =>
					e instanceof Error ? e.message : "Opps! failed to update affiliate.",
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unexpected error occurred");
			}
		}
		// return await new Promise((res)=>{
		//   setTimeout(()=>res(console.log("promise:",data)),5000);
		// });
	};

	if (isFetching) return <p>Loading...</p>;
	return (
		<>
			<PageTitle title={generatePageTitle("Affiliate")} />
			<div className="px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll">
				<Link to={constant.ROUTING_URLS.AFFILIATE}>
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
							<h2 className="font-medium text-xl text-black">Affiliate</h2>
							<h4>
								{" "}
								<span className="text-[#959595] w-[116px] h-4 text-xs">
									LIMOSPRO
								</span>{" "}
								<span className="text-xs text-[#3A3A3A] w-[50px] h-4">
									/ Edit Affiliate
								</span>
							</h4>
						</div>
					</div>
				</Header>
				<AffiliateForm
					onSubmit={handleEditAffiliate}
					initialData={data}
					businessAddress={businessAddress}
					type={"Edit Affiliate"}
				/>
			</div>
		</>
	);
}

export default EditAffiliatePage;
