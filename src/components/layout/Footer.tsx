import {
  Container,
  Flex,
  Link,
  Heading,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import Logo from "../../../public/MMS.svg";

export default function Footer() {
  const tiktok = "/tiktok.svg";
  const youtube = "/youtube.svg";
  const instagram = "/instagram.svg";
  return (
    <footer>
      <Container centerContent maxW="100%" py={10} bg="secondary.200" mb={100}>
        {/* Flex Principal: Contiene las tres columnas */}
        <Flex justifyContent="space-around" alignItems="flex-start" w={"70%"}>
          {/* Columna 1: Logo */}
          <Flex alignItems="flex-start" alignSelf="center">
            <Link href="/" fontWeight="bold">
              <Image
                src={Logo.src}
                alt="Mucho Mejor Sin"
                width={150}
                height={150}
              />
            </Link>
          </Flex>
          <Flex direction="column" alignSelf="center" color="white">
            <Heading
              as="h2"
              fontSize="4xl"
              fontWeight="500"
              letterSpacing={2}
            >
              Síguenos
            </Heading>
            <Flex gap={4}>
              <Link href="https://facebook.com" isExternal>
                <Image src={tiktok} alt="tiktok" width={30} height={30}/>
              </Link>
              <Link href="https://instagram.com" isExternal>
                <Image src={youtube} alt="youtube" width={30} height={30}/>
              </Link>
              <Link href="https://twitter.com" isExternal>
                <Image src={instagram} alt="instagram" width={30} height={30}/>
              </Link>
            </Flex>
          </Flex>
          <Flex
            direction="column"
            alignItems="flex-start"
            color="white"
            ml={20}
            mb={10}
          >
            <Heading as="h2" fontSize="2xl" fontWeight="500" mb={2}>
              Corporativo
            </Heading>
            <VStack align="flex-start" spacing={2}>
              <Link href="/">El Equipo</Link>
              <Link href="/about">Inicio</Link>
              <Link href="/contact">Programas</Link>
            </VStack>
          </Flex>

          {/* Columna 3: Enlaces Corporativos */}
          <Flex direction="column" alignItems="flex-start" color="white">
            <Heading as="h2" fontSize="2xl" fontWeight="500" mb={2}>
              Legal
            </Heading>
            <VStack align="flex-start" spacing={2}>
              <Link href="/">Condiciones de venta</Link>
              <Link href="/about">Política de cookies</Link>
              <Link href="/contact">Política de privacidad</Link>
            </VStack>
          </Flex>
        </Flex>
      </Container>
    </footer>
  );
}
