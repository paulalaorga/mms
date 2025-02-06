import {
    Modal as ChakraModal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalProps,
  } from "@chakra-ui/react";
  
  interface Props extends ModalProps {
    title: string;
    children: React.ReactNode;
  }
  
  export default function Modal({ title, children, ...props }: Props) {
    return (
      <ChakraModal {...props} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </ChakraModal>
    );
  }
  