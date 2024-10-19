"use client"

import React, { useState, useRef, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Upload, X } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/nextjs'

const AddConnects = () => {
    const { getToken, userId } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newConnection, setNewConnection] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        knowledges: "",
        profile_photo: null as File | null
    })
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);



    // Função para realizar a busca
    const performSearch = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            console.log(token)
            const response = await axios.get('http://localhost:8000/api/accounts/search-users/', {
                params: { query: searchInput, user_id: userId },
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Erro ao realizar a busca:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce da busca
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchInput.trim() !== '') {
                performSearch();
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchInput]);

    const handleAddConnection = async () => {
        // Validações existentes
        if (newConnection.firstName.trim() === "") {
            alert("First Name is required.");
            return;
        } else if (newConnection.lastName.trim() === "") {
            alert("Last Name is required.");
            return;
        } else if (newConnection.phoneNumber.trim() === "") {
            alert("Phone Number is required.");
            return;
        } else if (newConnection.knowledges.trim() === "") {
            alert("At least one knowledge is required.");
            return;
        }

        try {
            const token = await getToken();

            // Cria o objeto FormData
            const formData = new FormData();
            formData.append('user_id', userId);
            formData.append('first_name', newConnection.firstName);
            formData.append('last_name', newConnection.lastName);
            formData.append('phone_number', newConnection.phoneNumber);
            formData.append('knowledges', newConnection.knowledges); // Lista separada por vírgulas

            if (newConnection.photo) {
                formData.append('photo', newConnection.photo);
            }

            // Envia a requisição com FormData
            await axios.post(
                'http://localhost:8000/api/add-manual-connect/',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Resetar o formulário e fechar o diálogo
            setNewConnection({
                firstName: "",
                lastName: "",
                phoneNumber: "",
                knowledges: "",
                profile_photo: null,
            });
            setPhotoPreview(null);
            setIsDialogOpen(false);

            // Atualizar a lista de conexões ou refetch se necessário
            console.log("Nova conexão adicionada com sucesso");
        } catch (error) {
            console.error("Erro ao adicionar conexão:", error);
            alert("Houve um erro ao adicionar a conexão. Por favor, tente novamente.");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setNewConnection({ ...newConnection, photo: file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemovePhoto = () => {
        setNewConnection({ ...newConnection, photo: null })
        setPhotoPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleAddUser = async (targetUserId) => {
        try {
            const token = await getToken();
            await axios.post('http://localhost:8000/api/send-friend-request/', {
                from_user_id: userId,
                to_user_id: targetUserId,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            alert('Friend request sent!');
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request.');
        }
    };
    const [friendRequests, setFriendRequests] = useState([]);

    const fetchFriendRequests = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(`http://localhost:8000/api/friend-requests/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setFriendRequests(response.data);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const respondToFriendRequest = async (requestId, action) => {
        try {
            const token = await getToken();
            await axios.post(`http://localhost:8000/api/friend-request/${requestId}/`, {
                action: action,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // Atualizar a lista de pedidos após a ação
            fetchFriendRequests();
            alert(`Friend request ${action}ed.`);
        } catch (error) {
            console.error(`Error ${action}ing friend request:`, error);
            alert(`Failed to ${action} friend request.`);
        }
    };

    return (
        <NavBar>
            <div className="container min-w-[97%] px-4 py-10 md:px-6 lg:py-16 bg-white">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-16">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Add Connects</h2>
                            <p className="text-muted-foreground">Search for connects to add to your network.</p>
                        </div>
                        <div>
                            <form className="relative">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar amigos..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background pl-12 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </form>
                        </div>
                        {/* Exibir estado de carregamento */}
                        {isLoading && <p>Carregando...</p>}
                        {/* Exibir resultados da busca */}
                        <div className="grid gap-4">
                            {searchResults.map((user) => (
                                <div key={user.id} className="flex items-center gap-4 rounded-lg bg-muted p-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={user.profile_image || '/placeholder-user.jpg'} alt="User Avatar" />
                                        <AvatarFallback>
                                            {user.first_name?.[0]}
                                            {user.last_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {user.first_name} {user.last_name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                                    </div>
                                    <Button variant="outline" onClick={() => handleAddUser(user.id)}>Adicionar</Button>
                                </div>
                            ))}
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Manual Connection
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add Manual Connection</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="firstName" className="text-right">
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            value={newConnection.firstName}
                                            onChange={(e) => setNewConnection({ ...newConnection, firstName: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="lastName" className="text-right">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            value={newConnection.lastName}
                                            onChange={(e) => setNewConnection({ ...newConnection, lastName: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phoneNumber" className="text-right">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phoneNumber"
                                            value={newConnection.phoneNumber}
                                            onChange={(e) => setNewConnection({ ...newConnection, phoneNumber: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="knowledges" className="text-right">
                                            Knowledges
                                        </Label>
                                        <Textarea
                                            id="knowledges"
                                            value={newConnection.knowledges}
                                            onChange={(e) => setNewConnection({ ...newConnection, knowledges: e.target.value })}
                                            placeholder="Enter knowledges (comma-separated)"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="photo" className="text-right">
                                            Photo
                                        </Label>
                                        <div className="col-span-3">
                                            <Input
                                                id="photo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                ref={fileInputRef}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                {newConnection.photo ? 'Change Photo' : 'Upload Photo'}
                                            </Button>
                                            {photoPreview && (
                                                <div className="mt-4 relative">
                                                    <img
                                                        src={photoPreview}
                                                        alt="Photo preview"
                                                        className="w-full h-40 object-cover rounded-md"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2"
                                                        onClick={handleRemovePhoto}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={handleAddConnection}>Add Connection</Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
                            <p className="text-muted-foreground">View and respond to friend requests.</p>
                        </div>
                        <div className="grid gap-4">
                            {friendRequests.map((request) => (
                                <div key={request.id} className="flex items-center gap-4 rounded-lg bg-muted p-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={request.from_user.profile_photo || '/placeholder-user.jpg'} alt="User Avatar" />
                                        <AvatarFallback>
                                            {request.from_user.first_name?.[0]}
                                            {request.from_user.last_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {request.from_user.first_name} {request.from_user.last_name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Sent you a friend request</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => respondToFriendRequest(request.id, 'accept')}>Accept</Button>
                                        <Button variant="ghost" onClick={() => respondToFriendRequest(request.id, 'decline')}>Decline</Button>
                                    </div>
                                </div>
                            ))}
                            {friendRequests.length === 0 && <p>No new friend requests.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </NavBar>
    )
}

export default AddConnects

function SearchIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}