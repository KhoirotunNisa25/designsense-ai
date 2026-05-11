type ResultCardProps = {
	title: string;
	items: string[];
	variant?: "check" | "cross" | "bullet";
	emptyMessage?: string;
};

const iconMap = {
	check: "✓",
	cross: "✗",
	bullet: "•",
} as const;

export default function ResultCard({
	title,
	items,
	variant = "bullet",
	emptyMessage = "Upload a screenshot to get feedback.",
}: ResultCardProps) {
	const icon = iconMap[variant];
	const content = items.length ? items : [emptyMessage];

	return (
		<div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
			<div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
				{title}
			</div>
			<ul className="space-y-2 text-sm leading-6 text-zinc-700">
				{content.map((item, index) => (
					<li key={`${title}-${index}`} className="flex gap-2">
						<span className="font-semibold text-zinc-700">{icon}</span>
						<span>{item}</span>
					</li>
				))}
			</ul>
		</div>
	);
}
