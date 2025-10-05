import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MainCss, red, white, wholeHeight, wholeWidth } from './assets/css';
import imgCharge from './assets/images/charge0.png';
import imgDrop from './assets/images/drop.png';
import imgLogin from './assets/images/enter.png';
import imgLogo from './assets/images/logo-image.png';
import imgLabel from './assets/images/logo-label.png';
import imgPump from './assets/images/pump.png';
import imgStorage from './assets/images/storage.png';
import imgThumbCharge from './assets/images/thumb/thumb-charge.jpg';
import imgThumbDrop from './assets/images/thumb/thumb-drop.jpg';
import imgThumbPump from './assets/images/thumb/thumb-pump.jpg';
import imgThumbStorage from './assets/images/thumb/thumb-storage.jpg';
import imgThumbVoltaic from './assets/images/thumb/thumb-voltaic.jpg';
import imgVoltaic from './assets/images/voltaic.png';
import { timeAnimate } from './data/common';
import { NewsCss } from './News';
import { TotalCss } from './Total';

import imgClose from './assets/images/close.png';
import imgEmail from './assets/images/email.png';
import imgInfo from './assets/images/info-trans.png';
import imgNews from './assets/images/news.png';
import imgPhoneTele from './assets/images/phone.png';
import imgPhoneWhats from './assets/images/phone1.png';

const BeforeCss = StyleSheet.create({
    label:{...MainCss.label, lineHeight:16},
    redBar:{width: wholeWidth, height: 65,  backgroundColor: red},
    loginImg:{width: 22, height:22, marginRight: 30},
    btnImg:{width:35, height:35, resizeMode:'contain'},
});

const iconArr = [
    {key:'voltaic', img:imgVoltaic, thumb:imgThumbVoltaic, title:'Photovoltaikanlagen', description:['Stetig steigende Energiekosten, Strommangellage im Winter, sowie Versorgungsschwierigkeiten in Europa sorgen dafür, dass die Nachfrage nach Photovoltaikanlagen stetig steigt.', 'Wir zeigen Ihnen auf, wie sich eine Photovoltaikanlage bei Ihnen lohnen wird.']},
    {key:'pump', img:imgPump, thumb:imgThumbPump, title:'Wärmepumpen', description:['Die Wärmepumpentechnologie gilt als umweltfreundlichste Wärmeerzeugung, welche aktuell erhältlich ist. Hierbei profitieren Sie bereits beim Ersatz Ihres alten Elektroboilers. Beim Tausch der alten Heizanlage durch eine Wärmepumpe sparen Sie noch mehr!']},
    {key:'storage', img:imgStorage, thumb:imgThumbStorage, title:'Energiespeicher', description:['Mit einem Batteriespeicher nutzen Sie Ihren produzierten Strom vom eigenen Dach, auch smart in der Nacht. Ebenso werden Sie unabhängig, falls der Strom ausfällt und haben Ihre wichtigsten Geräte autark versorgt.']},
    {key:'charge', img:imgCharge, thumb:imgThumbCharge, title:'Ladestationen', description:['Die Elektromobilität erlebt einen regelrechten Boom. Nebst den stetig steigenden Benzinpreisen beschliessen immer mehr Hersteller zukünftig die Verbrennungsmotoren aus dem Sortiment zu nehmen und auf erneuerbare Energien zu setzen.']},
    {key:'drop', img:imgDrop, thumb:imgThumbDrop, title:'Wasseraufbereitung', description:['Beim einfachen Funktionsprinzip von Enthärtungsanlagen mit Ionentauschern werden Calcium- und Magnesiumionen gegen Natriumionen ausgetauscht. Salztabletten, die bei Enthärtungsanlagen mit Ionentauschern eingesetzt werden, entsprechen den höchsten Anforderungen, Normen und Gütekriterien. Durch die höchste Reinheit der Salztabletten ist ein nahezu rückstandsfreier Lösungsprozess und eine maximierte Lebensdauer des Ionentauschers garantiert.']},
];

const footerArr = [
    {img:imgInfo, label:'Über uns', btnKey:'Info'},
    {img:imgNews, label:'News', btnKey:'News'},
]

const infoArr = [
    {key:'telephone', title:'Telefon', img:imgPhoneTele, label:'+41 41 515 88 88', value:'+41415158888'},
    {key:'teleWhats', title:'Whatsapp', img:imgPhoneWhats, label:'+41 79 533 00 88', value:'+41795330088'},
    {key:'email', title:'E-Mail', img:imgEmail, label:'info@enerq.ch', value:'info@enerq.ch'},
]

