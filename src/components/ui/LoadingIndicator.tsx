"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LoadingIndicator() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
            <div className="relative flex flex-col items-center px-4 w-full max-w-xs sm:max-w-sm">
                {/* Animated Logo */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                        scale: [0.9, 1.05, 1],
                        opacity: 1
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                        <Image
                            src="/images/LithiaAutosLogoIcon.png"
                            alt="Lithia Autos Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Loading Text */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-navy-900 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 text-center"
                >
                    Loading Excellence
                </motion.p>

                {/* Progress Bar Container */}
                <div className="w-full h-1 bg-navy-50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
