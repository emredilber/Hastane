import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import CustomDropdown from '../../kompanentler/customDropDown';
import Item from './item';

const Doktorlar = ({ route, navigation }) => {
    const { tc } = route.params;
    const [doktorlar, setDoktorlar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredDoktorlar, setFilteredDoktorlar] = useState([]);
    const [poliklinikler, setPoliklinikler] = useState([]);
    const [yukleniyorPol, setYukleniyorPol] = useState(false);
    const [secilenPoliklinik, setSecilenPoliklinik] = useState('');

    const poliklinikGetir = async () => { // Ekran açıldığı zaman poliklinikler filtreleme yerine listeleniyor.
        setYukleniyorPol(true);
        try {
            const snapshot = await firestore().collection('poliklinikler').orderBy('poliklinikAdı').get();
            let poliklinikVerisi = snapshot.docs.map(doc => ({ title: doc.data().poliklinikAdı }));
            poliklinikVerisi.sort((a, b) => a.title.localeCompare(b.title, 'tr', { sensitivity: 'base' }));
            poliklinikVerisi = [{ title: "Bütün Poliklinikler" }, ...poliklinikVerisi];
            setPoliklinikler(poliklinikVerisi);
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            setYukleniyorPol(false)
        }
    };

    const doktorlarıGetir = async () => { // Doktorlar değişkene atarılıyor.
        try {
            const querySnapshot = await firestore().collection('doktorlar').get();

            const doktorlarList = await Promise.all(querySnapshot.docs.map(async (documentSnapshot) => {
                const sehiri = await firestore().collection('sehirler').
                    doc(documentSnapshot.get('dogumyeri')).get(); // Şehir ve poliklinik isimleri alınıyor.
                const poliklinik = await firestore().collection('poliklinikler').
                    doc(documentSnapshot.get('poliklinik')).get();
                return {
                    tc: documentSnapshot.id,
                    ad: documentSnapshot.get('ad'),
                    soyad: documentSnapshot.get('soyad'),
                    dogumtarihi: documentSnapshot.get('dogumtarihi'),
                    cinsiyet: documentSnapshot.get('cinsiyet'),
                    poliklinik: poliklinik.get('poliklinikAdı'),
                    gsm: documentSnapshot.get('gsm'),
                    dogumyeri: sehiri.get('SehirAdi'),
                    acik: false
                };
            }));
            setDoktorlar(doktorlarList);
            setFilteredDoktorlar(doktorlarList);
        } catch (ex) {
            Alert.alert("Hata", "Veri alınırken bir hata oluştu: " + ex.message, [{ text: "Tamam" }]);
        } finally {
            setLoading(false);
        }
    };

    const doktorSil = async (tc) => {
        try { // Doktor silmek istenildiği zaman çalışacak kodlar
            await firestore().collection('doktorlar').doc(tc).delete();
            setFilteredDoktorlar(prevState => prevState.filter(item => item.tc !== tc));
            setDoktorlar(prevState => prevState.filter(item => item.tc !== tc)); // İki değişkenden de siliniyor.
        } catch (error) {
            Alert.alert("Hata", "Doktor silinirken bir hata oluştu: " + error.message, [{ text: "Tamam" }]);
        }
    };

    useEffect(() => { // Sayfa ilk açıldığı zaman çalışacak kodlar.
        setLoading(true);
        poliklinikGetir();
        doktorlarıGetir();
    }, [])

    useEffect(() => { // Filtrelenen değer olunca otomatik olarak algılayan yapı
        if (secilenPoliklinik !== 'Bütün Poliklinikler') {
            const filteredList = doktorlar.filter(doktor => doktor.poliklinik === secilenPoliklinik);
            setFilteredDoktorlar(filteredList); // Filtrelenen doktorlar değişkene aktarılıyor.

        } else {
            setFilteredDoktorlar(doktorlar); // Filtreme işlemi olmadığı için ilk değerler değişkene aktarılıyor.
        }
    }, [secilenPoliklinik, doktorlar]);

    if (loading) { // Veriler yüklendiği sıra ekranda dönen bir simge çıkıyor.
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#03244f" />
                <Text style={{ color: '#03244f' }}>Veriler yükleniyor...</Text>
            </View>
        );
    }

    const acikMenu = (tc) => {
        // Doktorlar ile ilgili işlem yapmak için kaydırılan kutu eğer açıksa true değeri gönderiliyor.
        setFilteredDoktorlar(prevState =>
            prevState.map(item => ({
                ...item,
                acik: item.tc === tc ? true : false
            }))
        );

    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20, }}>
            {/* Doktorları polikliniğe göre filtreleme yapısı. */}
            <CustomDropdown data={poliklinikler} onSelect={(secilenPol, index) => {
                setSecilenPoliklinik(secilenPol.title);
            }} placeholder="Polikliniğe Göre Filtreleme"
                poliklinikSecimGirisi geciciVeri yukleniyor={yukleniyorPol} style={{ marginTop: 20 }} />

            <FlatList // Doktorları listeleme yapısı.
                showsVerticalScrollIndicator={false}
                data={filteredDoktorlar}
                keyExtractor={(item) => item.tc}
                contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
                renderItem={({ item }) => {
                    return (
                        <View style={{ borderColor: '#D9D9D9', borderWidth: 1.2, borderRadius: 12, }}>
                            <Item item={item} menuAcik={(tc) => {
                                acikMenu(tc);
                            }} doktorSil={doktorSil} navigation={navigation}>
                            </Item>
                        </View>

                    )
                }}
            />
        </View>
    );
};
export default Doktorlar;