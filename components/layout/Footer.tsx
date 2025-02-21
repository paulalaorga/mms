import {
  Container,
  Flex,
  Link,
  Heading,
  VStack,
  Text,
  Box
} from "@chakra-ui/react";
import Image from "next/image";
import Logo from "@/public/MMS.svg";

export default function Footer() {
  const tiktok = "/tiktok.svg";
  const youtube = "/youtube.svg";
  const instagram = "/instagram.svg";

  return (
    <footer>
      <Container
        centerContent
        maxW="100%"
        py={10}
        bg="secondary.200"
        mb={100}
        px={[4, 6, 10]} // Padding adaptable para evitar que se pegue a los bordes
      >
        {/* Flex Principal: Se adapta a móviles y escritorio */}
        <Flex
          flexDirection={["column", "column", "row"]} // Columnas en móvil, fila en escritorio
          justifyContent="space-around"
          alignItems={["center", "center", "flex-start"]}
          w="100%"
          gap={[8, 10, 0]} // Espaciado dinámico en diferentes dispositivos
        >
          {/* Columna 1: Logo */}
          <Box textAlign="center">
            <Link href="/" fontWeight="bold">
              <Image
                src={Logo.src}
                alt="Mucho Mejor Sin"
                width={120} // Tamaño ajustado para móviles
                height={120}
              />
            </Link>
          </Box>

          {/* Columna 2: Redes Sociales */}
          <Flex direction="column" alignItems="center" color="white">
            <Heading as="h2" fontSize={["2xl", "3xl", "4xl"]} fontWeight="500" letterSpacing={2}>
              Síguenos
            </Heading>
            <Flex gap={4} mt={2}>
              <Link href="https://www.tiktok.com/@santirotaeche" isExternal>
                <Image src={tiktok} alt="tiktok" width={30} height={30} />
              </Link>
              <Link href="https://youtube.com/@muchomejorsin2020" isExternal>
                <Image src={youtube} alt="youtube" width={30} height={30} />
              </Link>
              <Link href="https://www.instagram.com/therapy_victim" isExternal>
                <Image src={instagram} alt="instagram" width={30} height={30} />
              </Link>
            </Flex>
          </Flex>

          {/* Columna 3: Corporativo */}
          <Flex direction="column" alignItems={["center", "center", "flex-start"]} color="white">
            <Heading as="h2" fontSize="2xl" fontWeight="500" mb={2}>
              Corporativo
            </Heading>
            <VStack align={["center", "center", "flex-start"]} spacing={2}>
              <Link href="/">El Equipo</Link>
              <Link href="/about">Inicio</Link>
              <Link href="/contact">Programas</Link>
            </VStack>
          </Flex>

          {/* Columna 4: Legal */}
          <Flex direction="column" alignItems={["center", "center", "flex-start"]} color="white">
            <Heading as="h2" fontSize="2xl" fontWeight="500" mb={2}>
              Legal
            </Heading>
            <VStack align={["center", "center", "flex-start"]} spacing={2}>
              <Link href="/">Condiciones de venta</Link>
              <Link href="/about">Política de cookies</Link>
              <Link href="/contact">Política de privacidad</Link>
            </VStack>
          </Flex>
        </Flex>

        {/* Línea divisoria y Copyright */}
        <Flex
          w="100%"
          borderTop="1px solid white"
          mt={6}
          pt={4}
          justifyContent="center"
        >
          <Text fontSize="sm" color="whiteAlpha.700" textAlign="center">
            © 2025 Mucho Mejor Sin Dependencias S.L. Todos los derechos reservados.
          </Text>
        </Flex>
      </Container>
    </footer>
  );
}
