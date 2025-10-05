import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, Image, Keyboard, Linking, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// import QRModalComponent from './ScanQR';
import { MainCss, grey, wholeWidth } from './assets/css';
import { red, white } from './assets/css/MainCss';
import imgLogo from './assets/images/logo-image.png';
import imgLabel from './assets/images/logo-label.png';
import imgPhone from './assets/images/phone.png';
import { SetAnimateArr } from './data/common';

const tabArr = [
	{key:'kunde', label:'Kunde'},
	{key:'team', label:'Team'},
]
const testMode = false;
const codeLength = 12, defaultEmail = testMode?'worker0@gmail.com':'', defaultPassd = testMode?'password0':'';

export default function FirstComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	
	// Get initial params from route or props
	const {
		test,
		codeStr: initialCodeStr,
		selIdx: initialSelIdx,
		selFirst: initialSelFirst,
		mainInfo: initialMainInfo,
		systemOptionArr: initialSystemOptionArr,
		setCodeStr,
		setSelFirst,
		showError,
		onClickCode: propOnClickCode,
		onClickEmail: propOnClickEmail,
		setLoading,
		setSelSystemIdx
	} = route.params || props;

	// Convert class state to useState hooks
	const [selTab, setSelTab] = useState(tabArr[0].key);
	const [selFirst, setSelFirstState] = useState(initialSelFirst || 'input');
	const [codeStr, setCodeStrState] = useState(initialCodeStr || '');
	const [selIdx, setSelIdx] = useState(initialSelIdx || 0);
	const [email, setEmail] = useState(defaultEmail);
	const [passd, setPassd] = useState(defaultPassd);
	const [systemOptionArr, setSystemOptionArr] = useState(initialSystemOptionArr || []);
	const [mainInfo, setMainInfo] = useState(initialMainInfo || {});
	
	// Animation state
	const [tabTop, setTabTop] = useState(10);
	const [imgLogoW, setImgLogoW] = useState(82);
	const [imgLabelW, setImgLabelW] = useState(140);
	const [imgMarginV, setImgMarginV] = useState(0);
	const [logoTop, setLogoTop] = useState(90);
	const [logoPartH, setLogoPartH] = useState(160);
	const [keyBottom, setKeyBottom] = useState(0);

	// Create a reference object for SetAnimateArr
	const componentRef = {
		setState: (updates) => {
			Object.keys(updates).forEach(key => {
				switch(key) {
					case 'tabTop': setTabTop(updates[key]); break;
					case 'logoTop': setLogoTop(updates[key]); break;
					case 'keyBottom': setKeyBottom(updates[key]); break;
					default: break;
				}
			});
		}
	};

	// Convert componentDidMount to useEffect
	useEffect(() => {
		let keyboardDidShowListener, keyboardDidHideListener;
		
		if (Platform.OS !== 'ios') {
			keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
			keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
		}

		return () => {
			if (Platform.OS !== 'ios') {
				keyboardDidShowListener?.remove();
				keyboardDidHideListener?.remove();
			}
		};
	}, [selTab]);

	// Convert componentWillReceiveProps to useEffect
	useEffect(() => {
		if (initialCodeStr !== undefined && initialCodeStr !== codeStr) {
			setCodeStrState(initialCodeStr);
		}
	}, [initialCodeStr]);

	useEffect(() => {
		if (initialMainInfo && !initialMainInfo.name && mainInfo.name) {
			setLogoPartH(160);
			setLogoTop(90);
			setTabTop(10);
			setImgLogoW(82);
			setImgLabelW(140);
			setImgMarginV(0);
			setSelFirst && setSelFirst('input');
		}
		setMainInfo(initialMainInfo || {});
	}, [initialMainInfo]);

	useEffect(() => {
		if (initialSelFirst === 'confirm') {
			setSelFirstConfirm();
		}
		setSelFirstState(initialSelFirst || 'input');
	}, [initialSelFirst]);

	useEffect(() => {
		setSelIdx(initialSelIdx || 0);
	}, [initialSelIdx]);

	useEffect(() => {
		setSystemOptionArr(initialSystemOptionArr || []);
	}, [initialSystemOptionArr]);

	// Convert class methods to functions
	const keyboardDidShow = () => {
		if (selTab === 'kunde') return;
		const animateArr = [{ key: 'keyBottom', old: 0, new: 200 }];
		SetAnimateArr(animateArr, componentRef);
	};

	const keyboardDidHide = () => {
		if (selTab === 'kunde') return;
		const animateArr = [{ key: 'keyBottom', old: 200, new: 0 }];
		SetAnimateArr(animateArr, componentRef);
	};

	const onChangeInput = (e, key) => {
		let str = e;
		if (key === 'codeStr') {
			str = e.toUpperCase();
			setCodeStr && setCodeStr(str);
			setCodeStrState(str);
		} else if (key === 'email') {
			setEmail(str);
		} else if (key === 'passd') {
			setPassd(str);
		}
	};

	const onClickCode = (loading) => {
		if (!codeStr || codeStr.length !== codeLength) return;
		propOnClickCode && propOnClickCode(loading);
	};

	const setSelFirstConfirm = () => {
		const animateArr = [
			{ key: 'tabTop', old: 10, new: -50 },
			{ key: 'logoTop', old: 90, new: 40 },
		];
		SetAnimateArr(animateArr, componentRef);
	};

	const checkEmail = (str) => {
		return String(str).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	};

	const onClickEmail = () => {
		if (!checkEmail(email) || passd === '') {
			Alert.alert(
				'Input Error',
				'Insert correct email format and password!',
				[{ text: 'OK', onPress: async () => {} }],
				{ cancelable: false }
			);
			return;
		}
		propOnClickEmail && propOnClickEmail(email, passd);
	};

	const onClickConfirm = () => {
		navigation.navigate('Total');
	};

	const callPhone = () => {
		const phoneNumber = '+41415158888';
		Linking.openURL(`tel:${phoneNumber}`);
	};

	const codeBtnStyle = codeStr.length === codeLength ? {} : MainCss.buttonEmpty;
	return (
		<KeyboardAwareScrollView contentContainerStyle={{...MainCss.backBoard, ...MainCss.flexColumn, flex:1}} extraHeight={-64}>
			<View style={{position: 'absolute', top:tabTop, width: wholeWidth, ...MainCss.flex, display:'flex',}}>{/* tabTop -50 */}
				{tabArr.map((item, idx)=>
					<TouchableOpacity style={{...MainCss.flex, flex: 1}} onPress={() => setSelTab(item.key)} key={idx}>
						<View style={{paddingVertical: 6, borderBottomWidth :3, borderBottomColor: selTab===item.key?'#D9271C':'#FFFFFF'}}>
							<Text style={{...MainCss.label, width: 100, textAlign: 'center'}}>{item.label}</Text>
						</View>
					</TouchableOpacity>
				)}
			</View>
			<View style={{...MainCss.flexColumn, height:logoPartH, marginTop:logoTop}}>
				<Image source={imgLogo} style={{width:imgLogoW, height:imgLogoW, marginVertical:imgMarginV, resizeMode: 'contain'}} />
				<Image source={imgLabel} style={{width:imgLabelW, resizeMode: 'contain'}} />
			</View>
			{selTab==='kunde' &&
				<View style={{...MainCss.flexColumn, flex:1}}>
					{selFirst==='input' &&
						<View style={{...MainCss.flexColumn}}>
							<View style={{...MainCss.labelWrapper}}>
								<Text style={{...MainCss.label}}>Beim Auftragsabschluss hast Du</Text>
								<Text style={{...MainCss.label}}>einen Code von uns erhalten.</Text>
							</View>
							{/* <TouchableOpacity style={{...MainCss.button}} onPress={() => navigation.navigate('QRScan')}>
								<View style={{...MainCss.buttonIcon}}>
									<Image source={imgQr} style={{...MainCss.buttonImg}}></Image>
								</View>
								<Text style={{...MainCss.buttonIconLabel}}>QR-Code scannen</Text>
							</TouchableOpacity> */}
							
							<TextInput
								placeholder='Code eingeben'
								value={codeStr}
								onChangeText={e=>onChangeInput(e, 'codeStr')}
								style={{...MainCss.input, marginBottom: 10, marginTop:20}}
								placeholderTextColor={grey}
								// underlineColorAndroid="transparent"
								// blurOnSubmit={false} 
								// autoFocus={false} 
								// autoCorrect={false}
								// autoCapitalize="none" 
								// keyboardType="email-address" 
								// returnKeyType="next" 
								// onSubmitEditing={this.submit.bind(this)}
							></TextInput>
							<TouchableOpacity style={{...MainCss.button, ...codeBtnStyle}}
							// backgroundColor:codeStr.length===codeLength?red:white, borderColor:codeStr.length===codeLength?white:red
								onPress={e=>{
									if (!codeStr || codeStr.length!==codeLength) {
										showError && showError('Insert correct code!');
									} else { 
										onClickCode(true);
									}
								}}
							>
								<Text style={{...MainCss.buttonLabel, color:codeStr.length===codeLength?white:red}}>Weiter</Text>
							</TouchableOpacity>
							<View style={{...MainCss.labelWrapper}}>
								<Text style={{...MainCss.label}}>Noch kein Kunde?</Text>
								<Text style={{...MainCss.label}}>Kostenloses Angebot:</Text>
							</View>
							<TouchableOpacity style={{...MainCss.button, marginBottom:50}} onPress={e=>callPhone()}>
								<View style={{...MainCss.buttonIcon}}>
									<Image source={imgPhone} style={{...MainCss.buttonImg}}></Image>
								</View>
								<Text style={{...MainCss.buttonIconLabel}}>+41 41 515 88 88</Text>
							</TouchableOpacity>
						</View>
					}
					{selFirst==='confirm' &&
						<>{/* SafeAreaView style={{...MainCss.flexColumn, height:wholeHeight - 250}} */}
							<View style={{...MainCss.labelWrapper}}>
								<Text style={{...MainCss.label, textAlign:'center', fontSize:20}}>Hallo {mainInfo?.name},</Text>
								<Text style={{...MainCss.label, textAlign:'center', fontSize:20}}>wähle deine Anlage:</Text>
							</View>
							{/* <SelectDropdown
								data={systemOptionArr}
								onSelect={(selectedItem, index) => { setSelSystemIdx && setSelSystemIdx(index); }} // this.setState({selLocIdx:index})
								defaultValue={systemOptionArr[selIdx]}
								buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
								rowTextForSelection={(item, index) => { return item }}
								buttonStyle={{...MainCss.selectButton}}
							/> */}
							<TouchableOpacity style={{...MainCss.button, width:200}} onPress={onClickConfirm}>
								<Text style={{...MainCss.buttonLabel}}>Bestätigen</Text>
							</TouchableOpacity>
						</>// SafeAreaView
					}

				</View>
			}

			{selTab !== 'kunde' &&
				<View style={{...MainCss.flexColumn, flex:1, marginBottom:keyBottom}}>
					<Text style={{...MainCss.label, fontSize:20, lineHeight:25}}>Melde Dich hier mit deinen</Text>
					<Text style={{...MainCss.label, fontSize:20, lineHeight:25}}> Daten an.</Text>
					<TextInput
						placeholder='E-Mail'
						value={email}
						onChangeText={e=>onChangeInput(e, 'email')}
						style={{...MainCss.input, marginTop:20}}
						placeholderTextColor={grey}
						onSubmitEditing={e=>{onClickEmail(); }}
					></TextInput>
					<TextInput
						placeholder='Passwort'
						value={passd}
						secureTextEntry={true}
						onChangeText={e=>onChangeInput(e, 'passd')}
						style={{...MainCss.input, marginBottom: 20, marginTop:10}}
						placeholderTextColor={grey}
						onSubmitEditing={e=>{onClickEmail(); }}
					></TextInput>
					<TouchableOpacity style={{...MainCss.button}} onPress={onClickEmail}>
						<Text style={{...MainCss.buttonLabel}}>Absenden</Text>
					</TouchableOpacity>
				</View>
			}

		</KeyboardAwareScrollView>
	);
}
