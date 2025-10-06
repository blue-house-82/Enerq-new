
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';

import { MainCss } from './assets/css';
import { GetSelItem, onTouchE, onTouchS } from './data/common';
import { mainListArr, moduleArr } from './data/constant';
import ListWrapper from './pages/layout/ListWrapper';
import TopMenuComponent from './pages/layout/TopMenu';

import imgChartWhite from './assets/images/chart-white.png';
import imgCheckBox from './assets/images/check-box.png';

const listChartArr = [
	{key:'status', label:'Projektstatus', img:imgCheckBox},
	// {key:'bill', label:'Stand Rechnungen', img:imgBill},
	// {key:'certify', label:'Garantiescheine', img:imgInfo},
	// {key:'document', label:'Anlagedokumentation', img:imgDoc},
	// {key:'service', label:'Service', img:imgService},
]

const selPart = mainListArr[0];

export default function ChartMainComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	
	// Get initial params from route or props
	const {
		chartKey: initialChartKey,
		...otherProps
	} = route.params || props;
	
	console.log("comeMain");
	console.log(initialChartKey);
	
	const [state, setState] = useState({
		selModule: GetSelItem(moduleArr, initialChartKey)
	});

	useEffect(() => {
		const currentParams = route.params || props;
		const chartKey = currentParams.chartKey;
		
		if (chartKey && chartKey !== initialChartKey) {
			const selModule = GetSelItem(moduleArr, chartKey);
			setState(prevState => ({
				...prevState,
				selModule
			}));
		}
	}, [route.params, props]);

	const onClickSubItem = (itemKey) => {
		if (itemKey === 'status') {
			navigation.navigate('ChartDetail');
		}
	};

	const onClickMainBtn = (btnKey) => {
		console.log(btnKey);
	};

	const {selModule} = state;
	
	return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label={selModule?.label || ''}
					openProfile={()=>navigation.navigate('Profile')}
					goBack={e=>navigation.goBack()}
				></TopMenuComponent>
				<View
					onTouchStart={e=>onTouchS(e, { setState })}
					onTouchEnd={e=>onTouchE(e, { setState }, 'chartMain')}
					style={{...MainCss.button, ...MainCss.buttonExpand}}
				>
					<Image source={imgChartWhite} style={{...MainCss.buttonIcon}}></Image>
					<Text style={{...MainCss.buttonLabel, fontSize:20}}>{'Anlagen'}</Text>
				</View>
				<View style={{...MainCss.flexColumn, flex:1}}>
					<ListWrapper
						listArr={listChartArr}
						onClickListItem={listKey=> onClickSubItem(listKey)}
					></ListWrapper>
					<View style={{flex:1}}></View>
				</View>
			</View>
		);
}
