import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HoverBorderGradientDemo } from "./LoginWithNostr";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { IconBusinessplan, IconPhone, IconSpray, IconTie } from "@tabler/icons-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed py-8 mt-24 top-0 right-0 h-auto w-64 dark:bg-gray-800/50 dark:border-white/[0.2] bg-slate-200/50 shadow-lg z-50 rounded-tl-3xl rounded-bl-3xl mx-auto"
          >
            <div className="p-4 ">
              <nav className="flex flex-col space-y-4 text-center">
              <div className="flex justify-center text-center">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-1 sm:space-x-2 
                   px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-3
                   text-sm sm:text-sm md:text-base lg:text-lg transition-all duration-300"
                  >
                    <IconSpray className="text-lg text-ddblue dark:text-lgreen mx-2" />
                    <Link href="/pests" className="text-lg font-russo px-4" onClick={onClose}>
                      Услуги
                    </Link>
                  </HoverBorderGradient>
                </div>

                <div className="flex justify-center text-center">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-1 sm:space-x-2 
                   px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-3
                   text-sm sm:text-sm md:text-base lg:text-lg transition-all duration-300"
                  >
                  <IconTie className="text-lg dark:text-lgreen text-ddblue mx-2"/>
                <Link href="/business" className="text-lg font-russo px-4" onClick={onClose}>Бизнес</Link>
                </HoverBorderGradient>
                </div>


                <div className="flex justify-center text-center">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-1 sm:space-x-2 
                   px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-3
                   text-sm sm:text-sm md:text-base lg:text-lg transition-all duration-300"
                  >
                  <IconPhone className="text-lg dark:text-lgreen text-ddblue mx-2"/>
                <Link href="/contact" className="text-lg font-russo px-4" onClick={onClose}>Контакти</Link>
                </HoverBorderGradient>
                </div>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;