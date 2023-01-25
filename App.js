import Realm from 'realm'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Navigator from './navigator'
import AppLoading from 'expo-app-loading'
import { DBContext } from './context'

const FeelingSchema = {
    name: 'Feeling',
    properties: {
        _id: 'int',
        emotion: 'string',
        message: 'string',
    },
    primaryKey: '_id',
}

export default function App() {
    const [ready, setReady] = React.useState(false)
    const [realm, setRealm] = React.useState(null)
    const startLoading = async () => {
        const connection = await Realm.open({
            path: 'insooDiaryDB',
            schema: [FeelingSchema],
        })
        setRealm(connection)
    }
    const onFinish = () => setReady(true)
    if (!ready) {
        return <AppLoading startAsync={startLoading} onFinish={onFinish} onError={console.error} />
    }

    return (
        <DBContext.Provider value={realm}>
            <NavigationContainer>
                <Navigator />
            </NavigationContainer>
        </DBContext.Provider>
    )
}
