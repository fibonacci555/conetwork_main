"use client"
import React from 'react'
import { SignedIn, SignedOut, RedirectToSignIn, SignOutButton, UserButton } from '@clerk/clerk-react';
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import IconCloud from '@/components/ui/icon-cloud';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';


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
    "figma", "figma", "figma", "figma", "figma", "python", "c++", "c", "notion"
];


export function Conetwork() {
    const links = [
        {
            label: "Dashboard",
            href: "/conetwork",
            icon: (
                <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Knowledges",
            href: "/conetwork/profile",
            icon: (
                <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Settings",
            href: "/conetwork/settings",
            icon: (
                <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Logout",
            href: "#",
            icon: (
                <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
    ];
    const [open, setOpen] = useState(false);
    return (
        <>
            <SignedIn>
                <div
                    className={cn(
                        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
                    )}
                >
                    <Sidebar open={open} setOpen={setOpen}>
                        <SidebarBody className="justify-between gap-10">
                            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                                {open ? <Logo /> : <LogoIcon />}
                                <div className="mt-8 flex flex-col gap-2">
                                    {links.map((link, idx) => (
                                        <SidebarLink key={idx} link={link} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <UserButton />
                            </div>
                        </SidebarBody>
                    </Sidebar>
                    <Dashboard />
                </div>
            </SignedIn>
            <SignedOut>
                {/* Redireciona para a página de login se o utilizador não estiver autenticado */}
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}

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

// Dummy dashboard component with content
const Dashboard = () => {
    return (

        <div className="flex flex-1">
            <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full relative">

                {/* Campo de Pesquisa Estilo Spotlight */}
                <div className="absolute top-[55px] left-1/2 transform -translate-x-1/2 w-full max-w-xl z-20 justify-center">
                    <p className='text-sm justify-center ml-10 text-gray-400 mt-[-8px] mb-[5px]'>Describe what you need and our AI will find the best solution for you.</p>
                    <PlaceholdersAndVanishInput
                        placeholders={placeholders}
                        onChange={handleChange}
                        onSubmit={onSubmit}
                        
                    />
                </div>


                {/* Componente com IconCloud */}
                <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background px-20 pb-20 pt-8">
                    <IconCloud iconSlugs={slugs} />
                </div>
            </div>
        </div>

    );
};