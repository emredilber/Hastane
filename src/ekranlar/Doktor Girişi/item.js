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
                <View style={{ flexDirection: 'row', gap: -1, }}>
                    <TouchableOpacity style={{
                        justifyContent: 'center', alignItems: 'center',
                        backgroundColor: '#2D567B', paddingHorizontal: 20,
                    }}
                        onPress={() => { ref.current.close(); tamamlaRandevu(); console.log(item.id) }} >
                        <Text style={{ color: '#fff', textAlign: 'center' }}>Randevu{'\n'}Tamamlandı</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', gap: -1, backgroundColor: '#d60000' }}>
                    <TouchableOpacity style={{
                        justifyContent: 'center', alignItems: 'center',
                        backgroundColor: '#d60000', paddingHorizontal: 20,
                    }}
                        onPress={() => { ref.current.close(); gelinmediRandevu() }}>
                        <Text style={{ color: '#fff', textAlign: 'center' }}>Randevuya{'\n'}Gelinmedi</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    const tamamlaRandevu = () => { // Kayan kutudaki onayla butonuna basıldığında...
        if (item.randevuDurumu !== "Randevu Alındı") { // Sadece randevu alındı durumu ile işlem yapılabilir.
            Alert.alert("Hata", "Bu randevu ile ilgili işlem yapılamaz.");
            return;
        }

        const now = new Date();
        const randevuTarihParcalari = item.randevuTarihi.split('.');
        const randevuSaatiParcalari = item.randevuSaati.split(' - ')[0].split(':');

        const randevuTarihi = new Date(parseInt(randevuTarihParcalari[2]),
            parseInt(randevuTarihParcalari[1]) - 1, parseInt(randevuTarihParcalari[0]),
            parseInt(randevuSaatiParcalari[0]), parseInt(randevuSaatiParcalari[1]));


        if (randevuTarihi > now) { // Randevunun tarihi geçip geçmediği kontrol ediliyor.
            Alert.alert('Uyarı', 'Tarihi gelmeyen randevuda işlem yapılamaz.');
            return;
        }

        firestore().collection('randevular').doc(item.id).set({ randevuDurumu: 'Randevu Tamamlandı' }, { merge: true })
            .then(() => console.log('Randevu Tamamlandı')) // Veri tabanına kayıt ediliyor.
            .catch(error => Alert.alert('Hata', 'Firestore güncelleme hatası: ' + error.message));
    };

    const gelinmediRandevu = () => { // Kayan kutudaki iptal et butonuna basıldığında...
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

        if (randevuTarihi > now) { // Randevunun tarihi geçip geçmediği kontrol ediliyor
            Alert.alert('Uyarı', 'Bu randevu tarihini düzenleyemezsiniz çünkü randevu tarihi geçmişte.');
            return;
        }

        firestore().collection('randevular').doc(item.id).set({ randevuDurumu: 'Randevuya Gelinmedi' }, { merge: true })
            .then(() => console.log('Randevuya Gelinmedi')) // Veri tabanına kayıt ediliyor.
            .catch(error => Alert.alert('Hata', 'Firestore güncelleme hatası: ' + error.message));
    };

    useEffect(() => { // Eğer kutu açık deilse değişkene false değeri gönderiliyor.
        if (item.acik === false) {
            ref.current.close();
        }
    }, [item.acik])

    return (
        <Swipeable ref={ref} containerStyle={{ backgroundColor: '#2D567B', borderRadius: 12, }}
            renderRightActions={kayanButon} onSwipeableOpen={() => { menuAcik(item.id) }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', }}>
                <View style={{ padding: 20, backgroundColor: '#03244f' }}>
                    <Icon name='clock' size={48} color='#fff' />
                </View>
                <View style={{ marginLeft: 15, marginTop: 11, justifyContent: 'center', gap: 10 }}>
                    <Text style={{ color: '#03244f', }}>{item.hastaAdı}</Text>
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        <Text style={{ color: '#03244f', fontSize: 12 }}>Tarih: {'\n' + item.randevuTarihi}</Text>
                        <Text style={{ color: '#03244f', fontSize: 12 }}>Saati: {'\n' + item.randevuSaati}</Text>
                    </View>
                </View>

                <View style={{
                    position: 'absolute', paddingVertical: 4, width: 130, alignItems: 'center', right: 0,
                    borderTopRightRadius: 12, borderBottomLeftRadius: 12,
                    backgroundColor: item.randevuDurumu === 'Randevu Alındı' ?
                        '#04479E' : item.randevuDurumu === 'Randevu Tamamlandı' ?
                            '#2A8EC6' : (item.randevuDurumu === 'Randevuya Gelinmedi' ||
                                item.randevuDurumu === 'Hasta İptal Etti') && '#d60000'
                }}>
                    <Text style={{ fontSize: 9, color: '#fff', letterSpacing: 0.67 }}>{item.randevuDurumu}</Text>
                </View>
            </View>
        </Swipeable>
    )
}

export default Item