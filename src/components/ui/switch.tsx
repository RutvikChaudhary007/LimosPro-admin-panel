import { cn } from "@/lib/utils";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// Switch root CVA (size, bg, rounded)
const switchVariants = cva(
	"peer inline-flex items-center rounded-full transition-all data-[state=unchecked]:bg-base-gray",
	{
		variants: {
			variant: {
				primary: "data-[state=checked]:bg-base-primary",
				secondary: "data-[state=checked]:bg-base-secondary",
				dark: "data-[state=checked]:bg-base-black",
				danger: "data-[state=checked]:bg-base-danger",
				success: "data-[state=checked]:bg-base-success",
			},
			size: {
				md: "h-8 w-[72px]",
				lg: "h-10 w-[90px]",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	},
);

// Thumb translation + size based on switch size
const thumbMap = {
	md: {
		size: "w-6 h-6",
		translate: { unchecked: "translate-x-1", checked: "translate-x-11" },
	},
	lg: {
		size: "w-[30px] h-[30px]",
		translate: {
			unchecked: "translate-x-[5px]",
			checked: "translate-x-[55px]",
		},
	},
};

// Label CVA (font size + color based on switch variant and size)
const labelVariants = cva("font-bold", {
	variants: {
		variant: {
			primary: "text-base-primary",
			secondary: "text-base-secondary",
			dark: "text-base-black",
			danger: "text-base-danger",
			success: "text-base-success",
		},
		size: {
			md: "font-quicksand text-base",
			lg: "font-montserrat text-lg",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

interface SwitchProps
	extends React.ComponentProps<typeof SwitchPrimitive.Root>,
		VariantProps<typeof switchVariants> {
	labelChecked?: string;
	labelUnchecked?: string;
	asChild?: boolean;
	size?: "md" | "lg";
}

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitive.Root>,
	SwitchProps
>(
	(
		{
			className,
			labelChecked,
			labelUnchecked,
			variant,
			size = "md",
			asChild = false,
			checked: controlledChecked,
			...props
		},
		ref,
	) => {
		const [checked, setChecked] = React.useState(false);
		const isControlled = controlledChecked !== undefined;
		const state = isControlled ? controlledChecked : checked;

		const Wrapper = asChild ? React.Fragment : "div";

		return (
			<Wrapper className="flex items-center gap-1.5">
				{/* Switch Root */}
				<SwitchPrimitive.Root
					ref={ref}
					checked={state}
					onCheckedChange={(val) => {
						if (!isControlled) setChecked(val);
						props.onCheckedChange?.(val);
					}}
					className={cn(
						switchVariants({ variant, size }),
						"disabled:opacity-50 disabled:cursor-not-allowed",
						className,
					)}
					{...props}
				>
					{/* Thumb */}
					<SwitchPrimitive.Thumb
						className={cn(
							"block rounded-full bg-base-white transition-transform",
							thumbMap[size].size,
							state
								? thumbMap[size].translate.checked
								: thumbMap[size].translate.unchecked,
						)}
					/>
				</SwitchPrimitive.Root>

				{/* Label */}
				{(labelChecked || labelUnchecked) && (
					<span className={labelVariants({ variant, size })}>
						{state ? labelChecked : labelUnchecked}
					</span>
				)}
			</Wrapper>
		);
	},
);

Switch.displayName = "Switch";

export { Switch };
