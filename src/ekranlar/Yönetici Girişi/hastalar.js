import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, BackHandler, Alert, Image, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { useFocusEffect } from '@react-navigation/native';
import CustomDropdown from '../../kompanentler/customDropDown';
import Item from './item hasta';
import CustomInput from '../../kompanentler/custominput';

const Hastalar = ({ route, navigation }) => {
    const { tc } = route.params;
    const [hastalar, setHastalar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredHastalar, setFilteredHastalar] = useState([]);
    const [arananHasta, setArananHasta] = useState('');

    const hastalarıGetir = async () => {
        try {
            const querySnapshot = await firestore().collection('hastalar').get();

            const hastalarList = await Promise.all(querySnapshot.docs.map(async (documentSnapshot) => {
                const sehiri = await firestore().collection('sehirler').doc(documentSnapshot.get('dogumyeri')).get();
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

    const hastaSil = async (tc) => {
        try {
            await firestore().collection('hastalar').doc(tc).delete();
            setFilteredHastalar(prevState => prevState.filter(item => item.tc !== tc));
            setHastalar(prevState => prevState.filter(item => item.tc !== tc));
        } catch (error) {
            Alert.alert("Hata", "Hasta silinirken bir hata oluştu: " + error.message, [{ text: "Tamam" }]);
        }
    };

    useEffect(() => {
        setLoading(true);
        hastalarıGetir();
    }, [])


    useEffect(() => {
        if (arananHasta !== '') {
            const filteredList = hastalar.filter(hasta =>
                hasta.ad.toLowerCase().includes(arananHasta.toLowerCase()) ||
                hasta.soyad.toLowerCase().includes(arananHasta.toLowerCase()) ||
                `${hasta.ad.toLowerCase()} ${hasta.soyad.toLowerCase()}`.includes(arananHasta.toLowerCase())
            );
            setFilteredHastalar(filteredList);

        } else {
            setFilteredHastalar(hastalar);
        }
    }, [arananHasta, hastalar]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#03244f" />
                <Text>Veriler yükleniyor...</Text>
            </View>
        );
    }

    const acikMenu = (tc) => {

        setFilteredHastalar(prevState =>
            prevState.map(item => ({
                ...item,
                acik: item.tc === tc ? true : false
            }))
        );

    }


    return (
        <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20, }}>
            <CustomInput placeholder="Aranan Hasta" onChangeText={setArananHasta} adGirisi containerStyle={{ marginTop: 20 }} />

            <FlatList
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