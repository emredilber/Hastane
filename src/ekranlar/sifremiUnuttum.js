import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomInput from '../kompanentler/custominput'
import firestore from '@react-native-firebase/firestore'
import { ScrollView } from 'react-native-gesture-handler'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'

const SifremiUnuttum = ({ navigation }) => {
  const [tc, setTc] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');
  const [hata, setHata] = useState('');
  const [yenile, setYenile] = useState(false);

  const sifreguncelle = async () => { // Güncelle butonuna basınca çalışacak kodlar.
    if (sifre.length < 1) {
      Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
      return;
    } // Girilen metinlerde hata varmı kontrol ediliyor.
    else if (sifreTekrar.length < 1) {
      Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
      return;
    } else if (tc === '' || !/^\d+$/.test(tc)) {
      Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
      return;
    } else if (tc && tc.length < 11) {
      Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
      return;
    }

    if (sifre === sifreTekrar) { // Şifreler aynı mı kontrol ediliyor.
      setHata('')
      try {
        const dokuman = firestore().collection("hastalar").doc(tc);
        const sorgu = await dokuman.get(); // Veri tabanından girilen TC'nin dökümanı alınıyor.

        if (sorgu.exists) { // Veri tabanında veri varsa...
          await dokuman.set({ şifre: sifre }, { merge: true }); // Şifre değiştiriliyor.
          Alert.alert("Bilgi", "Şifre başarıyla güncellendi.", [{ text: 'Tamam' }]);
          navigation.navigate('Giris'); // Şifre değişikliği sonrası giriş ekranına yönlendiriliyor.
          setYenile(false);
        } else {
          Alert.alert("Hata", "Kullanıcı bulunamadı.", [{ text: 'Tamam' }])
        }
      } catch (ex) {
        Alert.alert("Hata", "Şifre güncellenirken bir hata oluştu: " + ex.message, [{ text: 'Tamam' }]);
      }
    }
    else {
      setHata("Şifreler eşit değil.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      setYenile(false);
    }, [])
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ height: 90, backgroundColor: '#03244f', zIndex: 999, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, gap: 10, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={require('../assets/iaü.png')} style={{ width: 60, height: 60 }} />
            <View>
              <Text style={{ color: '#fff' }}>İSTANBUL AYDIN ÜNİVERSİTESİ HASTANESİ</Text>
              <Text style={{ color: '#fff', fontSize: 13, marginTop: 10 }}>Şifremi Unuttum</Text>
            </View>
          </View>
          <TouchableOpacity onPress={navigation.goBack}>
            <Icon name='arrow-left-circle' size={35} color='#fff' />
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: 20 }}>


          <View style={{ marginTop: 160 }}>

            <CustomInput containerStyle={{}} placeholder={'Tc'} onChangeText={setTc} tcGirisi yenile={yenile} />
            <CustomInput containerStyle={{ marginTop: 10 }} placeholder={'Şifre'} onChangeText={setSifre} secureTextEntry sifreGirisi hata={hata} yenile={yenile} />
            <CustomInput containerStyle={{ marginTop: 10 }} placeholder={'Şifre Tekrar'} onChangeText={setSifreTekrar} secureTextEntry sifreGirisi hata={hata} yenile={yenile} />

          </View>
          <View style={{ marginTop: 40 }}>
            <TouchableOpacity
              style={{ paddingVertical: 10, borderRadius: 20, backgroundColor: '#03244f', alignItems: 'center' }}
              onPress={sifreguncelle}
            >
              <Text style={{ fontSize: 16, color: '#fff', }}>Güncelle</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default SifremiUnuttum