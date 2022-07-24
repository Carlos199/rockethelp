
import {Heading, Icon, VStack, useTheme } from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import { useState } from "react";

import Logo from "../assets/logo_primary.svg";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export function SignIn () {
    const {colors} = useTheme()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleSignIn (){
        console.log(email)
    }

    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
           <Logo />
           <Heading color="gray.100" fontSize="xl" mt={20} mb={6} >
            Accese a su cuenta {email}
           </Heading>

           <Input
          mb={4}
          InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4}/>}
            placeholder="E-mail"
            onChangeText={setEmail}
            />
            
           <Input 
           mb={8}
            InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4}/>}
           placeholder="Contraseña"
           onChangeText={setPassword}
           secureTextEntry
           />

           <Button title="Entrar" w="full" onPress={handleSignIn} />
        </VStack>
    );
};

