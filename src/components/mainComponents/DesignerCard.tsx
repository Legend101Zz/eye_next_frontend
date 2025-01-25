//@ts-nocheck
import { type DesignerCardProps } from "@/types/types";
import Image from "next/image";
import { followDesigner, handleApiError } from "@/helpers/api/designerApi";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function DesignerCard({
  designImageUrl,
  profileImageUrl,
  designerName,
  designerId,
  designerFollowers,
  totalDesigns,
}: DesignerCardProps) {
  // Hooks
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Local state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const fallbackImage = "/placeholder-image.png"; // Add a fallback image path
    e.currentTarget.src = fallbackImage;
  };

  // Handle follow action
  const handleFollow = async () => {
    // Don't proceed if already following or auth is loading
    if (followLoading || authLoading || isFollowing) return;

    // Redirect to login if user is not authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to follow designers",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    setFollowLoading(true);
    try {
      const result = await followDesigner(user.id, designerId);
      setIsFollowing(true);
      toast({
        title: "Success!",
        description: "You are now following this designer",
      });
    } catch (error) {
      const handledError = handleApiError(error);
      toast({
        title: "Error Following Designer",
        description: handledError.message,
        variant: "destructive",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle loading state
  if (authLoading) {
    return <DesignerCardSkeleton />;
  }

  return (
    <div className="h-[22em] w-[15em] flex flex-col gap-5">
      {/* Design Image */}
      <div className="rounded-t-lg h-[10em] w-[15em] relative mb-5">
        <div className="w-full overflow-hidden">
          <Image
            alt={`Design by ${designerName}`}
            src={designImageUrl}
            fill
            priority
            style={{ objectFit: "fill" }}
            className="rounded-t-lg"
            onError={handleImageError}
          />
        </div>
        {/* Profile Image */}
        <div className="overflow-hidden rounded-full w-16 h-16 absolute top-[70%] right-[35%] shadow-lg">
          <Image
            alt={`${designerName}'s profile`}
            src={profileImageUrl}
            fill
            style={{ objectFit: "cover" }}
            onError={handleImageError}
          />
        </div>
      </div>

      {/* Designer Info */}
      <div className="max-h-full w-full flex flex-col gap-2 text-black">
        <div className="text-center text-xl font-heading1">
          {designerName}
        </div>
        <div className="flex flex-row gap-2 w-fit mx-auto text-black text-sm tracking-tight px-3">
          <div className="text-center">
            {designerFollowers.toLocaleString()} followers
          </div>
          <div className="text-center">
            {totalDesigns.toLocaleString()} designs
          </div>
        </div>

        {/* Follow Button */}
        <div className="w-fit mx-auto">
          <Button
            className="bg-transparent rounded-full border-muted hover:bg-accent hover:text-black hover:border-0 transition-all duration-75 border-2 relative"
            onClick={handleFollow}
            disabled={followLoading || isFollowing || authLoading}
          >
            {isFollowing ? "Following" : "Follow"}
            {followLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
function DesignerCardSkeleton() {
  return (
    <div className="h-[22em] w-[15em] flex flex-col gap-5">
      <div className="rounded-t-lg h-[10em] w-[15em] relative mb-5">
        <Skeleton className="w-full h-full rounded-lg" />
        <div className="overflow-hidden rounded-full w-16 h-16 absolute top-[70%] right-[35%]">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
      </div>
      <div className="max-h-full w-full flex flex-col gap-2">
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <Skeleton className="h-8 w-24 mx-auto rounded-full" />
      </div>
    </div>
  );
}