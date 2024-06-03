import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, BackHandler, Alert, Image, TouchableOpacity, Button, StyleSheet } from 'react-native';
import Doktorlar from './doktorlar'
import sayfaBasligi from '../../kompanentler/sayfaBasligi'
import KayanMenuStili from '../../kompanentler/kayanMenuStil'
import DoktorKaydet from './doktorKaydet';
import DoktorDuzenle from './doktorDuzenle';
import Hastalar from './hastalar';
import HastaGuncelleme from './hastaDuzenle';

const Drawer = createDrawerNavigator();

const YoneticiGiris = ({ route, navigation }) => {
    const { tc ,ad} = route.params;

    return (
        <NavigationContainer independent={true}>
            <Drawer.Navigator
                drawerContent={(props) => <KayanMenuStili navigation1={navigation}{...props} tc={tc} ad={ad} />}
                screenOptions={({ navigation, route }) => ({
                    drawerPosition: "right",
                    header: () => sayfaBasligi({ navigation, route }),
                    sceneContainerStyle: { backgroundColor: '#fff' }

                })}>
                <Drawer.Screen name='Doktorlar' component={Doktorlar} initialParams={{ tc: tc }} />
                <Drawer.Screen name='Doktor Kaydet' component={DoktorKaydet} initialParams={{ tc: tc }} />
                <Drawer.Screen name='Doktor Düzenleme' component={DoktorDuzenle} initialParams={{ tc: tc }} />
                <Drawer.Screen name='Hastalar' component={Hastalar} initialParams={{ tc: tc }} />
                <Drawer.Screen name='Hasta Düzenleme' component={HastaGuncelleme} initialParams={{ tc: tc }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default YoneticiGiris;
