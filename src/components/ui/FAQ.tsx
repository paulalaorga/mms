import { useState } from "react";
import { Box, Text, Button, Collapse, Icon } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box borderBlock={"3px"} py={3} width="100%">
      {/* Botón para abrir/cerrar */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="unstyled"
        width="100%"
        textAlign="left"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        _hover={{ bg: "gray.100" }}
        p={2}
      >
        <Text fontWeight="bold">{question}</Text>
        <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} w={6} h={6} />
      </Button>

      {/* Contenido que se despliega */}
      <Collapse in={isOpen} animateOpacity>
        <Text mt={2} color="gray.600">
          {answer}
        </Text>
      </Collapse>
    </Box>
  );
};

// Componente principal de FAQ
const FAQ: React.FC = () => {
  const faqs = [
    { question: "¿Cómo funciona este servicio?", answer: "Nuestro servicio te ayuda a..." },
    { question: "¿Cuánto cuesta?", answer: "El precio depende del plan que elijas..." },
    { question: "¿Es seguro?", answer: "Sí, utilizamos las mejores prácticas de seguridad..." },
  ];

  return (
    <Box maxW="600px" mx="auto" p={4}>

      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </Box>
  );
};

export default FAQ;
