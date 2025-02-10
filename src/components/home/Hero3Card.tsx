import { Box, Text, Heading, Flex } from "@chakra-ui/react";
import { PiArrowCircleRightDuotone } from "react-icons/pi";
import { useRef } from "react";
import NextLink from "next/link";

interface Hero3CardProps {
  image: string;
  program: string;
  title: string;
  description: string;
  programPage: string;
}

const Hero3Card: React.FC<Hero3CardProps> = ({
  image,
  program,
  title,
  description,
  programPage
}) => {
  const programRef = useRef<HTMLHeadingElement>(null);
  const mmsRef = useRef<HTMLHeadingElement>(null);


  return (
    <Box
      as={NextLink}
      href={programPage}
      flex="1"
      minH={["250px", "300px", "350px"]} // Tamaños responsivos
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      position="relative"
      borderRadius="md"
      overflow="hidden"
      bgImage={`url(${image})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      color="white"
      p={[4, 6, 8]} // Espaciado adaptable
      transition="transform 0.3s ease-in-out"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bg: "rgba(0, 0, 0, 0.5)",
      }}
      _hover={{
        transform: "scale(1.05)", // Menos agresivo en pantallas táctiles
      }}
    >
      {/* Contenido sobre la imagen */}
      <Box position="relative" zIndex={1} width="100%">
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          {/* Sección de encabezado */}
          <Flex flexDirection="column" alignItems="center">
            <Heading
              as="h2"
              fontSize={["2xl","5xl", "6xl", "3xl"]}
              fontWeight="bold"
              textAlign="center"
              ref={mmsRef}
            >
              MMS
            </Heading>

            <Heading
              as="h3"
              fontSize={["xl", "2xl", "4xl", "2xl"]}
              fontWeight="bold"
              textAlign="center"
              ref={programRef}
            >
              {program}
            </Heading>
          </Flex>

          {/* Título y Flecha */}
          <Flex alignItems="center" gap={2} mt={2}>
            <Text
              letterSpacing="widest"
              fontWeight="extrabold"
              textTransform="uppercase"
              fontSize={["sm", "md"]}
              wordBreak="break-word"
            >
              {title}
            </Text>
            <PiArrowCircleRightDuotone fontSize="2rem" />
          </Flex>

          {/* Descripción */}
          <Text mt={3} fontSize={["sm", "md"]} px={[2, 4]}>
            {description}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default Hero3Card;
