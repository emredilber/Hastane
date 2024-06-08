import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';

// DropDown çağırıldığı zaman gönderilecek veya alınacak değişkenler belirleniyor.
const CustomDropdown = ({ data, onSelect, placeholder, yukleniyor, veri, style, yenileme, ...props }) => {
    // Seçilen öğeyi ve dropdown'un açılıp açılmadığını kontrol eden state'ler tanımlanıyor.
    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpened, setIsOpened] = useState(false);
    const labelPosition = useRef(new Animated.Value(0)).current;
    const [error, setError] = useState('');

    useEffect(() => { // Eğer geçici veri varsa ve veri değişirse ilk öğeyi seç.
        if (props.geciciVeri && data[0] !== undefined) {
            handleSelect(data[0], 0)
        }
    }, [data]); // Data her değiştiği zaman bu blok çalışıyor.

    useEffect(() => { // Eğer yenileme tanımlanmışsa ve değişirse yenileme işlemini yap.
        if (yenileme !== undefined) {
            handleSelect(yenileme)
        }
    }, [yenileme]); // Yenileme değiştiğinde kodlar çalışacak

    // Bir öğe seçilirse yapılacak olan işlemler
    const handleSelect = (item, index) => {
        setSelectedItem(item);
        onSelect(item, index);
        animatedLabel(1)
        setError('')
    };

    const handleDropdownToggle = (opened) => { // Dropdown açılıp kapandığında yapılan işlemler.
        setIsOpened(opened);
        if (isOpened) {
            // Hata mesajlarını ayarla
            if (props.dogumYeriGirisi && selectedItem === null)
                setError('Doğum yerini seçiniz!')
            if (props.kanGrubuGirisi && selectedItem === null)
                setError('Kan grubunu seçiniz!')
            if (props.poliklinikSecimGirisi && selectedItem === null)
                setError('Poliklinik seçiniz!')
            if (props.doktorSecimi && selectedItem === null)
                setError('Doktor seçiniz!')
        }
        if (opened)
            animatedLabel(1)
        else
            animatedLabel(selectedItem ? 1 : 0)
    };

    const animatedLabel = (toValue) => { // Yaznın hareket etmesini sağlamak için animasyon değişkeni.
        Animated.timing(labelPosition, {
            toValue: toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const labelStyle = { // Gelen veriye göre 0 ayda 1 ise karşılığındaki değer değiştiriliyor ve hareket ettiriliyor.
        left: 10,
        top: labelPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [13, -10],
        }),
        fontSize: labelPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 14],
        }),
        color: labelPosition.interpolate({
            inputRange: [0, 1],
            outputRange: ['gray', '#888'],
        }),
        marginLeft: labelPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [15, 0],
        }),
    };

    return (
        <View style={style}>
            <Animated.Text style={[labelStyle, { position: 'absolute', backgroundColor: '#fff', zIndex: 1 }]}>
                {placeholder}
            </Animated.Text>
            <SelectDropdown // DropDown'un tanımlandığı yer.
                data={data} // Veriler tanımlanıyor.
                disabled={yukleniyor} // Devre dışı durumu belirleniyor
                disableAutoScroll={true}
                onSelect={handleSelect} // Veri seçilirse çalıştırılıyor.
                onFocus={() => handleDropdownToggle(true)}
                onBlur={() => handleDropdownToggle(false)}
                renderButton={() => {
                    return ( // Buton stili belirleniyor
                        <View style={{
                            height: 50, borderRadius: 6, borderWidth: 1, borderColor: isOpened ? '#03244f' : error ? '#ff0000' : '#D9D9D9',
                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20,
                        }}>
                            <Text style={{ flex: 1, fontSize: 13, fontWeight: '500', color: '#03244f', }}>
                                {selectedItem && selectedItem.title} 
                            </Text>
                            {yukleniyor ? // Veriler yükleniyorsa gözükecek icon
                                <ActivityIndicator color='#03244f' size={20} style={{}} /> :
                                <Icon name={isOpened ? 'arrow-up' : 'arrow-down'} size={20} color={'#03244f'} />
                            }
                            {yenileme !== undefined && veri !== yenileme.title && veri && ( // Daha önceden kaydedilen verinin geri yüklenebilmesi işlevi 
                                <View>
                                    <TouchableOpacity style={{ width: 24 }} onPress={() => {
                                        if (veri !== undefined) {
                                            handleSelect(yenileme);
                                        }
                                    }}>
                                        <Icon3 name="restore" size={24} color={'#03244f'} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return ( // DropDown açıldığı zaman gözükecek stil.
                        <View style={{ flexDirection: 'row', paddingHorizontal: 17, justifyContent: 'center', alignItems: 'center', paddingVertical: 8, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                            <Text style={{ flex: 1, fontSize: 16, fontWeight: '500', color: '#151E26', }}>{item.title}</Text>
                        </View>
                    );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={{ backgroundColor: '#fff', borderRadius: 8, }}
                search={props.poliklinikSecimGirisi && true}
                searchPlaceHolder={props.poliklinikSecimGirisi && 'Poliklinik Ara'}
                renderSearchInputLeftIcon={(onSearch) => (<Icon2 name="search" size={20} color={'#03244f'} style={{ marginRight: -7 }} />)}
                searchInputTxtColor='#03244f'
                searchInputStyle={{ borderRadius: 6, margin: 1, padding: 9, height: 'auto', width: 'auto' }}

            />
            {/* Hata mesajı */}
            <Text style={{ marginTop: 5, fontSize: 14, color: 'red' }}>{error}</Text>

        </View>
    );
};

export default CustomDropdown;
