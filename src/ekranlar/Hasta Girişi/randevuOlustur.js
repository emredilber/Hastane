import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import CustomDropdown from '../../kompanentler/customDropDown'
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../../kompanentler/custominput';

const RandevuOlustur = ({ route }) => {
    const { tc } = route.params;
    const [date, setDate] = useState(new Date());
    const [dateGoster, setDateGoster] = useState(false);
    const [secilenTarih, setSecilenTarih] = useState('');
    const [poliklinikler, setPoliklinikler] = useState([]);
    const [doktorlar, setDoktorlar] = useState([]);
    const [secilenPoliklinik, setSecilenPoliklinik] = useState('');
    const [secilenPoliklinikId, setSecilenPoliklinikId] = useState('');
    const [secilenDoktor, setSecilenDoktor] = useState('');
    const [secilenDoktorAd, setSecilenDoktorAd] = useState('');
    const [aktifSaatler, setAktifSaatler] = useState([]);
    const [randevuSaati, setRandevuSaati] = useState('');
    const [hata, setHata] = useState('');
    const [yukleniyorPol, setYukleniyorPol] = useState(false);
    const [yukleniyorDoktor, setYukleniyorDoktor] = useState(false);
    const [yukleniyorSaat, setYukleniyorSaat] = useState(false);

    useEffect(() => { // Sayfa açıldığında poliklinikler listeleniyor.
        const poliklinikGetir = async () => {
            setYukleniyorPol(true);
            setYukleniyorDoktor(true);
            setYukleniyorSaat(true);
            try {
                const snapshot = await firestore().collection('poliklinikler').orderBy('poliklinikAdı').get();
                const poliklinikVerisi = snapshot.docs.map(doc => ({ title: doc.data().poliklinikAdı }));
                poliklinikVerisi.sort((a, b) => a.title.localeCompare(b.title, 'tr', { sensitivity: 'base' }));
                setPoliklinikler(poliklinikVerisi);
            } catch (error) {
                console.error('Error fetching data: ', error);
            } finally {
                setYukleniyorPol(false)
            }
        };
        poliklinikGetir();
    }, []);

    const doktorGetir = async (secilenPol, index) => {
        // Poliklinikler listelendikten sonra hangi polikinik seçili ise onun doktorları getiriliyor
        setYukleniyorDoktor(true);
        setYukleniyorSaat(true);
        try {
            const poladi = await firestore().collection('poliklinikler').where('poliklinikAdı', '==', secilenPol.title).get();
            const querySnapshot = await firestore()
                .collection('doktorlar')
                .where('poliklinik', '==', poladi.docs[0].id)
                .get();

            const doktorList = querySnapshot.docs.map(doc => ({
                doktorTc: doc.id,
                title: doc.data().ad + ' ' + doc.data().soyad,
            }));
            // Doktorlar değişkenlere aktarılıyor.
            setDoktorlar(doktorList);
            setSecilenPoliklinik(secilenPol.title);
            setSecilenPoliklinikId(poladi.docs[0].id);

        } catch (error) {
            Alert.alert('Hata', 'Doktorlar alınırken bir hata oluştu: ' + error.message);
        } finally {
            setYukleniyorDoktor(false);
        }
    };

    useEffect(() => {
        if (secilenPoliklinikId !== '' && secilenDoktor !== '') {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(
                currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;
            tarihDegisimi({ type: 'initial' }, currentDate);
        }
    }, [secilenPoliklinikId])

    const allTimes = [ // Randevuların kullanılabilecek tüm saatlari değişkende tutuluyor.
        { title: '08:20 - 08:30' }, { title: '08:30 - 08:40' }, { title: '08:40 - 08:50' }, { title: '08:50 - 09:00' },
        { title: '09:00 - 09:10' }, { title: '09:10 - 09:20' }, { title: '09:30 - 09:40' }, { title: '09:40 - 09:50' },
        { title: '09:50 - 10:00' }, { title: '10:00 - 10:10' }, { title: '10:10 - 10:20' }, { title: '10:20 - 10:30' },
        { title: '10:30 - 10:40' }, { title: '10:40 - 10:50' }, { title: '10:50 - 11:00' }, { title: '11:00 - 11:10' },
        { title: '11:10 - 11:20' }, { title: '11:20 - 11:30' }, { title: '11:30 - 11:40' }, { title: '11:40 - 11:50' },
        { title: '11:50 - 12:00' }, { title: '13:10 - 13:20' }, { title: '13:20 - 13:30' },
        { title: '13:30 - 13:40' }, { title: '13:40 - 13:50' }, { title: '13:50 - 14:00' }, { title: '14:00 - 14:10' },
        { title: '14:10 - 14:20' }, { title: '14:30 - 14:40' }, { title: '14:40 - 14:50' }, { title: '14:50 - 15:00' },
        { title: '15:00 - 15:10' }, { title: '15:10 - 15:20' }, { title: '15:20 - 15:30' }, { title: '15:30 - 15:40' },
        { title: '15:40 - 15:50' }, { title: '15:50 - 16:00' }, { title: '16:00 - 16:10' }, { title: '16:10 - 16:20' },
        { title: '16:20 - 16:30' }, { title: '16:30 - 16:40' }, { title: '16:40 - 16:50' }, { title: '16:50 - 17:00' }
    ];

    const tarihDegisimi = async (event, selectedDate) => {
        // Tarih değiştikten sonra otomatik olarak seçilen tarihte boş randevu saatleri listeleniyor.
        setDateGoster(false);
        setDate(selectedDate)
        const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}.${(
            selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getFullYear()}`;
        setSecilenTarih(formattedDate);
        setRandevuSaati('');
        if (event.type !== 'dismissed') {
            setYukleniyorSaat(true)
            try {
                const snapshot = await firestore().collection('randevular').
                    where('randevuTarihi', '==', formattedDate).
                    where('poliklinikID', '==', secilenPoliklinikId).
                    where('doktorTC', '==', secilenDoktor).get();
                const appointmentTimes = snapshot.docs.map(doc => ({ title: doc.data().randevuSaati }));
                const availableTimes = allTimes.filter
                    (time => !appointmentTimes.some(appointmentTime => appointmentTime.title === time.title));
                setAktifSaatler(availableTimes);
            } catch (error) {
                console.error("Hata:", error);
                return [];
            } finally {
                setYukleniyorSaat(false);
            }
        }
    };

    const randevuAl = async () => {
        // Randevu oluştur butonuna basınca olacak kodlar.
        try {
            const aynıTarihSorgu = await firestore().collection('randevular').
                where('hastaTC', '==', tc).
                where('randevuTarihi', '==', secilenTarih).
                where('randevuSaati', '==', randevuSaati).get();

            if (!aynıTarihSorgu.empty) {
                Alert.alert('Hata', 'Aynı tarihte randevu alınamaz!')
                return;
            }

            const querySnapshot = await firestore().collection('randevular').orderBy('id', 'desc').limit(1).get();
            // En son id alınıyor.
            let sonID = 0;
            if (!querySnapshot.empty) {
                const sonBelge = querySnapshot.docs[0];
                sonID = sonBelge.data().id;
            }

            const yeniID = sonID + 1; // En son id 1 arttırılıyor.
            const randevu = {
                id: yeniID,
                hastaTC: tc,
                doktorTC: secilenDoktor,
                doktorAdi: secilenDoktorAd,
                poliklinikID: secilenPoliklinikId,
                PoliklinikAdi: secilenPoliklinik,
                randevuTarihi: secilenTarih,
                randevuSaati: randevuSaati,
                randevuDurumu: 'Randevu Alındı',
            }; // Veri tabanına gönderiliyor
            await firestore().collection('randevular').doc(yeniID.toString()).set(randevu);
            Alert.alert('Durum', 'Randevunuz oluşturulmuştur.');
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    return (
        <View style={{ flex: 1, marginHorizontal: 20 }}>
            <View style={{ marginTop: 150, marginVertical: 30, rowGap: 10, }}>
                <CustomDropdown data={poliklinikler} onSelect={(secilenPol) => { doktorGetir(secilenPol); }}
                    placeholder="Poliklinik Seçimi" poliklinikSecimGirisi geciciVeri yukleniyor={yukleniyorPol} />
                <CustomDropdown data={doktorlar} onSelect={(secilenDokt) => {
                    setSecilenDoktor(secilenDokt.doktorTc);
                    setSecilenDoktorAd(secilenDokt.title);
                }}
                    placeholder="Doktor Seçimi" doktorSecimi geciciVeri yukleniyor={yukleniyorDoktor} />

                <TouchableOpacity onPress={() => {
                    if (secilenPoliklinikId === '') {
                        setHata('Önce poliklinik ve doktoru seçiniz!')
                    }
                    else if (secilenDoktor === '') { setHata('Öncelikle doktoru seçiniz!') }
                    else {
                        setHata('');
                        setDateGoster(true)
                    }
                }} >
                    <CustomInput placeholder="Randevu Tarihi" veri={secilenTarih} disable={false} hata={hata} />
                </TouchableOpacity>
                {dateGoster && (<DateTimePicker value={date} mode="date" display="compact" onChange={tarihDegisimi} />)}

                <CustomDropdown data={aktifSaatler} onSelect={(secilenSaat) => { setRandevuSaati(secilenSaat.title); }}
                    Dplaceholder="Randevu Saati" geciciVeri yukleniyor={yukleniyorSaat} />
                <TouchableOpacity
                    style={{ paddingVertical: 10, borderRadius: 20, backgroundColor: '#03244f', alignItems: 'center' }}
                    onPress={randevuAl}
                >
                    <Text style={{ fontSize: 16, color: '#fff', }}>Randevu Oluştur</Text>
                </TouchableOpacity>
            </View>


        </View >
    )
}

export default RandevuOlustur

