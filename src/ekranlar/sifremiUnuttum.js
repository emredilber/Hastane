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

  const sifreguncelle = async () => {

    if (sifre.length < 1) {
      // Eğer şifre doğrulaması yapılmak isteniyorsa ve kısa ise hata göster
      Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
      return;
    }
    else if (sifreTekrar.length < 1) {
      // Eğer şifre doğrulaması yapılmak isteniyorsa ve kısa ise hata göster
      Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
      return;
    } else if (tc === '' || !/^\d+$/.test(tc)) {
      Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
      return;
    } else if (tc && tc.length < 11) {
      Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
      return;
    }

    if (sifre === sifreTekrar) {
      setHata('')
      try {
        // Firestore'dan belgeyi al
        const dokuman = firestore().collection("hastalar").doc(tc);
        const sorgu = await dokuman.get();

        if (sorgu.exists) {
          // Şifreyi güncelle
          await dokuman.set({ şifre: sifre }, { merge: true });
          // Başarı mesajı göster
          Alert.alert("Bilgi", "Şifre başarıyla güncellendi.", [{ text: 'Tamam' }]);
          navigation.navigate('Giris')
          setYenile(false);
        } else {
          // Kullanıcı bulunamadı hatası
          Alert.alert("Hata", "Kullanıcı bulunamadı.", [{ text: 'Tamam' }])
        }
      } catch (ex) {
        // Hata durumunda mesaj göster
        Alert.alert("Hata", "Şifre güncellenirken bir hata oluştu: " + ex.message, [{ text: 'Tamam' }]);
      }
    }
    else {
      // Şifreler eşit değil hatası
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

        <View >
          <View style={{ height: 90, backgroundColor: '#03244f', zIndex: 999, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, gap: 10, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Image source={require('../assets/iaü.png')} style={{ width: 60, height: 60 }} />
              <View>
                <Text style={{ color: '#fff' }}>İSTANBUL AYDIN ÜNİVERSİTESİ HASTANESİ</Text>
                <Text style={{ color: '#fff', fontSize: 13, marginTop: 10 }}>Kayıt Ol</Text>
              </View>
            </View>
            <TouchableOpacity onPress={navigation.goBack}>
              <Icon name='arrow-left-circle' size={35} color='#fff' />
            </TouchableOpacity>
          </View>

          <View style={{ marginHorizontal: 20, marginTop: 160 }}>

            <CustomInput containerStyle={{}} placeholder={'Tc'} onChangeText={setTc} tcGirisi yenile={yenile} />
            <CustomInput containerStyle={{ marginTop: 10 }} placeholder={'Şifre'} onChangeText={setSifre} secureTextEntry sifreGirisi hata={hata} yenile={yenile} />
            <CustomInput containerStyle={{ marginTop: 10 }} placeholder={'Şifre Tekrar'} onChangeText={setSifreTekrar} secureTextEntry sifreGirisi hata={hata} yenile={yenile} />

          </View>
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <TouchableOpacity
              style={{ paddingVertical: 10, borderRadius: 20, backgroundColor: '#03244f', alignItems: 'center', width: 175 }}
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