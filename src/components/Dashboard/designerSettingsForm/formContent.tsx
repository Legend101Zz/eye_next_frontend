import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import SelectProductModal from "./SelectProductModal";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1 }
	}
};

const itemVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.3 }
	}
};

interface DesignerSettings {
	isPrivate: boolean;
	showDesigns: boolean;
	designIds: string[];
	showFollowers: boolean;
	showFullName: boolean;
	showPhone: boolean;
	showDescription: boolean;
	showProfilePhoto: boolean;
	socialMediaLink1: string;
	socialMediaLink2: string;
	portfolioLink1: string;
	portfolioLink2: string;
}

interface FormContentProps {
	onSubmit: (data: DesignerSettings) => Promise<void>;
	designerId: string;
	initialSettings: DesignerSettings;
	disabled?: boolean;
}

const FormContent: React.FC<FormContentProps> = ({
	onSubmit,
	designerId,
	initialSettings,
	disabled
}) => {
	const { register, handleSubmit, watch, setValue, reset } = useForm<DesignerSettings>();

	// Initialize form with values when initialSettings change
	useEffect(() => {
		console.log("Received initial settings:", initialSettings);
		reset({
			...initialSettings,
			isPrivate: !!initialSettings.isPrivate,
			showDesigns: !!initialSettings.showDesigns,
			showFollowers: !!initialSettings.showFollowers,
			showFullName: !!initialSettings.showFullName,
			showPhone: !!initialSettings.showPhone,
			showDescription: !!initialSettings.showDescription,
			showProfilePhoto: !!initialSettings.showProfilePhoto,
			socialMediaLink1: initialSettings.socialMediaLink1 || "",
			socialMediaLink2: initialSettings.socialMediaLink2 || "",
			portfolioLink1: initialSettings.portfolioLink1 || "",
			portfolioLink2: initialSettings.portfolioLink2 || "",
			designIds: initialSettings.designIds || []
		});
	}, [initialSettings, reset]);

	const showDesigns = watch("showDesigns");

	const handleFormSubmit = async (data: DesignerSettings) => {
		console.log("Form data before submission:", data);
		onSubmit(data);
	};

	const SectionTitle = ({ children }: { children: React.ReactNode }) => (
		<motion.h3
			variants={itemVariants}
			className="text-lg font-heading1 text-accent mb-6"
		>
			{children}
		</motion.h3>
	);

	const FormInput = ({ label, id, name, ...props }) => (
		<motion.div
			variants={itemVariants}
			className="grid grid-cols-4 items-center gap-4 group"
		>
			<Label htmlFor={id} className="text-right text-gray-400 group-hover:text-white transition-colors">
				{label}
			</Label>
			<Input
				id={id}
				{...register(name)}
				{...props}
				className="col-span-3 text-white bg-black/20 border-accent/20 focus:border-accent 
          transition-all duration-300 hover:border-accent/50"
			/>
		</motion.div>
	);

	const ToggleSwitch = ({ label, name, ...props }) => {
		const value = watch(name);

		return (
			<motion.div
				variants={itemVariants}
				className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 
          transition-colors group"
			>
				<Label
					className="text-gray-400 group-hover:text-white transition-colors cursor-pointer"
				>
					{label}
				</Label>
				<Switch
					checked={value}
					onCheckedChange={(checked) => setValue(name, checked)}
					className="data-[state=checked]:bg-accent"
					{...props}
				/>
			</motion.div>
		);
	};

	return (
		<motion.form
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			onSubmit={handleSubmit(handleFormSubmit)}
			className="space-y-8 py-4"
		>
			<motion.div variants={containerVariants} className="space-y-6">
				<SectionTitle>Portfolio Links</SectionTitle>
				<FormInput
					label="Portfolio Link 1"
					id="portfolioLink1"
					name="portfolioLink1"
					disabled={disabled}
				/>
				<FormInput
					label="Portfolio Link 2"
					id="portfolioLink2"
					name="portfolioLink2"
					disabled={disabled}
				/>
			</motion.div>

			<motion.div variants={containerVariants} className="space-y-6">
				<SectionTitle>Social Media</SectionTitle>
				<FormInput
					label="Social Link 1"
					id="socialMediaLink1"
					name="socialMediaLink1"
					disabled={disabled}
				/>
				<FormInput
					label="Social Link 2"
					id="socialMediaLink2"
					name="socialMediaLink2"
					disabled={disabled}
				/>
			</motion.div>

			<motion.div variants={containerVariants} className="space-y-4">
				<SectionTitle>Profile Visibility</SectionTitle>
				<div className="space-y-2 rounded-xl bg-black/20 p-4">
					<ToggleSwitch
						label="Display Profile Photo"
						name="showProfilePhoto"
						disabled={disabled}
					/>
					<ToggleSwitch
						label="Show Description"
						name="showDescription"
						disabled={disabled}
					/>
					<ToggleSwitch
						label="Show Full Name"
						name="showFullName"
						disabled={disabled}
					/>
					<ToggleSwitch
						label="Private Profile"
						name="isPrivate"
						disabled={disabled}
					/>
					<ToggleSwitch
						label="Show Contact Number"
						name="showPhone"
						disabled={disabled}
					/>
					<ToggleSwitch
						label="Show Followers"
						name="showFollowers"
						disabled={disabled}
					/>
					<ToggleSwitch
						label="Show Featured Designs"
						name="showDesigns"
						disabled={disabled}
					/>
				</div>
			</motion.div>

			{showDesigns && (
				<motion.div
					variants={itemVariants}
					className="pt-4"
				>
					<SelectProductModal
						designerId={designerId}
						onSelect={(ids) => setValue("designIds", ids)}
						disabled={disabled}
					/>
				</motion.div>
			)}

			<motion.div variants={itemVariants}>
				<Button
					type="submit"
					className="w-full bg-accent hover:bg-accent/90 text-white font-medium
            transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
            disabled:opacity-50 disabled:hover:scale-100"
					disabled={disabled}
				>
					{disabled ? (
						<div className="flex items-center gap-2">
							<div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							<span>Saving...</span>
						</div>
					) : (
						"Save changes"
					)}
				</Button>
			</motion.div>
		</motion.form>
	);
};

export default FormContent;