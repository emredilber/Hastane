import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// CustomInput çağırıldığı zaman gönderilecek veya alınacak değişkenler belirleniyor.
const CustomInput = ({ containerStyle, placeholder, onChangeText, hata, veri, yukleniyor, yenile, disable, focusDurum, blurDurum, hatavar, dogumTarihiYenile, ...props }) => {
  // State ve ref tanımlamaları yapılıyor.
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');
  const [showPassword, setShowPassword] = useState(props.secureTextEntry);
  const labelPosition = useRef(new Animated.Value(text ? 1 : 0)).current;

  useEffect(() => {  // Veri değiştiğinde veri tekrar yazı olarak gönderiliyor.
    if (veri !== undefined) {
      handleTextChange(veri);
    }
  }, [veri]);

  useEffect(() => {  // Yenileme durumu olduğunda yazı sıfırlanıyor.
    if (yenile === true) {
      handleTextChange('');
    }
  }, [yenile])

  const handleFocus = () => {  // Odaklanma durumunda yapılan işlemler.
    setIsFocused(true);
    if (focusDurum && blurDurum) {
      focusDurum(true);
      blurDurum(false);
    }
    animatedLabel(1);
    setError();
  };

  // Odaktan çıkıldığında yapılan işlemler
  const handleBlur = () => {
    setIsFocused(false);
    checkErrors(text); // Kutudan çıkıldığında hataları kontrol et.
    if (focusDurum && blurDurum) {
      focusDurum(false);
      blurDurum(true);
    }
    if (!text) {
      animatedLabel(0);
    }
  };

  const handleTextChange = (text) => {  // Yazılan metin değiştiğinde yapılan işlemler.
    setText(text);

    if (onChangeText) {
      onChangeText(text);
    }
    if (text) {
      animatedLabel(1); // Animasyonlu şekilde yazıyı oynatıyor.
    } else {
      animatedLabel(isFocused ? 1 : 0);
    }
  };

  // Hataları kontrol eden fonksiyon
  const checkErrors = (text) => {
    if (!yenile) { // Eğer yenile durumu yoksa hatalar kontrol ediliyor.
      if (props.emailGirisi && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text)) {
        setError('Geçerli bir e-posta giriniz!');
      } else if (props.sifreGirisi && text.length < 1) {
        setError('Şifre boş bırakılamaz!');
      } else if ((props.tcGirisi || props.gsmGirisi) && text !== '' && !/^\d+$/.test(text)) {
        setError('Sadece sayı giriniz!');
        { hatavar && hatavar('Sadece sayı giriniz!'); }
      } else if (props.adGirisi && text.length < 3) {
        setError('Yanlış ad girişi!');
      } else if (props.soyadGirisi && text.length < 3) {
        setError('Yanlış soyadı girişi!');
      } else if (props.tcGirisi && text.length < 11) {
        setError('Tc kimlik numarasını 11 haneli girmelisiniz!');
        { hatavar && hatavar('Tc numarasını 11 haneli girmelisiniz!') }
      } else if (props.gsmGirisi && text.length < 11) {
        setError('Telefon numarasını 11 haneli girmelisiniz!');
      } else if (props.gsmGirisi && !/^(05\d{9})$/.test(text)) {
        setError('Telefon numarası 0 ile başlamalıdır ve doğru girilmelidir!');
      } else if (props.tarihGirisi && !/^([0-9]{2})\.([0-9]{2})\.([0-9]{4})$/.test(text)) {
        setError('Geçersiz tarih formatı. Lütfen gg.aa.yyyy formatında girin.');
      } else {
        setError("");
        { hatavar && hatavar(''); }
      }
    }
  };

  const animatedLabel = (toValue) => { // Yaznın hareket etmesini sağlamak için animasyon değişkeni.
    Animated.timing(labelPosition, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = { // Gelen veriye göre 0 ayda 1 ise karşılığındaki değer değiştiriliyor ve hareket ettiriliyor.
    left: 10,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [13, -10]
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14]
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: ['gray', '#888']
    }),
    marginLeft: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 0]
    })
  };

  return (
    <View style={containerStyle}>
      <View style={[{ borderWidth: 1, borderColor: isFocused ? '#03244f' : '#D9D9D9', borderRadius: 6, height: 50, justifyContent: 'center' }, hata === undefined ? error : hata && { borderColor: 'red' }]}>
        <Animated.Text style={[labelStyle, { position: 'absolute', color: isFocused ? '#03244f' : 'gray', backgroundColor: '#fff' }]}>{placeholder}</Animated.Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
          <TextInput // Yazı yazma bileşeni oluşturuluyor.
            {...props}
            style={{ fontWeight: '500', flex: 1, fontSize: 13, height: 50, marginLeft: 20, color: yukleniyor && 'gray' || disable ? 'gray' : isFocused ? '#03244f' : 'black' }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleTextChange}
            value={text}
            textAlignVertical="center"
            textContentType={props.sifreGirisi ? 'newPassword' : props.sifreGirisi}
            keyboardType={props.tcGirisi || props.gsmGirisi ? 'numeric' : (props.emailGirisi ? 'email-address' : 'default')}
            maxLength={props.tcGirisi ? 11 : (props.gsmGirisi ? 11 : null)}
            secureTextEntry={showPassword}
            editable={props.yukleniyor && !yukleniyor || disable}
          />
          {/* Veriler yükleniyorsa gözükecek icon */}
          {yukleniyor &&
            <ActivityIndicator color='#03244f' size={30} style={{}}
            />
          }
          {/* Şifre göster/gizle ikonu */}
          {props.sifreGirisi && (
            <View>
              <TouchableOpacity style={{ width: 24 }}
                onPress={() => setShowPassword(!showPassword)}>
                {!showPassword ? (<Feather name="eye-off" size={24} color={'#03244f'} />) : (<Feather name="eye" size={24} color={'#03244f'} />)}
              </TouchableOpacity>
            </View>
          )}
          {/* Daha önceden kaydedilen verinin geri yüklenebilmesi işlevi  */}
          {props.yenileme && veri !== text && veri && (
            <View>
              <TouchableOpacity style={{ width: 24 }} onPress={() => {
                handleTextChange(veri);
                checkErrors(veri);
              }}>
                <Icon name="restore" size={24} color={'#03244f'} />
              </TouchableOpacity>
            </View>
          )}
          {/* Doğum tarihine özel doğum tarihini yazdırma. */}
          {props.dgt && veri !== dogumTarihiYenile && veri && (
            <View>
              <TouchableOpacity style={{ width: 24 }} onPress={() => {
                handleTextChange(dogumTarihiYenile);
                checkErrors(dogumTarihiYenile);
              }}>
                <Icon name="restore" size={24} color={'#03244f'} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {/* Hata mesajı */}
      {!props.hataalma && <Text style={{ marginTop: 5, fontSize: 14, color: 'red' }}>{hata === undefined ? error : hata}</Text>}
    </View>
  );
};

export default CustomInput;