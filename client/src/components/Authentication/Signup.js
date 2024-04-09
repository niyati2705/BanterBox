import React, { useState } from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";

const Signup = () => {

    const[name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confrimPassword, setConfirmPassword] = useState();

    const [pic, setPic] = useState();
    // const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {};

    const submitHandler = () =>{};

  return (
    <VStack spacing="5px">
      <FormControl id='fname' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
            _placeholder='Enter your Name'
            onChange={(e)=> setName(e.target.value)}
        />
         </FormControl>

         <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
            _placeholder='Enter your Email'
            onChange={(e)=> setEmail(e.target.value)}
        />
         </FormControl>
         <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
               type={show ? "text" : "password"}
               placeholder="Enter Password"
               onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* <FormControl id = "pic">
        <FormLabel>Upload your profile picture</FormLabel>
        <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) = postDetails(e.target.files[0])}/>
      
      </FormControl> */}

        <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
       
      >
        Sign Up
      </Button>

    </VStack>
  )
}

export default Signup
