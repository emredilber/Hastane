import { View, Text, TouchableOpacity, Image, } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

const KayanMenuStili = ({ navigation1, navigation, tc, ad }) => { // Menü için olan ekran yapısı birde programın kendi ekran yapısını değişken olarak çağırıyoruz.
    const routes = navigation.getState().routes;
    const routeIcons = { // Hangi ekranlar menüde gözüküyorsa onun resmi yanında beliriyor.
        'Randevular': require('../assets/date.png'),
        'Randevu Olustur': require('../assets/calendar.png'),
        'Bilgi Güncelleme': require('../assets/skills.png'),
        'Doktor Randevuları': require('../assets/medical.png'),
        'Doktor Bilgi Güncelleme': require('../assets/skills.png'),
        'Doktorlar': require('../assets/stethoscope.png'),
        'Doktor Kaydet': require('../assets/kaydet.png'),
        'Doktor Düzenleme': require('../assets/skills.png'),
        'Hastalar': require('../assets/stethoscope.png'),
        'Hasta Düzenleme': require('../assets/skills.png'),
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#03244f', justifyContent: 'space-between' }}>
            <View>
                <View style={{ flexDirection: 'row', gap: 10, paddingLeft: 10, alignItems:'center', height: 90, backgroundColor: '#03244f',  borderBottomWidth: 1, borderBottomColor: '#fff' }}>
                    <Image source={require('../assets/iaü.png')} style={{ width: 55, height: 55 }} />
                    <Text style={{ color: '#fff', fontSize: 16, }}>Hoşgeldin {ad},</Text>
                </View>
                <View style={{ marginTop: 10, gap: 10 }}>
                    {routes.map((route, index) => ( // Kullanıcı girişine göre hangi ekranlar gözüküyorsa onlar döngüye alınıyor
                        <TouchableOpacity   // Döngüye alınan ger ekran adı buton olarak oluşturuluyor ve o butona tıklayınca ilgili menüye aktarılıyor.
                            key={index}
                            style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10,paddingLeft:8 }}
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
                    onPress={() => navigation1.navigate('Giris')} // Menünün buluduğu yerin en altında oturumu kapatma tuşuna basınca programın ana dizinindeki ekranlarda giriş ekranına yönlendiriyor.
                >
                    <Icon name='log-out-outline' size={30} color='#fff' />
                    <Text style={{ color: '#fff', marginLeft: 15 }}>Oturumu Kapat</Text>

                </TouchableOpacity>

            </View>
        </View>
    );
};


export default KayanMenuStili;

