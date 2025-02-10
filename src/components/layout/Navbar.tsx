import { Box, Button, Flex, HStack, Link } from "@chakra-ui/react";
import { VscAccount } from "react-icons/vsc";
import NextLink from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <Box bg="brand.200" color="white" py={3} px={6} zIndex={100} position={"sticky"} top={0}>
      <Flex justify="space-between" align="center">
        <Link as={NextLink} href="/">
          <Image src="/muchomejorsin.svg" alt="Logo" width={80} height={80} />
        </Link>
        <HStack spacing={6}>
          <Link textTransform= "uppercase" fontWeight="600" fontSize={["sm", "md", "lg", "xl"]}
            as={NextLink}
            href="/familia"
            _hover={{ color: "black" }}
          >
            Familia
          </Link>
          <Link textTransform= "uppercase" fontWeight="600" fontSize={["sm", "md", "lg", "xl"]}
            as={NextLink}
            href="/programas"
            _hover={{ color: "black" }}
          >
            Programas
          </Link>
          <Link textTransform= "uppercase" fontWeight="600" fontSize={["sm", "md", "lg", "xl"]}
            as={NextLink}
            href="/equipo"
            _hover={{ color: "black" }}
          >
            El Equipo
          </Link>
          <Link textTransform= "uppercase" fontWeight="600" fontSize={["sm", "md", "lg", "xl"]}
            as={NextLink}
            href="/noticias"
            _hover={{ color: "black" }}
          >
            Noticias
          </Link>
          <Button textTransform= "uppercase" 
            as={Link}
            href="/matricula"
            colorScheme="white"
            borderColor={"black"}
            bg={"black.200"}
            variant="outline"
            rounded={"full"}
            _hover={{
              transform: "scale(1.1)", // Efecto de zoom al pasar el mouse
              textDecoration:"none"
            }} 
          >
          Matricúlate ahora
            </Button>
          <Link
            as={NextLink}
            href="/login"
            _hover={{ color: "black", transform: "scale(1.1)" }}
          >
            <VscAccount fontSize="2rem" />
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
