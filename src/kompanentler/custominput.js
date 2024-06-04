import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const CustomInput = ({ containerStyle, placeholder, onChangeText, hata, veri, yukleniyor, yenile, disable, focusDurum, blurDurum, hatavar, dogumTarihiYenile, ...props }) => {
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');
  const [showPassword, setShowPassword] = useState(props.secureTextEntry);
  const labelPosition = useRef(new Animated.Value(text ? 1 : 0)).current;


  useEffect(() => {
    if (veri !== undefined) {
      handleTextChange(veri);
    }
  }, [veri]);

  useEffect(() => {
    if (yenile === true) {
      handleTextChange('');
    }
  }, [yenile])

  const handleFocus = () => {
    setIsFocused(true);
    if (focusDurum && blurDurum) {
      focusDurum(true);
      blurDurum(false);
    }
    animatedLabel(1);
    setError();
  };

  const handleBlur = () => {
    setIsFocused(false);
    checkErrors(text); // Kutudan çıkıldığında hataları kontrol et
    if (focusDurum && blurDurum) {
      focusDurum(false);
      blurDurum(true);
    }
    if (!text) {
      animatedLabel(0);
    }
  };

  const handleTextChange = (text) => {
    setText(text);

    if (onChangeText) {
      onChangeText(text);
    }
    if (text) {
      animatedLabel(1);
    } else {
      animatedLabel(isFocused ? 1 : 0);
    }
  };

  const checkErrors = (text) => {
    if (!yenile) {
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

  const animatedLabel = (toValue) => {
    Animated.timing(labelPosition, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = {
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
          <TextInput
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
          {yukleniyor &&
            <ActivityIndicator color='#03244f' size={30} style={{}}
            />
          }

          {props.sifreGirisi && (
            <View>
              <TouchableOpacity style={{ width: 24 }}
                onPress={() => setShowPassword(!showPassword)}>
                {!showPassword ? (<Feather name="eye-off" size={24} color={'#03244f'} />) : (<Feather name="eye" size={24} color={'#03244f'} />)}
              </TouchableOpacity>
            </View>
          )}
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
      {!props.hataalma && <Text style={{ marginTop: 5, fontSize: 14, color: 'red' }}>{hata === undefined ? error : hata}</Text>}
    </View>
  );
};

export default CustomInput;
