import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const MMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = async (option: string) => {
        console.log(`Selected option: ${option}`);
        setIsOpen(false);

        // Generate a unique token
        const token = uuidv4();
        const res = await fetch('/api/auth/generate-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: option, token }),
        });

        if (res.ok) {
            const link = `${window.location.origin}/register?token=${token}`;
            alert(`Registration link generated: ${link}`);
        } else {
            console.error('Failed to generate link');
        }
    };

    return (
        <nav className="p-4">
            <ul className="flex space-x-4">
                <li>
                    <Link href="/" className="text-blue-600 hover:text-blue-800">
                        Roles
                    </Link>
                </li>
                <li>
                    <Link href="/" className="text-blue-600 hover:text-blue-800">
                        Settings
                    </Link>
                </li>
                <li className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Generate Registration
                    </button>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                            >
                                {['student', 'parent', 'teacher'].map((option) => (
                                    <motion.li
                                        key={option}
                                        whileHover={{ backgroundColor: '#f3f4f6' }}
                                        className="cursor-pointer"
                                    >
                                        <button
                                            onClick={() => handleOptionClick(option)}
                                            className=" text-center block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {option}
                                        </button>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </li>
            </ul>
        </nav>
    );
};

export default MMenu;