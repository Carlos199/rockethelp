import  firestore  from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { VStack } from 'native-base';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';

export function Register() {
const [isLoading, setIsLoading] = useState(false)
const [patrimony, setPatrimony] = useState('')
const [description, setDescription] = useState('')

const navigation = useNavigation()

function handleNewOrderRegistrater() {
  if(!patrimony || !description){
    return Alert.alert('Registrar', 'Escriba todo los campos')
  }

  setIsLoading(true)

  firestore()
  .collection('orders')
  .add({
    patrimony,
    description,
    status: 'open',
    created_at : firestore.FieldValue.serverTimestamp()
  })
  .then(()=>{
    Alert.alert('Solicitud', 'Solicitud registrada con éxito.')
    navigation.goBack()
  })
  .catch((error)=>{
    console.log(error)
    setIsLoading(false)
    return Alert.alert('Solicitud', 'No fue posible registrar solicitud')
  })
}

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title='Nueva Solicitud'/>

      <Input 
      placeholder='Número de patrimonio'
      mt={4}
      onChangeText={setPatrimony}
      />
      <Input 
         placeholder='Descripción del problema'
         flex={1}
         mt={5}
         multiline
         textAlignVertical='top'
         onChangeText={setDescription}
      />
      <Button 
      title='Guardar'
      mt={5}
      isLoading = {isLoading}
      onPress={handleNewOrderRegistrater}
      />
    </VStack>
  );
}