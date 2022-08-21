import { useNavigation } from '@react-navigation/native';
import { Center, FlatList, Heading, HStack, IconButton, Text, useTheme, VStack } from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore'

import auth from '@react-native-firebase/auth'

import Logo from '../assets/logo_secondary.svg'
import { Button } from '../components/Button';
import { Filter } from '../components/Filter';
import { Orders, OrderProps } from '../components/Orders';
import { Alert } from 'react-native';
import { dateFormat } from '../utils/firestoreDateFormat';
import Loading from '../components/Loading';

export function Home() {
   const [isLoading, setIsLoading] = useState(false)
    const [statusSelected, setStatusSelected] = useState<'open'| 'closed'>('open')
    const [orders, setOrders] = useState<OrderProps[]>([])
    const {colors} = useTheme()

    const navigation = useNavigation()
/**
 * It navigates to the new page
 */

    function handleNewOrder(){
     navigation.navigate('new')
    }

    /**
     * The function takes in an orderId as a parameter, and then navigates to the details screen,
     * passing in the orderId as a parameter
     * @param {string} orderId - The id of the order that was clicked.
     */
    function handleOpenDetails(orderId: string){
      navigation.navigate('details', {orderId})
    }

   /**
    * It logs out the user from the app.
    */
    function handleLogout(){
      auth().signOut()
      .catch(error => {
        console.log(error)
        return Alert.alert('Salir', 'No fue posible cerrar sesión')
      })
    }

    useEffect(()=>{
      setIsLoading(true)

      /* A function that is called when the component is mounted. It is a listener that is listening to
      the firestore database. */
      const subscriber = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot(snapshot =>{
        const data = snapshot.docs.map(doc =>{
          const {patrimony, description, status,created_at} = doc.data()
          return{
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at)
            
          }
        })
        setOrders(data)
        setIsLoading(false)
      })
      return subscriber
    },[statusSelected])

  return (
    <VStack flex={1} pb={6} bg="gray.700">
        <HStack 
        w={'full'}
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
        >
              <Logo />
              <IconButton
              icon={<SignOut size={26} color={colors.gray[300]}/>}
              onPress={handleLogout}
              />

        </HStack>

      <VStack flex={1} px={6}>
        <HStack w="full" mt={8} mb={4} justifyContent={'space-between'} alignItems="center">
            <Heading color="gray.100">
                Solicitaciones
            </Heading>
        <Text color="gray.200">{orders.length}</Text>
     </HStack>
      
      <HStack space={3} mb={8}>
        <Filter 
        type='open'
        title='En agendamiento'
        onPress={()=> setStatusSelected('open')}
        isActive={statusSelected === 'open'}
        />

     <Filter 
        type='closed'
        title='Finalizado'
        onPress={()=> setStatusSelected('closed')}
        isActive={statusSelected === 'closed'}
        />
      </HStack>
      {isLoading ? <Loading /> : 
      <FlatList 
      data={orders}
      keyExtractor={item => item.id}
      renderItem={({item})=> <Orders data={item} onPress={()=> handleOpenDetails(item.id)} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 100}}
      ListEmptyComponent={()=>(
        <Center>
          <ChatTeardropText  color={colors.gray[300]} size={40}/>
          <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
            Voce ainda nao possui {'\n'} solicitud {statusSelected === 'open' ? 'en reserva' : 'finalizado'}
          </Text>
        </Center>
      )}
      />
}
      <Button title='Nueva Solicitud' onPress={handleNewOrder}/>
      </VStack>
   </VStack>
  );
}