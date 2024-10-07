"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  Cloud,
  fetchSimpleIcons,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud";

// Defina as opções do cloud fora do componente para evitar recriações
const cloudOptions = {
  reverse: true,
  depth: 1,
  wheelZoom: false,
  imageScale: 2,
  activeCursor: "pointer",
  tooltip: "native",
  initial: [0.1, -0.1],
  clickToFront: 500,
  tooltipDelay: 0,
  outlineColour: "#0000",
  maxSpeed: 0.015,
  minSpeed: 0.01,
};

export type DynamicCloudProps = {
  iconSlugs: string[];
};

export default function IconCloud({ iconSlugs }: DynamicCloudProps) {
  const [selectedIconSlug, setSelectedIconSlug] = useState<string | null>(null);

  // Memoize the onIconClick function to prevent unnecessary re-renders
  const handleIconClick = useCallback((slug: string) => {
    setSelectedIconSlug(slug);
  }, []);

  // Function to close the notification
  const closeNotification = () => {
    setSelectedIconSlug(null);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Centraliza o icon cloud */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CloudContainer iconSlugs={iconSlugs} onIconClick={handleIconClick} />
      </div>
      {/* Exibe o card de notificação no topo direito */}
      {selectedIconSlug && (
        <NotificationCard slug={selectedIconSlug} onClose={closeNotification} />
      )}
    </div>
  );
}

// Componente memoizado para evitar re-renders desnecessários
const CloudContainer = React.memo(function CloudContainer({
  iconSlugs,
  onIconClick,
}) {
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const iconsRef = useRef<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchSimpleIcons({ slugs: iconSlugs }).then((iconsData) => {
      if (isMounted) {
        setData(iconsData);

        iconsRef.current = Object.values(iconsData.simpleIcons).map((icon) =>
          renderCustomIcon(icon, theme || "light", icon.slug, onIconClick)
        );
      }
    });

    return () => {
      isMounted = false;
    };
  }, [iconSlugs, theme, onIconClick]);

  return (
    // @ts-ignore
    <Cloud
      options={cloudOptions}
      containerProps={{
        style: {
          width: "100%",
          height: "100%",
        },
      }}
    >
      {iconsRef.current}
    </Cloud>
  );
});

export const renderCustomIcon = (
  icon: SimpleIcon,
  theme: string,
  slug: string,
  onIconClick: (slug: string) => void
) => {
  const bgHex = theme === "light" ? "#f3f2ef" : "#080510";
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff";
  const minContrastRatio = theme === "dark" ? 2 : 1.2;

  const iconElement = renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: "#",
      title: slug,
      onClick: (e: any) => {
        e.preventDefault();
        onIconClick(slug);
      },
      style: { cursor: "pointer" },
    },
  });

  return iconElement;
};

// Novo componente NotificationCard
const NotificationCard = ({ slug, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reinicia a animação toda vez que o slug muda
    setVisible(false);
    const timer = setTimeout(() => {
      setVisible(true);
    }, 10); // Pequeno delay para reiniciar a animação

    return () => clearTimeout(timer);
  }, [slug]);

  const handleClose = () => {
    // Anima a saída
    setVisible(false);
    // Remove o card após a animação de saída
    setTimeout(() => {
      onClose();
    }, 300); // Tempo deve corresponder à duração da animação
  };

  return (



    <div
      style={{
        position: "absolute",
        top: "100px",
        right: "20px",
        width: "300px",
        padding: "20px",
        backgroundColor: "#fff",
        color: "#000",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        
        transform: visible ? "translateY(0)" : "translateY(-350px)",
        opacity: 1,
        transition: "all 0.2s ease-in-out",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <figure
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "64px",
            height: "64px",
            backgroundColor: "#6366f1",
            borderRadius: "50%",
            margin: "0 auto 16px auto",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"

            viewBox="0 0 16 16"
            style={{ color: "#fff" }}
          >
            <path
              d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
            ></path>
          </svg>
        </figure>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#6366f1" }}>
          {slug}
        </h2>
        <p style={{ color: "#6b7280" }}>Web Developer</p>
        <div style={{ marginTop: "16px" }}>
          <a
            href="#"
            style={{
              padding: "8px 16px",
              backgroundColor: "#6366f1",
              color: "white",
              borderRadius: "9999px",
              textDecoration: "none",
              marginRight: "8px",
            }}
          >
            Contact
          </a>
          <a
            href="#"
            style={{
              padding: "8px 16px",
              backgroundColor: "#d1d5db",
              color: "#000",
              borderRadius: "9999px",
              textDecoration: "none",
            }}
          >
            Portfolio
          </a>
          <button
            onClick={handleClose}
            style={{
              marginTop: "20px",
              padding: "8px 16px",
              backgroundColor: "red",
              color: "white",
             width: "75%",
              borderRadius: "9999px",
              textDecoration: "none",
            }}
          >
            Fechar
          </button>
        </div>
      </div>



    </div>

  );
};
