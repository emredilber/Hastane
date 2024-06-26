import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Alert, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomInput from '../../kompanentler/custominput';
import CustomDropdown from '../../kompanentler/customDropDown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'

const DoktorKaydet = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [dateGoster, setDateGoster] = useState(false);
    const [yenile, setYenile] = useState(false);
    const [tc, setTc] = useState('');
    const [ad, setAd] = useState('');
    const [soyad, setSoyad] = useState('');
    const [cinsiyet, setCinsiyet] = useState('');
    const [dogumyeri, setDogumyeri] = useState('');
    const [dogumtarihi, setDogumtarihi] = useState('');
    const [gsm, setGsm] = useState('');
    const [sifre, setSifre] = useState('');
    const [yukleniyorPol, setYukleniyorPol] = useState(false);
    const [yukleniyorSehir, setYukleniyorSehir] = useState(false);

    const [secilenPoliklinikId, setSecilenPoliklinikId] = useState('');
    const [sehirler, setSehirler] = useState([]);
    const [poliklinikler, setPoliklinikler] = useState([]);

    const poliklinikGetir = async () => { // Polikklinik adları getiriliyor.
        setYukleniyorPol(true);
        try {
            const snapshot = await firestore().collection('poliklinikler').orderBy('poliklinikAdı').get();
            let poliklinikVerisi = snapshot.docs.map(doc => ({ title: doc.data().poliklinikAdı }));
            poliklinikVerisi.sort((a, b) => a.title.localeCompare(b.title, 'tr', { sensitivity: 'base' }));
            setPoliklinikler(poliklinikVerisi);
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            setYukleniyorPol(false)
        }
    };

    const sehirleriGetir = async () => { // Şehir adları getiriliyor.
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

    const handleRegister = async () => { // Kaydet butonuna basınca olacaklar.
        if (cinsiyet === '') { // Hata tespiti yapılıyor.
            setCinsiyet('girilmedi');
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        }
        if (sifre && sifre.length < 1) {
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
        } else if (dogumtarihi === '') {
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        }

        try {
            const sehirSnapshot = await firestore()
                .collection('sehirler')
                .where('SehirAdi', '==', dogumyeri)
                .get(); // Şehirin id'si alınıyor.


            const sehirId = sehirSnapshot.docs[0].id;
            const kaydet = firestore().collection('doktorlar').doc(tc);
            const sorgu = await kaydet.get(); // Kaydedilecek döküman referansı alınıyor.
            if (!sorgu.exists) {
                const user = {
                    tc: tc,
                    ad: ad,
                    soyad: soyad,
                    cinsiyet: cinsiyet,
                    dogumyeri: sehirId,
                    dogumtarihi: dogumtarihi,
                    poliklinik: secilenPoliklinikId,
                    gsm: gsm,
                    şifre: sifre
                };
                await kaydet.set(user); // Kaydediliyor.
                setYenile(true);
                setYenile(false);
                setCinsiyet('');
                setDogumtarihi('');
                Alert.alert('Bilgi', 'Doktor kaydedildi.', [{ text: 'Tamam' }]);
            }
            else {
                Alert.alert('Hata', "Böyle bir kullanıcı zaten var!", [{ text: 'Tamam' }]);
            }
        } catch (ex) {
            Alert.alert('Hata', `Firestore'a veri eklenirken bir hata oluştu: ${ex.message}`, [{ text: 'Tamam' }]);
        } finally {

        }
    };

    useFocusEffect( // Sayfa ilk açıldığı zaman bu işlemler yürütülüyor.
        useCallback(() => {
            setYenile(false);
            poliklinikGetir();
            sehirleriGetir();
        }, [])
    );

    const tarihDegisimi = (event, selectedDate) => {
        setDateGoster(false);
        setDate(selectedDate) // Tarihi string formatına çevirme.
        const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}.${(
            selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getFullYear()}`;
        setDogumtarihi(formattedDate);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>

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
                    <CustomDropdown data={poliklinikler} onSelect={async (secilenPol) => {
                        let poladi = await firestore().collection('poliklinikler').where('poliklinikAdı', '==', secilenPol.title).get();
                        setSecilenPoliklinikId(poladi.docs[0].id);
                    }} placeholder="Poliklinik Seçimi" poliklinikSecimGirisi geciciVeri yukleniyor={yukleniyorPol} />
                    <CustomDropdown data={sehirler} onSelect={(selectedItem) => { setDogumyeri(selectedItem.title); }}
                        placeholder="Doğum Yeri" dogumYeriGirisi geciciVeri yukleniyor={yukleniyorSehir} />
                    <TouchableOpacity onPress={() => { setDateGoster(true) }} >
                        <CustomInput placeholder="Doğum Tarihi" veri={dogumtarihi} disable={false} yenile={yenile} />
                    </TouchableOpacity>
                    {dateGoster && (<DateTimePicker value={date} mode="date" display="compact" onChange={tarihDegisimi} />)}

                    <CustomInput placeholder="GSM" onChangeText={setGsm} gsmGirisi yenile={yenile} />
                    <CustomInput placeholder="Şifre" onChangeText={setSifre} secureTextEntry sifreGirisi yenile={yenile} />
                    <TouchableOpacity
                        style={{ paddingVertical: 10, borderRadius: 20, backgroundColor: '#03244f', alignItems: 'center', }}
                        onPress={handleRegister}
                    >
                        <Text style={{ fontSize: 16, color: '#fff', }}>Doktoru Kaydet</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DoktorKaydet;
