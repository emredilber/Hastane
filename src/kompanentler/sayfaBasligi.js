import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { CommonActions } from '@react-navigation/native'


const sayfaBasligi = ({ route, navigation }) => {
    return (
        <View>
            <View style={{ height: 90, backgroundColor: '#03244f', zIndex: 999, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 10, }} >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Image source={require('../assets/iaü.png')} style={{ width: 60, height: 60 }} />
                    <View>
                        <Text style={{ color: '#fff' }}>İSTANBUL AYDIN ÜNİVERSİTESİ{'\n'}VM MEDİCAL PARK HASTANESİ</Text>
                        <Text style={{ color: '#fff', fontSize: 13, marginTop: 10 }}>{route.name}</Text>
                    </View>
                </View>
                <View >
                    <TouchableOpacity onPress={() => navigation.openDrawer()} >
                        <Icon name='menu' color='#fff' size={40} />
                    </TouchableOpacity>
                    {route.name === 'Doktorlar' && <TouchableOpacity onPress={() => navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: route.name }],
                        })
                    )
                    } >
                        <Icon name='refresh-circle-outline' color='#fff' size={40} />
                    </TouchableOpacity>}
                    {route.name === 'Hastalar' && <TouchableOpacity onPress={() => navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: route.name }],
                        })
                    )
                    } >
                        <Icon name='refresh-circle-outline' color='#fff' size={40} />
                    </TouchableOpacity>}
                    {route.name === 'Doktor Randevuları' && <TouchableOpacity onPress={() => navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: route.name }],
                        })
                    )
                    } >
                        <Icon name='refresh-circle-outline' color='#fff' size={40} />
                    </TouchableOpacity>}
                    {route.name === 'Randevular' && <TouchableOpacity onPress={() => navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: route.name }],
                        })
                    )
                    } >
                        <Icon name='refresh-circle-outline' color='#fff' size={40} />
                    </TouchableOpacity>}
                </View>
            </View>
        </View>)
}

export default sayfaBasligi