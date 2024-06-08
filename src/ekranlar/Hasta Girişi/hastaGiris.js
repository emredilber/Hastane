import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Image } from 'react-native';
import Randevularim from './randevularim'
import sayfaBasligi from '../../kompanentler/sayfaBasligi'
import KayanMenuStili from '../../kompanentler/kayanMenuStil'
import HastaBilgileriGuncelle from './hastaBilgileri';
import RandevuOlustur from './randevuOlustur';

const Drawer = createDrawerNavigator();

const HastaGiris = ({ route, navigation }) => { // Ekran yapısı çalıştırılıyor.
    const { tc, ad } = route.params;

    return (
        // Ekranların gözükeceği yapı ve ekranların bileşenler tasarlanıyor.
        <NavigationContainer independent={true} /* Diğer ekran yapısı ile bağımsız olması sağlanıyor*/> 
            <Drawer.Navigator
                drawerContent={(props) => <KayanMenuStili navigation1={navigation}{...props} tc={tc} ad={ad} />}
                screenOptions={({ navigation, route }) => ({
                    drawerPosition: "right",
                    header: () => sayfaBasligi({ navigation, route }),
                    sceneContainerStyle: { backgroundColor: '#fff' }

                })}>
                <Drawer.Screen name='Randevular' component={Randevularim} initialParams={{ tc: tc }}
                    options={{ drawerIcon: (() => (<Image source={require('../../assets/date.png')} />)) }} />
                <Drawer.Screen name='Randevu Olustur' component={RandevuOlustur} initialParams={{ tc: tc }} />
                <Drawer.Screen name='Bilgi Güncelleme' component={HastaBilgileriGuncelle} initialParams={{ tc: tc }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default HastaGiris;
