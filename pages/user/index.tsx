"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import UserLayout from "./layout";

interface Product {
  id: string;
  name: string;
  price: number;
  status: string;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/user/products");
        if (!res.ok) throw new Error("No se pudieron cargar los productos");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (status === "loading") {
    return <Spinner size="xl" />;
  }

  return (
    <Container centerContent py={10}>
      <VStack spacing={6} align="center">
        <Heading size="lg">Bienvenido, {session?.user?.name || "Usuario"} 🎉</Heading>
        <Text fontSize="lg">Este es tu panel de usuario</Text>

        <Heading size="md" mt={6}>Tus productos comprados</Heading>

        {loading && <Spinner size="lg" />}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {!loading && !error && products.length === 0 && (
          <Text>No tienes productos comprados aún.</Text>
        )}

        {!loading && !error && (
          <SimpleGrid columns={[1, 2]} spacing={4} width="100%">
            {products.map((product) => (
              <Card key={product.id} width="100%" borderWidth="1px" borderRadius="lg">
                <CardBody>
                  <Heading size="md">{product.name}</Heading>
                  <Text>Precio: ${product.price}</Text>
                  <Text>Estado: {product.status}</Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

      </VStack>
    </Container>
  );
}

UserDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <UserLayout>{page}</UserLayout>;
};