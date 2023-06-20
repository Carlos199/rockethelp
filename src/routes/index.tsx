import {NavigationContainer} from '@react-navigation/native'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'

import {SignIn} from '../screens/SignIn'
import { AppRoutes } from './app.routes'
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';

export function Routes(){
    const [loading, setLoading] = useState(true);
    const [user, setUser]= useState<FirebaseAuthTypes.User>()
     
    /* A hook that is used to check if the user is logged in or not. */
    useEffect(()=>{
        const subscriber = auth()
        .onAuthStateChanged(response => {
            setUser(response)
            setLoading(false)
        })
        return subscriber
    },[user])

    if(loading){
        return <Loading />
    }

    return(
    <NavigationContainer>
       {user ? <AppRoutes /> : <SignIn/> }
    </NavigationContainer>
    )
}