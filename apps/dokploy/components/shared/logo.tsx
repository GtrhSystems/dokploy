import { cn } from "@/lib/utils";

interface Props {
	className?: string;
	logoUrl?: string;
	showText?: boolean;
}

export const Logo = ({ className = "size-14", logoUrl, showText = false }: Props) => {
	if (logoUrl) {
		return (
			<img
				src={logoUrl}
				alt="GlobalPivot Logo"
				className={cn(className, "object-contain rounded-sm")}
			/>
		);
	}

	const Icon = (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
			className={cn("text-primary", className)}
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="10"
		>
			<defs>
				<linearGradient id="gp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop
						offset="0%"
						style={{ stopColor: "currentColor", stopOpacity: 1 }}
					/>
					<stop
						offset="100%"
						style={{ stopColor: "currentColor", stopOpacity: 0.6 }}
					/>
				</linearGradient>
			</defs>

			{/* 
                GlobalPivot Identity (Perfected Geometry):
                - Center: 50,50
                - Grid aligned for optical balance.
            */}
			
			{/* The 'G' Curve - Outer Wrap
			    - Starts Top-Right (75, 25) matching P alignment
			    - Large radius (35) wrapping around
			    - Ends Bottom-Right (75, 85) with horizontal base
			*/}
			<path
				d="M 75 25 A 35 35 0 1 0 50 85 H 75"
				stroke="url(#gp-gradient)"
			/>
			
			{/* The 'P' Pivot - Central Axis
			    - Vertical Stem at x=50
			    - Loop Radius 15 (extends to x=80, fitting inside G)
			*/}
			<path
				d="M 50 75 V 25 H 65 A 15 15 0 0 1 65 55 H 50"
				stroke="url(#gp-gradient)"
			/>
			
			{/* Pivot Dot - Center */}
			<circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
		</svg>
	);

	if (showText) {
		return (
			<div className="flex items-center gap-3">
				<div className={className}>{Icon}</div>
				<span className="text-2xl font-bold tracking-tight text-primary">
					GlobalPivot
				</span>
			</div>
		);
	}

	return Icon;
};
