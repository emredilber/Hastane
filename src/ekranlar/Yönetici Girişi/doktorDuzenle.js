import React, { useEffect, useState } from 'react';
import { View, Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomInput from '../../kompanentler/custominput';
import CustomDropdown from '../../kompanentler/customDropDown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePicker from '@react-native-community/datetimepicker'

const DoktorGuncelleme = ({ navigation, route }) => {
    const { doktorTc } = route.params;
    const [tcinput, setTcinput] = useState('');
    const [date, setDate] = useState(new Date());
    const [dateGoster, setDateGoster] = useState(false);
    const [yenile, setYenile] = useState(false);
    const [tc, setTc] = useState('');
    const [ad, setAd] = useState('');
    const [soyad, setSoyad] = useState('');
    const [cinsiyet, setCinsiyet] = useState('');
    const [dogumyeri, setDogumyeri] = useState('');
    const [dogumtarihi, setDogumtarihi] = useState('');
    const [poliklinik, setPolikinik] = useState('');
    const [gsm, setGsm] = useState('');
    const [sifre, setSifre] = useState('');

    const [hatavar, setHataVar] = useState('');
    const [tcFocus, setTcFocus] = useState();
    const [tcBlur, setTcBlur] = useState();
    const [yukleniyorTc, setYukleniyorTc] = useState(false);
    const [yukleniyorAd, setYukleniyorAd] = useState(false);
    const [yukleniyorSoyad, setYukleniyorSoyad] = useState(false);
    const [yukleniyorCinsiyet, setYukleniyorCinsiyet] = useState(false);
    const [yukleniyorDogumTarihi, setYukleniyorDogumTarihi] = useState(false);
    const [yukleniyorGsm, setYukleniyorGsm] = useState(false);
    const [yukleniyorSifre, setYukleniyorSifre] = useState(false);
    const [yukleniyorPol, setYukleniyorPol] = useState(false);
    const [yukleniyorSehir, setYukleniyorSehir] = useState(false);

    const [ad1, setAd1] = useState('');
    const [soyad1, setSoyad1] = useState('');
    const [cinsiyet1, setCinsiyet1] = useState('');
    const [dogumyeri1, setDogumyeri1] = useState();
    const [dogumtarihi1, setDogumtarihi1] = useState('');
    const [poliklinik1, setPolikinik1] = useState();
    const [gsm1, setGsm1] = useState('');
    const [sifre1, setSifre1] = useState('');

    const [sehirler, setSehirler] = useState([]);
    const [poliklinikler, setPoliklinikler] = useState([]);

    const poliklinikGetir = async () => { // Sayfa açıldığında poliklinikler yükleniyor.

        try {
            const snapshot = await firestore().collection('poliklinikler').orderBy('poliklinikAdı').get();
            let poliklinikVerisi = snapshot.docs.map(doc => ({ title: doc.data().poliklinikAdı }));
            poliklinikVerisi.sort((a, b) => a.title.localeCompare(b.title, 'tr', { sensitivity: 'base' }));
            setPoliklinikler(poliklinikVerisi);
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            setYukleniyorPol(false);
        }

    };

    const sehirleriGetir = async () => { // Sayfa açıldığında şehirler yükleniyor.
        try {
            const snapshot = await firestore().collection('sehirler').orderBy('SehirAdi').get();
            const fetchedData = snapshot.docs.map(doc => ({ title: doc.data().SehirAdi }));
            fetchedData.sort((a, b) => a.title.localeCompare(b.title, 'tr', { sensitivity: 'base' }));
            setSehirler(fetchedData);
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            setYukleniyorSehir(false);
        }
    };

    const verileriGetir = async (numarası) => { // Veriler veri tabanından alınıyor ve değişkenlere aktarılıyor.
        setYenile(false);
        setYukleniyorTc(true);
        setYukleniyorAd(true);
        setYukleniyorSoyad(true);
        setYukleniyorCinsiyet(true);
        setYukleniyorDogumTarihi(true);
        setYukleniyorGsm(true);
        setYukleniyorSifre(true);
        setYukleniyorSehir(true);
        setYukleniyorPol(true);

        try {
            const veri = await firestore().collection('doktorlar').doc(numarası).get();
            if (veri.exists) {
                let sehirCevir = await firestore().collection('sehirler').doc(veri.get('dogumyeri')).get();
                let polCevir = await firestore().collection('poliklinikler').doc(veri.get('poliklinik')).get();
                setAd1(veri.get('ad')); // Alınan veriler metinlerde gözükmesi için bir değişken daha kullanılıyor.
                setSoyad1(veri.get('soyad'));
                setCinsiyet1(veri.get('cinsiyet'));
                setDogumyeri1({ title: sehirCevir.get('SehirAdi') });
                setDogumtarihi1(veri.get('dogumtarihi'));
                setPolikinik1({ title: polCevir.get('poliklinikAdı') })
                setGsm1(veri.get('gsm'));
                setSifre1(veri.get('şifre'));
                setAd(veri.get('ad'));
                setSoyad(veri.get('soyad'));
                setCinsiyet(veri.get('cinsiyet'));
                setDogumyeri(sehirCevir.get('SehirAdi'));
                setDogumtarihi(veri.get('dogumtarihi'));
                setPolikinik(polCevir.get('poliklinikAdı'));
                setGsm(veri.get('gsm'));
                setSifre(veri.get('şifre'));
            }
        } catch (ex) {
            Alert.alert('Hata', ex.message)
        } finally {
            setYukleniyorTc(false);
            setYukleniyorAd(false);
            setYukleniyorSoyad(false);
            setYukleniyorCinsiyet(false);;
            setYukleniyorDogumTarihi(false);
            setYukleniyorGsm(false);
            setYukleniyorSifre(false);
            setYukleniyorSehir(false);
            setYukleniyorPol(false);
        }
    }

    const doktorDüzenle = async () => { // Düzenleme butonuna basıldığında...
        if (cinsiyet === '') { // Hata kontrolü yapılıyor.
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
            let sehirSnapshot = await firestore()
                .collection('sehirler')
                .where('SehirAdi', '==', dogumyeri)
                .get();

            const sehirId = sehirSnapshot.docs[0].id;
            let polCevir = await firestore().collection('poliklinikler').where('poliklinikAdı', '==', poliklinik).get();
            let polid = polCevir.docs[0].id;
            const kaydet = firestore().collection('doktorlar').doc(tcinput);
            const user = {
                ad: ad,
                soyad: soyad,
                cinsiyet: cinsiyet,
                dogumyeri: sehirId,
                dogumtarihi: dogumtarihi,
                poliklinik: polid,
                gsm: gsm,
                şifre: sifre
            };
            await kaydet.set(user, { merge: true });
            setYenile(true); // Veriler kaydediliyor ve ardından değişkenden temizleniyor.
            setYenile(false);
            setCinsiyet('');
            setDogumtarihi('');
            setAd1('');
            setSoyad1('');
            setCinsiyet1('');
            setDogumyeri1(sehirler[0]);
            setDogumtarihi1('');
            setPolikinik1(poliklinikler[0]);
            setGsm1('');
            setSifre1('');

            Alert.alert('Bilgi', 'Doktor kaydedildi.', [{ text: 'Tamam' }]);

        } catch (ex) {
            Alert.alert('Hata', `Firestore'a veri eklenirken bir hata oluştu: ${ex.message}`, [{ text: 'Tamam' }]);
        }
    };

    useEffect(() => { // TC girilip kutudan çıkınca doktor araması yapılıyor.
        async function verigetirme() {
            if (hatavar === '' && tcBlur) {
                try {
                    const veriGetir = await firestore().collection('doktorlar').doc(tc).get();
                    if (veriGetir.exists) {
                        setTcinput(tc);
                        await verileriGetir(tc); // Doktor verileri tekrar getiriliyor.
                    } else {
                        Alert.alert('Hata', 'Doktor bulunamadı!');
                    }
                } catch (ex) {
                    Alert.alert('Hata', 'Veri getirme hatası! ' + ex.message);
                }
            } else if (hatavar !== '') {
                Alert.alert('Hata', hatavar);
            }
        }
        verigetirme();
    }, [tcBlur])

    useEffect(() => {
        // Eğer doktorların listelendiği ekrandan kutuyu kaydırıp düzenle 
        // butonuna basılırsa oradaki TC buraya gönderilip verileri getirme işlemi başlatılır.
        const datagetir = async () => {
            setCinsiyet('');
            setDogumtarihi('');
            setTcinput('');
            setAd1('');
            setSoyad1('');
            setCinsiyet1('');
            setDogumyeri1(sehirler[0]);
            setDogumtarihi1('');
            setPolikinik1(poliklinikler[0]);
            setGsm1('');
            setSifre1('');
            setYenile(true);
            setYukleniyorTc(true);
            setYukleniyorAd(true);
            setYukleniyorSoyad(true);
            setYukleniyorCinsiyet(true);
            setYukleniyorDogumTarihi(true);
            setYukleniyorGsm(true);
            setYukleniyorSifre(true);
            setYukleniyorSehir(true);
            setYukleniyorPol(true);
            await poliklinikGetir();
            await sehirleriGetir();
            await verileriGetir(doktorTc);
            setTcinput(doktorTc);
        }
        datagetir();
    }, [doktorTc])


    const tarihDegisimi = (event, selectedDate) => {
        setDateGoster(false);
        setDate(selectedDate)
        const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}.${(
            selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getFullYear()}`;
        setDogumtarihi(formattedDate);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ScrollView style={{ marginHorizontal: 20 }} showsVerticalScrollIndicator={false}>
                <View style={{ justifyContent: 'center', marginVertical: 30, rowGap: 10 }}>
                    <CustomInput placeholder="TC" onChangeText={setTc} tcGirisi yenile={yenile} veri={tcinput}
                        focusDurum={setTcFocus} blurDurum={setTcBlur} yukleniyor={yukleniyorTc} hatavar={setHataVar} yenileme />
                    <CustomInput placeholder="Ad" onChangeText={setAd} adGirisi yenile={yenile} veri={ad1} yukleniyor={yukleniyorAd} yenileme />
                    <CustomInput placeholder="Soyad" onChangeText={setSoyad} soyadGirisi yenile={yenile} veri={soyad1} yukleniyor={yukleniyorSoyad} yenileme />
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
                            <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                                {yukleniyorCinsiyet && <ActivityIndicator color='#03244f' size={20} />}
                                {cinsiyet1 !== cinsiyet &&
                                    < TouchableOpacity style={{ width: 24 }} onPress={() => { setCinsiyet(cinsiyet1) }}>
                                        <Icon name="restore" size={24} color={'#03244f'} />
                                    </TouchableOpacity>
                                }
                            </View>
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
                    <CustomDropdown data={poliklinikler} onSelect={(secilenPol) => { setPolikinik(secilenPol.title); }}
                        placeholder="Poliklinik Seçimi" poliklinikSecimGirisi veri={poliklinik} yukleniyor={yukleniyorPol} yenileme={poliklinik1} geciciVeri />
                    <CustomDropdown data={sehirler} onSelect={(selectedItem) => { setDogumyeri(selectedItem.title); }}
                        placeholder="Doğum Yeri" dogumYeriGirisi veri={dogumyeri} yukleniyor={yukleniyorSehir} yenileme={dogumyeri1} geciciVeri />
                    <TouchableOpacity onPress={() => { setDateGoster(true) }} >
                        <CustomInput placeholder="Doğum Tarihi" onChangeText={setDogumtarihi} veri={dogumtarihi} dgt
                            dogumTarihiYenile={dogumtarihi1} disable={false} yenile={yenile} yukleniyor={yukleniyorDogumTarihi} />
                    </TouchableOpacity>
                    {dateGoster && (<DateTimePicker value={date} mode="date" display="compact" onChange={tarihDegisimi} />)}

                    <CustomInput placeholder="GSM" onChangeText={setGsm} gsmGirisi yenile={yenile} veri={gsm1} yukleniyor={yukleniyorGsm} yenileme />
                    <CustomInput placeholder="Şifre" onChangeText={setSifre} secureTextEntry sifreGirisi yenile={yenile}
                        veri={sifre1} yukleniyor={yukleniyorSifre} yenileme />
                    <TouchableOpacity
                        style={{ paddingVertical: 10, borderRadius: 20, backgroundColor: '#03244f', alignItems: 'center', }}
                        onPress={doktorDüzenle}
                    >
                        <Text style={{ fontSize: 16, color: '#fff', }}>Doktoru Düzenle</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

export default DoktorGuncelleme;
