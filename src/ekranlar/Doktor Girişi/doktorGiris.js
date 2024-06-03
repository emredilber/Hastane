import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, BackHandler, Alert, Image, TouchableOpacity, Button, StyleSheet } from 'react-native';
import Randevularim from './doktorRandevularim'
import sayfaBasligi from '../../kompanentler/sayfaBasligi'
import KayanMenuStili from '../../kompanentler/kayanMenuStil'
import DoktorBilgileriGuncelle from './doktorBilgileri';
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DoktorGiris = ({ route, navigation }) => {
    const { tc, ad } = route.params;

    const Drawer1 = () => {
        return (
            <Drawer.Navigator
                drawerContent={(props) => <KayanMenuStili navigation1={navigation}{...props} tc={tc} ad={ad} />}
                screenOptions={({ navigation, route }) => ({
                    drawerPosition: "right",
                    header: () => sayfaBasligi({ navigation, route }),
                    sceneContainerStyle: { backgroundColor: '#fff' }

                })}>
                <Drawer.Screen name='Doktor Randevuları' component={Randevularim} initialParams={{ tc: tc }} />
                <Drawer.Screen name='Doktor Bilgi Güncelleme' component={DoktorBilgileriGuncelle} initialParams={{ tc: tc }} />
            </Drawer.Navigator>
        )
    }

    return (
        <NavigationContainer independent={true}>


            <Stack.Navigator>
                <Stack.Screen name="Deneme" component={Drawer1} initialParams={{ tc: tc }} options={{ headerShown: false, cardStyle: {} }} />
                <Stack.Screen name="Test" component={Randevularim} initialParams={{ tc: tc }} options={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }} />
            </Stack.Navigator>

        </NavigationContainer>
    );
};

export default DoktorGiris;
