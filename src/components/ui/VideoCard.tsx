import { useDisclosure } from "@chakra-ui/react";
import {
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  CloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegPlayCircle } from "react-icons/fa";

interface VideoCardProps {
  thumbnail: string;
  videoUrl: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ thumbnail, videoUrl }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState("");

  const handleOpen = () => {
    setSelectedVideo(videoUrl);
    onOpen();
  };

  return (
    <>
      {/* Imagen clickeable con fondo cubriendo todo el recuadro */}
      <Box
        onClick={handleOpen}
        cursor="pointer"
        borderRadius="md"
        overflow="hidden"
        position="relative"
        width="30%" // Tamaño fijo del recuadro
        height="80%" // Ajusta según necesidad
        display="flex"
        justifyContent="center"
        alignItems="center"
        _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
      >
        <Image
          src={thumbnail}
          alt="Video Thumbnail"
          width="100%"
          height="100%"
          objectFit="cover" // Hace que la imagen cubra el espacio completamente
        />

        {/* Ícono de Play en el centro */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <FaRegPlayCircle size="50px" color="white" />
        </Box>
      </Box>

      {/* Modal Único para Cada VideoCard */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="black">
          <CloseButton color="white" onClick={onClose} />
          <ModalBody display="flex" justifyContent="center">
            {selectedVideo && (
              <video width="100%" controls autoPlay>
                <source src={selectedVideo} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VideoCard;
