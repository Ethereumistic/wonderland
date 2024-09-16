"use client";
import React, { useState, useEffect } from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import NDK from "@nostr-dev-kit/ndk";
import { useRouter } from "next/navigation";
import { nip19 } from 'nostr-tools';
import { useAuthStore } from '@/store/authStore';

export function LoginWithNostr() {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, login, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const npub = localStorage.getItem("nostrPublicKey");
    if (npub) {
      login();
    }
  }, [login]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      if (typeof window.nostr === 'undefined') {
        throw new Error("Nostr extension not found");
      }

      const publicKey = await window.nostr.getPublicKey();
      console.log("Public Key (hex):", publicKey);

      // Convert hex public key to npub format
      const npub = nip19.npubEncode(publicKey);
      console.log("Public Key (npub):", npub);

      const ndk = new NDK();
      await ndk.connect();

      // Store the npub public key
      localStorage.setItem("nostrPublicKey", npub);
      login();
      
      router.push("/profile");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("nostrPublicKey");
    logout();
    router.push("/");
  };

  return (
    <div className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        onClick={isLoggedIn ? handleLogout : handleLogin}
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-1 sm:space-x-2 
                   px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-3
                   text-sm sm:text-sm md:text-base lg:text-lg transition-all duration-300"
      >
        <AceternityLogo />
        <span className="font-russo">
          {isLoading ? "Processing..." : (isLoggedIn ? "Logout" : "Login with Nostr")}
        </span>
      </HoverBorderGradient>
    </div>
  );
}

const AceternityLogo = () => {
  return (
    <div className="text-sm sm:text-base md:text-lg lg:text-xl">🐔</div>
  );
};