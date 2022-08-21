import { useNavigation, useRoute } from '@react-navigation/native';
import { Text, VStack, useTheme, HStack, ScrollView, Box } from 'native-base';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { OrderProps } from '../components/Orders';

import firestore from '@react-native-firebase/firestore'
import { OrderFirestoreDTO } from '../DTOs/OrderDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import Loading from '../components/Loading';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';

type RouteParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  description: string
  solution: string
  closed: string
}

export function Details() {
  const {colors} = useTheme()
const [isLoading, setIsLoading] = useState(true)
const [solution, setSolution]= useState('')
const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)

const navigation = useNavigation()

  const route = useRoute()
  const { orderId } = route.params as RouteParams

 /**
  * It updates the order status to closed, adds the solution and the closed_at timestamp to the order
  * document in the orders collection
  * @returns return (
  *     <View style={styles.container}>
  *       <View style={styles.header}>
  *         <Text style={styles.headerText}>{order.title}</Text>
  *       </View>
  *       <View style={styles.body}>
  *         <Text style={styles.bodyText}>{order.description}
  */
  function handleOrderClose () {
    if(!solution){
      return Alert.alert('Solicitación', 'Informa una solución para cerrar la solicitud')
    }
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(()=>{
      Alert.alert('Soliciatud', 'Solicitud cerrada')
      navigation.goBack()
    })
    .catch((error)=>{
      Alert.alert('Solicitud', 'No fue posible cerrar la solicitud')
    })
  }

 /* A hook that is called when the component is mounted. */
useEffect(()=>{
/* Getting the data from the firestore database. */
firestore()
.collection<OrderFirestoreDTO>('orders')
.doc(orderId)
.get()
.then((doc)=> {
  const { patrimony, description, status, created_at, closed_at, solution } = doc.data()

  const closed = closed_at ? dateFormat(closed_at) : null

  setOrder({
    id: doc.id,
    patrimony,
    description,
    status,
    solution,
    when: dateFormat(created_at),
    closed
  })

  setIsLoading(false)

})
  },[])

  if(isLoading){
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
      <Header title='Solicitud'/>
      </Box>
       
      <HStack bg='gray.500' justifyContent="center" p={4} >
        {
          order.status === 'closed'
          ? <CircleWavyCheck size={22} color={colors.green[300]}/> 
          : <Hourglass size={22} color={colors.secondary[700]}/>
        }

        <Text
        fontSize='sm'
        color={order.status === 'closed'? colors.green[300] : colors.secondary[700]}
        >
          {order.status === 'closed' ? 'finalizado' : 'agendado'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsHorizontalScrollIndicator={false}>
        <CardDetails 
        title='equipamiento'
        description={`Patrimonio ${order.patrimony}`}
        icon={DesktopTower}
        footer={order.when}
        />

      <CardDetails 
        title='descriccion del problema'
        description={`Patrimonio ${order.description}`}
        icon={ClipboardText}
        />

       <CardDetails 
        title='solución'
        icon={CircleWavyCheck}
        description={order.solution}
        footer={order.closed && `Cerrado en ${order.closed}`}
        >
          {
          order.status === 'open' && 
          <Input 
          placeholder='Descriccion de la solución'
          onChangeText={setSolution}
          textAlignVertical="top"
          multiline
          h={24}
          />
        }
        </CardDetails>
      </ScrollView>
      {
        order.status === 'open' &&
        <Button 
        title='Cerrar solicitud'
        m={5}
        onPress={handleOrderClose}
        />
      }
    </VStack>
  );
}