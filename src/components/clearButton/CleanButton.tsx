import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
interface CleanButtonProps {
    onClick: () => void;
}


const CircularLoader = () => {
    return (
        <svg className="absolute w-full h-full animate-spin" viewBox="0 0 100 100">
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="150"
                strokeDashoffset="30"
                className="text-gray-400 dark:text-gray-500"
            />
        </svg>
    );
};

export const CleanButton = ({ onClick }: CleanButtonProps) => {
    const [state, setState] = useState<"idle" | "cleaning" | "done">("idle");

    const handleClick = async () => {
        if (state !== "idle") return;

        setState("cleaning");
        await onClick();

        setTimeout(() => {
            setState("done");

            setTimeout(() => {
                setState("idle");
            }, 2000);
        }, 1800);
    };

    return (
        <motion.button
            onClick={handleClick}
            disabled={state !== "idle"}
            className="relative w-32 h-32 rounded-full border-4 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md flex items-center justify-center transition hover:scale-[1.02] active:scale-95 group overflow-hidden"
        >
            {state === "cleaning" && <CircularLoader />}

            <AnimatePresence mode="wait">
                {state === "idle" && (
                    <motion.span
                        key="idle"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                        className="text-gray-700 dark:text-gray-300 font-semibold text-lg z-10"
                    >
                        Clean
                    </motion.span>
                )}

                {state === "cleaning" && (
                    <motion.span
                        key="cleaning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-600 dark:text-gray-400 font-medium z-10"
                    >
                        Cleaning
                    </motion.span>
                )}

                {state === "done" && (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="z-10"
                    >
                        <Check className="h-10 w-10 text-gray-700 dark:text-gray-300" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};
