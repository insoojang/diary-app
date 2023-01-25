import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import colors from '../color'
import { Ionicons } from '@expo/vector-icons'
import { useDB } from '../context'
import { FlatList, LayoutAnimation, Platform, TouchableOpacity, UIManager } from 'react-native'

const Home = ({ navigation: { navigate } }) => {
    const realm = useDB()
    const [feelings, setFeelings] = useState([])

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    useEffect(() => {
        const newFeeling = realm.objects('Feeling')
        newFeeling.addListener((feelings, changes) => {
            LayoutAnimation.spring()
            setFeelings(feelings.sorted('_id', true))
        })
        return () => {
            newFeeling.removeAllListeners()
        }
    }, [])
    const onPress = (id) => {
        realm.write(() => {
            const feeling = realm.objectForPrimaryKey('Feeling', id)
            realm.delete(feeling)
        })
    }
    return (
        <View>
            <Title>My journal</Title>
            <FlatList
                data={feelings}
                keyExtractor={(feeling) => feeling._id + ''}
                contentContainerStyle={{ paddingVertical: 10 }}
                ItemSeparatorComponent={Separator}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            onPress(item._id)
                        }}
                    >
                        <Record>
                            <Emotion>{item.emotion}</Emotion>
                            <Message>{item.message}</Message>
                        </Record>
                    </TouchableOpacity>
                )}
            />
            <Btn
                onPress={() => {
                    navigate('Write')
                }}
            >
                <Ionicons name="add" color="white" size={40} />
            </Btn>
        </View>
    )
}

export default Home

const View = styled.View`
    flex: 1;
    padding: 0px 50px;
    padding-top: 100px;
    background-color: ${colors.bgColor};
`
const Title = styled.Text`
    color: ${colors.textColor};
    font-size: 38px;
    margin-bottom: 100px;
`
const Btn = styled.TouchableOpacity`
    position: absolute;
    bottom: 50px;
    right: 50px;
    height: 80px;
    width: 80px;
    border-radius: 40px;
    justify-content: center;
    align-items: center;
    background-color: ${colors.btnColor};
    elevation: 5;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
`
const Record = styled.View`
    background-color: ${colors.cardColor};
    flex-direction: row;
    padding: 10px 20px;
    border-radius: 10px;
`
const Emotion = styled.Text`
    font-size: 24px;
    margin-right: 10px;
`
const Message = styled.Text`
    font-size: 18px;
    font-weight: 400;
`
const Separator = styled.View`
    height: 10px;
`
