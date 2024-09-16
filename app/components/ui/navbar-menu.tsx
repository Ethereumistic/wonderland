"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'next-i18next';

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {


  return (
    <div onMouseEnter={() => setActive(item)} className="relative ">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const LogoImage = ({
  title,
  href,
  src,
  darkSrc,
}: {
  title: string;
  href: string;
  src: string;
  darkSrc: string;
}) => {
  return (
    <Link href={href} className="block text-center ml-1 xs:ml-2 sm:ml-3 md:ml-4 lg:ml-8">
      <div className="relative inline-block translate-y-1">
        <Image
          src={src}
          width={68}
          height={68}
          alt={title}
          className="dark:hidden block rounded-md hover:rotate-[360deg] transition-all duration-700
                     w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[65px] lg:h-[65px]"
        />
        <Image
          src={darkSrc}
          width={68}
          height={68}
          alt={title}
          className="dark:block hidden rounded-md hover:rotate-[360deg] transition-all duration-700
                     w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[65px] lg:h-[65px]"
        />
      </div>
      <h1 className="block text-ddblue dark:text-white font-russo -translate-y-1
                       text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">
        Bio <span className="text-lgreen">DDD</span>
      </h1>  
    </Link>
  );
};


export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="border border-transparent 
      dark:bg-gray-800/50 dark:border-white/[0.2] bg-slate-200/50 rounded-full">
      <nav
        onMouseLeave={() => setActive(null)} // resets the state
        className="relative h-[90px] rounded-full 
        shadow-input flex items-center px-8 py-6"
      >
        <div className="flex justify-between w-full">
          {children}
        </div>
      </nav>
    </div>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
  darkSrc,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
  darkSrc: string;
}) => {

  const { t } = useTranslation();

  return (
    <Link href={href} className="flex space-x-2   hover:scale-105 transition duration-300 hover:text-lred">
              <Image
          src={src}
          width={100}
          height={50}
          alt={title}
          className="block dark:hidden"
        />
        <Image
          src={darkSrc}
          width={100}
          height={50}
          alt={title}
          className="hidden dark:block"
        />
      <div className="">
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white ">
          {t(title)}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {t(description)}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black "
    >
      {children}
    </Link>
  );
};
