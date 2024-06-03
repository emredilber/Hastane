import { View, Text, TouchableOpacity, Image, } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

const KayanMenuStili = ({ navigation1, navigation, tc, ad }) => {
    const routes = navigation.getState().routes;
    const routeIcons = {
        'Randevular': require('../assets/date.png'),
        'Hasta Bilgi Güncelleme': require('../assets/calendar.png'),
        'Randevu Olustur': require('../assets/skills.png'),
        'Doktor Randevuları': require('../assets/medical.png'),
        'Doktor Bilgi Güncelleme': require('../assets/skills.png'),
        'Doktorlar': require('../assets/stethoscope.png'),
        'Doktor Kaydet': require('../assets/kaydet.png'),
        'Doktor Düzenleme': require('../assets/kaydet.png'),
        'Hastalar': require('../assets/stethoscope.png'),
        'Hasta Düzenleme': require('../assets/kaydet.png'),
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#03244f', justifyContent: 'space-between' }}>
            <View>
                <View style={{ flexDirection: 'row', gap: 10, paddingLeft: 10, alignItems:'center', height: 90, backgroundColor: '#03244f',  borderBottomWidth: 1, borderBottomColor: '#fff' }}>
                    <Image source={require('../assets/iaü.png')} style={{ width: 55, height: 55 }} />
                    <Text style={{ color: '#fff', fontSize: 16, }}>Hoşgeldin {ad},</Text>
                </View>
                <View style={{ marginTop: 10, gap: 10 }}>
                    {routes.map((route, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 20, }}
                            onPress={() => navigation.navigate(route.name)}
                        >
                            <Image source={routeIcons[route.name]} style={{ width: 30, height: 30, marginRight: 15 }} />
                            <Text style={{ color: '#fff' }}>{route.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: '#fff' }}>
                <TouchableOpacity
                    style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 20, marginVertical: 10 }}
                    onPress={() => navigation1.navigate('Giris')}
                >

                    <Icon name='log-out-outline' size={30} color='#fff' />
                    <Text style={{ color: '#fff', marginLeft: 15 }}>Çıkış yap</Text>

                </TouchableOpacity>

            </View>
        </View>
    );
};


export default KayanMenuStili;

