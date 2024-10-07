import Image from "next/image";
import { Box, Button, Typography } from '@mui/material';
import netImage from '/images/net.jpg';
import logo from '/images/logo.png';
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import TypingAnimation from "@/components/ui/typing-animation";
import Link from "next/link";
import { OrbitingCirclesDemo } from "@/components/Rotating";

export default function Home() {
  return (
    <>
    <nav className="height-full flex justify-center items-center absolute top-5 left-0 right-0">
      <Image src={logo} alt="Logo" width={200} height={200} />
    </nav>

    <Box
      sx={{
        height: '80vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
        borderRadius: '10vh',
        margin: '10vh',
      }}
    >
      {/* Imagem grande como fundo usando next/image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
        }}
      >
        <Image
          src={netImage}
          alt="Background Image"
          layout="fill" // Faz a imagem preencher todo o espaço
          objectFit="cover" // Ajusta a imagem para cobrir toda a área mantendo a proporção
          quality={100} // Ajusta a qualidade da imagem se necessário
        />
      </Box>

      {/* Overlay escuro sobre a imagem */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Deixa a camada mais escura com opacidade
          zIndex: -1,
        }}
      />

      {/* Título em cima da imagem */}
      <h1 className="text-white text-center text-6xl font-bold flex items-center justify-center">
        <span className="flex items-baseline">
          <span>Make your connections&nbsp;</span>
          <span className="text-6xl font-bold text-white">
            <TypingAnimation text="truly count." className="text-6xl font-bold text-[#FFD700] "/>
          </span>
        </span>
      </h1>

      <p className="text-white text-center mt-7 text-m font-bold">Organize your connections with ease and benefit from the power of the networking.</p>

      {/* Botões abaixo do título */}
      <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
        <SignInButton mode="modal">
          <button className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-white text-white rounded-lg font-medium">
            Login
          </button>
        </SignInButton>

        {/* Botão para Criar Conta */}
        <SignUpButton mode="modal" >
          <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-white bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors">
            Create Account  >
          </button>
        </SignUpButton>




      </Box>
    </Box>
    
    </>
  );
}
