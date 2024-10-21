"use client";
import React, { useState, useEffect, useRef } from "react";
import { HoveredLink, Logo, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import ThemeSwitch from "./themeSwitch";
import Link from "next/link";
import { FlipWordsNav } from "./FlipWords";
import MobileMenu from "./MobileMenu";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { IconContract, IconSpray, IconTie, IconMenu, IconX } from "@tabler/icons-react";
import { useSession } from 'next-auth/react'; // Import useSession

export function NavbarDemo({ className }: { className?: string }) { // Removed session prop

  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 932); // Adjust breakpoint as needed
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });
  
  return (
    <div className="relative w-full flex items-center justify-center">
      <AnimatePresence mode="wait">
      {/* <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
          className={cn(
            "flex fixed top-0 inset-x-0 mx-auto rounded-full bg-transparent z-[5000] items-center justify-center",
            className
          )}
        > */}
          <div className="flex fixed top-0 inset-x-0 mx-auto rounded-full bg-transparent z-[5000] items-center justify-center">
          <Navbar 
            className="top-0" 
            isMobile={isMobile} 
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen} 
          />
          </div>
        {/* </motion.div> */}
      </AnimatePresence>
      
      {isMobile && (
        <div ref={menuRef}>
          <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </div>
  );
}

function Navbar({ 
  className, 
  isMobile, 
  mobileMenuOpen,
  setMobileMenuOpen,
}: { 
  className?: string, 
  isMobile: boolean, 
  mobileMenuOpen: boolean,
  setMobileMenuOpen: (isOpen: boolean) => void 
}) {  
  const [active, setActive] = useState<string | null>(null);
  const { data: session } = useSession(); // Get session data

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 ">
      <div className={cn("max-w-7xl mx-auto", className)}>
        <Menu setActive={setActive}>
          <div className="flex items-center justify-between w-full">
            {/* Logo on the left */}
            <Logo 
        title="Wonderland"
        href="/"
        src="https://cdn.jsdelivr.net/gh/Ethereumistic/wonderland-assets/logo/w.png"
        src2="https://cdn.jsdelivr.net/gh/Ethereumistic/wonderland-assets/logo/o.png"
        src3="https://cdn.jsdelivr.net/gh/Ethereumistic/wonderland-assets/logo/n.png"
      />

            {/* Navigation items or menu icon */}
            {isMobile ? (
              <div className="flex items-center space-x-4">
                <div className="" >
                  <ThemeSwitch  />
                </div>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="text-3xl z-[5001] ml-4"
              >
                {mobileMenuOpen ? <IconX /> : <IconMenu />}
              </button>
              </div>
              
            ) : (
              <div className="flex items-center font-russo space-x-2 xs:space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-12">
                <Link href="/about" className="text-lg font-russo px-4" >
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-1 sm:space-x-2 
                   px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-3
                   text-sm sm:text-sm md:text-base lg:text-lg transition-all duration-300"
                  >
                      За Нас
                  </HoverBorderGradient>
                  </Link>

                <Link href="/services" className="text-lg ">
                <div className="flex justify-center text-center">



                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-1 sm:space-x-2 
                               px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-3
                               text-sm sm:text-sm md:text-base lg:text-lg transition-all duration-300"
                  >

                  <MenuItem setActive={setActive} active={active} item='Услуги'>
                  
                    <div className="flex justify-center items-center my-4"><IconSpray width={50} height={50} /><FlipWordsNav /></div>
                      <div className=" text-sm grid grid-cols-4 gap-10 p-4 ">
            <ProductItem
              title="BTC"
              href="/pests/cockroach"
              src="https://cdn.jsdelivr.net/gh/Ethereumistic/bio-ddd-assets/entity-assets/cockroach.png"
              darkSrc="https://cdn.jsdelivr.net/gh/Ethereumistic/bio-ddd-assets/entity-assets/dark/cockroach.png"
              description="test"
            />
            <ProductItem
              title="BTC"
              href="/pests/rat"
              src="https://cdn.jsdelivr.net/gh/Ethereumistic/bio-ddd-assets/entity-assets/rat.png"
              darkSrc="https://cdn.jsdelivr.net/gh/Ethereumistic/bio-ddd-assets/entity-assets/dark/rat.png"
              description="test"
            />
            <ProductItem
              title="BTC"
              href="/pests/bedbug"
              src="https://cdn.jsdelivr.net/gh/Ethereumistic/bio-ddd-assets/entity-assets/bedbug.png"
              darkSrc="https://cdn.jsdelivr.net/gh/Ethereumistic/bio-ddd-assets/entity-assets/dark/bedbug.png"
              description="test"
            />

                      </div>
                  </MenuItem>
                  </HoverBorderGradient>
                  </div>
                </Link>

                <Link href="/register" className="text-lg">
                <div className="flex justify-center text-center">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-1 sm:space-x-2 
                             px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-3
                             text-sm sm:text-sm md:text-base lg:text-lg transition-all duration-300"
                >
                  <MenuItem setActive={setActive} active={active} item='Register'>
                    <div className="flex flex-col text-lg px-8 my-10">
                      <div className="flex flex-row  pb-10  justify-center hover:scale-105 transition duration-300 hover:drop-shadow-[0_1.5px_1.5px_rgba(94,187,70,1)]">
                      <IconTie width={30} height={30} className="mr-2" />
                      <HoveredLink href="/web-dev">Business</HoveredLink>
                      </div>
                      <hr></hr>
                      <div className="flex flex-row pt-10  hover:scale-105 transition duration-300 hover:drop-shadow-[0_1.5px_1.5px_rgba(94,187,70,1)]">
                      <IconContract width={30} height={30} className="mr-2" />
                      <HoveredLink href="/interface-design">Test</HoveredLink>
                      </div>

                      {/* <div className=" hover:scale-105 transition duration-300 hover:drop-shadow-[0_1.5px_1.5px_rgba(255,22,22,1)]">
                      <HoveredLink href="/seo">Контрол на Гризачи</HoveredLink>
                      </div>

                      <div className=" hover:scale-105 transition duration-300 hover:drop-shadow-[0_1.5px_1.5px_rgba(255,22,22,1)]">
                      <HoveredLink href="/branding">Контрол на Мравки</HoveredLink>
                      </div> */}
                    </div>
                  </MenuItem>
                </HoverBorderGradient>
                </div>
                </Link>

                {session && ( // Check if session exists
                  <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-1 sm:space-x-2 
                 px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-3
                 text-sm sm:text-sm md:text-base lg:text-lg transition-all duration-300"
                >
            <Link href={`/dashboard`} className="text-lg">
              <button className="">
                📑 Оценки
              </button>
            </Link>
            </HoverBorderGradient>
          )}

                <ThemeSwitch />
              </div>
            )}
          </div>
        </Menu>
      </div>
    </div>
  );
}