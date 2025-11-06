import { IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

function BadgePage() {
	return (
		<div className="flex gap-2 bg-pink-200 p-2">
			<Badge>
				<IconTrendingUp /> <span>5.2%</span>
			</Badge>
			<Badge variant={"secondary"}>
				<IconTrendingUp /> <span>5.2%</span>
			</Badge>
			<Badge variant={"black"}>
				<IconTrendingUp /> <span>5.2%</span>
			</Badge>
			<Badge variant={"white"}>
				<IconTrendingUp /> <span>5.2%</span>
			</Badge>
		</div>
	);
}

export default BadgePage;
