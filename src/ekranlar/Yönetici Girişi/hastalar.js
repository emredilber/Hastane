import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import Item from './item hasta';
import CustomInput from '../../kompanentler/custominput';

const Hastalar = ({ route, navigation }) => {
    const { tc } = route.params;
    const [hastalar, setHastalar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredHastalar, setFilteredHastalar] = useState([]);
    const [arananHasta, setArananHasta] = useState('');

    const hastalarıGetir = async () => { // Hastalar değişkene atarılıyor.
        try {
            const querySnapshot = await firestore().collection('hastalar').get();

            const hastalarList = await Promise.all(querySnapshot.docs.map(async (documentSnapshot) => {
                const sehiri = await firestore().collection('sehirler').
                    doc(documentSnapshot.get('dogumyeri')).get(); // Şehir isimleri alınıyor.
                return {
                    tc: documentSnapshot.id,
                    ad: documentSnapshot.get('ad'),
                    soyad: documentSnapshot.get('soyad'),
                    dogumtarihi: documentSnapshot.get('dogumtarihi'),
                    dogumyeri: sehiri.get('SehirAdi'),
                    cinsiyet: documentSnapshot.get('cinsiyet'),
                    kangrubu: documentSnapshot.get('kangrubu'),
                    email: documentSnapshot.get('email'),
                    adres: documentSnapshot.get('adres'),
                    gsm: documentSnapshot.get('gsm'),
                    acik: false
                };
            }));
            setHastalar(hastalarList);
            setFilteredHastalar(hastalarList);
        } catch (ex) {
            Alert.alert("Hata", "Veri alınırken bir hata oluştu: " + ex.message, [{ text: "Tamam" }]);
        } finally {
            setLoading(false);
        }
    };

    const hastaSil = async (tc) => { // Hasta silmek istenildiği zaman çalışacak kodlar.
        try {
            await firestore().collection('hastalar').doc(tc).delete();
            setFilteredHastalar(prevState => prevState.filter(item => item.tc !== tc));
            setHastalar(prevState => prevState.filter(item => item.tc !== tc)); // İki değişkenden de siliniyor.
        } catch (error) {
            Alert.alert("Hata", "Hasta silinirken bir hata oluştu: " + error.message, [{ text: "Tamam" }]);
        }
    };

    useEffect(() => { // Sayfa ilk açıldığı zaman çalışacak kodlar.
        setLoading(true);
        hastalarıGetir();
    }, [])


    useEffect(() => { // Filtrelenen değer olunca otomatik olarak algılayan yapı.
        if (arananHasta !== '') {
            const filteredList = hastalar.filter(hasta =>
                hasta.ad.toLowerCase().includes(arananHasta.toLowerCase()) ||
                hasta.soyad.toLowerCase().includes(arananHasta.toLowerCase()) ||
                `${hasta.ad.toLowerCase()} ${hasta.soyad.toLowerCase()}`.includes(arananHasta.toLowerCase())
            );
            setFilteredHastalar(filteredList); // Filtrelenen hastalardeğişkene aktarılıyor.

        } else {
            setFilteredHastalar(hastalar); // Filtreme işlemi olmadığı için ilk değerler değişkene aktarılıyor.
        }
    }, [arananHasta, hastalar]);

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
        setFilteredHastalar(prevState =>
            prevState.map(item => ({
                ...item,
                acik: item.tc === tc ? true : false
            }))
        );

    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20, }}>
            {/* Hastaları adı veya soyadına göre filtreleme yapısı. */}
            <CustomInput placeholder="Aranan Hasta" onChangeText={setArananHasta} containerStyle={{ marginTop: 20 }} />

            <FlatList // Hastaları listeleme yapısı.
                showsVerticalScrollIndicator={false}
                data={filteredHastalar}
                keyExtractor={(item) => item.tc}
                contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
                renderItem={({ item }) => {
                    return (
                        <View style={{ borderColor: '#D9D9D9', borderWidth: 1.2, borderRadius: 12, }}>
                            <Item item={item} menuAcik={(tc) => {
                                acikMenu(tc);
                            }} hastaSil={hastaSil} navigation={navigation}>
                            </Item>
                        </View>
                    )
                }}
            />
        </View>
    );
};
export default Hastalar;