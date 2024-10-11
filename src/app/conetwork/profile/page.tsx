"use client"

import { useState, useEffect } from 'react'
import { useUser, useAuth, UserButton } from '@clerk/nextjs'
import axios from 'axios'
import { Edit2, Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import NavBar from '@/components/NavBar'

export default function Profile() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [knowledges, setKnowledges] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [profileTitle, setProfileTitle] = useState("My Profile")
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  useEffect(() => {
    const setAxiosDefaults = async () => {
      const token = await getToken()
      axios.defaults.baseURL = 'http://localhost:8000'
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setAxiosDefaults()
  }, [getToken])

  useEffect(() => {
    const fetchKnowledges = async () => {
      try {
        const response = await axios.get('/api/knowledges/')
        if (response.data) {
          setKnowledges(response.data)
        }
      } catch (error) {
        console.error("Error fetching knowledges:", error)
      }
    }

    if (user?.id) {
      fetchKnowledges()
    }
  }, [user])

  const handleAddKnowledge = async () => {
    if (input.trim() === "") return
    const knowledgeToAdd = input.trim()
    setInput("")

    try {
      await axios.put('/api/knowledges/', { knowledge: knowledgeToAdd })
      setKnowledges([...knowledges, knowledgeToAdd])
    } catch (error) {
      console.error("Error adding knowledge:", error)
    }
  }

  const handleRemoveKnowledge = async (knowledgeToRemove: string) => {
    try {
      await axios.delete('/api/knowledges/', { data: { knowledge: knowledgeToRemove } })
      setKnowledges(knowledges.filter((k) => k !== knowledgeToRemove))
    } catch (error) {
      console.error("Error removing knowledge:", error)
    }
  }

  return (
    <NavBar>
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
          
            <div className="flex items-center justify-between">
              
                <CardTitle className="text-2xl font-bold">{profileTitle}</CardTitle>
                <UserButton />
              
              
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Your Knowledges</h2>
            <p className="text-muted-foreground mb-6">
              Share the skills and knowledge you want others to recognize in you.
            </p>
            <div className="flex gap-2 mb-6">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a new knowledge"
                className="flex-1"
              />
              <Button onClick={handleAddKnowledge}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            {knowledges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {knowledges.map((knowledge, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm py-1 px-2">
                    {knowledge}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-4 w-4 p-0"
                      onClick={() => handleRemoveKnowledge(knowledge)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {knowledge}</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No knowledges added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </NavBar>
  )
}