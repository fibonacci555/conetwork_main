"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import IconCloud from '@/components/ui/icon-cloud';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import NavBar from '@/components/NavBar';

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
    const [showConnectionsList, setShowConnectionsList] = useState(false);
    const [connectionsList, setConnectionsList] = useState<any[]>([]);
    const [editingConnectionId, setEditingConnectionId] = useState<string | null>(null);
    const [editedConnection, setEditedConnection] = useState<any>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { getToken, userId } = useAuth();
  
    const buttonRef = useRef(null);
    const connectionsListRef = useRef(null);
  
    useEffect(() => {
      const fetchConnectionCount = async () => {
        if (userId) {
          try {
            const token = await getToken();
            if (!token) {
              console.error('Token not found');
              return;
            }
  
            const response = await axios.get(
              `http://localhost:8000/api/users/connections-count/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.data) {
              setConnectionCount(response.data.connections_count);
            }
          } catch (error) {
            console.error('Error fetching connection count:', error);
          }
        }
      };
  
      fetchConnectionCount();
    }, [userId, getToken]);
  
    const handleConnectionsClick = async () => {
      setShowConnectionsList(!showConnectionsList);
      console.log(connectionsList)
  
      // Fetch connections if not already fetched
      if (connectionsList.length === 0) {
        try {
          const token = await getToken();
          if (!token) {
            console.error('Token not found');
            return;
          }
  
          const response = await axios.get(
            `http://localhost:8000/api/users/connections/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response.data) {
            setConnectionsList(response.data);
            
          }
        } catch (error) {
          console.error('Error fetching connections:', error);
        }
      }
    };
  
    // Function to handle deleting a connection
    const handleDeleteConnection = async (connectionId: string) => {
      try {
        const token = await getToken();
        if (!token) {
          console.error('Token not found');
          return;
        }
  
        await axios.delete(
          `http://localhost:8000/api/users/connections/${userId}/${connectionId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Remove the connection from the list
        setConnectionsList(connectionsList.filter((conn) => conn.user_id !== connectionId));
        // Update the connection count
        setConnectionCount(connectionCount! - 1);
      } catch (error) {
        console.error('Error deleting connection:', error);
      }
    };
  
    // Function to handle editing a connection
    const handleEditConnection = (connection: any) => {
      setEditingConnectionId(connection.user_id);
      setEditedConnection({ ...connection });
      setIsModalOpen(true);
    };
  
    // Function to handle changes in the edited connection
    const handleConnectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedConnection({
        ...editedConnection,
        [e.target.name]: e.target.value,
      });
    };
  
    // Function to save the edited connection
    const handleSaveConnection = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error('Token not found');
          return;
        }
  
        await axios.put(
          `http://localhost:8000/api/users/connections/${userId}/${editingConnectionId}/`,
          editedConnection,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Update the connections list
        setConnectionsList(
          connectionsList.map((conn) =>
            conn.user_id === editingConnectionId ? editedConnection : conn
          )
        );
  
        setIsModalOpen(false);
        setEditingConnectionId(null);
        setEditedConnection({});
      } catch (error) {
        console.error('Error updating connection:', error);
      }
    };
  
    // Function to close the modal
    const closeModal = () => {
      setIsModalOpen(false);
      setEditingConnectionId(null);
      setEditedConnection({});
    };
  
    const placeholders = [
      'I want to make a website...',
      'I need an accounting...',
      'I need to know the best way to buy a house...',
      'I want to buy the best laptop...',
    ];
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
    };
  
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log('submitted');
    };
  
    return (
      <>
        <NavBar>
          <div className="flex flex-1">
            <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full relative">
              {/* Campo de Pesquisa Estilo Spotlight */}
              <div className="absolute top-[55px] left-1/2 transform -translate-x-1/2 w-full max-w-xl z-20 justify-center px-10">
                <p className="text-sm justify-center ml-10 text-gray-400 mt-[-8px] mb-[5px]">
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
                  <>
                    <Button
                      ref={buttonRef}
                      className="absolute bottom-4 right-4 p-2 rounded-lg bg-indigo-600 text-white"
                      onClick={handleConnectionsClick}
                    >
                      Connections: {connectionCount}
                    </Button>
                    <AnimatePresence>
                      {showConnectionsList && (
                        <motion.div
                          ref={connectionsListRef}
                          key="connections-list"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute bottom-16 right-4 bg-white dark:bg-neutral-800 shadow-lg p-4 rounded-lg max-h-60 overflow-y-auto"
                        >
                          {connectionsList && connectionsList.length > 0 ? (
                            <ul>
                              {connectionsList.map((connection) => (
                                <li
                                  key={connection.user_id}
                                  className="p-2 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center"
                                >
                                  <div className="flex-1">
                                    {connection.first_name} {connection.last_name} - {connection.phone}
                                    <p className="text-xs">{connection.knowledges}</p>
                                  </div>
  
                                  <div className="flex space-x-2">
                                    {connection.user_id.startsWith('manual') && (
                                      <Button
                                        onClick={() => handleEditConnection(connection)}
                                        className="text-blue-500"
                                        variant="ghost"
                                      >
                                        <PencilEdit01Icon />
                                      </Button>
                                    )}
                                    <Button
                                      onClick={() => handleDeleteConnection(connection.user_id)}
                                      className="text-red-500"
                                      variant="ghost"
                                    >
                                      <Delete02Icon className='color-red'/>
                                    </Button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No connections found.</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </div>
          </div>
        </NavBar>
  
        {/* Modal for editing connections */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-lg font-semibold mb-4">Edit Connection</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                value={editedConnection.first_name || ''}
                onChange={handleConnectionChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={editedConnection.last_name || ''}
                onChange={handleConnectionChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Knowledges</label>
              <input
                type="text"
                name="knowledges"
                value={editedConnection.knowledges || ''}
                onChange={handleConnectionChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <p className="text-xs text-gray-500">Separate multiple knowledges with commas.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button onClick={handleSaveConnection} className="bg-indigo-600 text-white">
              Save
            </Button>
            <Button onClick={closeModal} variant="ghost">
              Cancel
            </Button>
          </div>
        </Modal>
      </>
    );
  };
  
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  };

const placeholders = [
  'I want to make a website...',
  'I need an accounting...',
  'I need to know the best way to buy a house...',
  'I want to buy the best laptop...',
];

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log('submitted');
};

const Delete02Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={15} height={15} color={"red"} fill={"none"} {...props}>
      <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

const PencilEdit01Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={15} height={15} color={"#000000"} fill={"none"} {...props}>
      <path d="M15.2141 5.98239L16.6158 4.58063C17.39 3.80646 18.6452 3.80646 19.4194 4.58063C20.1935 5.3548 20.1935 6.60998 19.4194 7.38415L18.0176 8.78591M15.2141 5.98239L6.98023 14.2163C5.93493 15.2616 5.41226 15.7842 5.05637 16.4211C4.70047 17.058 4.3424 18.5619 4 20C5.43809 19.6576 6.94199 19.2995 7.57889 18.9436C8.21579 18.5877 8.73844 18.0651 9.78375 17.0198L18.0176 8.78591M15.2141 5.98239L18.0176 8.78591" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 20H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

export default Conetwork;
