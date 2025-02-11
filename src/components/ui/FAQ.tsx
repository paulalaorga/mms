import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  UnorderedList,
  OrderedList,
  ListItem,
} from "@chakra-ui/react";
import { buttonStyles } from "@/components/ui/Button"; // Importamos los estilos

interface FAQItemProps {
  question: string;
  answer: string[];
}

// Función para aplicar negritas dentro del texto
const formatText = (text: string) => {
  const regex = /\*\*(.*?)\*\*/g; // Expresión regular para detectar **negritas**
  const parts = text.split(regex); // Divide el texto en partes según la negrita

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <Text as="span" textAlign={"left"} color={"whiteAlpha.900"} fontWeight="bold" key={index}>
        {part}
      </Text>
    ) : (
      part
    )
  );
};

// Función para renderizar diferentes tipos de texto
const renderAnswer = (text: string, index: number, isOrderedList: boolean) => {
  if (text.startsWith("- ")) {
    return <ListItem key={index}>{formatText(text.substring(2))}</ListItem>; // ✅ Lista desordenada
  }
  if (isOrderedList) {
    return <ListItem key={index}>{formatText(text)}</ListItem>; // ✅ Lista ordenada real
  }
  return (
    <Text textAlign={"left"} color={"whiteAlpha.700"} key={index} mb={2}>
      {formatText(text)}
    </Text>
  ); // ✅ Párrafo normal sin lista
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  // Detectamos si todas las líneas son una lista numerada real
  const isOrderedList = answer.every((line) => /^\d+\./.test(line));

  return (
    <AccordionItem border="none" mb={6} shadow={"md"} width="100%" maxWidth="800px">
      {({ isExpanded }) => (
        <>
          <AccordionButton
            sx={buttonStyles.outline}
            shadow={"xl"}
            display="flex"
            alignItems="center"
            borderRadius={4}
            width="100%"
            bg={isExpanded ? "brand.200" : "transparent"}
            _hover={{ bg: "brand.300", color: "white" }}
          >
            <Box flex="1" textAlign="left">
              <Text
                fontSize={"2xl"}
                fontWeight="bold"
                color={isExpanded ? "white" : "brand.200"}
                _hover={{ color: "white" }}
              >
                {question}
              </Text>
            </Box>
            <AccordionIcon
              as="span"
              color={isExpanded ? "white" : "brand.200"}
              _groupHover={{ color: "white" }}
            />
          </AccordionButton>

          <AccordionPanel borderRadius={4} bg={"brand.200"} width="100%" p={6} fontSize={"lg"}>
            {answer.some((line) => line.startsWith("- ")) ? (
              <UnorderedList textAlign={"left"} color="whiteAlpha.900" pl={5}>
                {answer.map((line, index) => renderAnswer(line, index, false))}
              </UnorderedList>
            ) : isOrderedList ? (
              <OrderedList textAlign={"left"} color="whiteAlpha.900" pl={5}>
                {answer.map((line, index) => renderAnswer(line, index, true))}
              </OrderedList>
            ) : (
              answer.map((line, index) => renderAnswer(line, index, false))
            )}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};


// Componente principal de FAQ
const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "¿Qué pasa en un centro de desintoxicación?",
      answer: [
        "- Los centros de desintoxicación, como MMS, brindan tratamientos de adicción a personas dependientes al alcohol u otras sustancias.",
        "- En MMS tenemos disponibles programas para el proceso de recuperación y desintoxicación",
        "- Antes de embarcarse en el proceso, es fundamental conocer los servicios y programas de cada centro.",
        "- En MMS el tratamiento es online, conseguimos el mismo resultado con menos terapias, te ayudamos a parar de beber o consumir otras drogas desde casa para que no dejes de realizar tu vida cotidiana.",
      ],
    },
    {
      question: "¿Cómo puedo saber si tengo un problema con el alcohol?",
      answer: [
        "- Si habitualmente **bebes más** de lo que te gustaría.",
        "- Si tu relación con el alcohol tiene **consecuencias negativas** en tu vida.",
        "- Si ya elaboras **estrategias para beber menos**.",
        "Muchas personas no reconocen su problema hasta que afecta su vida cotidiana.",
        "Si sientes que el consumo de alcohol está afectando tu bienestar, te recomendamos buscar ayuda.",
      ],
    },
    {
      question: "¿Cómo puedo saber si tengo un problema con el alcohol?",
      answer: [
        "- Si habitualmente bebes más de lo que te gustaría",
        "- Si tu relación con el alcohol tiene consecuencias negativas en tu vida",
        "- Si ya elaboras estrategias para beber menos",      ],
    },
    {
      question: "¿Cuál es la diferencia entre el abuso y la dependencia del alcohol?",
      answer: [
        "Dentro de los consumidores en MMS hacemos **tres categorías:**",
        "**1. Los que beben bien:**",
        "- Son personas cuyo consumo de alcohol u otras drogas es **puramente recreativo**.",
        "- No presentan consecuencias negativas en su vida a causa del consumo.",
        "**2. Los que beben mal:**",
        "- Además de ser recreativo, el consumo comienza a **generar consecuencias negativas** en algunas áreas de su vida.",
        "- Es probable que esta población **se beneficie del programa MMS** y mejore su calidad de vida.",
        "- Aunque podrían intentar revertir la situación por disciplina o fuerza de voluntad, **seguir el programa de MMS facilitaría mucho el proceso**.",
        "**3. Los que beben muy mal:**",
        "- El consumo de alcohol, drogas u otras conductas adictivas ha tomado **control total de su vida**.",
        "- Presentan consecuencias negativas en **casi todas las áreas** de su vida.",
        "- Usan el consumo para **regular su sistema emocional**.",
        "- En estos casos, el tratamiento especializado es esencial para lograr la recuperación.",
      ],
    },
    {
      question: "¿Cuáles son los riesgos para la salud asociados con el consumo excesivo de alcohol?",
      answer: [
        "**1. Problemas Hepáticos:**",
        "Puede causar enfermedades como la **esteatosis hepática (hígado graso)**, la **hepatitis alcohólica**, la **cirrosis** y el **cáncer de hígado**.",
        "**2. Problemas Cardiovasculares:**",
        "Aumenta la presión arterial y el riesgo de **arritmias cardíacas**.",
        "Puede debilitar el músculo cardíaco y aumentar la probabilidad de **accidentes cerebrovasculares**.",
        "**3. Trastornos Neurológicos:**",
        "Puede dañar el sistema nervioso y provocar **síndrome de Wernicke-Korsakoff** y **neuropatías periféricas**.",
        "**4. Trastornos Mentales:**",
        "Relacionado con un mayor riesgo de **depresión**, **ansiedad** y otros **trastornos psiquiátricos**.",
        "**5. Daño al Sistema Digestivo:**",
        "Puede afectar el revestimiento del estómago e intestinos, causando **gastritis, úlceras** y otros problemas gastrointestinales.",
        "**6. Daño al Sistema Inmunológico:**",
        "Debilita el sistema inmunológico, aumentando la susceptibilidad a infecciones y enfermedades.",
        "**7. Daño al Páncreas:**",
        "Puede causar **pancreatitis**, una inflamación peligrosa del páncreas.",
        "**8. Cáncer:**",
        "Aumenta el riesgo de cáncer en la **boca, garganta, esófago, hígado, colon y mama**.",
        "**9. Problemas Sociales y Personales:**",
        "Puede afectar las relaciones personales, el desempeño laboral y la estabilidad financiera.",
        "**10. Dependencia y Síndrome de Abstinencia:**",
        "Puede llevar a la **dependencia física y psicológica**.",
        "Provoca síntomas de abstinencia graves al intentar dejar de consumir.",
      ],
    },
    {
      question: "¿Cómo puedo lidiar con los desencadenantes y las situaciones de tentación después de dejar de beber?",
      answer: [
        "- Para mantener la sobriedad después de un tiempo de abstinencia es recomendable también:",
        "1. Realizar ajustes en tu estilo de vida.",
        "2. Cultivar compañías de personas comprometidas con un uso responsable del alcohol.",
        "3. Evitar los lugares que estén vinculados con el consumo de alcohol en el pasado.",
      ],
    },
    {
      question: "¿Cómo puedo mantener mi sobriedad a largo plazo?",
      answer: [
        "**1. Establece Objetivos Claros:** Define tus razones para mantener la sobriedad y establece metas realistas y significativas. Estos objetivos te brindarán motivación y un sentido de propósito.",
        "**2. Busca Apoyo:** Construye una red de apoyo sólida que incluya familiares, amigos, terapeutas y grupos de apoyo. Rodearte de personas que entienden tu proceso facilitará tu recuperación.",
        "**3. Evita Situaciones de Riesgo:** Identifica y evita lugares y personas que puedan desencadenar el deseo de consumir sustancias. Cambiar hábitos y rutinas puede minimizar estas tentaciones.",
        "**4. Aprende Habilidades de Afrontamiento:** Desarrolla estrategias efectivas para manejar el estrés y la ansiedad sin recurrir al consumo de sustancias. La terapia cognitivo-conductual y la meditación pueden ser útiles.",
        "**5. Cuida Tu Bienestar Físico:** Mantén un estilo de vida saludable con una alimentación equilibrada, ejercicio regular y suficiente descanso. Una buena salud física fortalece tu resistencia a las recaídas.",
        "**6. Busca Terapia Continua:** La terapia individual o grupal puede proporcionarte herramientas adicionales para enfrentar desafíos. Mantener el contacto con profesionales aumenta tus posibilidades de éxito a largo plazo.",
        "**7. Desarrolla Intereses Nuevos:** Encuentra pasatiempos, actividades y proyectos que te mantengan motivado y ocupado. Ocupar tu mente en nuevas experiencias ayuda a reemplazar patrones de comportamiento anteriores.",
        "**8. Practica el Autocuidado:** Dedica tiempo a cuidar tu bienestar emocional. Esto puede incluir técnicas de relajación, expresión creativa y practicar la gratitud.",
        "**9. Mantén la Comunicación Abierta:** Comparte tus desafíos y logros con tu red de apoyo. La comunicación abierta ayuda a prevenir el aislamiento y fomenta la responsabilidad.",
        "**10. Aprende de las Recaídas:** Si experimentas una recaída, no te culpes ni te rindas. Analiza la experiencia, busca ayuda y vuelve a enfocarte en tu recuperación.",
      ],
    },
    {
      question: "¿Cómo funciona el proceso de tratamiento y recuperación en MMS?",
      answer: [
        "En MMS, hemos desarrollado un proceso de tratamiento y recuperación integral que abarca diversos niveles, desde MMS Fundamental hasta MMS VIP. No solo somos el único programa en línea exitoso en España, sino que también abordamos el tratamiento y recuperación como un proyecto de transformación personal. En esencia, guiamos a quienes enfrentan problemas con el consumo hacia la evolución hacia un estado de abstinencia. Nuestro enfoque se basa en una combinación de terapia grupal e individual. A través de estas sesiones, dotamos a los participantes de la motivación y el compromiso necesarios para llevar a cabo el cambio deseado. Proporcionamos un conjunto completo de herramientas y estrategias diseñadas para asegurar el éxito en este viaje de recuperación. Es importante destacar que entendemos que el proceso de tratamiento y recuperación es un camino de evolución personal. Partiendo de un estado de consumo problemático, trabajamos en conjunto para lograr la transformación en una vida de abstinencia y bienestar. La duración del programa puede variar según las necesidades individuales, extendiéndose desde un año hasta un período indefinido. Nuestro objetivo es brindar un soporte continuo y eficaz a lo largo de todo este proceso, ayudando a nuestros participantes a enfrentar los desafíos, desarrollar habilidades para el cambio duradero y celebrar cada paso hacia una vida más saludable y libre de adicciones.",
      ],
    },
    {
      question: "¿Cuál es la duración típica del tratamiento y cómo se determina?",
      answer: [
        "MMS ofrece un programa de recuperación dividido en **4 niveles**, con una duración total de **3 años** en su totalidad.",
        "- **MMS Fundamental:** Se enfoca en aprender las herramientas necesarias para detener el consumo de alcohol. Tiene una duración de **1 año** y tiene como objetivo generar un cambio en tu estilo de vida.",
        "- **MMS Avanzado:** Se trabaja en la introspección y el cambio de patrones de pensamiento. Tiene una duración de **1 año** y su propósito es provocar un cambio en tu forma de pensar.",
        "- **MMS Mantenimiento:** Diseñado para consolidar y reforzar el progreso ya logrado en etapas anteriores, tiene una duración de **1 año**.",
        "- **MMS VIP:** Ofrece un espacio de encuentro para individuos afines y no tiene un límite de duración establecido.",
        "Cada nivel es **independiente y completo por sí mismo**. Tú decides si avanzar al siguiente nivel o si te sientes satisfecho con los logros alcanzados en cada etapa.",
      ],
    },
    {
      question: "¿Cuál es el enfoque para abordar las recaídas y mantener la sobriedad a largo plazo?",
      answer: [
        "MMS reconoce que una recaída es una oportunidad de aprendizaje y una señal de que tanto nosotros como nuestros usuarios podemos mejorar juntos. Las recaídas pueden originarse por:",
        "1. **Falta de motivación y compromiso para el cambio.**",
        "2. **Carencia en la adquisición de herramientas de contención y manejo emocional.**",
        "Cuando ocurre una recaída, en MMS adoptamos un enfoque proactivo:",
        "- **Identificamos desencadenantes:** Trabajamos con el usuario para entender los factores que llevaron a la recaída.",
        "- **Brindamos apoyo:** Proporcionamos el apoyo necesario para fomentar el aprendizaje a partir de la experiencia.",
        "- **Prevención futura:** Desarrollamos estrategias para evitar recaídas y, si es necesario, ofrecemos derivaciones a recursos adicionales.",
        "Nuestro objetivo es transformar la recaída en una oportunidad de crecimiento y aprendizaje, asegurando que nuestros usuarios tengan el apoyo y las herramientas necesarias para continuar su recuperación.",
      ],
    },
    {
      question: "¿Cuál es el costo y las opciones de pago para los servicios de tratamiento?",
      answer: [
        "MMS opera bajo un modelo de suscripción mensual, lo que significa que los usuarios pagan una tarifa mensual durante un período predeterminado.",
        "La duración de los programas de MMS es de **un año**, con la excepción de **MMS VIP**, que es de duración indefinida.",
        "Los precios mensuales son los siguientes:",
        "- **MMS Fundamental:** 250€",
        "- **MMS Avanzado:** 125€",
        "- **MMS Mantenimiento:** 90€",
        "- **MMS VIP:** 60€",
        "Todas las suscripciones de MMS tienen la **flexibilidad de ser canceladas** según la voluntad del usuario.Nuestro objetivo es brindar opciones accesibles y personalizadas para apoyar a los individuos en su viaje hacia la recuperación.",
        "**Terapias Particulares:**",
        "--Sesión individual: 75€",
        "--Sesión familiar: 150€",
      ],
    },
    {
      question: "¿Puedo dejar de beber sin medicación?",
      answer: [
        "**Casos en los que la medicación es necesaria:**",
        "1. **Medicación para la Desintoxicación:** En algunos casos, la medicación puede ser útil para sobrellevar el proceso de desintoxicación.",
        "2. **Medicación para el Dolor Psicológico:** En situaciones de intensa angustia emocional, la medicación puede ser considerada para gestionar el malestar.",
        "Sin embargo, una gran mayoría de usuarios logra avanzar en su tratamiento sin necesidad de medicación.",
        "Aquellos que siguen un tratamiento de medicación bajo la supervisión médica adecuada reciben el respaldo de MMS.",
        "Nuestro enfoque es brindar **apoyo integral**, adaptado a las necesidades individuales, para asegurar que cada persona tenga las **herramientas** y el acompañamiento necesario para alcanzar una **recuperación exitosa**.",
      ],
    },
  ];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh" // Para centrarlo en toda la pantalla
      p={6}
    >
      <Accordion allowToggle width="100%" maxWidth="800px">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </Accordion>
    </Box>
  );
};
export default FAQ;
