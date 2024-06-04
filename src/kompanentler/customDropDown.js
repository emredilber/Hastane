import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { configureLayoutAnimationBatch } from 'react-native-reanimated/lib/typescript/reanimated2/core';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native-gesture-handler';

const CustomDropdown = ({ data, onSelect, placeholder, yukleniyor, veri, style, yenileme, ...props }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpened, setIsOpened] = useState(false);
    const labelPosition = useRef(new Animated.Value(0)).current;
    const [error, setError] = useState('');

    useEffect(() => {
        if (props.geciciVeri && data[0] !== undefined) {
            handleSelect(data[0], 0)
        }
    }, [data]);

    useEffect(() => {
        if (yenileme !== undefined) {
            handleSelect(yenileme)
        }
    }, [yenileme])

    const handleSelect = (item, index) => {
        setSelectedItem(item);
        onSelect(item, index);
        animatedLabel(1)
        setError('')
    };

    const handleDropdownToggle = (opened) => {
        setIsOpened(opened);
        if (isOpened) {
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

    const animatedLabel = (toValue) => {
        Animated.timing(labelPosition, {
            toValue: toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };
    const labelStyle = {
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
            <SelectDropdown
                data={data}
                disabled={yukleniyor}
                disableAutoScroll={true}
                onSelect={handleSelect}
                onFocus={() => handleDropdownToggle(true)}
                onBlur={() => handleDropdownToggle(false)}
                renderButton={() => {
                    return (
                        <View style={{
                            height: 50,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: isOpened ? '#03244f' : error ? '#ff0000' : '#D9D9D9',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                        }}>
                            <Text style={{
                                flex: 1,
                                fontSize: 13,
                                fontWeight: '500',
                                color: '#03244f',
                            }}>
                                {selectedItem && selectedItem.title}
                            </Text>
                            {yukleniyor ?
                                <ActivityIndicator color='#03244f' size={20} style={{}} /> :
                                <Icon name={isOpened ? 'arrow-up' : 'arrow-down'} size={20} color={'#03244f'} />
                            }
                            {yenileme !== undefined && veri !== yenileme.title && veri && (
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
                    return (
                        <View style={{
                            flexDirection: 'row',
                            paddingHorizontal: 17,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: 8,
                            ...(isSelected && { backgroundColor: '#D2D9DF' })
                        }}>
                            <Text style={{
                                flex: 1,
                                fontSize: 16,
                                fontWeight: '500',
                                color: '#151E26',
                            }}>{item.title}</Text>
                        </View>
                    );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 8,
                }}
                search={props.poliklinikSecimGirisi && true}
                searchPlaceHolder={props.poliklinikSecimGirisi && 'Poliklinik Ara'}
                renderSearchInputLeftIcon={(onSearch) => (
                    <Icon2 name="search" size={20} color={'#03244f'} style={{ marginRight: -7 }} />
                )}
                searchInputTxtColor='#03244f'
                searchInputStyle={{
                    borderRadius: 6,
                    margin: 1,
                    padding: 9,
                    height: 'auto',
                    width: 'auto'
                }}

            />
            <Text style={{ marginTop: 5, fontSize: 14, color: 'red' }}>{error}</Text>

        </View>
    );
};

export default CustomDropdown;
