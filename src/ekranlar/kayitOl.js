import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Button, Alert, SafeAreaView, ScrollView, Platform, Image, Text, Animated, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomInput from '../kompanentler/custominput';
import CustomDropdown from '../kompanentler/customDropDown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/SimpleLineIcons'
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker  from '@react-native-community/datetimepicker';

const KayitOl = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [dateGoster, setDateGoster] = useState(false);
    const [yenile, setYenile] = useState(false);
    const [tc, setTc] = useState('');
    const [ad, setAd] = useState('');
    const [soyad, setSoyad] = useState('');
    const [cinsiyet, setCinsiyet] = useState('');
    const [dogumyeri, setDogumyeri] = useState('');
    const [dogumtarihi, setDogumtarihi] = useState('');
    const [kangrubu, setKangrubu] = useState('');
    const [gsm, setGsm] = useState('');
    const [email, setEmail] = useState('');
    const [adres, setAdres] = useState('');
    const [sifre, setSifre] = useState('');
    const [yukleniyorSehir, setYukleniyorSehir] = useState(false);

    const [kanGrupları,setKanGrupları] = useState([
        { title: 'AB Rh+' },
        { title: 'AB Rh-' },
        { title: 'A Rh+' },
        { title: 'A Rh-' },
        { title: 'B Rh+' },
        { title: 'B Rh-' },
        { title: '0 Rh+' },
        { title: '0 Rh-' },
    ]);
    const [sehirler, setSehirler] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setYukleniyorSehir(true);
            try {
                const snapshot = await firestore().collection('sehirler').orderBy('SehirAdi').get();
                const fetchedData = snapshot.docs.map(doc => ({ title: doc.data().SehirAdi }));
                fetchedData.sort((a, b) => a.title.localeCompare(b.title, 'tr', { sensitivity: 'base' }));
                setSehirler(fetchedData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            } finally {
                setYukleniyorSehir(false)
            }
        };
        fetchData();
    }, []);


    const handleRegister = async () => {
        if (cinsiyet === '') {
            setCinsiyet('girilmedi');
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        }
        if (email && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            // Eğer e-posta doğrulaması yapılmak isteniyorsa ve geçersizse hata göster
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if (sifre && sifre.length < 1) {
            // Eğer şifre doğrulaması yapılmak isteniyorsa ve kısa ise hata göster
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if ((tc || gsm) && tc !== '' && gsm !== '' && !/^\d+$/.test(tc) && !/^\d+$/.test(gsm)) {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if (ad && ad.length < 3) {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if (soyad && soyad.length < 3) {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if (tc && tc.length < 11) {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if (gsm && gsm.length < 10) {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if (gsm && !/^(05\d{9})$/.test(gsm)) {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if (dogumtarihi && !/^([0-9]{2})\.([0-9]{2})\.([0-9]{4})$/.test(dogumtarihi)) {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        } else if (kangrubu === '' || dogumtarihi === '') {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        }

        try {
            const sehirSnapshot = await firestore()
                .collection('sehirler')
                .where('SehirAdi', '==', dogumyeri)
                .get();


            const sehirId = sehirSnapshot.docs[0].id;
            const kaydet = firestore().collection('hastalar').doc(tc);
            const sorgu = await kaydet.get();
            if (!sorgu.exists) {
                const user = {
                    tc: tc,
                    ad: ad,
                    soyad: soyad,
                    cinsiyet: cinsiyet,
                    dogumyeri: sehirId,
                    dogumtarihi: dogumtarihi,
                    kangrubu: kangrubu,
                    gsm: gsm,
                    email: email,
                    adres: adres,
                    şifre: sifre
                };
                await kaydet.set(user);
            }
            else {
                Alert.alert('Hata', "Böyle bir kullanıcı zaten var!", [{ text: 'Tamam' }]);
            }
            setYenile(true);
            setYenile(false);
            setCinsiyet('');
            setDogumtarihi('');
            Alert.alert('Bilgi', 'Veri başarıyla Firestore\'a kaydedildi.', [{ text: 'Tamam' }]);
        } catch (ex) {
            Alert.alert('Hata', `Firestore'a veri eklenirken bir hata oluştu: ${ex.message}`, [{ text: 'Tamam' }]);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setYenile(false);
        }, [])
    );
    
    const tarihDegisimi = (event, selectedDate) => {
        setDateGoster(false);
        setDate(selectedDate)
        const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getFullYear()}`;
        setDogumtarihi(formattedDate);
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ height: 90, backgroundColor: '#03244f', zIndex: 999, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, gap: 10, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Image source={require('../assets/iaü.png')} style={{ width: 60, height: 60 }} />
                    <View style={{}}>
                        <Text style={{ color: '#fff', }}>İSTANBUL AYDIN ÜNİVERSİTESİ{'\n'}VM MEDİCAL PARK HASTANESİ</Text>
                        <Text style={{ color: '#fff', fontSize: 13, marginTop: 10 }}>Kayıt Ol</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon2 name='arrow-left-circle' size={35} color='#fff' />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ marginHorizontal: 20 }} showsVerticalScrollIndicator={false}>
                <View style={{ justifyContent: 'center', marginVertical: 30, rowGap: 10 }}>
                    <CustomInput placeholder="TC" onChangeText={setTc} tcGirisi yenile={yenile} />
                    <CustomInput placeholder="Ad" onChangeText={setAd} adGirisi yenile={yenile} />
                    <CustomInput placeholder="Soyad" onChangeText={setSoyad} soyadGirisi yenile={yenile} />
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <TouchableOpacity
                                style={{
                                    width: 175, height: 50, borderWidth: cinsiyet === "Erkek" ? null : 1, borderRadius: 6, borderColor: '#eee',
                                    backgroundColor: cinsiyet === "Erkek" ? '#03244f' : '#fff',
                                    paddingHorizontal: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'
                                }} onPress={() => setCinsiyet('Erkek')}>
                                <Text style={{ color: cinsiyet === "Erkek" ? '#fff' : '#03244f' }}>Erkek</Text>
                                <Icon name='gender-male' size={32} color={cinsiyet === 'Erkek' ? '#fff' : '#03244f'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: 175, height: 50, borderWidth: cinsiyet === "Kadın" ? null : 1, borderRadius: 6, borderColor: '#eee',
                                    backgroundColor: cinsiyet === "Kadın" ? '#03244f' : '#fff',
                                    paddingHorizontal: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'
                                }} onPress={() => setCinsiyet('Kadın')}>
                                <Text style={{ color: cinsiyet === "Kadın" ? '#fff' : '#03244f' }}>Kadın</Text>
                                <Icon name='gender-female' size={32} color={cinsiyet === 'Kadın' ? '#fff' : '#03244f'} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ marginTop: 5, fontSize: 14, color: 'red' }}>{cinsiyet === 'girilmedi' && 'Cinsiyet seçiniz.'}</Text>
                    </View>
                    <CustomDropdown data={kanGrupları} onSelect={(selectedItem) => { setKangrubu(selectedItem.title); }} placeholder="Kan Grubu" kanGrubuGirisi geciciVeri />
                    <CustomDropdown data={sehirler} onSelect={(selectedItem) => { setDogumyeri(selectedItem.title); }} placeholder="Doğum Yeri" dogumYeriGirisi geciciVeri yukleniyor={yukleniyorSehir} />
                    <TouchableOpacity onPress={() => { setDateGoster(true) }} >
                        <CustomInput placeholder="Doğum Tarihi" veri={dogumtarihi} disable={false} yenile={yenile}/>
                    </TouchableOpacity>
                    {dateGoster && (<DateTimePicker value={date} mode="date" display="compact" onChange={tarihDegisimi} />)}
                    <CustomInput placeholder="GSM" onChangeText={setGsm} gsmGirisi yenile={yenile} />
                    <CustomInput placeholder="Email" onChangeText={setEmail} emailGirisi yenile={yenile} />
                    <CustomInput placeholder="Adres" onChangeText={setAdres} yenile={yenile} />
                    <CustomInput placeholder="Şifre" onChangeText={setSifre} secureTextEntry sifreGirisi yenile={yenile} />
                    <TouchableOpacity
                        style={{ paddingVertical: 10, borderRadius: 20, backgroundColor: '#03244f', alignItems: 'center', }}
                        onPress={handleRegister}
                    >
                        <Text style={{ fontSize: 16, color: '#fff', }}>Kayıt Ol</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default KayitOl;