export default function BeforeComponent(props) {
    const navigation = useNavigation();
	const route = useRoute();
    const { otherHeight } = route.params || {};
    
    // Convert class state to useState hooks
    const [selItem, setSelItem] = useState(iconArr[0]);
    const [modalLayer, setModalLayer] = useState(-1);
    const [modalOpacity, setModalOpacity] = useState(0);

    // Convert componentDidMount to useEffect
    useEffect(() => {
       console.log('Component mounted with otherHeight:', otherHeight);
    }, []);
	useEffect(() => {
        if (otherHeight !== undefined) {
            console.log('otherHeight updated:', otherHeight);
        }
    }, [otherHeight]);


    // Convert componentWillUnmount to useEffect cleanup
    useEffect(() => {
        return () => {
            // componentWillUnmount logic here (currently empty)
        };
    }, []);

    // Convert class methods to regular functions
    const setLogin = () => {
        navigation.navigate('First');
    };

    const onClickBtn = (idx) => {
        setSelItem(iconArr[idx]);
    };

    const onClickFooterBtn = (btnKey) => {
        if (btnKey === 'News') {
            if (props.navigation) {
                props.navigation.navigate(btnKey);
            } else {
                navigation.navigate(btnKey);
            }
        } else if (btnKey === 'Info') {
            showInfoModal();
        }
    };

    const showInfoModal = () => {
        setModalLayer(1);
        // Note: SetAnimateOpa might need to be adapted for functional components
        // You may need to use a different animation approach with hooks
        setTimeout(() => {
            setModalOpacity(1);
        }, 50);
    };

    const onClickInfoBtn = (item) => {
        if (item.key === 'telephone') {
            Linking.openURL(`tel:${item.value}`);
        } else if (item.key === 'teleWhats') {
            Linking.openURL('https://wa.me/' + item.value);
        } else if (item.key === 'email') {
            Linking.openURL('mailto:'+item.value+'?subject=SendMail&body=Description');
        }
    };

    const closeInfoModal = () => {
        setModalOpacity(0);
        setTimeout(() => {
            setModalLayer(-1);
        }, timeAnimate + 10);
    };

    // Create a ref object to handle touch methods if needed
    const componentRef = {
        modalOpacity,
        setModalOpacity
    };

    const modalHeight = wholeHeight - 220;

    return (
        <View style={{...MainCss.backBoard}}>
            <View style={{...MainCss.flexColumn, height:100, marginTop:20}}>
                <Image source={imgLogo} style={{width:82, height:82, marginVertical:28, resizeMode: 'contain'}} />
            </View>
            <View style={{...MainCss.flex, width:wholeWidth, height:50}}>
                <View style={{...NewsCss.iconLine}}></View>
                <Image source={imgLabel} style={{...NewsCss.topIcon, width:140, opacity:1}}></Image>
                <View style={{...NewsCss.iconLine}}></View>
            </View>

            <View style={{...MainCss.flexColumn, marginVertical:10}}>
                <Text style={{...MainCss.label, lineHeight:20}}>Willkommen bei Enerq.</Text>
                <Text style={{...MainCss.label, lineHeight:20}}>Ihr schweizer Partner für erneuerbare Energie.</Text>
            </View>

            <View style={{...MainCss.flex, ...BeforeCss.redBar}}>
                {iconArr.map((item, idx) =>
                    <View style={{...MainCss.flex, flex:1}} key={idx}>
                        <TouchableOpacity 
                            style={{
                                ...MainCss.flex, 
                                width:52, 
                                height:52, 
                                borderColor: selItem.key === item.key ? white : red, 
                                borderRadius:8, 
                                borderWidth:2, 
                                position:'relative'
                            }} 
                            onPress={() => onClickBtn(idx)}
                        >
                            <Image source={item.img} style={{...BeforeCss.btnImg}}></Image>
                            <View style={{position:'absolute', backgroundColor:red, width:32, height:4, top:-2, left:10}}></View>
                            <View style={{position:'absolute', backgroundColor:red, width:32, height:4, bottom:-2, left:10}}></View>
                            <View style={{position:'absolute', backgroundColor:red, height:32, width:4, left:-2, top:10}}></View>
                            <View style={{position:'absolute', backgroundColor:red, height:32, width:4, right:-2, top:10}}></View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <Image source={selItem.thumb} style={{width:wholeWidth, height:160, resizeMode:'cover'}}></Image>
            <View style={{width:wholeWidth, height:2, backgroundColor:'#C5C5C5', marginTop:20}}></View>
            <View style={{...MainCss.flex, width:wholeWidth}}>
                <View style={{...MainCss.flex, width:210, paddingHorizontal:20, backgroundColor:white, marginTop:-18}}>
                    <Text style={{...MainCss.label, fontSize:20}}>{selItem.title}</Text>
                </View>
            </View>

            <View style={{flex:1, flexGrow: 1, marginHorizontal:12, marginVertical:0}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
                <ScrollView>
                    <View>
                        {selItem.description.map((des, idx) =>
                            <Text style={{...MainCss.label, fontSize:14, color:'#666666'}} key={idx}>{des}</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
            
            <View style={{...MainCss.flex, ...TotalCss.footer, height:65}}>
                {footerArr.map((item, idx) =>
                    <TouchableOpacity
                        key={idx}
                        onPress={() => onClickFooterBtn(item.btnKey)}
                        style={{
                            ...MainCss.flex, 
                            ...TotalCss.footerItem, 
                            borderRightWidth: idx === 0 ? 1 : 0, 
                            borderRightColor:'#C5C5C5'
                        }}
                    >
                        <Image source={item.img} style={{...TotalCss.footerImg, marginRight:20}}></Image>
                        <Text style={{...MainCss.label, lineHeight:20}}>{item.label}</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            <TouchableOpacity
                onPress={setLogin}
                style={{...MainCss.flex, ...BeforeCss.redBar}}
            >
                <Image source={imgLogin} style={{...BeforeCss.loginImg}}></Image>
                <Text style={{...MainCss.title, fontWeight:500, color:white}}>Zum Login</Text>
            </TouchableOpacity>

            <View style={{
                ...MainCss.backBoard, 
                height: wholeHeight - otherHeight, 
                position:'absolute', 
                top:0, 
                left:0, 
                backgroundColor:'#FFFFFFAA', 
                ...MainCss.flexColumn, 
                zIndex: modalLayer, 
                opacity: modalOpacity
            }}>
                <View style={{width:wholeWidth, height:modalHeight, ...MainCss.flex, marginTop:40}}>
                    <View style={{
                        ...MainCss.flexColumn, 
                        width: wholeWidth * 0.85, 
                        height: modalHeight, 
                        backgroundColor: white, 
                        borderRadius:28, 
                        shadowColor: "#000", 
                        shadowOffset: { width: 10, height: 12, }, 
                        shadowOpacity: 0.58, 
                        shadowRadius: 16.00, 
                        elevation: 12,
                    }}>
                        <View style={{...MainCss.flexColumn, width:'100%', flex:1, position:'relative'}}>
                            <View style={{...MainCss.flex, paddingVertical:20}}>
                                <Image source={imgLogo} style={{width:30, height:30, resizeMode: 'contain'}} />
                                <Image source={imgLabel} style={{width:140, height:25, resizeMode:'contain'}}></Image>
                            </View>

                            <View style={{flex:1}}>
                                <Text style={{...BeforeCss.label, textAlign:'center'}}>ENERQ GmbH</Text>
                                <Text style={{...BeforeCss.label, textAlign:'center'}}>Nachhaltige Energie</Text>
                            </View>

                            <View style={{flex:1}}>
                                <Text style={{...BeforeCss.label, textAlign:'center'}}>Eiweg 10</Text>
                                <Text style={{...BeforeCss.label, textAlign:'center'}}>4460 Gelterkinden</Text>
                                <Text style={{...BeforeCss.label, textAlign:'center'}}>Schweiz</Text>
                            </View>

                            <View style={{flex:1}}>
                                <Text style={{...BeforeCss.label, textAlign:'center'}}>So erreichen Sie uns:</Text>
                            </View>
                            
                            <TouchableOpacity 
                                style={{
                                    position:'absolute', 
                                    top:10, 
                                    right:10, 
                                    ...MainCss.flex, 
                                    width:30, 
                                    height:30, 
                                    backgroundColor:'white'
                                }} 
                                onPress={closeInfoModal}
                            >
                                <Image source={imgClose} style={{width:16, height:16, resizeMode:'contain', opacity:0.7}}></Image>
                            </TouchableOpacity>
                        </View>

                        <View style={{...MainCss.flexColumn}}>
                            {infoArr.map((item, idx) =>
                                <View style={{...MainCss.flexColumn}} key={idx}>
                                    <Text style={{...BeforeCss.label}}>{item.title}</Text>
                                    <TouchableOpacity 
                                        style={{
                                            ...MainCss.button, 
                                            marginTop:5, 
                                            marginBottom:15, 
                                            width: wholeWidth * 0.9 - 70
                                        }} 
                                        onPress={() => onClickInfoBtn(item)}
                                    >
                                        <View style={{...MainCss.buttonIcon}}>
                                            <Image source={item.img} style={{...MainCss.buttonImg}}></Image>
                                        </View>
                                        <Text style={{...MainCss.buttonIconLabel}}>{item.label}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}