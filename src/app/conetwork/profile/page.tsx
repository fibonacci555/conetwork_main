"use client";
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { RedirectToSignIn, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
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
    const [knowledges, setKnowledges] = useState([]);
    const [input, setInput] = useState("");

    // Obter conhecimentos do utilizador ao carregar a página
    useEffect(() => {
        const fetchKnowledges = async () => {
            try {
                const response = await axios.get(`/api/knowledges/${user.id}`);
                if (response.data) {
                    setKnowledges(response.data.knowledges);
                }
            } catch (error) {
                console.error("Erro ao obter conhecimentos:", error);
            }
        };

        if (user?.id) {
            fetchKnowledges();
        }
    }, [user]);

    // Função para adicionar um novo conhecimento
    const handleAddKnowledge = async () => {
        if (input.trim() === "") return;

        const updatedKnowledges = [...knowledges, input.trim()];
        setKnowledges(updatedKnowledges);
        setInput("");

        try {
            await axios.post('/api/knowledges/update', {
                userId: user.id,
                knowledges: updatedKnowledges,
            });
        } catch (error) {
            console.error("Erro ao atualizar conhecimentos:", error);
        }
    };

    return (
        <div className="flex flex-1">
            <div className="p-6 md:p-12 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full h-full relative">
                {/* Título da Página */}
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Edit Profile</h1>

                {/* Seção de Informações Básicas do Perfil */}
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    {/* Foto de Perfil */}
                    <UserButton />
                    
                    {/* Nome e Email */}
                    <div className="flex flex-col gap-4 w-full">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Full Name</label>
                            <input
                                type="text"
                                value={user?.fullName || ""}
                                readOnly
                                className="w-full mt-1 p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-neutral-300 dark:border-neutral-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email Address</label>
                            <input
                                type="email"
                                value={user?.primaryEmailAddress?.emailAddress || ""}
                                readOnly
                                className="w-full mt-1 p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-neutral-300 dark:border-neutral-600"
                            />
                        </div>
                    </div>
                </div>

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
                            {knowledges.map((knowledge, idx) => (
                                <li key={idx} className="flex justify-between items-center p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700">
                                    <span>{knowledge}</span>
                                    {/* Botão para Remover Conhecimento */}
                                    <button
                                        onClick={() => {
                                            const updatedKnowledges = knowledges.filter((_, i) => i !== idx);
                                            setKnowledges(updatedKnowledges);
                                            // Atualiza no backend
                                            axios.post('/api/knowledges/update', {
                                                userId: user.id,
                                                knowledges: updatedKnowledges,
                                            });
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex justify-end gap-4 mt-10">
                    <button className="px-6 py-3 rounded-md bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                        Cancel
                    </button>
                    <button className="px-6 py-3 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
