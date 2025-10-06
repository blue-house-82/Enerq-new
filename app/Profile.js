import { useNavigation, useRoute } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MainCss, red, white, wholeHeight, wholeWidth } from './assets/css';
import TopMenuComponent from './pages/layout/TopMenu';

import imgAvatarBig from './assets/images/avatar-big.png';
import imgAvatarSetting from './assets/images/avatar-setting.png';
import imgDoc from './assets/images/doc.png';
import imgExit from './assets/images/exit.png';
import { SetAnimate, onTouchE, onTouchS } from './data/common';
import { apiUrl } from './data/config';
import ListWrapper from './pages/layout/ListWrapper';

const listArr = [
	// {key:'account', img:imgAvatarSmall, label:'Mein Konto'},
	// {key:'invoice', img:imgBill, label:'Rechnungsübersicht'},
	// {key:'ideas', img:imgSetting, label:'Einstellungen'},
	{key:'agb', img:imgDoc, label:'AGB'},
	{key:'impress', img:imgDoc, label:'Impressum'},
]
const ProfileCss = StyleSheet.create({
	// avatar:{height:wholeHeight - 600},
	avatar:{flex:1},
	avatarImgWrapper:{width:130, height:130, marginBottom:20, position:'relative'},
	avatarImg:{width:130, height:130, borderRadius:65},
	back:{width: wholeWidth, height: 70,  backgroundColor: red},
	backImg:{width: 22, height:22, marginRight: 30},
});

export default function ProfileComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	
	// Get initial params from route or props
	const {
		profile: initialProfile,
		mainInfo: initialMainInfo,
		setLoading,
		setMainInfo,
		...otherProps
	} = route.params || props;
	
	const [state, setState] = useState({
		profile: initialProfile,
		mainInfo: initialMainInfo || {},
		top: -wholeHeight
	});

	useEffect(() => {
		const currentParams = route.params || props;
		['profile', 'mainInfo'].forEach(key => {
			const propValue = currentParams[key];
			if (state[key] !== propValue && propValue !== undefined) {
				if (key === 'profile') {
					if (propValue === true) {
						SetAnimate('top', -wholeHeight, 0, { setState });
					} else {
						SetAnimate('top', 0, -wholeHeight, { setState });
					}
				}
				setState(prevState => ({
					...prevState,
					[key]: propValue
				}));
			}
		});
	}, [route.params, props]);

	const onClickListItem = (listKey) => {
		if 		(listKey==='agb') navigation.navigate('AGB');
		else if (listKey==='impress') navigation.navigate('Impress');
	};

	const selectFile = async() => {
		try {
			const res = await DocumentPicker.pick({ type: ['image/*'], })
			const fileInfo = res[0]
			if (!fileInfo) return;
			// {"fileCopyUri": null, "name": "IMG_20230309_024536.jpg", "size": 10593640, "type": "image/jpeg", "uri": "content://media/external/images/media/1463"}
			const format = fileInfo.name.split('.').pop();
			if (!format) return;
			if (setLoading) setLoading(true);
			const formData = new FormData(), customerInfo = {...state.mainInfo};
			formData.append("file", fileInfo);
			formData.append("format", format);
			formData.append("type", 'profile');
			formData.append("customerId", customerInfo.id);

			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", apiUrl+'other/uploadImgFile.php', true); // Mobile
			xhttp.onreadystatechange = (e) => {
				const result = e.target;
				if (result.readyState === 4 && result.status === 200) {
					const res = JSON.parse(result.responseText);
					customerInfo.image = res.file_name;
					if (setMainInfo) setMainInfo(customerInfo);
					if (setLoading) setLoading(false);
				}
			};
			xhttp.send(formData);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) { } else {  }
		}
	};

	const {mainInfo} = state;
	
	return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label='Dein Account'
					hideProfile={true}
					goBack={e=>navigation.goBack()}
				></TopMenuComponent>
				<View style={{...MainCss.flexColumn, ...ProfileCss.avatar}}>
					<View style={{...ProfileCss.avatarImgWrapper}}>
						{mainInfo.image !== '' &&
							<Image style={{...ProfileCss.avatarImg}} source={{uri : apiUrl+'other/profile_images/'+mainInfo.image}} ></Image>
						}
						{mainInfo.image === '' &&
							<Image style={{...ProfileCss.avatarImg}} source={imgAvatarBig}></Image>
						}
						
						<TouchableOpacity style={{...MainCss.flex, height:27, width:27, position:'absolute', top:95, left:95}} onPress={e=>selectFile()}>
							<Image source={imgAvatarSetting} style={{width:27, height:27, resizeMode:'cover'}}></Image>
						</TouchableOpacity>
					</View>
					<Text style={{...MainCss.label}}>Willkommen, {mainInfo?mainInfo.first+' '+mainInfo.last:''}.</Text>
				</View>
				<View style={{height:300}}>
					<ListWrapper
						listArr={listArr}
						onClickListItem={listKey=>onClickListItem(listKey)}
					></ListWrapper>
				</View>
				
				<View
					onTouchStart={e=> onTouchS(e, { setState })}
					onTouchEnd={e => onTouchE(e, { setState }, 'logout') }
					style={{...MainCss.flex, ...ProfileCss.back}}>
					<Image source={imgExit} style={{...ProfileCss.backImg}}></Image>
					<Text style={{...MainCss.title, color:white}}>Abmelden</Text>
				</View>
			</View>
		);
}
