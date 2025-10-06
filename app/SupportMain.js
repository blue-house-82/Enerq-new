
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { MainCss } from './assets/css';
import TopMenuComponent from './pages/layout/TopMenu';

import imgDoc from './assets/images/doc.png';
import imgQuestion from './assets/images/question-black.png';
import imgTicket from './assets/images/ticket.png';

import imgSupportWhite from './assets/images/support-white.png';
import imgSupport from './assets/images/support.png';

import ListWrapper from './pages/layout/ListWrapper';
import RoundIconBtn from './pages/layout/RoundIconBtn';


const listSupportArr = [
	{key:'ticketList', label:'Meine Support-Tickets', img:imgTicket},
	{key:'warranty', label:'Garantieübersicht', img:imgDoc},
]

const SubPartCss = StyleSheet.create({
	supportTop: { height:200, marginTop:50},
	supportTopImg: { width:60, height:60, opacity:0.6, marginBottom:40, resizeMode:'contain'},
});

export default function SupportMainComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	const { selSystem: propSelSystem, unRead: propUnRead } = props;
	
	const [selSystem, setSelSystem] = useState(propSelSystem || null);
	const [unRead, setUnRead] = useState(propUnRead || null);

	useEffect(() => {
		// Component did mount logic here
	}, []);

	useEffect(() => {
		if (propSelSystem !== selSystem) {
			setSelSystem(propSelSystem);
		}
		if (propUnRead !== unRead) {
			setUnRead(propUnRead);
		}
	}, [propSelSystem, propUnRead, selSystem, unRead]);

	const onClickSubItem = (itemKey) => {
		if (itemKey==='ticketList') {
			navigation.navigate('TicketList');
		}
	};

	const onClickCreateTicket = () => {
		navigation.navigate('TicketCreate');
	};
	return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label={'Support'}
					openProfile={()=>navigation.navigate('Profile')}
					goBack={e=>navigation.goBack()}
				></TopMenuComponent>
				<View style={{...SubPartCss.supportTop, ...MainCss.flexColumn}}>
					<Image source={imgSupport} style={{...SubPartCss.supportTopImg}}></Image>
					<ListWrapper
						listArr={[ {key:'question', label:'Häufig gestellte Fragen', img:imgQuestion}, ]}
						onClickListItem={listKey=> {console.log(listKey)}}
					></ListWrapper>
				</View>
				<RoundIconBtn
					img={imgSupportWhite}
					label='Support anfragen'
					onClick={e=>onClickCreateTicket()}
				></RoundIconBtn>
				<View style={{...MainCss.flexColumn, flex:1}}>
					<ListWrapper
						listArr={listSupportArr}
						unRead={unRead}
						onClickListItem={listKey=> onClickSubItem(listKey)}
					></ListWrapper>
					<View style={{flex:1}}></View>
				</View>
				<View style={{...MainCss.flexColumn, flex:1, marginBottom:30}}>
					{/* <Text style={{...MainCss.label}}>Du erreichst uns auch per Mail an:</Text>
					<Text style={{...MainCss.label}}>support@enerq.ch</Text> */}
				</View>
			</View>
		);
}
