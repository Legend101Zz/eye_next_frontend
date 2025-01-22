"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import MenuMobile from "./MenuMobile";
import { CgProfile } from "react-icons/cg";
import { MdLogout, MdOutlineLogin } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { BiMenuAltRight } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { handleLogout } from "@/lib/auth-utils";
import SearchComponent from "./SearchComponent";
import Image from "next/image";
import { DashboardIcon } from "@radix-ui/react-icons";

interface Category {
	id: number;
	attributes: {
		slug: string;
		name: string;
		products: {
			data: any[];
		};
	};
}

const Header = () => {
	const { toast } = useToast();
	const { isAuthenticated, isDesigner, isLoading } = useAuth();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [mobileMenu, setMobileMenu] = useState<boolean>(false);
	const [showCatMenu, setShowCatMenu] = useState<boolean>(false);
	const [show, setShow] = useState<string>("translate-y-0");
	const [categories, setCategories] = useState<Category[] | null>(null);
	const [active, setActive] = useState<boolean>(true);

	const pathName = usePathname();
	const router = useRouter();

	console.log("user", isAuthenticated);
	useEffect(() => {
		if (pathName.includes("auth")) {
			setActive(false);
		} else {
			setActive(true);
		}

		// Set example categories
		setCategories([
			{
				id: 1,
				attributes: {
					name: "T-Shirts",
					slug: "/",
					products: { data: [] },
				},
			},
			{
				id: 2,
				attributes: {
					name: "Hoodies",
					slug: "/",
					products: { data: [] },
				},
			},
		]);
	}, [pathName]);

	const toggleDropdown = useCallback(() => {
		setIsOpen(!isOpen);
	}, [isOpen]);

	const handleSellArtButton = async () => {
		if (!isAuthenticated) {
			toast({
				title: "Please login",
				description: "You need to login to sell your art",
			});
			router.push("/auth/login");
			return;
		}

		if (!isDesigner) {
			toast({
				title: "Register as Designer",
				description: "You need to be registered as a designer",
			});
			router.push("/auth/signup/designer");
			return;
		}

		router.push("/profile/DesignerProfile");
	};

	const onLogout = async () => {
		try {
			await handleLogout();
			toast({
				title: "Logged out",
				description: "You have been successfully logged out",
			});
			router.push("/auth/login");
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to logout. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<div
			className={`${active ? "block" : "hidden"
				} w-full h-[50px] md:h-[80px] flex justify-between z-20 fixed bg-white top-0 transition-all duration-500 px-5`}
		>
			{/* Logo Section */}
			<div className="flex gap-2 items-center ml-5 h-full">
				<Link href="/">
					<div className="flex h-full max-h-full gap-2 overflow-hidden items-center">
						<Image
							src="/logo.jpeg"
							height={100}
							width={100}
							alt="logo"
							className="inset-0 overflow-clip"
						/>
					</div>
				</Link>
			</div>

			{/* Search Section */}
			<div className="flex items-center w-[100px] lg:w-[600px]">
				<SearchComponent />
			</div>

			{/* Mobile Menu */}
			{mobileMenu && (
				<MenuMobile
					showCatMenu={showCatMenu}
					setShowCatMenu={setShowCatMenu}
					setMobileMenu={setMobileMenu}
					categories={categories || undefined}
				/>
			)}

			{/* Actions Section */}
			<div className="flex items-center gap-1">
				{/* Sell Art Button */}
				<button
					className="hidden md:block text-accent du-btn du-btn-primary text-black font-heading1 lg:text-xl text-sm text-nowrap shadow-md"
					onClick={handleSellArtButton}
				>
					Sell Your Art
				</button>

				{/* Auth Buttons */}
				{!isLoading && (
					<>
						{!isAuthenticated ? (
							<>
								<Link
									href="/auth/login"
									className="hidden md:flex du-btn du-btn-md du-btn-ghost my-auto items-center justify-center font-heading1 text-lg"
								>
									Log In
								</Link>
								<Link
									href="/auth/signup"
									className="hidden md:flex du-btn du-btn-md du-btn-ghost my-auto items-center justify-center font-heading1 text-lg"
								>
									Sign Up
								</Link>
							</>
						) : (
							<Link
								href="/profile/DesignerDashboard"
								className="hidden md:flex du-btn du-btn-md du-btn-ghost my-auto items-center justify-center font-heading1 text-lg"
							>
								Dashboard <DashboardIcon width={18} />
							</Link>
						)}
					</>
				)}

				{/* Icons Section */}
				<div className="flex">
					{isAuthenticated && (
						<>
							<div className="hidden md:flex w-8 md:w-12 h-8 md:h-12 rounded-full justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
								<IoMdHeartEmpty className="text-[19px] md:text-[24px]" />
								<div className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
									51
								</div>
							</div>

							<Link href="/cart" className="hidden md:block">
								<div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
									<BsCart className="text-[15px] md:text-[20px] fill-black" />
								</div>
							</Link>
						</>
					)}

					{/* Profile Menu */}
					<div onClick={toggleDropdown}>
						<div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center cursor-pointer relative hover:bg-black/10">
							<CgProfile className="text-[17px] md:text-[25px]" />
						</div>
					</div>

					{/* Mobile Menu Toggle */}
					<div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex md:hidden justify-center items-center hover:bg-black/[0.05] cursor-pointer relative -mr-2">
						{mobileMenu ? (
							<VscChromeClose
								className="text-[16px]"
								onClick={() => setMobileMenu(false)}
							/>
						) : (
							<BiMenuAltRight
								className="text-[20px]"
								onClick={() => setMobileMenu(true)}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Profile Dropdown */}
			{isOpen && (
				<div className="absolute z-10 right-0 mt-16 w-36 bg-white border rounded-lg shadow-lg">
					{isAuthenticated ? (
						<>
							<Link href="/profile/settings">
								<div className="flex gap-2 items-center px-4 py-2 text-gray-800 hover:bg-gray-200">
									Settings <DashboardIcon />
								</div>
							</Link>
							<button
								onClick={onLogout}
								className="w-full flex gap-2 items-center px-4 py-2 text-gray-800 hover:bg-gray-200"
							>
								Logout <MdLogout />
							</button>
						</>
					) : (
						<>
							<Link href="/auth/login">
								<div className="flex gap-2 items-center px-4 py-2 text-gray-800 hover:bg-gray-200">
									Login <MdOutlineLogin />
								</div>
							</Link>
							<Link href="/auth/signup">
								<div className="flex gap-2 items-center px-4 py-2 text-gray-800 hover:bg-gray-200">
									Sign Up
								</div>
							</Link>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default Header;