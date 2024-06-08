import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { useFocusEffect } from '@react-navigation/native';
import Item from './item';


const Randevularim = ({ route }) => {
    const { tc } = route.params;
    const [randevular, setRandevular] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hata, setHata] = useState(false);

    const randevularıGetir = async () => {
        try {
            const querySnapshot = await firestore() // Hastanın randevuları veri tabanından getiriliyor
                .collection('randevular')
                .orderBy('id', 'desc')
                .where('hastaTC', '==', tc)
                .get();

            if (querySnapshot.empty) {
                setHata(true)
            }
            else {
                setHata(false);
            }

            const randevularList = await Promise.all(querySnapshot.docs.map(async (documentSnapshot) => {
                return {
                    id: documentSnapshot.id,
                    doktorAdi: documentSnapshot.get('doktorAdi'),
                    randevuTarihi: documentSnapshot.get('randevuTarihi'),
                    randevuSaati: documentSnapshot.get('randevuSaati'),
                    poliklinikAdi: documentSnapshot.get('PoliklinikAdi'),
                    randevuDurumu: documentSnapshot.get('randevuDurumu'),
                    acik: false
                }
            }));
            setRandevular(randevularList);
        } catch (ex) {
            Alert.alert("Hata", "Veri alınırken bir hata oluştu: " + ex.message, [{ text: "Tamam" }]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect( // Randevular sayfası açıldığı zaman çalışacak kodlar.
        useCallback(() => {
            setLoading(true);
            randevularıGetir();
        }, [])
    );

    if (loading) {  // Veriler yüklendiği sıra ekranda dönen bir simge çıkıyor.
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#03244f" />
                <Text>Veriler yükleniyor...</Text>
            </View>
        );
    }

    const acikMenu = (id) => {
        // Randevu ile ilgili işlem yapmak için kaydırılan kutu eğer açıksa true değeri gönderiliyor.
        setRandevular(prevState =>
            prevState.map(item => ({
                ...item,
                acik: item.id === id ? true : false
            }))
        );

    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20, }}>
            {hata === false && <FlatList // Listeleme yapısı kullanarak randevular listeleniyor.
                showsVerticalScrollIndicator={false}
                data={randevular}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
                renderItem={({ item }) => {

                    {/* Harici bir komponent çağırılıyor kod karışıklığı engelleniyor. */}
                    return (
                        <View style={{ borderColor: '#D9D9D9', borderWidth: 1.2, borderRadius: 12, }}>
                            <Item item={item} menuAcik={(id) => { 
                                acikMenu(id);
                            }} >
                            </Item>
                        </View>
                    );
                }}
            />}

            {/* Randevusu bulunmazsa ekrana hata yazdırılıyor. */}
            {hata === true && <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#03244f', fontSize: 16 }}>Randevunuz Bulunmamaktadır</Text>
            </View>
            }
        </View>
    );
};
export default Randevularim;