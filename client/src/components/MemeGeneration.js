import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  FormControl,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
  useToast
} from "@chakra-ui/react";

// const objectToQueryParam = (obj) => {
//      const params = Object.entries(obj).map(([key, val]) => `${key}=${val}`).join('&');
//      return '?' + params;
// }
const objectToQueryParam = (obj) => {
  const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
  return "?" + params.join("&");
};

const MemeGeneration = ({handleReceiveMemeUrl, handleSendMeme}) => {
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [memeUrl, setMemeUrl] = useState(null);

  const toast = useToast();

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes").then((m) =>
      m.json().then((response) => setTemplates(response.data.memes))
    );
  }, []);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTemplate(null);
    setIsOpen(false);
    setTopText(""); // Reset topText state
    setBottomText(""); // Reset bottomText state
    setMemeUrl(null); // Reset meme state
  };

//   const handleSendMeme = () => {
    
//     // Call the sendMessage function passed as a prop
//     sendMessage();
//     // Close the modal or reset the state if needed
//     handleCloseModal();
//   };

    const handleGenerate = async () => {
      try {
        const params = {
          template_id: selectedTemplate.id,
          text0: topText,
          text1: bottomText,
          username: "niyatisadh",
          password: "niyatisadh",
        };
    
        const res = await fetch(
          `https://api.imgflip.com/caption_image${objectToQueryParam(params)}`
        );
    
        const json = await res.json();
        const memeUrl = json.data.url;
    
        // Upload the generated meme to Cloudinary
        const cloudinaryResponse = await uploadMemeToCloudinary(memeUrl);
    
        // Send the Cloudinary URL of the meme in the chat
        await handleSendMeme(cloudinaryResponse.secure_url);
        
        // Close the modal or reset the state if needed
        handleCloseModal();
      } catch (error) {
        console.error("Error generating meme:", error);
        toast({
          title: "Error Occurred!",
          description: "Failed to generate or send the meme",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
    
    const uploadMemeToCloudinary = async (memeUrl) => {
      try {
        const formData = new FormData();
        formData.append("file", memeUrl);
        formData.append("upload_preset", "banterbox");
    
        const response = await fetch("https://api.cloudinary.com/v1_1/niyatisadh/image/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Failed to upload meme to Cloudinary");
        }
    
        return await response.json();
      } catch (error) {
        console.error("Error uploading meme to Cloudinary:", error);
        throw new Error("Failed to upload meme to Cloudinary");
      }
    };
  useEffect(() => {
    console.log(memeUrl);
    handleReceiveMemeUrl(memeUrl);
  }, [memeUrl]);

  
  return (
    <>
      <Box
        maxHeight="250px" // Set maximum height for scrollable container
        overflowY="auto" // Enable vertical scrolling
        mt={3}
      >
        <Flex flexWrap="wrap" justifyContent="center">
          {/* {template && <Meme template = {template}/>
            } */}

          {!template &&
            templates.map((template) => (
              <Box
                key={template.id}
                onClick={() =>
                  // setTemplate(template)
                  handleTemplateClick(template)
                }
                p={2}
              >
                <img
                  style={{ width: "200px", cursor: "pointer" }}
                  src={template.url}
                  alt={template.name}
                />
              </Box>
            ))}

          {selectedTemplate && (
            <Modal isOpen={isOpen} onClose={handleCloseModal}>
              <ModalOverlay />
              <ModalContent>
                {memeUrl ? ( 
                  <>
                    <ModalHeader>Your custom meme!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Image src={memeUrl} alt="custom meme" />
                    </ModalBody>
                    <ModalFooter>
                      {/* Sene meme button */}
                      <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={() => handleSendMeme(memeUrl)}
                      >
                        Send!
                      </Button>
                    </ModalFooter>
                  </>
                ) : (
                  <>
                    <ModalHeader>{selectedTemplate.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Image
                        src={selectedTemplate.url}
                        alt={selectedTemplate.name}
                      />

                      <Input
                        placeholder="Enter top text"
                        value={topText}
                        onChange={(e) => setTopText(e.target.value)}
                      />
                      <Input
                        placeholder="Enter bottom text"
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value)}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={handleCloseModal}
                      >
                        Close
                      </Button>

                      {/* Generate Button*/}
                      <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={handleGenerate}
                      >
                        Generate
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          )}
        </Flex>
      </Box>
    </>
  );
};
export default MemeGeneration;