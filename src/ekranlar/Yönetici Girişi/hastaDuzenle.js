import React, { useEffect, useState } from 'react';
import { View, Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomInput from '../../kompanentler/custominput';
import CustomDropdown from '../../kompanentler/customDropDown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePicker from '@react-native-community/datetimepicker'

const HastaGuncelleme = ({ navigation, route }) => {
    const { hastaTc } = route.params;
    const [tcinput, setTcinput] = useState('');
    const [date, setDate] = useState(new Date());
    const [dateGoster, setDateGoster] = useState(false);
    const [yenile, setYenile] = useState(false);
    const [tc, setTc] = useState('');
    const [ad, setAd] = useState('');
    const [soyad, setSoyad] = useState('');
    const [dogumtarihi, setDogumtarihi] = useState('');
    const [dogumyeri, setDogumyeri] = useState('');
    const [cinsiyet, setCinsiyet] = useState('');
    const [kanGrubu, setKangrubu] = useState('');
    const [email, setEmail] = useState('');
    const [adres, setAdres] = useState('');
    const [gsm, setGsm] = useState('');
    const [sifre, setSifre] = useState('');

    const [hatavar, setHataVar] = useState('');
    const [tcFocus, setTcFocus] = useState();
    const [tcBlur, setTcBlur] = useState();
    const [yukleniyorTc, setYukleniyorTc] = useState(false);
    const [yukleniyorAd, setYukleniyorAd] = useState(false);
    const [yukleniyorSoyad, setYukleniyorSoyad] = useState(false);
    const [yukleniyorDogumTarihi, setYukleniyorDogumTarihi] = useState(false);
    const [yukleniyorSehir, setYukleniyorSehir] = useState(false);
    const [yukleniyorCinsiyet, setYukleniyorCinsiyet] = useState(false);
    const [yukleniyorKanGrubu, setYukleniyorKangrubu] = useState(false);
    const [yukleniyorEmail, setYukleniyorEmail] = useState(false);
    const [yukleniyorAdres, setYukleniyorAdres] = useState(false);
    const [yukleniyorGsm, setYukleniyorGsm] = useState(false);
    const [yukleniyorSifre, setYukleniyorSifre] = useState(false);

    const [ad1, setAd1] = useState('');
    const [soyad1, setSoyad1] = useState('');
    const [dogumtarihi1, setDogumtarihi1] = useState('');
    const [dogumyeri1, setDogumyeri1] = useState();
    const [cinsiyet1, setCinsiyet1] = useState('');
    const [kanGrubu1, setKangrubu1] = useState();
    const [email1, setEmail1] = useState('');
    const [adres1, setAdres1] = useState('');
    const [gsm1, setGsm1] = useState('');
    const [sifre1, setSifre1] = useState('');
    const [kanGrupları, setKanGrupları] = useState([
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
        setYukleniyorDogumTarihi(true);
        setYukleniyorSehir(true);
        setYukleniyorCinsiyet(true);
        setYukleniyorKangrubu(true);
        setYukleniyorEmail(true);
        setYukleniyorAdres(true);
        setYukleniyorGsm(true);
        setYukleniyorSifre(true);

        try {
            const veri = await firestore().collection('hastalar').doc(numarası).get();
            if (veri.exists) {
                let sehirCevir = await firestore().collection('sehirler').doc(veri.get('dogumyeri')).get();
                setAd1(veri.get('ad')); // Alınan veriler metinlerde gözükmesi için bir değişken daha kullanılıyor.
                setSoyad1(veri.get('soyad'));
                setDogumtarihi1(veri.get('dogumtarihi'));
                setDogumyeri1({ title: sehirCevir.get('SehirAdi') });
                setCinsiyet1(veri.get('cinsiyet'));
                setKangrubu1({ title: veri.get('kangrubu') });
                setEmail1(veri.get('email'));
                setAdres1(veri.get('adres'));
                setGsm1(veri.get('gsm'));
                setSifre1(veri.get('şifre'));
                setAd(veri.get('ad'));
                setSoyad(veri.get('soyad'));
                setDogumtarihi(veri.get('dogumtarihi'));
                setDogumyeri(sehirCevir.get('SehirAdi'));
                setCinsiyet(veri.get('cinsiyet'));
                setKangrubu(veri.get('kangrubu'));
                setEmail(veri.get('email'));
                setAdres(veri.get('adres'));
                setGsm(veri.get('gsm'));
                setSifre(veri.get('şifre'));
            }
        } catch (ex) {
            Alert.alert('Hata', ex.message)
        } finally {
            setYukleniyorTc(false);
            setYukleniyorAd(false);
            setYukleniyorSoyad(false);
            setYukleniyorDogumTarihi(false);
            setYukleniyorSehir(false);
            setYukleniyorCinsiyet(false);
            setYukleniyorKangrubu(false);
            setYukleniyorEmail(false);
            setYukleniyorAdres(false);
            setYukleniyorGsm(false);
            setYukleniyorSifre(false);
        }
    }

    const hastaDüzenle = async () => { // Düzenleme butonuna basıldığında...
        if (cinsiyet === '') { // Hata kontrolü yapılıyor.
            setCinsiyet('girilmedi');
            Alert.alert('Hata', "Girilen bilgileri kontrol et!", [{ text: 'Tamam' }]);
            return;
        }
        if (sifre && sifre.length < 1) {
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
            const kaydet = firestore().collection('hastalar').doc(tcinput);
            const user = {
                ad: ad,
                soyad: soyad,
                dogumtarihi: dogumtarihi,
                dogumyeri: sehirId,
                cinsiyet: cinsiyet,
                kangrubu: kanGrubu,
                email: email,
                adres: adres,
                gsm: gsm,
                şifre: sifre
            };
            await kaydet.set(user, { merge: true });
            setYenile(true); // Veriler kaydediliyor ve ardından değişkenden temizleniyor.
            setYenile(false);
            setAd1('');
            setSoyad1('');
            setDogumtarihi('');
            setDogumyeri1(sehirler[0]);
            setKangrubu1(kanGrupları[0]);
            setAdres('');
            setAdres1('');
            setEmail('');
            setEmail1('');
            setCinsiyet('');
            setCinsiyet1('');
            setDogumtarihi1('');
            setGsm1('');
            setSifre1('');

            Alert.alert('Bilgi', 'Hasta kaydedildi.', [{ text: 'Tamam' }]);

        } catch (ex) {
            Alert.alert('Hata', `Firestore'a veri eklenirken bir hata oluştu: ${ex.message}`, [{ text: 'Tamam' }]);
        }
    };

    useEffect(() => { // TC girilip kutudan çıkınca doktor araması yapılıyor.
        async function verigetirme() {
            if (hatavar === '' && tcBlur) {
                try {
                    const veriGetir = await firestore().collection('hastalar').doc(tc).get();
                    if (veriGetir.exists) {
                        setTcinput(tc);
                        await verileriGetir(tc); // Hasta verileri tekrar getiriliyor.
                    } else {
                        Alert.alert('Hata', 'Hasta bulunamadı!');
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
            setKangrubu1(kanGrupları[0]);
            setDogumtarihi1('');
            setEmail1('');
            setAdres1('');
            setGsm1('');
            setSifre1('');
            setYenile(true);
            setYukleniyorTc(true);
            setYukleniyorAd(true);
            setYukleniyorSoyad(true);
            setYukleniyorDogumTarihi(true);
            setYukleniyorSehir(true);
            setYukleniyorCinsiyet(true);
            setYukleniyorKangrubu(true);
            setYukleniyorEmail(true);
            setYukleniyorAdres(true);
            setYukleniyorGsm(true);
            setYukleniyorSifre(true);
            await sehirleriGetir();
            await verileriGetir(hastaTc);
            setTcinput(hastaTc);
        }
        datagetir();
    }, [hastaTc])


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
                    <CustomDropdown data={sehirler} onSelect={(selectedItem) => { setDogumyeri(selectedItem.title); }}
                        placeholder="Doğum Yeri" dogumYeriGirisi veri={dogumyeri} yukleniyor={yukleniyorSehir} yenileme={dogumyeri1} geciciVeri />
                    <TouchableOpacity onPress={() => { setDateGoster(true) }} >
                        <CustomInput placeholder="Doğum Tarihi" onChangeText={setDogumtarihi} veri={dogumtarihi}
                            dgt dogumTarihiYenile={dogumtarihi1} disable={false} yenile={yenile} yukleniyor={yukleniyorDogumTarihi} />
                    </TouchableOpacity>
                    {dateGoster && (<DateTimePicker value={date} mode="date" display="compact" onChange={tarihDegisimi} />)}
                    <CustomDropdown data={kanGrupları} onSelect={(selectedItem) => { setKangrubu(selectedItem.title); }}
                        placeholder="Kan Grubu" kanGrubuGirisi veri={kanGrubu} yukleniyor={yukleniyorAdres} yenileme={kanGrubu1} geciciVeri />

                    <CustomInput placeholder="Email" onChangeText={setEmail} emailGirisi yenile={yenile} veri={email1} yukleniyor={yukleniyorEmail} yenileme />
                    <CustomInput placeholder="Adres" onChangeText={setAdres} adresGirisi yenile={yenile} veri={adres1} yukleniyor={yukleniyorAdres} yenileme />
                    <CustomInput placeholder="GSM" onChangeText={setGsm} gsmGirisi yenile={yenile} veri={gsm1} yukleniyor={yukleniyorGsm} yenileme />
                    <CustomInput placeholder="Şifre" onChangeText={setSifre} secureTextEntry sifreGirisi yenile={yenile} veri={sifre1} yukleniyor={yukleniyorSifre} yenileme />
                    <TouchableOpacity
                        style={{ paddingVertical: 10, borderRadius: 20, backgroundColor: '#03244f', alignItems: 'center', }}
                        onPress={hastaDüzenle}
                    >
                        <Text style={{ fontSize: 16, color: '#fff', }}>Hastayı Düzenle</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

export default HastaGuncelleme;
