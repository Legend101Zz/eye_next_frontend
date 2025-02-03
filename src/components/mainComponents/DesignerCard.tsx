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
import { motion } from "framer-motion";
import { Eye, Sparkles, Palette } from "lucide-react";

export default function DesignerCard({
  coverImageUrl,
  profileImageUrl,
  designerName,
  designerId,
  designerFollowers,
  totalDesigns,
}: DesignerCardProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const fallbackImage = "/deauthCircleIcon2.png";
    e.currentTarget.src = fallbackImage;
  };

  const handleFollow = async () => {
    if (followLoading || authLoading || isFollowing) return;

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

  if (authLoading) {
    return <DesignerCardSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[22em] w-[15em] flex flex-col bg-secondary rounded-lg relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Elements */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-ring opacity-0 group-hover:opacity-100 rounded-lg blur transition duration-500" />

      {/* Main Content Container */}
      <div className="relative flex flex-col w-full h-full bg-secondary rounded-lg">
        {/* Cover Image Container */}
        <div className="rounded-t-lg h-[10em] w-full relative overflow-hidden">
          <Image
            alt={`Cover by ${designerName}`}
            src={coverImageUrl}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            style={{ objectFit: "cover" }}
            className="transition-all duration-300"
            onError={handleImageError}
          />

          {/* Hover Overlay with Animated Border */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-secondary/80"
          />
        </div>

        {/* Profile Image Container */}
        <motion.div
          className="absolute left-[38%] -translate-x-1/2 -translate-y-1/2 top-[8.5em]"
          whileHover={{ scale: 1.5 }}
        >
          <div className="relative">
            {/* Rotating Border Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-ring to-primary animate-spin-slow"
              style={{ padding: '3px', animation: 'spin 4s linear infinite' }} />

            {/* Profile Image */}
            <div className="w-16 h-16 rounded-full overflow-hidden relative bg-secondary p-0.5">
              <Image
                alt={`${designerName}'s profile`}
                src={profileImageUrl}
                fill
                sizes="64px"
                style={{ objectFit: "cover" }}
                className="rounded-full"
                onError={handleImageError}
              />
            </div>
          </div>
        </motion.div>

        {/* Designer Info */}
        <div className="flex flex-col items-center mt-12 px-4 space-y-3">
          <motion.h3
            className="font-heading1 text-xl text-primary-content group-hover:text-primary transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {designerName}
          </motion.h3>

          {/* Stats Container */}
          <motion.div
            className="flex items-center gap-4 text-sm text-neutral"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-1">
              <Palette className="w-4 h-4 text-primary" />
              <span>{totalDesigns.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-primary" />
              <span>{designerFollowers.toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Follow Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-[80%] mt-2"
          >
            <Button
              className={`
                w-full relative overflow-hidden group
                ${isFollowing
                  ? 'bg-success hover:bg-success/90'
                  : 'bg-primary hover:bg-primary/90'} 
                text-primary-content rounded-full transition-all duration-300
                hover:shadow-lg hover:shadow-primary/20
              `}
              onClick={handleFollow}
              disabled={followLoading || isFollowing || authLoading}
            >
              <span className="flex items-center justify-center gap-2">
                {isFollowing ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Following
                  </>
                ) : (
                  'Follow'
                )}
              </span>
              {followLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-4 h-4 border-2 border-primary-content border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function DesignerCardSkeleton() {
  return (
    <div className="h-[22em] w-[15em] flex flex-col bg-secondary rounded-lg p-4">
      <div className="rounded-t-lg h-[10em] w-full relative mb-8">
        <Skeleton className="w-full h-full rounded-lg" />
        <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%-2rem)]">
          <div className="w-16 h-16 overflow-hidden rounded-full">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 mt-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
}