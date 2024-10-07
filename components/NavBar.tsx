"use client";

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Ícone de Menu para Versão Mobile */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        {/* Logotipo da Aplicação */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Connect Network
          </Link>
        </Typography>

        {/* Links para as páginas principais */}
        <Button color="inherit" component={Link} href="/my-network" style={{ textDecoration: 'none', color: 'inherit' }}>
          My Network
        </Button>
        <Button color="inherit" component={Link} href="/add-connect/search" style={{ textDecoration: 'none', color: 'inherit' }}>
          Add Connect
        </Button>
        <Button color="inherit" component={Link} href="/requests" style={{ textDecoration: 'none', color: 'inherit' }}>
          Requests
        </Button>
        <Button color="inherit" component={Link} href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          Profile
        </Button>

        {/* Botões de Login, Registo e Logout de Clerk */}
        <nav>
          {/* Quando o utilizador não está autenticado */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button color="inherit">Login</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button color="inherit">Register</Button>
            </SignUpButton>
          </SignedOut>

          {/* Quando o utilizador está autenticado */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
