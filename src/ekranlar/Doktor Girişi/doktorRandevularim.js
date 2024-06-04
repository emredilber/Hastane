import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, BackHandler, Alert, Image, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { useFocusEffect } from '@react-navigation/native';
import CustomInput from '../../kompanentler/custominput';
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Item from './item';


const DoktorRandevularim = ({ route }) => {
    const { tc } = route.params;
    const [date, setDate] = useState(new Date());
    const [dateGoster, setDateGoster] = useState(false);
    const [secilenTarih, setSecilenTarih] = useState('');
    const [randevular, setRandevular] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrele, setFiltrele] = useState(false);
    const [filteredRandevular, setFilteredRandevular] = useState([]);

    const randevularıGetir = async () => {
        try {
            const querySnapshot = await firestore()
                .collection('randevular')
                .orderBy('id')
                .where('doktorTC', '==', tc)
                .get();

            const randevularList = await Promise.all(querySnapshot.docs.map(async (documentSnapshot) => {
                const hastaDoc = await firestore()
                    .collection('hastalar')
                    .doc(documentSnapshot.get('hastaTC'))
                    .get();
                return {
                    id: documentSnapshot.id,
                    hastaAdı: hastaDoc.get('ad') + ' ' + hastaDoc.get('soyad'),
                    randevuTarihi: documentSnapshot.get('randevuTarihi'),
                    randevuSaati: documentSnapshot.get('randevuSaati'),
                    randevuDurumu: documentSnapshot.get('randevuDurumu'),
                    acik: false
                };
            }));
            setRandevular(randevularList);
            setFilteredRandevular(randevularList);
        } catch (ex) {
            Alert.alert("Hata", "Veri alınırken bir hata oluştu: " + ex.message, [{ text: "Tamam" }]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            randevularıGetir();
        }, [])
    );


    const tarihDegisimi = (event, selectedDate) => {
        setDateGoster(false);
        setDate(selectedDate)
        const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getFullYear()}`;
        setSecilenTarih(formattedDate);
    }

    useEffect(() => {
        if (filtrele) {

            const filteredList = randevular.filter(randevu => randevu.randevuTarihi === secilenTarih);
            setFilteredRandevular(filteredList);

        } else {
            setFilteredRandevular(randevular);
        }
    }, [secilenTarih, filtrele, randevular]);

    const tarihFiltrele = () => {
        setFiltrele(!filtrele);
    }
    
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#03244f" />
                <Text style={{color:'#03244f'}}>Veriler yükleniyor...</Text>
            </View>
        );
    }

    const acikMenu = (id) => {

        setFilteredRandevular(prevState =>
            prevState.map(item => ({
                ...item,
                acik: item.id === id ? true : false
            }))
        );

    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20, gap: 10 }}>
            <TouchableOpacity onPress={() => {
                setDateGoster(true)
            }}
                style={{ marginTop: 20 }}>
                <CustomInput placeholder="Randevu Tarihi" veri={secilenTarih} disable={false} yenileme hataalma />
            </TouchableOpacity>
            {dateGoster && (<DateTimePicker value={date} mode="date" display="compact" onChange={tarihDegisimi} />)}

            <TouchableOpacity onPress={() => { tarihFiltrele() }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon2 name={filtrele ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color={'#03244f'} />
                <Text style={{ fontSize: 16, color: '#03244f', marginLeft: 10 }}>Tarihe Göre Filtrele</Text>
            </TouchableOpacity>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredRandevular}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{gap:10}}
                renderItem={({ item }) => {
                    return (
                        <View style={{ borderColor: '#D9D9D9', borderWidth: 1.2, borderRadius: 12, }}>
                            <Item item={item} menuAcik={(id) => {
                                acikMenu(id);
                            }} >
                            </Item>
                        </View>
                    );
                }}
            />
        </View>
    );
};
export default DoktorRandevularim;