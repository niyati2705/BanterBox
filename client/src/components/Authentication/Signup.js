import React, { useState } from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/toast";
import { VStack } from "@chakra-ui/layout";
import {useHistory} from 'react-router-dom';
import axios from 'axios';

const Signup = () => {

    const[name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    // const [loading, setLoading] = useState(false);
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleClick = () => setShow(!show);

    const toast = useToast();
    const history = useHistory();

    const postDetails = (pics) => {
      setPicLoading(true);
      if(pics === undefined) {
        toast({
          title: "Select an image",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      if(pics.type==="image/jpeg" || pics.type==="image/png"){
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset","banterbox");
        data.append("cloud_name","niyatisadh");
        //api call to cloudinary url
        fetch("https://api.cloudinary.com/v1_1/niyatisadh/image/upload",{
          method:"post",
          body: data,
        }).then((res) => res.json())
        .then((data)=>{
            setPic((data.url).toString());
            setPicLoading(false);
        })    
       }else{
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
       }
    };

    const submitHandler = async () =>{
      setPicLoading(true);
      if (!name || !email || !password || !confirmPassword) {
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: "Passwords Do Not Match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      console.log(name, email, password, pic);

      //make api request to store in database
      try{
        const config ={
          headers: {
            "Content-type" : "application/json",
          }
        };
        const {data} = await axios.post("/api/user",
        { name, email, password, pic}
          ,config
        );
        console.log(data);
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        localStorage.setItem("userInfo", JSON.stringify(data));

        setPicLoading(false);
        history.push('/chats');
      }catch(error){
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
      
      }
    }
    

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

      <FormControl id = "pic">
        <FormLabel>Upload your profile picture</FormLabel>
        <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}/>
      
      </FormControl>

        <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
       isloading={picLoading}
      >
        Sign Up
      </Button>

    </VStack>
  )
}

export default Signup
