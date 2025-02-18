// pages/user/dashboard.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard de Usuario</h1>
      <p>Bienvenido a tu panel de usuario. Aquí puedes gestionar tus programas y sesiones.</p>
      
      <Link href="/user/programs" passHref>
        <Button colorScheme="blue" mt={4}>Contratar Programas</Button>
      </Link>
      
      <Link href="/user/individual-therapy" passHref>
        <Button colorScheme="green" mt={4}>Terapias Individuales</Button>
      </Link>
      
      <Link href="/user/therapy-bundles" passHref>
        <Button colorScheme="purple" mt={4}>Bonos de Terapia</Button>
      </Link>
    </div>
  );
};

export default Dashboard;
