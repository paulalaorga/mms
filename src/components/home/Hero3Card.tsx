import { Box, Text, Heading, Flex } from "@chakra-ui/react";
import { PiArrowCircleRightDuotone } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
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
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (programRef.current && mmsRef.current) {
      const programWidth = programRef.current.offsetWidth;
      setTextWidth(programWidth);
    }
  }, [program]); // Se actualiza si `program` cambia

  return (
    <Box
      as={NextLink}
      href={programPage}
      flex="1"
      minH="300px"
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
      p={6}
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
        transform: "scale(1.1)", // Efecto de zoom al pasar el mouse
    }} 
    >
      {/* Contenido sobre el fondo */}
      <Box bottom={"-25%"} position="relative" zIndex={1} width="100%">
        <Flex justifyContent="center" gap={3} alignItems="center" width="100%">
          {/* Heading y Icono en la misma línea, centrados */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="fit-content"
              minWidth="max-content" // Asegura que MMS se expanda según el contenido de {program}
            >
              <Heading
                as="h2"
                fontSize="3xl"
                fontWeight="bold"
                textAlign="center"
                ref={mmsRef}
                minWidth={textWidth ? `${textWidth}px` : "auto"} // Ajusta al ancho de {program}
                letterSpacing={textWidth ? `${textWidth / 10}px` : "normal"} // Ajusta espaciado dinámicamente
              >
                MMS
              </Heading>

              {/* Programa con referencia para capturar su ancho */}
              <Heading
                as="h3"
                fontSize="2xl"
                fontWeight="bold"
                textAlign="center"
                ref={programRef} // Captura el ancho de este texto
              >
                {program}
              </Heading>
            </Flex>
          </Box>
          <Text
            letterSpacing={"widest"}
            fontWeight={"extrabold"}
            display={"inline-block"}
            textTransform={"uppercase"}
            fontSize="sm"
            maxWidth={"min-content"}
          >
            {title}
          </Text>
          <PiArrowCircleRightDuotone fontSize="3rem" />
        </Flex>

        <Text mt={3}>{description}</Text>
      </Box>
    </Box>
  );
};

export default Hero3Card;
