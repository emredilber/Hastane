import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Doktorlar from './doktorlar'
import sayfaBasligi from '../../kompanentler/sayfaBasligi'
import KayanMenuStili from '../../kompanentler/kayanMenuStil'
import DoktorKaydet from './doktorKaydet';
import DoktorDuzenle from './doktorDuzenle';
import Hastalar from './hastalar';
import HastaGuncelleme from './hastaDuzenle';

const Drawer = createDrawerNavigator();

const YoneticiGiris = ({ route, navigation }) => { // Ekran yapısı çalıştırılıyor.
    const { tc, ad } = route.params;

    return (
        // Ekranların gözükeceği yapı ve ekranların bileşenler tasarlanıyor.
        <NavigationContainer independent={true} /* Diğer ekran yapısı ile bağımsız olması sağlanıyor*/ >
            <Drawer.Navigator
                initialRouteName='Doktorlar'
                drawerContent={(props) => <KayanMenuStili navigation1={navigation}{...props} tc={tc} ad={ad} />}
                screenOptions={({ navigation, route }) => ({
                    drawerPosition: "right",
                    header: () => sayfaBasligi({ navigation, route }),
                    sceneContainerStyle: { backgroundColor: '#fff' }

                })}>
                <Drawer.Screen name='Doktor Kaydet' component={DoktorKaydet} initialParams={{ tc: tc }} />
                <Drawer.Screen name='Doktorlar' component={Doktorlar} initialParams={{ tc: tc }} />
                <Drawer.Screen name='Doktor Düzenleme' component={DoktorDuzenle} initialParams={{ tc: tc }} />
                <Drawer.Screen name='Hastalar' component={Hastalar} initialParams={{ tc: tc }} />
                <Drawer.Screen name='Hasta Düzenleme' component={HastaGuncelleme} initialParams={{ tc: tc }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default YoneticiGiris;
