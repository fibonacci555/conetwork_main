"use client"
import React, { useState, useEffect } from 'react'
import { SignedIn, SignedOut, RedirectToSignIn, SignOutButton, UserButton } from '@clerk/clerk-react';
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconPlus,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import IconCloud from '@/components/ui/icon-cloud';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import NavBar from '@/components/NavBar';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

const slugs = [
    "typescript",
    "javascript",
    "dart",
    "java",
    "react",
    "flutter",
    "android",
    "html5",
    "css3",
    "nodedotjs",
    "express",
    "nextdotjs",
    "prisma",
    "amazonaws",
    "postgresql",
    "firebase",
    "nginx",
    "vercel",
    "testinglibrary",
    "jest",
    "cypress",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "sonarqube",
    "figma",
    "cypress",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "sonarqube",
    "figma",
    "figma", "figma", "figma", "figma", "figma", "python", "c++", "c", "notion","sql","excel","word","powerbi","sqlserver","mysql","oracle","postgresql","mongodb","firebase","redis","docker","git","jira","github","gitlab","visualstudiocode","androidstudio","sonarqube","figma","figma","figma","figma","figma","python","c++","c","notion"
];

const Conetwork = () => {
    const [connectionCount, setConnectionCount] = useState<number | null>(null);
    const { getToken, userId } = useAuth();

    useEffect(() => {
        const fetchConnectionCount = async () => {
            if (userId) {
                try {
                    const token = await getToken();
                    if (!token) {
                        console.error("Token not found");
                        return;
                    }
                    
                    const response = await axios.get(`http://localhost:8000/api/users/${userId}/connections-count/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data) {
                        setConnectionCount(response.data.connections_count);
                    }
                } catch (error) {
                    console.error("Error fetching connection count:", error);
                }
            }
        };

        fetchConnectionCount();
    }, [userId, getToken]);

    return (
        <>
            <NavBar>
                <div className="flex flex-1">
                    <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full relative">
                        {/* Campo de Pesquisa Estilo Spotlight */}
                        <div className="absolute top-[55px] left-1/2 transform -translate-x-1/2 w-full max-w-xl z-20 justify-center px-10">
                            <p className='text-sm justify-center ml-10 text-gray-400 mt-[-8px] mb-[5px]'>
                                Describe what you need and our AI will find the best solution for you.
                            </p>
                            <PlaceholdersAndVanishInput
                                placeholders={placeholders}
                                onChange={handleChange}
                                onSubmit={onSubmit}
                            />
                        </div>
                        {/* Componente com IconCloud */}
                        <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background px-20 pb-20 pt-8">
                            <IconCloud iconSlugs={slugs} />
                            {/* Displaying the Connection Count */}
                            {connectionCount !== null && (
                                <div className="absolute bottom-4 right-4 p-2 rounded-lg bg-indigo-600 text-white">
                                    Connections: {connectionCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </NavBar>
        </>
    );
};

const placeholders = [
    "I want to make a website...",
    "I need an accounting...",
    "I need to know the best way to buy a house...",
    "I want to buy the best laptop...",
];

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
};
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
};

export default Conetwork;
export const Logo = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                Conetwork
            </motion.span>
        </Link>
    );
};
export const LogoIcon = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};