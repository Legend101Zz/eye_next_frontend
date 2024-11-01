"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/presentation/components/ui/label";
import { Input } from "@/presentation/components/ui/input";
import { Button } from "@/presentation/components/ui/button";
import SelectProductModal from "./SelectProductModal";
import { DesignerSettings } from "@/domain/entities/designer.entity";
import { useDesigner } from "@/application/hooks/designer/useDesigner";


interface FormContentProps {
  designerId: string;
  onSubmit?: (data: DesignerSettings) => void;
}

/**
 * Form Content Component for Designer Settings
 * Uses useDesigner hook for settings management
 */
const FormContent: React.FC<FormContentProps> = ({ designerId, onSubmit }) => {
  const {
    settings,
    loading,
    error,
    updateSettings,
  } = useDesigner({
    designerId,
    shouldFetchOnMount: true,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Partial<DesignerSettings>>({
    defaultValues: settings || {
      isPrivate: false,
      showDesigns: true,
      designIds: [],
      showFollowers: true,
      showFullName: true,
      showPhone: true,
      showDescription: true,
      showCoverPhoto: true,
      showProfilePhoto: true,
      socialMediaLink1: "",
      socialMediaLink2: "",
      portfolioLink1: "",
      portfolioLink2: "",
    }
  });

  /**
   * Handle form submission
   */
  const handleFormSubmit = async (data: DesignerSettings) => {
    try {
      await updateSettings(data);
      onSubmit?.(data);
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="w-6 h-6 border-2 border-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Failed to load settings: {error}
      </div>
    );
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Portfolio Links Section */}
        <div className="grid gap-4 py-4 text-center">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portfolioLink1" className="text-right">
              Portfolio Link 1
            </Label>
            <Input
              id="portfolioLink1"
              {...register("portfolioLink1")}
              className="col-span-3 text-white"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portfolioLink2" className="text-right">
              Portfolio Link 2
            </Label>
            <Input
              id="portfolioLink2"
              {...register("portfolioLink2")}
              className="col-span-3 text-white"
            />
          </div>

          <hr />

          {/* Social Media Links Section */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="socialMediaLink1" className="text-right">
              Social Media Link 1
            </Label>
            <Input
              id="socialMediaLink1"
              {...register("socialMediaLink1")}
              className="col-span-3 text-white"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="socialMediaLink2" className="text-right">
              Social Media Link 2
            </Label>
            <Input
              id="socialMediaLink2"
              {...register("socialMediaLink2")}
              className="col-span-3 text-white"
            />
          </div>

          <hr />

          {/* Visibility Settings Section */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="showProfilePhoto" className="text-right col-span-2">
              Display Picture
            </Label>
            <Input
              type="checkbox"
              id="showProfilePhoto"
              {...register("showProfilePhoto")}
              className="col-span-2 mx-auto w-5 text-black"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="showDescription" className="text-right col-span-2">
              Description
            </Label>
            <Input
              type="checkbox"
              id="showDescription"
              {...register("showDescription")}
              className="col-span-2 mx-auto w-5 text-black"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="showFullName" className="text-right col-span-2">
              Name
            </Label>
            <Input
              type="checkbox"
              id="showFullName"
              {...register("showFullName")}
              className="col-span-2 mx-auto w-5 text-black"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isPrivate" className="text-right col-span-2">
              Private Profile
            </Label>
            <Input
              type="checkbox"
              id="isPrivate"
              {...register("isPrivate")}
              className="col-span-2 mx-auto w-5 text-black"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="showPhone" className="text-right col-span-2">
              Show Contact Number
            </Label>
            <Input
              type="checkbox"
              id="showPhone"
              {...register("showPhone")}
              className="col-span-2 mx-auto w-5 text-black"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="showFollowers" className="text-right col-span-2">
              Show Followers
            </Label>
            <Input
              type="checkbox"
              id="showFollowers"
              {...register("showFollowers")}
              className="col-span-2 mx-auto w-5 text-black"
            />
          </div>

          <hr />

          {/* Featured Designs Section */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="showDesigns" className="text-right col-span-2">
              Show Featured Designs
            </Label>
            <Input
              type="checkbox"
              id="showDesigns"
              {...register("showDesigns")}
              className="col-span-2 mx-auto w-5 text-black"
            />
          </div>

          <hr />

          {/* Conditional Product Selection */}
          {watch("showDesigns") && (
            <div>
              <SelectProductModal designerId={designerId} />
            </div>
          )}
        </div>

        <hr className="my-1" />

        {/* Submit Button */}
        <Button
          type="submit"
          className="my-1 bg-white/[0.4] hover:bg-accent"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default FormContent;