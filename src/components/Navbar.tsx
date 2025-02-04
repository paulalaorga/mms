import { Box, Button, Flex, HStack, Link } from "@chakra-ui/react";
import { VscAccount } from "react-icons/vsc";
import NextLink from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <Box bg="brand.200" color="white" py={3} px={6} zIndex={2}>
      <Flex justify="space-between" align="center">
        <Link as={NextLink} href="/">
          <Image src="/muchomejorsin.svg" alt="Logo" width={80} height={80} />
        </Link>
        <HStack spacing={6}>
          <Link textTransform= "uppercase" fontWeight="600" fontSize={["sm", "md", "lg", "xl"]}
            as={NextLink}
            href="/familia"
            _hover={{ textDecoration: "underline" }}
          >
            Familia
          </Link>
          <Link textTransform= "uppercase" fontWeight="600" fontSize={["sm", "md", "lg", "xl"]}
            as={NextLink}
            href="/programas"
            _hover={{ textDecoration: "underline" }}
          >
            Programas
          </Link>
          <Link textTransform= "uppercase" fontWeight="600" fontSize={["sm", "md", "lg", "xl"]}
            as={NextLink}
            href="/equipo"
            _hover={{ textDecoration: "underline" }}
          >
            El Equipo
          </Link>
          <Link textTransform= "uppercase" fontWeight="600" fontSize={["sm", "md", "lg", "xl"]}
            as={NextLink}
            href="/noticias"
            _hover={{ textDecoration: "underline" }}
          >
            Noticias
          </Link>
          <Button textTransform= "uppercase" fontWeight="600"
            as={NextLink}
            href="/matricula"
            colorScheme="white"
            bg={"black.200"}
            variant="outline"
            rounded={"full"}
            _hover={{ textDecoration: "underline" }}
          >
            Matricúlate ahora
            </Button>
          <Link
            as={NextLink}
            href="/login"
            _hover={{ textDecoration: "underline" }}
          >
            <VscAccount fontSize="2rem" />
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
