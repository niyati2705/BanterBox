import {useEffect} from 'react'
import {  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,} from '@chakra-ui/react'

import { useHistory} from 'react-router-dom'

import Signin from '../components/Authentication/Signin'
import Signup from '../components/Authentication/Signup'

const Homepage = () => {

  const history = useHistory();
 

  useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("userInfo"));

      //if user logged in
      if(user){
          history.push('/chats');
      }
  },[history]); //run again whenever history changes
  return (

    <Container maxW='xl' centerContent> 
      <Box d='flex' justifyContent='center' p={2} bg={"white"} color="black"m='40px 0 15px 0' borderRadius="lg" borderWidth="1px"> 

          <Text fontSize='2xl'fontFamily={"sans-serif"}>BanterBox</Text>

      </Box>

      <Box bg="black" w="100%" p={4} borderRadius="lg" borderWidth="1px">
      <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Signin />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage
