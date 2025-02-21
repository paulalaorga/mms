import { Box, Heading, Text } from "@chakra-ui/react";

interface Props {
  title: string;
  description: string;
}

export default function Card({ title, description }: Props) {
  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="md">
      <Heading size="md">{title}</Heading>
      <Text mt={2}>{description}</Text>
    </Box>
  );
}
