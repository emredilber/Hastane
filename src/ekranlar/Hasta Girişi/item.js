import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Swipeable } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import firestore from '@react-native-firebase/firestore'

const Item = ({ item, menuAcik }) => {
    const ref = useRef();

    const kayanButon = () => { // Randevu kutusu kaydırıldığın ortaya çıkan butonun kodları
        return (
            <View style={{ flexDirection: 'row', gap: -1, }}>

                <View style={{ flexDirection: 'row', gap: -1, backgroundColor: '#d60000' }}>
                    <TouchableOpacity style={{
                        justifyContent: 'center', alignItems: 'center',
                        backgroundColor: '#d60000', paddingHorizontal: 20,
                    }}
                        onPress={() => { ref.current.close(); gelinmediRandevu() }}>
                        <Text style={{ color: '#fff' }}>İptal Et</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const gelinmediRandevu = () => { // Kayan kutudaki butona basıldığında...
        if (item.randevuDurumu !== "Randevu Alındı") { // Sadece randevu alındı durumu ile işlem yapılabilir.
            Alert.alert("Hata", "Bu randevu ile ilgili işlem yapılamaz.");
            return;
        }

        const now = new Date();
        // Veri tabanından gelen tarih ve saat bölünüyor.
        const randevuTarihParcalari = item.randevuTarihi.split('.');
        const randevuSaatiParcalari = item.randevuSaati.split(' - ')[0].split(':');

        // Randevu tarihini ve saati oluştur date olarak oluştur.
        const randevuTarihi = new Date(parseInt(randevuTarihParcalari[2]),
            parseInt(randevuTarihParcalari[1]) - 1, parseInt(randevuTarihParcalari[0]),
            parseInt(randevuSaatiParcalari[0]), parseInt(randevuSaatiParcalari[1]));

        if (randevuTarihi < now) { // Geçmişte mi kontrol ediliyor.
            Alert.alert('Uyarı', 'Geçmiş randevu ile ilgili işlem yapılamaz.');
            return;
        }

        const ileriTarih = new Date(now.getTime() + (4 * 60 * 60 * 1000));

        if (randevuTarihi < ileriTarih) { // Randevuya 4 saatten kısa süre kaldıysa iptal edilmesi engelleniyor.
            Alert.alert('Uyarı', `Bu randevuyu en geç 4 saat önce iptal edebilirdin.`);
            return;
        }

        firestore().collection('randevular').doc(item.id).set({ randevuDurumu: 'Hasta İptal Etti' }, { merge: true })
            .then(() => console.log('hasta iptal etti')) // Veri tabanına kayıt ediliyor.
            .catch(error => Alert.alert('Hata', 'Veri güncelleme hatası: ' + error.message));
    };


    useEffect(() => { // Eğer kutu açık deilse değişkene false değeri gönderiliyor.
        if (item.acik === false) {
            ref.current.close();
        }
    }, [item.acik])

    return (
        <Swipeable ref={ref} containerStyle={{ backgroundColor: '#d60000', borderRadius: 12, }}
            renderRightActions={kayanButon} onSwipeableOpen={() => { menuAcik(item.id) }}
        >
            <View style={{ backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', }}>
                <View style={{ padding: 20, backgroundColor: '#03244f' }}>
                    <Icon name='clock' size={48} color='#fff' />
                </View>
                <View style={{ marginLeft: 15, justifyContent: 'center', gap: 10 }}>
                    <Text style={{ color: '#03244f', width: 145 }}>{item.doktorAdi}</Text>
                    <Text style={{ color: '#03244f', fontSize: 13 }}>{item.poliklinikAdi}</Text>
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        <Text style={{ color: '#03244f', fontSize: 12 }}>Tarih: {item.randevuTarihi}</Text>
                        <Text style={{ color: '#03244f', fontSize: 12 }}>Saati: {item.randevuSaati}</Text>
                    </View>
                </View>

                <View style={{
                    position: 'absolute', paddingVertical: 4, width: 130, alignItems: 'center', right: 0, borderTopRightRadius: 12, borderBottomLeftRadius: 12,
                    backgroundColor: item.randevuDurumu === 'Randevu Alındı' ?
                        '#04479e' : item.randevuDurumu === 'Randevu Tamamlandı' ?
                            '#1BBCA9' : (item.randevuDurumu === 'Randevuya Gelinmedi' ||
                                item.randevuDurumu === 'Hasta İptal Etti') && '#d60000'
                }}>
                    <Text style={{ fontSize: 9, color: '#fff', letterSpacing: 0.67 }}>{item.randevuDurumu}</Text>
                </View>
            </View>
        </Swipeable>
    )
}

export default Item