import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, BackHandler, Alert, Image, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { useFocusEffect } from '@react-navigation/native';
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

    const poliklinikGetir = async () => {
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


    const doktorlarıGetir = async () => {
        try {
            const querySnapshot = await firestore().collection('doktorlar').get();

            const doktorlarList = await Promise.all(querySnapshot.docs.map(async (documentSnapshot) => {
                const sehiri = await firestore().collection('sehirler').doc(documentSnapshot.get('dogumyeri')).get();
                const poliklinik = await firestore().collection('poliklinikler').doc(documentSnapshot.get('poliklinik')).get();
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
        try {
            await firestore().collection('doktorlar').doc(tc).delete();
            setFilteredDoktorlar(prevState => prevState.filter(item => item.tc !== tc));
            setDoktorlar(prevState => prevState.filter(item => item.tc !== tc));
        } catch (error) {
            Alert.alert("Hata", "Doktor silinirken bir hata oluştu: " + error.message, [{ text: "Tamam" }]);
        }
    };

    useEffect(() => {
        setLoading(true);
        poliklinikGetir();
        doktorlarıGetir();
    }, [])


    useEffect(() => {
        if (secilenPoliklinik !== 'Bütün Poliklinikler') {
            const filteredList = doktorlar.filter(doktor => doktor.poliklinik === secilenPoliklinik);
            setFilteredDoktorlar(filteredList);

        } else {
            setFilteredDoktorlar(doktorlar);
        }
    }, [secilenPoliklinik, doktorlar]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#03244f" />
                <Text>Veriler yükleniyor...</Text>
            </View>
        );
    }

    const acikMenu = (tc) => {

        setFilteredDoktorlar(prevState =>
            prevState.map(item => ({
                ...item,
                acik: item.tc === tc ? true : false
            }))
        );

    }


    return (
        <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20, }}>
            <CustomDropdown data={poliklinikler} onSelect={(secilenPol, index) => {
                setSecilenPoliklinik(secilenPol.title);
            }} placeholder="Polikliniğe Göre Filtreleme" poliklinikSecimGirisi geciciVeri yukleniyor={yukleniyorPol} style={{ marginTop: 20 }} />

            <FlatList
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