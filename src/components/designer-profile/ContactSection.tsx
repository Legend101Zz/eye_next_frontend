'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    MailIcon,
    MessageSquareIcon,
    ChevronRightIcon
} from 'lucide-react';
import { SocialBar } from './SocialBar';

interface ContactSectionProps {
    email: string;
    socialLinks: string[];
}

export const ContactSection = ({ email, socialLinks }: ContactSectionProps) => {
    return (
        <div className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                    }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative">
                <motion.div
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Left Column */}
                        <div>
                            <motion.h2
                                className="text-3xl md:text-4xl font-heading1 text-white mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                Let&apos;s Create Something Amazing Together
                            </motion.h2>
                            <motion.p
                                className="text-white/60 mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                Whether you have a project in mind or just want to say hello, I&apos;d love to hear from you.
                            </motion.p>

                            {/* Contact Buttons */}
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Button
                                        className="w-full bg-accent hover:bg-accent/90 text-white"
                                        onClick={() => window.location.href = `mailto:${email}`}
                                    >
                                        <MailIcon className="w-4 h-4 mr-2" />
                                        Send Email
                                    </Button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full border-white/10 text-white hover:bg-white/5"
                                    >
                                        <MessageSquareIcon className="w-4 h-4 mr-2" />
                                        Start Commission
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Social Links */}
                            {socialLinks.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-sm text-white/40 mb-4">Or connect on social media</h3>
                                    <SocialBar links={socialLinks} />
                                </div>
                            )}
                        </div>

                        {/* Right Column - Quick Links */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-heading1 text-white mb-8">Quick Links</h3>

                            {[
                                { label: 'Commission Process', href: '#' },
                                { label: 'Licensing & Usage', href: '#' },
                                { label: 'Custom Projects', href: '#' },
                                { label: 'FAQs', href: '#' },
                            ].map((link, index) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-colors group"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <span>{link.label}</span>
                                    <ChevronRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};