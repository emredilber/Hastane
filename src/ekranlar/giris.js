import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Text, TouchableOpacity, TextInput, Animated, View, Alert, TouchableWithoutFeedback, Image, Keyboard } from 'react-native';
import CustomInput from '../kompanentler/custominput';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons'
import { useFocusEffect } from '@react-navigation/native';


const Giris = ({ navigation }) => {
  const [yenile, setYenile] = useState(false);
  const [kullanıcıTipi, setKullanıcıTipi] = useState('');
  const [error, setError] = useState('');
  const [tc, setTc] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [Keyboard]);

  const loginButon = async () => {
    setYenile(false);
    if (password.length < 1) {
      // Eğer şifre doğrulaması yapılmak isteniyorsa ve kısa ise hata göster
      Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }])
      return
    } if (tc === null || tc === '' || !/^\d+$/.test(tc)) {
      Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }])
      return
    }
    if (kullanıcıTipi === 'hasta') {
      try {
        const dokuman = firestore().collection('hastalar').doc(tc);
        const sorgu = await dokuman.get();

        if (sorgu.exists) {
          const sifresi = sorgu.data().şifre;
          const ad = sorgu.data().ad;

          if (sifresi === password) {
            setPassword('');
            setYenile(true);
            navigation.navigate('HastaGiris', { tc, ad });
          } else {
            Alert.alert("Hata", "Geçersiz TC veya parola.", [{ text: "Tamam" }]);
          }
        } else {
          Alert.alert("Hata", "Geçersiz TC veya parola.", [{ text: "Tamam" }]);
        }
      } catch (ex) {
        Alert.alert("Hata", "Veri alınırken bir hata oluştu: " + ex.message, [{ text: "Tamam" }]);
      }
    }
    else if (kullanıcıTipi === 'doktor') {
      try {
        const dokuman = firestore().collection('doktorlar').doc(tc);
        const sorgu = await dokuman.get();

        if (sorgu.exists) {
          const sifresi = sorgu.data().şifre;
          const ad = sorgu.data().ad;

          if (sifresi === password) {
            setPassword('');
            setYenile(true);
            navigation.navigate('DoktorGiris', { tc, ad });
          } else {
            Alert.alert("Hata", "Geçersiz TC veya parola.", [{ text: "Tamam" }]);
          }
        } else {
          Alert.alert("Hata", "Geçersiz TC veya parola.", [{ text: "Tamam" }]);
        }
      } catch (ex) {
        Alert.alert("Hata", "Veri alınırken bir hata oluştu: " + ex.message, [{ text: "Tamam" }]);
      }

    }
    else if (kullanıcıTipi === 'yönetici') {
      try {
        const dokuman = firestore().collection('admins').doc(tc);
        const sorgu = await dokuman.get();

        if (sorgu.exists) {
          const sifresi = sorgu.data().password;
          const ad = sorgu.data().ad;

          if (sifresi === password) {
            setPassword('');
            setYenile(true);
            navigation.navigate('YoneticiGiris', { tc, ad });
          } else {
            Alert.alert("Hata", "Geçersiz TC veya parola.", [{ text: "Tamam" }]);
          }
        } else {
          Alert.alert("Hata", "Geçersiz TC veya parola.", [{ text: "Tamam" }]);
        }
      } catch (ex) {
        Alert.alert("Hata", "Veri alınırken bir hata oluştu: " + ex.message, [{ text: "Tamam" }]);
      }

    }
    else { setError('Birini seç!') }
  }
  useFocusEffect(
    useCallback(() => {
      setYenile(false);
    }, [])
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: 40, backgroundColor: '#03244f', zIndex: 999 }} />

      <View style={{ marginHorizontal: 20 }}>
        <View style={{ alignItems: 'center',marginHorizontal:50, marginTop: keyboardHeight ? -keyboardHeight / 2 : 40, gap: 20 }}>
          <Image source={require('../assets/iaü.png')} style={{ height: 150, width: 150 }} />
          <Text style={{ color: '#03244f', fontWeight: '500', fontSize: 19, textAlign: 'center', lineHeight: 30 }}>İSTANBUL AYDIN ÜNİVERSİTESİ VM MEDİCAL PARK HASTANESİ</Text>
        </View>
        <View style={{ justifyContent: 'center', marginTop: 80 }}>

          <View>
            <CustomInput
              containerStyle={{}}
              placeholder={'Tc'}
              onChangeText={setTc}
              tcGirisi
            />
            <CustomInput
              containerStyle={{ marginTop: 10 }}
              placeholder={'Şifre'}
              onChangeText={setPassword}
              yenile={yenile}
              secureTextEntry
              sifreGirisi
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ marginTop: 10 }}>
                <View style={{ alignItems: 'center', }}>
                  <View style={{ flexDirection: 'row', gap: 15, }}>
                    <TouchableOpacity onPress={() => { setKullanıcıTipi('hasta'); setError('') }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name={kullanıcıTipi === 'hasta' ? 'radio-button-on' : 'radio-button-off'} size={23} color={'#03244f'} />
                      <Text style={{ color: '#03244f', marginLeft: 4, fontSize: 12, fontWeight: '500' }}>Hasta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setKullanıcıTipi('doktor'); setError('') }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name={kullanıcıTipi === 'doktor' ? 'radio-button-on' : 'radio-button-off'} size={23} color={'#03244f'} />
                      <Text style={{ color: '#03244f', marginLeft: 4, fontSize: 12, fontWeight: '500' }}>Doktor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setKullanıcıTipi('yönetici'); setError('') }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name={kullanıcıTipi === 'yönetici' ? 'radio-button-on' : 'radio-button-off'} size={23} color={'#03244f'} />
                      <Text style={{ color: '#03244f', marginLeft: 4, fontSize: 12, fontWeight: '500' }}>Yönetici</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={{ marginTop: 30, fontSize: 14, color: 'red', position: 'absolute' }}>{error}</Text>
              </View>

              <TouchableWithoutFeedback onPress={() => navigation.navigate('SifremiUnuttum')}>
                <Text style={{ textDecorationLine: 'underline', color: '#03244f', fontSize: 13.5, }}>Şifremi Unuttum?</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 80, justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{ paddingVertical: 10, borderRadius: 20, backgroundColor: '#03244f', alignItems: 'center', width: 182 }}
                onPress={loginButon}
              >
                <Text style={{ fontSize: 16, color: '#fff', }}>Giriş</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#03244f', backgroundColor: '#fff', alignItems: 'center', width: 182 }}
                onPress={() => navigation.navigate('KayitOl')}
              >
                <Text style={{ fontSize: 16, color: '#03244f', }}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}

export default Giris;