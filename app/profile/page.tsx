"use client";
import React, { useEffect, useState } from 'react';
import { LoginWithNostr } from '../components/LoginWithNostr';
import NDK, { NDKFilter } from "@nostr-dev-kit/ndk";
import { nip19 } from 'nostr-tools';
import Image from 'next/image';

interface UserProfile {
  name: string;
  pubkey: string;
  picture: string;
  banner: string;
  nip05: string;
  about: string;
}

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const npub = localStorage.getItem("nostrPublicKey");
      if (!npub) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);

      try {
        const ndk = new NDK({
          explicitRelayUrls: [
            'wss://relay.damus.io',
            'wss://relay.nostr.band',
            'wss://nos.lol',
            'wss://relay.current.fyi',
          ],
        });
        await ndk.connect();

        const hexPubkey = nip19.decode(npub).data as string;

        const filter: NDKFilter = { kinds: [0], authors: [hexPubkey] };
        const events = await ndk.fetchEvents(filter);

        let profileEvent;
        for await (const event of events) {
          profileEvent = event;
          break; // We only need the first event
        }

        if (profileEvent) {
          const profileContent = JSON.parse(profileEvent.content);
          console.log("Profile content:", profileContent);
          setUserProfile({
            name: profileContent.name || profileContent.displayName || "Unknown",
            pubkey: npub,
            picture: profileContent.picture || '',
            banner: profileContent.banner || '',
            nip05: profileContent.nip05 || '',
            about: profileContent.about || '',
          });
        } else {
          setUserProfile({
            name: "Unknown",
            pubkey: npub,
            picture: '',
            banner: '',
            nip05: '',
            about: '',
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile({
          name: "Unknown",
          pubkey: npub,
          picture: '',
          banner: '',
          nip05: '',
          about: '',
        });
      }
    };

    fetchUserProfile();
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Welcome to Your NOSTR Profile</h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">Please log in to view your profile</p>
        <LoginWithNostr />
      </div>
    );
  }

  return (
    <div className="min-h-screen  mt-32">
      {userProfile && (
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {userProfile.banner ? (
              <div className="w-full h-64 relative">
                <Image src={userProfile.banner} alt="Profile banner" layout="fill" objectFit="cover" />
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            )}
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-0">
                {userProfile.picture ? (
                  <Image 
                    src={userProfile.picture} 
                    alt="Profile picture" 
                    width={128} 
                    height={128} 
                    className="rounded-full border-4 border-white dark:border-gray-800"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-4xl text-gray-600 dark:text-gray-300">{userProfile.name[0]}</span>
                  </div>
                )}
              </div>
              <div className="text-center mt-16">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{userProfile.name}</h1>
                {userProfile.nip05 && (
                  <p className="mt-2 text-xl text-blue-500 dark:text-blue-400">{userProfile.nip05}</p>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 break-all">{userProfile.pubkey}</p>
                {userProfile.about && (
                  <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500 dark:text-gray-300">{userProfile.about}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;