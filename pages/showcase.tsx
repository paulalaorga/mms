import { Box, VStack, Heading, Divider } from "@chakra-ui/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { useState } from "react";

export default function ShowcasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box maxW="container.md" mx="auto" py={10}>
      <Heading size="xl" textAlign="center" mb={6}>
        UI Components Showcase
      </Heading>
      
      <VStack spacing={6} align="stretch">
        <Divider />
        
        <Heading size="md">Botones</Heading>
        <Button variant="primary">Botón Primario</Button>
        <Button variant="secondary">Botón Secundario</Button>
        <Button variant="outline">Botón Outline</Button>
        <Button variant="primary" isLoading>Botón Cargando</Button>
        
        <Divider />
        
        <Heading size="md">Inputs</Heading>
        <Input label="Nombre" placeholder="Ingresa tu nombre" />
        <Input label="Email" placeholder="Ingresa tu email" error="Email inválido" />
        
        <Divider />
        
        <Heading size="md">Badges</Heading>
        <Badge text="Nuevo" variant="success" />
        <Badge text="En Proceso" variant="warning" />
        <Badge text="Error" variant="error" />
        
        <Divider />
        
        <Heading size="md">Alerts</Heading>
        <Alert status="success" title="Operación exitosa" />
        <Alert status="error" title="Ocurrió un error" description="Detalles del error aquí" />
        <Alert status="warning" title="Advertencia" />
        
        <Divider />
        
        <Heading size="md">Card</Heading>
        <Card title="Título de la Tarjeta" description="Este es el contenido de la tarjeta." />
        
        <Divider />
        
        <Heading size="md">Modal</Heading>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>Abrir Modal</Button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Este es un Modal">
          <p>Contenido del modal aquí.</p>
        </Modal>
      </VStack>
    </Box>
  );
}
