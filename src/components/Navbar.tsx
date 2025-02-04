import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { VscAccount } from "react-icons/vsc";
import NextLink from "next/link";

const Navbar = () => {
  return (
    <Box bg="brand.200" color="white" py={3} px={6}>
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">Mi Aplicación</Text>
        <HStack spacing={6}>
          <Link as={NextLink} href="/content1" _hover={{ textDecoration: "underline" }}>
            Contenido 1
          </Link>
          <Link as={NextLink} href="/content2" _hover={{ textDecoration: "underline" }}>
            Contenido 2
          </Link>
          <Link as={NextLink} href="/login" _hover={{ textDecoration: "underline" }}>
            <VscAccount fontSize="2rem" />
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
