import { View, Text, Alert, TouchableOpacity, Animated } from 'react-native'
import React, { useCallback, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import CustomInput from '../../kompanentler/custominput'
import { useFocusEffect } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const HastaBilgileriGuncelle = ({ route }) => {
    const { tc } = route.params;
    const [hata, setHata] = useState('');
    const [gsm, setGsm] = useState('');
    const [email, setEmail] = useState('');
    const [adres, setAdres] = useState('');
    const [gsm1, setGsm1] = useState('');
    const [email1, setEmail1] = useState('');
    const [adres1, setAdres1] = useState('');
    const [sifre, setSifre] = useState('');
    const [sifreTekrar, setSifreTekrar] = useState('');
    const [yukleniyor, setYukleniyor] = useState(false);
    const [yenile, setYenile] = useState(false);


    const bilgileriGetir = async () => { // Sayfa yüklendiğinde ilk önce veri tabanındaki bilgiler değişkene aktarılıyor.
        setYukleniyor(true);
        try {
            setGsm(('')); setEmail(('')); setAdres(('')); setGsm1(('')); setEmail1(('')); setAdres1((''));
            const dokuman = await firestore().collection('hastalar').doc(tc).get();
            if (dokuman.exists) {
                setGsm(dokuman.get('gsm'));
                setEmail(dokuman.get('email'));
                setAdres(dokuman.get('adres'));
                setGsm1(dokuman.get('gsm'));
                setEmail1(dokuman.get('email'));
                setAdres1(dokuman.get('adres'));
            }
            else
                Alert.alert("Hata", "Bir Hata Oluştu");
        } catch (ex) {
            Alert.alert("Hata", "Veri alınırken bir hata oluştu: " + ex.message, [{ text: "Tamam" }]);
        } finally {
            setYukleniyor(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            bilgileriGetir()
        }, [])
    );

    const verileriGuncelle = async () => {
        // Girilen değerlerde hata varmı kontrol ediliyor.
        if (tc === '' || !/^\d+$/.test(tc)) {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if (tc && tc.length < 11) {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if (gsm && !/^(05\d{9})$/.test(gsm)) {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if (email && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        }
        setYenile(false);
        if (sifreGoster) { // Şifre değiştirecekse CheckBox'u seçiyor
            if (sifre === sifreTekrar) {
                if (sifre !== '' && sifreTekrar !== '') {
                    setHata('')
                    try {
                        // Firestore'dan belgeyi al
                        const dokuman = firestore().collection("hastalar").doc(tc);
                        const sorgu = await dokuman.get(); // Veri tabanından döküman referansı alınıyor.

                        if (sorgu.exists) {

                            const kullanıcı = {
                                gsm: gsm,
                                email: email,
                                adres: adres,
                                şifre: sifre
                            };
                            await dokuman.set(kullanıcı, { merge: true }); // Bilgileri güncelleniyor.
                            Alert.alert("Bilgi", "Şifre başarıyla güncellendi.", [{ text: 'Tamam' }]);
                            bilgileriGetir(); // Tekrardan sayfa açıldığındaki kodlar çalıştırılıyor.
                            setYenile(true);
                        } else {
                            Alert.alert("Hata", "Kullanıcı bulunamadı.", [{ text: 'Tamam' }])
                        }
                    } catch (ex) {
                        Alert.alert("Hata", "Şifre güncellenirken bir hata oluştu: " + ex.message, [{ text: 'Tamam' }]);
                    }
                }
                else {
                    setHata('Boş şifre giremezsiniz!');
                }
            }
            else {
                setHata("Şifreler eşit değil.");
            }
        }
        else {
            try {
                const dokuman = firestore().collection("hastalar").doc(tc);
                const sorgu = await dokuman.get();

                if (sorgu.exists) {

                    const kullanıcı = {
                        gsm: gsm,
                        email: email,
                        adres: adres,
                    };
                    await dokuman.set(kullanıcı, { merge: true });
                    Alert.alert("Bilgi", "Şifre başarıyla güncellendi.", [{ text: 'Tamam' }]);
                    bilgileriGetir(); // Tekrardan sayfa açıldığındaki kodlar çalıştırılıyor.
                } else {
                    Alert.alert("Hata", "Kullanıcı bulunamadı.", [{ text: 'Tamam' }])
                }
            } catch (ex) {
                Alert.alert("Hata", "Şifre güncellenirken bir hata oluştu: " + ex.message, [{ text: 'Tamam' }]);
            }

        }
    };
    const [sifreGoster, setSifreGoster] = useState(false);
    const [formOpacity] = useState(new Animated.Value(0));
    // İsteğe bağlı şifre değişiminin yapılması için animasyonlu şekilde ekranda belirmesi sağlanıyor.
    const sifreDegisim = () => {
        setSifreGoster(!sifreGoster);
        if (sifreGoster) {
            setSifre(''); setSifreTekrar(''); setHata('');
        }
        Animated.timing(formOpacity, { // Eğer CheckBox seçili ise metinler getiriliyor.
            toValue: sifreGoster ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };


    return (
        <View style={{ flex: 1, marginHorizontal: 20 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', }}>

                <View style={{ justifyContent: 'center', }}>
                    <View style={{ justifyContent: 'center', marginVertical: 30, rowGap: 10 }}>
                        <CustomInput placeholder="GSM" onChangeText={setGsm} gsmGirisi veri={gsm1} yukleniyor={yukleniyor} />
                        <CustomInput placeholder="Email" onChangeText={setEmail} emailGirisi veri={email1} yukleniyor={yukleniyor} />
                        <CustomInput placeholder="Adres" onChangeText={setAdres} veri={adres1} yukleniyor={yukleniyor} />
                        <TouchableOpacity onPress={sifreDegisim} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name={sifreGoster ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color={'#03244f'} />
                            <Text style={{ fontSize: 16, color: '#03244f', marginLeft: 10 }}>Şifre Değişikliği</Text>
                        </TouchableOpacity>
                        <Animated.View style={{ gap: 10, marginTop: 10, height: formOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, 160] }), }}>
                            {sifreGoster && (
                                <>
                                    <CustomInput placeholder={'Şifre'} onChangeText={setSifre} secureTextEntry sifreGirisi hata={hata} yenile={yenile} />
                                    <CustomInput placeholder={'Şifre Tekrar'} onChangeText={setSifreTekrar} secureTextEntry sifreGirisi hata={hata} yenile={yenile} />
                                </>
                            )}
                        </Animated.View>


                        <TouchableOpacity
                            style={{ paddingVertical: 10, borderRadius: 20, backgroundColor: '#03244f', alignItems: 'center' }}
                            onPress={verileriGuncelle}
                        >
                            <Text style={{ fontSize: 16, color: '#fff', }}>Güncelle</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </ScrollView >

        </View >
    )
}

export default HastaBilgileriGuncelle;