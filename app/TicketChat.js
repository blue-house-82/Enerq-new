import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useRef, useState } from 'react';
// import RNFetchBlob from 'rn-fetch-blob';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Animated, Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RenderHtml from 'react-native-render-html';

import { black, grey, MainCss, ModalCss, red, white, wholeWidth } from './assets/css';
import imgAttach from './assets/images/attach.png';
import imgChatTriGrey from './assets/images/chat-tri-grey.png';
import imgChatTriRed from './assets/images/chat-tri-red.png';
import imgClose from './assets/images/close.png';
import imgDownload from './assets/images/download.png';
import imgInfoRed from './assets/images/info-red.png';
import imgSupportGrey from './assets/images/support.png';
import { GetParseDate, UpdateHtmlStr } from './data/common';
import { apiUrl } from './data/config';
import TopMenuComponent from './pages/layout/TopMenu';

const DetailCss = StyleSheet.create({
	chatBoard:{flex:1, flexGrow:1, width:wholeWidth},
})

export default function TicketChatComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	const { selTicketId: propSelTicketId, mainInfo: propMainInfo, ticketArr: propTicketArr, teamArr: propTeamArr, setLoading, resetSelTicketId, openTicketInfo } = props;
	
	const inputBottom = useRef(new Animated.Value(0));
	const scrollRef = useRef();
	const ticketInfoRef = useRef(null);
	const keyShowEventRef = useRef(null);
	const keyHideEventRef = useRef(null);
	
	const [selTicketId, setSelTicketId] = useState(propSelTicketId || null);
	const [mainInfo, setMainInfo] = useState(propMainInfo || null);
	const [ticketArr, setTicketArr] = useState(propTicketArr || []);
	const [teamArr, setTeamArr] = useState(propTeamArr || []);
	const [messageArr, setMessageArr] = useState([]);
	const [detailCourse, setDetailCourse] = useState({});
	const [courseOpacity, setCourseOpacity] = useState(1);
	const [selSystemIdx, setSelSystemIdx] = useState(0);
	const [selFormatIdx, setSelFormatIdx] = useState(0);
	const [inputStr, setInputStr] = useState('');
	const [keyShow, setKeyShow] = useState(false);
	const [modalImg, setModalImg] = useState(false);

	useEffect(() => {
		keyShowEventRef.current = Keyboard.addListener('keyboardDidShow', (e) => { setKeyStatus(e, true); });
		keyHideEventRef.current = Keyboard.addListener('keyboardDidHide', (e) => { setKeyStatus(e, false); });
		
		if (selTicketId) {
			ticketInfoRef.current = ticketArr.find(item => parseInt(item.id) === parseInt(selTicketId));
			refreshChatData(0, true);
		}
		
		return () => {
			if (keyShowEventRef.current) keyShowEventRef.current.remove();
			if (keyHideEventRef.current) keyHideEventRef.current.remove();
		};
	}, []);

	useEffect(() => {
		if (propSelTicketId !== selTicketId) {
			setSelTicketId(propSelTicketId);
			if (propSelTicketId) {
				ticketInfoRef.current = ticketArr.find(item => parseInt(item.id) === parseInt(propSelTicketId));
				refreshChatData(0, true);
			}
		}
		if (propMainInfo !== mainInfo) setMainInfo(propMainInfo);
		if (propTicketArr !== ticketArr) setTicketArr(propTicketArr);
		if (propTeamArr !== teamArr) setTeamArr(propTeamArr);
	}, [propSelTicketId, propMainInfo, propTicketArr, propTeamArr]);

	const refreshChatData = (time, loading) => {
		const isFocused = navigation.isFocused();
		if (!isFocused) return;
		const customerId = parseInt(mainInfo.id);
		if (!selTicketId || !ticketInfoRef.current) return;
		if (setLoading) setLoading(loading);
		const getDataJson = {ticketId: parseInt(ticketInfoRef.current.id), time, customerId};
		axios.post(`${apiUrl}mobile/getMessage.php`, getDataJson).then(res => {
			const newMessageArr = [...messageArr];
			res.data.forEach(item => {
				const timeVal = parseInt(item.time);
				const senderInfo = item.customer ? mainInfo : teamArr.find(emp => emp.id === parseInt(item.sender));
				const messageItem = {
					time: getTimeStr(timeVal),
					sender: senderInfo.name,
					message: UpdateHtmlStr(item.content, item.messageType),
					client: parseInt(item.sender) === customerId ? false : true,
					messageType: item.messageType
				}
				newMessageArr.push(messageItem);
				time = timeVal;
			});
			setMessageArr(newMessageArr);
			if (setLoading) setLoading(false);
			setTimeout(() => { refreshChatData(time); }, 1000);
		}).catch(error => {
			console.log(error);
			if (setLoading) setLoading(false);
		});
	};

	const getTimeStr = (timeVal) => {
		if (!timeVal) return '';
		const {yearNum, monthName, dayNum, hourStr, minStr} = GetParseDate(timeVal);
		return dayNum + '. ' + monthName + ' ' + yearNum + ' ' + hourStr + ':' + minStr;
	};

	const setKeyStatus = (e, status) => {
		Animated.timing(inputBottom.current, { toValue: e.endCoordinates.height, duration: 300, useNativeDriver: false }).start();
		setKeyShow(status);
	};

	const sendMessage = (messageType) => {
		if (!inputStr.trim()) return;
		const timeVal = Math.round(Date.now() / 1000);
		const messageItem = {
			time: getTimeStr(timeVal),
			sender: mainInfo.name,
			message: messageType === 'image' ? inputStr : '<p style="color: black; margin: 3px 0px;">' + inputStr + '</p>',
			client: false,
			messageType
		}
		const newMessageArr = [...messageArr, messageItem];
		setMessageArr(newMessageArr);
		setInputStr('');
		const {id, systemId} = ticketInfoRef.current;
		const insertData = {
			systemId: parseInt(systemId),
			ticketId: parseInt(id),
			sender: parseInt(mainInfo.id),
			content: messageType === 'image' ? inputStr : '<p>' + inputStr + '</p>',
			time: timeVal,
			messageType
		}
		axios.post(`${apiUrl}mobile/sendMessage.php`, insertData).then(res => {
		}).catch(error => { });
	};

	const onChangeInput = (str) => {
		setInputStr(str);
	};

	const setScrollEnd = (e) => {
		const scrollHeight = e.nativeEvent.layout.y;
		scrollRef.current.scrollTo({x: 0, y: scrollHeight, animated: true});
	};

	const downloadModal = () => {
		if (setLoading) setLoading(true);
		const date = new Date();
		const image_URL = apiUrl + 'other/message_images/' + modalImg;
		let ext = getExtention(image_URL);
		ext = '.' + ext[0];
		// const { config, fs } = RNFetchBlob;
		// let PictureDir = fs.dirs.PictureDir;
		// let options = {
		// 	fileCache: true,
		// 	addAndroidDownloads: {
		// 		// Related to the Android only
		// 		useDownloadManager: true,
		// 		notification: true,
		// 		path: PictureDir + '/image_' +  Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
		// 		description: 'Image',
		// 	},
		// };
		// config(options).fetch('GET', image_URL).then(res => {
		// 	console.log('res -> ', JSON.stringify(res));
		// 	if (setLoading) setLoading(false);
		// });
	};

	const getExtention = (filename) => {
		return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
	};

	const selectFile = async () => {
		// DocumentPicker.pick({ type: ['image/*'], }, (error, res) => { console.log(error); });
		try {
			const res = await DocumentPicker.pick({ type: ['image/*'] });
			const fileInfo = res[0];
			if (!fileInfo) return;
			// {"fileCopyUri": null, "name": "IMG_20230309_024536.jpg", "size": 10593640, "type": "image/jpeg", "uri": "content://media/external/images/media/1463"}
			const format = fileInfo.name.split('.').pop();
			if (setLoading) setLoading(true);
			if (!format) return;
			const formData = new FormData();
			formData.append("file", fileInfo);
			formData.append("format", format);
			formData.append("type", 'message');

			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", apiUrl + 'other/uploadImgFile.php', true); // Mobile
			xhttp.onreadystatechange = (e) => {
				const result = e.target;
				if (result.readyState === 4 && result.status === 200) {
					const res = JSON.parse(result.responseText);
					console.log('success');
					console.log(res);
					setInputStr(res.file_name + '.' + format);
					sendMessage('image');
					setTimeout(() => { if (setLoading) setLoading(false); }, 100);
				}
			};
			xhttp.send(formData);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) { } else { }
		}
	};

	const closeImageModal = () => {
		setModalImg(false);
	};

	return (
		<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
			<TopMenuComponent
				label='Chat-Support'
				openProfile={()=>{
					if (resetSelTicketId) resetSelTicketId(0);
					navigation.navigate('Profile');
				}}
				goBack={e=>{
					if (resetSelTicketId) resetSelTicketId(0);
					navigation.goBack()
				}}
			></TopMenuComponent>
			<View style={{width:wholeWidth, flex:1}}>
				<View style={{...MainCss.flex, paddingVertical:10, borderTopColor:grey, borderTopWidth:2}}>
					<Image source={imgSupportGrey} style={{...MainCss.buttonIcon, marginRight:15, marginLeft:10}}></Image>
					<Text style={{...MainCss.label, flex:1}}>Ticket-Nummer: {ticketInfoRef.current ? ticketInfoRef.current.number : ''}</Text>
					<TouchableOpacity style={{marginRight:15}} onPress={e=>openTicketInfo && openTicketInfo()}><Image source={imgInfoRed} style={{...MainCss.buttonIcon}}></Image></TouchableOpacity>
				</View>
				<View style={{width:wholeWidth, flex:1}}>
					<ScrollView ref={scrollRef}>
						{messageArr.map((chat, idx)=>
							<View key={idx} style={{marginVertical:10, marginHorizontal:30, ...MainCss.flex}} onLayout={e=>{if (idx===messageArr.length-1) setScrollEnd(e)}}>
								<View style={{width:66, display:chat.client?'none':'flex'}}></View>
								<View style={{flex:1, backgroundColor:chat.client?'#F5BCBB':'#E6E3E6', paddingHorizontal:10, paddingVertical:7, borderRadius:7, position:'relative'}}>
									<View style={{...MainCss.flex}}>
										<Text style={{...MainCss.label, color:grey, flex:1}}>{chat.sender}</Text>
										<Text style={{...MainCss.label, color:grey}}>{chat.time}</Text>
									</View>
									{!chat.messageType &&
										<RenderHtml
											style={{...MainCss.label, color:black}}
											contentWidth={wholeWidth}
											source={{html:chat.message}}
										/>
									}
									{chat.messageType==='image' &&
										<TouchableOpacity style={{width:'100%', height:150, ...MainCss.flex}} onPress={e=>setModalImg(chat.message)}>
											<Image source={{uri : apiUrl+'other/message_images/'+chat.message}} style={{width:'95%', height:150, resizeMode:'contain'}}></Image>
										</TouchableOpacity>
									}
									{chat.client ?
										<Image source={imgChatTriRed} style={{position:'absolute', top:0, left:-12}}></Image>:
										<Image source={imgChatTriGrey} style={{position:'absolute', top:0, right:-12}}></Image>
									}
								</View>
								<View style={{width:66, display:chat.client?'flex':'none'}}></View>
							</View>
						)}
					</ScrollView>
				</View>
				<View style={{...MainCss.flex, backgroundColor:'#D0D0D0', width:wholeWidth, height:60}}>
					<TextInput
						placeholder='Hier tippen..'
						value={inputStr}
						onChangeText={e=>onChangeInput(e)}
						style={{backgroundColor:white, ...MainCss.label, flex:1, borderRadius:7, height:44, paddingHorizontal:10, marginHorizontal:10}}
					></TextInput>
					<TouchableOpacity style={{...MainCss.flex, height:44, borderRadius:7, width:44, borderColor:grey, borderWidth:1}} onPress={e=>selectFile()}>
						<Image source={imgAttach} style={{width:25, height:25, resizeMode:'contain'}}></Image>
					</TouchableOpacity>
					<TouchableOpacity style={{...MainCss.flex, height:44, borderRadius:7, backgroundColor:red, width:60, opacity:inputStr?1:0.3, marginHorizontal:10}} onPress={e=>sendMessage()}>
						<Text style={{color:white}}>OK</Text>
					</TouchableOpacity>
				</View>
				<Animated.View style={[{width:wholeWidth, height:inputBottom.current}]}></Animated.View>
			</View>
			{modalImg &&
				<View style={{...ModalCss.back}}>
					<View style={{...ModalCss.wrapper, height:580}}>
						<Image source={{uri : apiUrl+'other/message_images/'+modalImg}} style={{...ModalCss.image}}></Image>
						<TouchableOpacity style={{...MainCss.button, width:80}} onPress={e=>downloadModal()}>
							<Image source={imgDownload} style={{...MainCss.buttonImg}}></Image>
						</TouchableOpacity>
						<TouchableOpacity style={{...ModalCss.close}} onPress={e=>closeImageModal()}>
							<Image source={imgClose} style={{...ModalCss.closeImg}}></Image>
						</TouchableOpacity>
					</View>
				</View>
			}
		</View>
	);
}
