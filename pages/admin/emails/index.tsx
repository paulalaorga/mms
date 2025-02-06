"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Textarea,
  Input,
} from "@chakra-ui/react";

interface EmailTemplate {
  _id: string;
  type: string;
  subject: string;
  body: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    fetch("/api/admin/email-templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data));
  }, []);

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setSubject(template.subject);
    setBody(template.body);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;

    const res = await fetch("/api/admin/email-templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedTemplate._id,
        subject,
        body,
      }),
    });

    if (res.ok) {
      const updatedTemplate = await res.json();
      setTemplates((prev: EmailTemplate[]) =>
        prev.map((t) => (t._id === updatedTemplate._id ? updatedTemplate : t))
      );
      setSelectedTemplate(null);
    }
  };

  return (
    <>
      <Container maxW="container.lg" py={10}>
        <Heading size="lg" mb={6}>
          Gestión de Emails
        </Heading>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Tipo</Th>
              <Th>Asunto</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {templates.map((template) => (
              <Tr key={template._id}>
                <Td>{template.type}</Td>
                <Td>{template.subject}</Td>
                <Td>
                  <Button size="sm" onClick={() => handleEdit(template)}>
                    Editar
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {selectedTemplate && (
          <Box mt={6} p={4} borderWidth={1} borderRadius="md">
            <Heading size="md">Editar Email</Heading>
            <Input
              mt={4}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Asunto"
            />
            <Textarea
              mt={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Cuerpo del correo"
            />
            <Button mt={4} onClick={handleSave}>
              Guardar Cambios
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}
