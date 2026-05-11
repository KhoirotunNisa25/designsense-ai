"use client";

import { useCallback, useRef, useState } from "react";
import type { DragEvent } from "react";

type UploadCardProps = {
	onFileSelected: (file: File) => void;
	disabled?: boolean;
	helperText?: string;
};

export default function UploadCard({
	onFileSelected,
	disabled = false,
	helperText,
}: UploadCardProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleFile = useCallback(
		(file?: File) => {
			if (!file || disabled) return;
			onFileSelected(file);
		},
		[disabled, onFileSelected]
	);

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);
		handleFile(event.dataTransfer.files?.[0]);
	};

	const handleBrowse = () => {
		if (disabled) return;
		inputRef.current?.click();
	};

	return (
		<div
			className={`group rounded-2xl border border-dashed p-8 transition-all ${
				isDragging
					? "border-blue-400 bg-blue-50/70"
					: "border-zinc-200 bg-white"
			} ${disabled ? "opacity-70" : "hover:border-blue-300"}`}
			onDragEnter={(event) => {
				event.preventDefault();
				if (!disabled) setIsDragging(true);
			}}
			onDragOver={(event) => {
				event.preventDefault();
				if (!disabled) setIsDragging(true);
			}}
			onDragLeave={() => setIsDragging(false)}
			onDrop={handleDrop}
			role="button"
			tabIndex={0}
			aria-disabled={disabled}
			onClick={handleBrowse}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					handleBrowse();
				}
			}}
		>
			<input
				ref={inputRef}
				type="file"
				accept="image/png,image/jpeg,image/webp"
				className="hidden"
				onChange={(event) => handleFile(event.target.files?.[0])}
				disabled={disabled}
			/>
			<div className="flex flex-col items-center gap-3 text-center">
				<div className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
					Drop your screenshot
				</div>
				<p className="text-lg font-semibold text-zinc-900">
					Drag & drop UI screenshot here
				</p>
				<p className="text-sm text-zinc-500">
					or click to browse. PNG, JPG, WEBP up to ~4MB.
				</p>
				{helperText ? (
					<p className="text-xs font-medium text-blue-600">{helperText}</p>
				) : null}
			</div>
		</div>
	);
}
