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

const AddConnects = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newConnection, setNewConnection] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        knowledges: "",
        photo: null as File | null
    })
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAddConnection = async () => {
        if (newConnection.firstName.trim() === "") {
            alert("First Name is required.");
            return;
        }
    
        try {
            const token = await getToken();
            await axios.post(
                'http://localhost:8000/api/add-manual-connect/',
                {
                    first_name: newConnection.firstName,
                    last_name: newConnection.lastName,
                    phone_number: newConnection.phoneNumber,
                    knowledges: newConnection.knowledges, // Comma-separated list of knowledges
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            // Reset form and close dialog
            setNewConnection({
                firstName: "",
                lastName: "",
                phoneNumber: "",
                knowledges: "",
                photo: null,
            });
            setIsDialogOpen(false);
    
            // Optionally, refetch connections or update state with the new connection
            console.log("New manual connection added successfully");
        } catch (error) {
            console.error("Erro ao adicionar a conexão manual:", error);
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
                                    placeholder="Search for friends..."
                                    className="w-full rounded-lg border border-input bg-background pl-12 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </form>
                        </div>
                        <div className="grid gap-4">
                            <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-medium">John Doe</div>
                                    <div className="text-sm text-muted-foreground">@johndoe</div>
                                </div>
                                <Button variant="outline">Add</Button>
                            </div>
                            <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                    <AvatarFallback>JA</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-medium">Jane Appleseed</div>
                                    <div className="text-sm text-muted-foreground">@janeappleseed</div>
                                </div>
                                <Button variant="outline">Add</Button>
                            </div>
                            <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                    <AvatarFallback>BO</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-medium">Bob Odenkirk</div>
                                    <div className="text-sm text-muted-foreground">@bobodenkirk</div>
                                </div>
                                <Button variant="outline">Add</Button>
                            </div>
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
                                            onChange={(e) => setNewConnection({...newConnection, firstName: e.target.value})}
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
                                            onChange={(e) => setNewConnection({...newConnection, lastName: e.target.value})}
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
                                            onChange={(e) => setNewConnection({...newConnection, phoneNumber: e.target.value})}
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
                                            onChange={(e) => setNewConnection({...newConnection, knowledges: e.target.value})}
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
                            <p className="text-muted-foreground">View and respond to follow requests.</p>
                        </div>
                        <div className="grid gap-4">
                            <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                    <AvatarFallback>SA</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-medium">Sarah Anderson</div>
                                    <div className="text-sm text-muted-foreground">Sent you a follow request</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline">Accept</Button>
                                    <Button variant="ghost">Decline</Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                    <AvatarFallback>MI</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-medium">Michael Irvine</div>
                                    <div className="text-sm text-muted-foreground">Sent you a follow request</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline">Accept</Button>
                                    <Button variant="ghost">Decline</Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                    <AvatarFallback>EL</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-medium">Emily Lau</div>
                                    <div className="text-sm text-muted-foreground">Sent you a follow request</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline">Accept</Button>
                                    <Button variant="ghost">Decline</Button>
                                </div>
                            </div>
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