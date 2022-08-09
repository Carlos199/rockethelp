
import {Heading, Icon, VStack, useTheme} from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import { useState } from "react";
import { Alert } from "react-native";

import auth from '@react-native-firebase/auth'

import Logo from "../assets/logo_primary.svg";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export function SignIn () {
    const {colors} = useTheme()

    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleSignIn (){
       if(!email || !password){
        return Alert.alert('Entrar', 'Escriba el email y contraseña')
       }

       setIsLoading(true)

       auth().signInWithEmailAndPassword(email, password).catch((error)=>{
        console.log(error)
        setIsLoading(false)

        if(error.code === 'auth/invalid-email'){
            return Alert.alert('Entrar', 'E-mail o contraseña inválido!')
        }

        if(error.code === 'auth/wrong-password'){
            return Alert.alert('Entrar', 'E-mail o contraseña inválido!')
        }

        if(error.code === 'auth/user-not-found'){
            return Alert.alert('Entrar', 'Usuario no existe!')
        }
       })
       
    }

    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
           <Logo />
           <Heading color="gray.100" fontSize="xl" mt={20} mb={6} >
            Accese a su cuenta 
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

           <Button
           isLoading={isLoading}
           title="Entrar" w="full" onPress={handleSignIn} />
        </VStack>
    );
};

