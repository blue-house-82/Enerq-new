import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import SelectDropdown from 'react-native-select-dropdown';

import { apiUrl } from './data/config';
import TopMenuComponent from './pages/layout/TopMenu';

import { MainCss, black, red, wholeHeight, wholeWidth } from './assets/css';
import imgSupportWhite from './assets/images/support-white.png';
import { catArr } from './data/constant';
const catLabelArr = [];
catArr.forEach(cat => { catLabelArr.push(cat.label) });

const CreateCss = StyleSheet.create({
	redBar: {...MainCss.flex, width:wholeWidth, height:60, backgroundColor:red},
	input:{width:wholeWidth-40, color:black, borderWidth:1, borderColor:'#C5C5C5', borderRadius:4, marginHorizontal:20}
})

export default function TicketCreateComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	const { selSystem: propSelSystem, mainInfo: propMainInfo, ticketArr: propTicketArr, setLoading, callTicketAPI } = props;
	
	const ticketCatRef = useRef(catArr[0].key);
	
	const [selSystem, setSelSystem] = useState(propSelSystem || null);
	const [category, setCategory] = useState(catArr[0].label);
	const [selCatIdx, setSelCatIdx] = useState(0);
	const [mainInfo, setMainInfo] = useState(propMainInfo || null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [ticketArr, setTicketArr] = useState(propTicketArr || []);

	useEffect(() => {
		// Component did mount logic here
		// this._unsubscribe = navigation.addListener('focus', () => {
		// 	// do something
		// });
		
		// return () => {
		// 	// this._unsubscribe();
		// };
	}, []);

	useEffect(() => {
		if (propSelSystem !== selSystem) {
			setSelSystem(propSelSystem);
		}
		if (propMainInfo !== mainInfo) {
			setMainInfo(propMainInfo);
		}
		if (propTicketArr !== ticketArr) {
			setTicketArr(propTicketArr);
		}
	}, [propSelSystem, propMainInfo, propTicketArr]);

	const onChangeInput = (str, key) => {
		if (key === 'title') {
			setTitle(str);
		} else if (key === 'description') {
			setDescription(str);
		}
	};

	const submitCreate = () => {
		const catInfo = catArr.find(item => { return item.key === ticketCatRef.current });
		const desArr = description.split('\n');
		var newDesStr = '';
		desArr.forEach(des => {
			newDesStr += '<p>' + des + '</p>\n';
		});

		const time = Date.now();
		var ticketNum = ticketArr.length + 1, ticketNumStr = '';
		if (ticketNum < 10) ticketNumStr = '00' + ticketNum;
		else if (ticketNum < 100) ticketNumStr = '0' + ticketNum;
		const updateData = {
			customerId: parseInt(mainInfo.id),
			systemId: parseInt(selSystem.id),
			number: selSystem.number + ticketNumStr,
			category: catInfo.label,
			title,
			employeeId: 0,
			description: newDesStr,
			status: 'client',
			createTime: Math.round(time / 1000)
		};
		if (setLoading) setLoading(true);
		axios.post(`${apiUrl}mobile/updateTicket.php`, updateData).then(res => {
			if (setLoading) setLoading(false);
			const {success} = res.data;
			if (success) {
				setTitle('');
				setDescription('');
				if (callTicketAPI) callTicketAPI();
			}
		}).catch(error => {
			console.error(error);
			if (setLoading) setLoading(false);
		});
	};

	return (
		<KeyboardAwareScrollView style={{...MainCss.backBoard}}>
			<TopMenuComponent
				label={'Support'}
				openProfile={()=>navigation.navigate('Profile')}
				goBack={e=>navigation.goBack()}
			></TopMenuComponent>
			<View style={{...CreateCss.redBar}}>
				<Image style={{...MainCss.buttonIcon}} source={imgSupportWhite}></Image>
				<Text style={{...MainCss.buttonIconLabel}}>Neue Support-Anfrage:</Text>
			</View>
			<Text style={{...MainCss.label, margin:20}}>Anlage: {selSystem?.name}, {selSystem?.canton}</Text>
			<View style={{display:'flex', flexDirection:'row', marginHorizontal:20}}>
				<Text style={{...MainCss.label, width:100, marginTop:10}}>Kategorie:</Text>
				{/* <SelectDropdown
					data={catLabelArr}
					onSelect={(selectedItem, index) => { 
						ticketCatRef.current = catArr[index].key; 
						setCategory(selectedItem);
						setSelCatIdx(index);
					}}
					defaultValue={category}
					buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
					rowTextForSelection={(item, index) => { return item }}
					selectIndex={selCatIdx}
					// dropdownStyle={{width:200, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#C9C9C9'}}
					buttonStyle={{...MainCss.selectButton, width:wholeWidth - 140}}
				/> */}
			</View>
			<TextInput
				placeholder='Betreff..'
				placeholderTextColor={black}
				value={title}
				onChangeText={e=>onChangeInput(e, 'title')}
				style={{...CreateCss.input, padding:10}}
			></TextInput>
			<TextInput
				placeholder='Deine Anfrage hier eingeben..'
				placeholderTextColor={black}
				value={description}
				onChangeText={e=>onChangeInput(e, 'description')}
				style={{...CreateCss.input, height:wholeHeight - 400, marginTop:20, verticalAlign:'top', paddingHorizontal:10}}
				editable
				multiline
			></TextInput>
			<TouchableOpacity style={{...MainCss.button, width:100, borderRadius:4, marginTop:10, marginLeft:wholeWidth - 120}} onPress={e=>submitCreate()}>
				<Text style={{...MainCss.buttonLabel}}>Senden</Text>
			</TouchableOpacity>
		</KeyboardAwareScrollView>
	);
}
