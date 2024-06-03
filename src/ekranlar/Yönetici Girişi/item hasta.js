import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Swipeable } from 'react-native-gesture-handler'

const Item = ({ item, menuAcik, hastaSil, navigation }) => {
    const ref = useRef();

    const kayanButon = () => {
        return (
            <View style={{ flexDirection: 'row', gap: -1, }}>
                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#00be00', paddingHorizontal: 20, }}
                        onPress={() => { ref.current.close(); navigation.navigate('Hasta Düzenleme', { hastaTc: item.tc }); }} >
                        <Text>Hastayı{'\n'}Düzenle</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', backgroundColor: '#ff0000' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff0000', paddingHorizontal: 20, }}
                        onPress={() => {
                            ref.current.close();
                            Alert.alert(
                                "Hastayı Sil",
                                `${item.ad} ${item.soyad} adlı hastayı silmek istediğinizden emin misiniz?`,
                                [
                                    { text: "İptal", style: "cancel" },
                                    { text: "Evet", onPress: () => hastaSil(item.tc) }
                                ],
                                { cancelable: true }
                            );
                        }}>
                        <Text>Hastayı Sil</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    useEffect(() => {
        if (item.acik === false) {
            ref.current.close();
        }
    }, [item.acik])

    return (
        <Swipeable ref={ref} containerStyle={{ backgroundColor: '#00be00', borderRadius: 12, }} renderRightActions={kayanButon} onSwipeableOpen={() => { menuAcik(item.tc) }} >
            <View style={{ backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', }}>
                <View style={{ marginLeft: 15, justifyContent: 'center', gap: 10, marginVertical: 10 }}>
                    <Text style={{ color: '#03244f', width: 220 }}>Doktor Adı Soyadı: {item.ad + ' ' + item.soyad}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#03244f', fontSize: 12 }}>E-mail: {item.email} / </Text>
                        <Text style={{ color: '#03244f', fontSize: 12 }}>Kan Grubu: {item.kangrubu}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ color: '#03244f', fontSize: 12 }}>Doğum Tarihi: {item.dogumtarihi} / </Text>
                        <Text style={{ color: '#03244f', fontSize: 12 }}>Telefon NO: {item.gsm}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#03244f', fontSize: 12 }}>Cinsiyeti: {item.cinsiyet} / </Text>
                        <Text style={{ color: '#03244f', fontSize: 12 }}>Doğum Yeri: {item.dogumyeri}</Text>
                    </View>
                        <Text style={{ color: '#03244f', fontSize: 12 }}>Adres: {item.adres}</Text>
                </View>

                <View style={{
                    position: 'absolute', paddingVertical: 4, width: 130, alignItems: 'center', right: 0, borderTopRightRadius: 12, borderBottomLeftRadius: 12,
                    backgroundColor: '#04479e'
                }}>
                    <Text style={{ fontSize: 9, color: '#fff', letterSpacing: 0.67 }}>{item.tc}</Text>
                </View>
            </View>
        </Swipeable>
    )
}

export default Item