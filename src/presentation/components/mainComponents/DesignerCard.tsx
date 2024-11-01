import React from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/application/hooks/auth/useAuth";
import { useDesigner } from "@/application/hooks/designer/useDesigner";

interface DesignerCardProps {
  totalDesigns: number;
  designerFollowers: number;
  designImageUrl: string;
  designName: string;
  designerId: string;
  designerName: string;
  profileImageUrl: string;
}

const DesignerCard: React.FC<DesignerCardProps> = ({
  totalDesigns,
  designerFollowers,
  designImageUrl,
  designName,
  designerId,
  designerName,
  profileImageUrl,
}) => {
  // Get the designer hook functionality for this specific designer
  const {
    designer,
    loading: followLoading,
    error: followError,

  } = useDesigner({ designerId });

  // Get current user context
  const { user } = useAuth();

  // Check if the current user is following this designer
  const isFollowing = user && designer?.followers?.includes(user.id);

  // Handle follow/unfollow action
  const handleFollowAction = async () => {
    try {
      if (!user) {
        // Redirect to login or show login modal
        return;
      }

      if (isFollowing) {
        await unfollowDesigner(designerId);
      } else {
        await followDesigner(designerId);
      }
    } catch (error) {
      console.error("Failed to update follow status:", error);
    }
  };

  return (
    <div className="h-[22em] w-[15em] flex flex-col gap-5 group">
      {/* Design Image */}
      <div className="rounded-t-lg h-[10em] w-[15em] relative mb-5 overflow-hidden">
        <img
          src={designImageUrl || "/placeholder-design.png"}
          alt={designName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Profile Picture Overlay */}
        <div className="overflow-hidden rounded-full w-16 h-16 absolute top-[70%] right-[35%] border-2 border-white">
          <img
            src={profileImageUrl || "/placeholder-profile.png"}
            alt={designerName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Designer Info */}
      <div className="max-h-full w-full flex flex-col gap-3">
        <h3 className="text-center text-xl font-heading1">{designerName}</h3>
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          <span>{totalDesigns} designs</span>
          <span>{designerFollowers} followers</span>
        </div>
      </div>

      {/* Follow Button */}
      <div className="w-fit mx-auto">
        <Button
          onClick={handleFollowAction}
          disabled={followLoading}
          className={`
            rounded-full transition-all duration-200
            ${isFollowing
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              : 'bg-accent text-white hover:bg-accent-dark'
            }
          `}
        >
          {followLoading
            ? 'Loading...'
            : isFollowing
              ? 'Following'
              : 'Follow'
          }
        </Button>
      </div>

      {/* Error Message */}
      {followError && (
        <p className="text-red-500 text-xs text-center">
          {followError}
        </p>
      )}
    </div>
  );
};

export default DesignerCard;