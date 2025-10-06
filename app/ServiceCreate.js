import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
// import SelectDropdown from 'react-native-select-dropdown';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { apiUrl } from './data/config';
import TopMenuComponent from './pages/layout/TopMenu';

import { MainCss, black, wholeHeight, wholeWidth } from './assets/css';
import { moduleLabelArr } from './data/constant';

const mainCatArr = ['Photovoltaikanlage', 'Wärmepumpe', 'Speicher'];

const subCatKeyArr = [
	['module-clean', 'inverter-clean'],
	['blower-clean', 'temp-regulation'],
	['adjustment']
]

const subCatArr = [
	['Modulreinigung', 'Wechselrichterreinigung'],
	['Gebläsereinigung', 'Temperatureinregelung'],
	['Priorisierungsanpassung']
]

const CreateCss = StyleSheet.create({
	label: {...MainCss.label, marginTop:20, marginBottom:10, marginHorizontal:40, fontSize:18},
	select: {width:wholeWidth - 80, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#C9C9C9', marginHorizontal:40, marginBottom:10, borderRadius:7, textAlign:'left'},
	input:{width:wholeWidth-80, color:black, borderWidth:1, borderColor:'#C5C5C5', borderRadius:4, marginHorizontal:40, fontSize:16}
})

export default function ServiceCreateComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	const { mainInfo, selSystem, setLoading, setError } = props;
	
	const subSelect = useRef();
	const [state, setState] = useState({
		mainInfo: mainInfo || null,
		selSystem: selSystem || null,
		selMainIdx: null,
		selSubIdx: null,
		description: ''
	});

	useEffect(() => {
		// Component did mount logic here
	}, []);

	useEffect(() => {
		setState(prevState => ({
			...prevState,
			mainInfo: mainInfo || null,
			selSystem: selSystem || null
		}));
	}, [mainInfo, selSystem]);

	const onChangeInput = (str, key) => {
		setState(prevState => ({
			...prevState,
			[key]: str
		}));
	};

	const checkDisable = () => {
		const {description, selMainIdx, selSubIdx} = state;
		return (!description || selMainIdx===null || selSubIdx===null);
	};

	const submitCreate = () => {
		if (checkDisable()) return;
		const {mainInfo, selSystem, description, selMainIdx, selSubIdx} = state;
		const selMainLabel = moduleLabelArr.find(item=>{return mainCatArr[selMainIdx].includes(item.label)}) || {};
		const mainType = selMainLabel.key, subType = subCatKeyArr[selMainIdx][selSubIdx];
		
		const time = Date.now();
		const updateData = {customerId:parseInt(mainInfo.id), systemId:parseInt(selSystem.id), mainType, subType, content:description, time:Math.round(time/1000)};
		if (setLoading) setLoading(true);
		axios.post(`${apiUrl}mobile/updateService.php`, updateData).then(res => {
			const {success} = res.data;
			if (success) {
				setState(prevState => ({
					...prevState,
					selMainIdx: null,
					selSubIdx: null,
					description: ''
				}));
			} else {
				if (setError) setError('Failed to create the service request');
			}
			if (setLoading) setLoading(false);
		}).catch(error => {
			console.error(error);
			if (setLoading) setLoading(false);
		});
	};

	const { description, selMainIdx, selSubIdx} = state;
	
	return (
		<KeyboardAwareScrollView style={{...MainCss.backBoard}}>
			<TopMenuComponent
				label={'Support'}
				openProfile={()=>navigation.navigate('Profile')}
				goBack={e=>navigation.goBack()}
			></TopMenuComponent>
			<Text style={{...CreateCss.label}}>Für welche Anlage möchten Sie Service beantragen?</Text>
			<View style={{...MainCss.flex}}>
				{/* <SelectDropdown
					data={mainCatArr}
					onSelect={(selectedItem, index) => { setState(prevState => ({...prevState, selMainIdx:index, selSubIdx:null})); subSelect.current.reset(); }}
					defaultValue={''}
					buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
					rowTextForSelection={(item, index) => { return item }}
					selectIndex={selMainIdx}
					// dropdownStyle={{width:200, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#C9C9C9'}}
					buttonStyle={{...MainCss.selectButton, width:wholeWidth - 80, marginBottom:10, textAlign:'left'}}
				/> */}
			</View>

			<Text style={{...CreateCss.label}}>Welchen Service möchten Sie für diese Anlage beantragen?</Text>
			<View style={{...MainCss.flex}}>
				{/* <SelectDropdown
					ref={subSelect}
					data={subCatArr[selMainIdx] || []}
					onSelect={(selectedItem, index) => { setState(prevState => ({...prevState, selSubIdx:index})); }}
					defaultValue={''}
					buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
					rowTextForSelection={(item, index) => { return item }}
					selectIndex={selSubIdx}
					// dropdownStyle={{width:200, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#C9C9C9'}}
					buttonStyle={{...MainCss.selectButton, width:wholeWidth - 80, marginBottom:10, textAlign:'left'}}
				/> */}
			</View>

			<Text style={{...CreateCss.label}}>Anmerkungen:</Text>
			<TextInput
				placeholder='Deine Anfrage hier eingeben..'
				placeholderTextColor={black}
				value={description}
				onChangeText={e=>onChangeInput(e, 'description')}
				style={{...CreateCss.input, height:wholeHeight - 510, verticalAlign:'top', paddingHorizontal:10}}
				editable
				multiline
			></TextInput>
			<TouchableOpacity style={{...MainCss.button, width:200, borderRadius:4, marginTop:10, marginLeft:wholeWidth - 240, opacity:checkDisable()?0.5:1}} onPress={e=>submitCreate()}>
				<Text style={{...MainCss.buttonLabel}}>Angebot anfordern</Text>
			</TouchableOpacity>
			{/* <View style={{...MainCss.button, width:200, borderRadius:4, marginTop:10, marginLeft:wholeWidth - 240, opacity:this.checkDisable()?0.5:1}} 
				onTouchStart={e=>onTouchS(e, this) }
				onTouchEnd={e => onTouchE(e, this, 'serviceCreate') }>
				<Text style={{...MainCss.buttonLabel}}>Angebot anfordern</Text>
			</View> */}
		</KeyboardAwareScrollView>
	);
}
