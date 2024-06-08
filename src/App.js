import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Giris from './ekranlar/giris';
import HastaGiris from './ekranlar/Hasta Girişi/hastaGiris';
import DoktorGiris from './ekranlar/Doktor Girişi/doktorGiris';
import SifremiUnuttum from './ekranlar/sifremiUnuttum';
import KayitOl from './ekranlar/kayitOl';
import YoneticiGiris from './ekranlar/Yönetici Girişi/yoneticiGiris';

const Stack = createStackNavigator(); // Ekranlar arası geçiş için Stack Navigator olusturuluyor

const App = () => {

  useEffect(() => {
    // Geri tuşuna basıldığında yapılacak işlem tanımlanıyor
    const backAction = () => {
      return true; // Geri tuşu basıldığında herhangi bir işlem yapılmıyor
    };

    // Geri tuşu dinleyicisi ekleniyor
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    // Bileşen temizlendiğinde geri tuşu dinleyicisi kaldırılıyor
    return () => backHandler.remove();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator> {/* Ekranlar tanımlanıyor, companentler ile de hangi dosyalar çağırılacak onlar belirleniyor*/}
        <Stack.Screen name="Giris" component={Giris} options={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }} />
        <Stack.Screen name="HastaGiris" component={HastaGiris} options={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }} />
        <Stack.Screen name="DoktorGiris" component={DoktorGiris} options={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }} />
        <Stack.Screen name="YoneticiGiris" component={YoneticiGiris} options={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }} />
        <Stack.Screen name='SifremiUnuttum' component={SifremiUnuttum} options={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }} />
        <Stack.Screen name='KayitOl' component={KayitOl} options={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;