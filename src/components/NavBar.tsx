"use client";
import { Logo, LogoIcon } from '@/app/conetwork/page';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { RedirectToSignIn, SignedIn, SignedOut, UserButton, useUser, useAuth } from '@clerk/nextjs';
import { IconArrowLeft, IconBrandTabler, IconPlus, IconSettings, IconUserBolt } from '@tabler/icons-react';
import React, { Children, useState } from 'react'

export default function NavBar({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const links = [
        {
            label: "My Network",
            href: "/conetwork",
            icon: (
                <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "My Knowledges",
            href: "/conetwork/profile",
            icon: (
                <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Add Connect",
            href: "/conetwork/add-connect",
            icon: (
                <IconPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Settings",
            href: "/conetwork/settings",
            icon: (
                <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
                    {children}
                </div>
            </SignedIn>
            <SignedOut>
                {/* Redireciona para a página de login se o utilizador não estiver autenticado */}
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}