/* "use client";

import { useState, useEffect } from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Calendar } from "react-calendar";
 */

export default function SesionesPage() {}
  /*
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Obtener sesiones del usuario (ejemplo)
    fetch("/api/user/sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data));
  }, []);

  return (
    <>
      <Box p={6}>
        <Heading size="lg">Tus Sesiones</Heading>
        <Calendar onChange={setSelectedDate} value={selectedDate} />

        <Heading size="md" mt={4}>Sesiones Agendadas</Heading>
        {sessions.length === 0 ? (
          <Text mt={2}>No tienes sesiones programadas.</Text>
        ) : (
          sessions.map((session) => (
            <Box key={session.id} p={4} borderWidth="1px" borderRadius="md" mt={2}>
              <Text>Fecha: {session.date}</Text>
              <Text>Terapeuta: {session.therapist}</Text>
              <Button size="sm" mt={2} colorScheme="red">Cancelar</Button>
            </Box>
          ))
        )}

        <Button mt={6} colorScheme="blue">Contratar Más Sesiones</Button>
      </Box>
    </>
  );
}
 */