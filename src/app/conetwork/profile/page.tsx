"use client";
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { RedirectToSignIn, SignedIn, SignedOut, UserButton, useUser, useAuth } from '@clerk/nextjs';
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Logo, LogoIcon } from '../page';
import { cn } from '@/lib/utils';
import axios from 'axios';

const Profile = () => {
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
    ];

    const [open, setOpen] = useState(false);

    return (
        <>
            <SignedIn>
                <div
                    className={cn(
                        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                        "h-screen" // Usando `h-screen` para ocupar a altura inteira da tela
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
                                    {/* Link de Logout */}
                                    <button
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.href = "/"; // Redirecionar para a página inicial após logout
                                        }}
                                        className="flex items-center p-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full text-left"
                                    >
                                        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                                        <span className="ml-3">Logout</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <UserButton />
                            </div>
                        </SidebarBody>
                    </Sidebar>
                    <ProfileSection />
                </div>
            </SignedIn>
            <SignedOut>
                {/* Redireciona para a página de login se o utilizador não estiver autenticado */}
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
};

export default Profile;

const ProfileSection = () => {
    const { user } = useUser(); // Clerk user object
    const [knowledges, setKnowledges] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const { getToken } = useAuth();

    // Set Axios defaults
    useEffect(() => {
        const setAxiosDefaults = async () => {
            const token = await getToken();
            axios.defaults.baseURL = 'http://localhost:8000'; // Ensure the baseURL points to your Django server
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        };
        setAxiosDefaults();
    }, [getToken]);

    // Fetch knowledges when component mounts
    useEffect(() => {
        const fetchKnowledges = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/knowledges/');
                if (response.data) {
                    setKnowledges(response.data);
                }
            } catch (error) {
                console.error("Erro ao obter conhecimentos:", error);
            }
        };

        if (user?.id) {
            fetchKnowledges();
        }
    }, [user]);

    // Function to add a new knowledge
    const handleAddKnowledge = async () => {
        if (input.trim() === "") return;

        const knowledgeToAdd = input.trim();
        setInput("");

        try {
            await axios.put('http://localhost:8000/api/knowledges/', {
                knowledge: knowledgeToAdd,
            });
            // Update local state
            setKnowledges([...knowledges, knowledgeToAdd]);
        } catch (error) {
            console.error("Erro ao adicionar conhecimento:", error);
        }
    };

    // Function to remove a knowledge
    const handleRemoveKnowledge = async (knowledgeToRemove: string) => {
        try {
            await axios.delete('http://localhost:8000/api/knowledges/', {
                data: { knowledge: knowledgeToRemove },
            });
            // Update local state
            setKnowledges(knowledges.filter((k) => k !== knowledgeToRemove));
        } catch (error) {
            console.error("Erro ao remover conhecimento:", error);
        }
    };

    return (
        <div className="flex flex-1">
            <div className="p-6 md:p-12 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full h-full relative">
                {/* Título da Página */}
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Edit Profile</h1>

                {/* Seção de Conhecimentos */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Knowledges</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Add a new knowledge"
                                className="flex-1 p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-neutral-300 dark:border-neutral-600"
                            />
                            <button
                                onClick={handleAddKnowledge}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-md"
                            >
                                Add
                            </button>
                        </div>

                        {/* Lista de Conhecimentos */}
                        <ul className="mt-4">
                            {knowledges && knowledges.length > 0 ? (
                                knowledges.map((knowledge, idx) => (
                                    <li key={idx} className="flex justify-between items-center p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700">
                                        <span>{knowledge}</span>
                                        {/* Botão para Remover Conhecimento */}
                                        <button
                                            onClick={() => handleRemoveKnowledge(knowledge)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p>No knowledges added yet.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
