
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { View } from 'react-native';

import { MainCss } from './assets/css';
import TopMenuComponent from './pages/layout/TopMenu';

import imgBill from './assets/images/bill.png';
import imgClock from './assets/images/clock.png';

import imgServiceWhite from './assets/images/service-white.png';

import ListWrapper from './pages/layout/ListWrapper';
import RoundIconBtn from './pages/layout/RoundIconBtn';

export const listServicetArr = [
	{key:'course', label:'Verlauf', title : 'Serviceverlauf', img:imgClock},
	{key:'bill', label:'Stand Rechnungen', title:'Stand Rechnungen', img:imgBill},
]

export default function ServiceMainComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	const { setServiceKey } = props;

	useEffect(() => {
		// Component did mount logic here
	}, []);

	const onClickSubItem = (itemKey) => {
		if (setServiceKey) setServiceKey(itemKey);
		navigation.navigate('ServiceDetail');
	};

	const onClickCreateService = () => {
		navigation.navigate('ServiceCreate');
	};

	return (
		<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
			<TopMenuComponent
				label={'Service'}
				openProfile={()=>navigation.navigate('Profile')}
				goBack={e=>navigation.goBack()}
			></TopMenuComponent>
			<RoundIconBtn
				img={imgServiceWhite}
				label='Service beantragen'
				onClick={e=>onClickCreateService()}
			></RoundIconBtn>
			<View style={{...MainCss.flexColumn, flex:1}}>
				<ListWrapper
					listArr={listServicetArr} // []
					onClickListItem={listKey=> onClickSubItem(listKey)}
				></ListWrapper>
				<View style={{flex:1}}></View>
			</View>
		</View>
	);
}
