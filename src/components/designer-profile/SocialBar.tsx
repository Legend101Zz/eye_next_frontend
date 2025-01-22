import { motion } from 'framer-motion';
import {
    FaBehance,
    FaDribbble,
    FaGithub,
    FaInstagram,
    FaLinkedin,
    FaMedium,
    FaTwitter,
    FaYoutube,
    FaFigma
} from 'react-icons/fa';
import { SiArtstation } from 'react-icons/si';

interface SocialIconProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    color: string;
}

const SocialIcon = ({ href, icon, label, color }: SocialIconProps) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
        <div
            className={`p-3 rounded-lg transition-colors ${color} opacity-80 group-hover:opacity-100`}
        >
            {icon}
        </div>
        <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm bg-black/90 text-white px-3 py-1 rounded"
        >
            {label}
        </motion.span>
    </motion.a>
);

const getSocialIcon = (url: string): { icon: React.ReactNode; label: string; color: string } => {
    const iconProps = { size: 24, className: "text-white" };

    if (url.includes('behance')) {
        return {
            icon: <FaBehance {...iconProps} />,
            label: 'Behance',
            color: 'bg-[#053eff]'
        };
    }
    if (url.includes('dribbble')) {
        return {
            icon: <FaDribbble {...iconProps} />,
            label: 'Dribbble',
            color: 'bg-[#ea4c89]'
        };
    }
    if (url.includes('github')) {
        return {
            icon: <FaGithub {...iconProps} />,
            label: 'GitHub',
            color: 'bg-[#333]'
        };
    }
    if (url.includes('instagram')) {
        return {
            icon: <FaInstagram {...iconProps} />,
            label: 'Instagram',
            color: 'bg-gradient-to-tr from-[#fd5949] to-[#d6249f]'
        };
    }
    if (url.includes('linkedin')) {
        return {
            icon: <FaLinkedin {...iconProps} />,
            label: 'LinkedIn',
            color: 'bg-[#0077b5]'
        };
    }
    if (url.includes('medium')) {
        return {
            icon: <FaMedium {...iconProps} />,
            label: 'Medium',
            color: 'bg-[#00ab6c]'
        };
    }
    if (url.includes('twitter')) {
        return {
            icon: <FaTwitter {...iconProps} />,
            label: 'Twitter',
            color: 'bg-[#1da1f2]'
        };
    }
    if (url.includes('youtube')) {
        return {
            icon: <FaYoutube {...iconProps} />,
            label: 'YouTube',
            color: 'bg-[#ff0000]'
        };
    }
    if (url.includes('figma')) {
        return {
            icon: <FaFigma {...iconProps} />,
            label: 'Figma',
            color: 'bg-[#f24e1e]'
        };
    }
    if (url.includes('artstation')) {
        return {
            icon: <SiArtstation {...iconProps} />,
            label: 'ArtStation',
            color: 'bg-[#13aff0]'
        };
    }

    return {
        icon: <FaGithub {...iconProps} />,
        label: 'Portfolio',
        color: 'bg-gray-700'
    };
};

export const SocialBar = ({ links }: { links: string[] }) => {
    return (
        <motion.div
            className="flex gap-3 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {links.map((link, index) => {
                const { icon, label, color } = getSocialIcon(link);
                return (
                    <SocialIcon
                        key={index}
                        href={link}
                        icon={icon}
                        label={label}
                        color={color}
                    />
                );
            })}
        </motion.div>
    );
};