"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Cloud } from "react-icon-cloud";
// Import Avatar components from the correct library
import * as Avatar from "@radix-ui/react-avatar"; // Ensure you're using Radix UI for Avatar components
import { BorderAllIcon } from "@radix-ui/react-icons";

const cloudOptions = {
  reverse: true,
  depth: 1,
  wheelZoom: false,
  imageScale: 1,
  activeCursor: "pointer",
  tooltip: "native",
  initial: [0.1, -0.1],
  clickToFront: 500,
  tooltipDelay: 0,
  outlineColour: "#0000",
  maxSpeed: 0.02,
  minSpeed: 0.005,
  weight: true,
  imageRadius: "50%",
  shadow: "#000"
};

export type IconCloudProps = {
  connections: any[];
};

export default function IconCloud({ connections }: IconCloudProps) {
  const [selectedConnection, setSelectedConnection] = useState<any | null>(
    null
  );

  const handleIconClick = useCallback((connection: any) => {
    setSelectedConnection(connection);
  }, []);

  const closeNotification = () => {
    setSelectedConnection(null);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          
        }}
      >
        <CloudContainer
          connections={connections}
          onIconClick={handleIconClick}
        />
      </div>
      {selectedConnection && (
        <NotificationCard
          connection={selectedConnection}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}

const CloudContainer = React.memo(function CloudContainer({
  connections,
  onIconClick,
}) {
  const icons = connections.map((connection) =>
    renderCustomIcon(connection, onIconClick)
  );

  return (
    // @ts-ignore
    <Cloud
      options={cloudOptions}
      containerProps={{
        style: {
          width: "100%",
          height: "100%",
          borderRadius: "50%",
        },
      }}
    >
      {icons}
    </Cloud>
  );
});

export const renderCustomIcon = (
  connection,
  onIconClick
) => {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(connection.profile_photo, {
          mode: 'cors',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImgSrc(url);
      } catch (error) {
        console.error('Error fetching image:', error);
        setImgSrc('/default.png'); // Fallback image
      }
    };

    if (connection.profile_photo) {
      fetchImage();
    } else {
      setImgSrc('/default.png');
    }
  }, [connection.profile_photo]);

  return (
    <a
      href="#"
      title={`${connection.first_name} ${connection.last_name}`}
      onClick={(e) => {
        e.preventDefault();
        onIconClick(connection);
      }}
      className="cursor-pointer inline-block bg-red shadow-sm"
    >
      
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={`${connection.first_name} ${connection.last_name}`}
            width={150}
            height={150}
            
            
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600 font-bold">
            {connection.first_name.charAt(0)}
            {connection.last_name.charAt(0)}
          </div>
        )}
      
    </a>
  );
};

const NotificationCard = ({ connection, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => {
      setVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, [connection]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;

  return (
    <div
      style={{
        position: isMobile ? "fixed" : "absolute",
        bottom: isMobile ? "0" : "100px",
        left: isMobile ? "0" : "20px",
        right: isMobile ? "0" : "unset",
        top: isMobile ? "unset" : "100px",
        width: isMobile ? "100%" : "300px",
        maxWidth: isMobile ? "400px" : "unset",
        padding: "20px",
        backgroundColor: "#fff",
        color: "#000",
        borderRadius: isMobile ? "16px 16px 0 0" : "8px",
        boxShadow: isMobile
          ? "0 -4px 12px rgba(0,0,0,0.1)"
          : "0 4px 6px rgba(0,0,0,0.1)",
        transform: visible
          ? "translateY(0)"
          : isMobile
          ? "translateY(100%)"
          : "translateY(-350px)",
        transition: "transform 0.3s ease-in-out",
        zIndex: 100,
        margin: isMobile ? "0 auto" : "0",
        opacity: 1,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div className="flex justify-center mb-4">
          <Avatar.Root className="w-16 h-16 border-2 border-black rounded-full overflow-hidden">
            <Avatar.Image
              src={connection.profile_photo || "/default.png"}
              alt={`${connection.first_name} ${connection.last_name}`}
              className="object-cover w-full h-full"
            />
            <Avatar.Fallback className="flex items-center justify-center bg-gray-200 text-gray-600 font-bold">
              {connection.first_name.charAt(0)}
              {connection.last_name.charAt(0)}
            </Avatar.Fallback>
          </Avatar.Root>
        </div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#6366f1",
          }}
        >
          {connection.first_name} {connection.last_name}
        </h2>
        <p style={{ color: "#6b7280" }}>{connection.knowledges}</p>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Additional buttons or links */}
          <button
            onClick={handleClose}
            style={{
              marginTop: "16px",
              padding: "10px 20px",
              backgroundColor: "#ef4444",
              color: "white",
              borderRadius: "9999px",
              textDecoration: "none",
              border: "none",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
