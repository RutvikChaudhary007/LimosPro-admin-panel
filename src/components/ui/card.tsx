import IconTrendingUp from "@/assets/Icons/ic-arrow-trending-up.svg?react";
import { cn } from "@/lib/utils";
import type * as React from "react";
import { Badge } from "./badge";

function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card"
			className={cn(
				"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
				className,
			)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn("leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-6", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
			{...props}
		/>
	);
}

function MetricCard({
	title = "Total Revenue",
	value = "$0.00",
	percentage = "0%",
	icon = <IconTrendingUp />,
	bgClass = "bg-base-blue-cream",
	wrapperClass = "",
	headerClass = "",
	actionClass = "",
	badgeClass = "",
	contentClass = "",
	titleClass = "",
	valueClass = "",
}: {
	title?: string;
	value?: string;
	percentage?: string;
	icon?: React.ReactNode;
	bgClass?: string;
	wrapperClass?: string;
	headerClass?: string;
	actionClass?: string;
	badgeClass?: string;
	contentClass?: string;
	titleClass?: string;
	valueClass?: string;
}) {
	return (
		<Card
			className={`border-base-primary @container/card w-full gap-1.5 rounded ${bgClass} pt-2.5 shadow-none min-h-[125px] ${wrapperClass}`}
		>
			<CardHeader className={`px-2.5 ${headerClass}`}>
				<CardAction className={actionClass}>
					<Badge className={badgeClass}>
						{icon}
						<span>{percentage}</span>
					</Badge>
				</CardAction>
			</CardHeader>

			<CardContent className={`space-y-1 ${contentClass}`}>
				<p
					className={`font-quicksand text-base leading-[100%] font-medium tracking-[0] text-black ${titleClass}`}
				>
					{title}
				</p>
				<h4
					className={`font-montserrat text-2xl leading-[100%] font-bold tracking-[0] text-black ${valueClass}`}
				>
					{value}
				</h4>
			</CardContent>
		</Card>
	);
}

export {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	MetricCard,
};
