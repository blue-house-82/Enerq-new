import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { mainListArr } from './data/constant';
import ListWrapper from './pages/layout/ListWrapper';
import ModuleComponent from './pages/layout/Module';
import TopMenuComponent from './pages/layout/TopMenu';

import { MainCss, white, wholeWidth } from './assets/css';

import imgNews from './assets/images/news.png';
import imgWeather from './assets/images/weather.png';
// import imgTime from './assets/images/clock.png';
import imgCheckBoxGreen from './assets/images/check-box-green.png';
import { onTouchE, onTouchS } from './data/common';

export const TotalCss = StyleSheet.create({
	techPart: { height: 60, borderTopWidth: 2, borderTopColor: '#C5C5C5', borderBottomWidth: 2, marginTop:10, borderBottomColor: '#C5C5C5'},
	techPartImg : {height:35, width:35, marginLeft:30},
	techCheckImg : {height:31, width:31, resizeMode:'contain'},
	techPartLabels: {flex:1},
	footer:{width:wholeWidth, height: 70, borderTopWidth: 1, borderTopColor: '#C5C5C5'},
	footerItem:{flex: 1, height: '100%'},
	footerImg:{height: 35, width:35, resizeMode:'contain', marginBottom: 0}
});

export const footerArr = [
	{img:imgWeather, label:'Wetter', pageName:'Weather'},
	{img:imgNews, label:'Neuigkeiten', pageName:'News'},
]

export default function TotalComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	
	// Get initial params from route or props
	const {
		pageKey: initialPageKey,
		selSystem: initialSelSystem,
		unRead: initialUnRead,
		setPartKey,
		setChartKey,
		...otherProps
	} = route.params || props;
	
	const initialLastUpdateStr = initialSelSystem?.lastUpdate || 'Not updated yet';
	
	const [pageKey, setPageKey] = useState(initialPageKey);
	const [sideKey, setSideKey] = useState('');
	const [partKeyState, setPartKeyState] = useState('');
	const [selSystem, setSelSystem] = useState(initialSelSystem);
	const [unRead, setUnRead] = useState(initialUnRead);
	const [lastUpdateStr, setLastUpdateStr] = useState(initialLastUpdateStr);
	
	const labelWidth = useRef(initialLastUpdateStr.length * 7.5);
	const labelLeft = useRef(new Animated.Value(0));
	const animationTimeout = useRef(null);

	useEffect(() => {
		if (labelWidth.current > wholeWidth - 80) {
			animateLabel();
		}
		
		return () => {
			if (animationTimeout.current) {
				clearTimeout(animationTimeout.current);
			}
		};
	}, []);

	useEffect(() => {
		const currentParams = route.params || props;
		
		if (currentParams.selSystem && currentParams.selSystem !== selSystem) {
			setSelSystem(currentParams.selSystem);
			const newLastUpdateStr = currentParams.selSystem.lastUpdate || 'Not updated yet';
			setLastUpdateStr(newLastUpdateStr);
			labelWidth.current = newLastUpdateStr.length * 7.5;
		}
		
		if (currentParams.unRead !== unRead) {
			setUnRead(currentParams.unRead);
		}
		
		if (currentParams.pageKey && currentParams.pageKey !== pageKey) {
			setPageKey(currentParams.pageKey);
		}
	}, [route.params, props, selSystem, unRead, pageKey]);

	const animateLabel = () => {
		const leftEnd = (wholeWidth - 105) - labelWidth.current;
		setTimeout(() => { 
			Animated.timing(labelLeft.current, { toValue: leftEnd, duration: 3000, useNativeDriver: false }).start(); 
		}, 2000);
		setTimeout(() => { 
			Animated.timing(labelLeft.current, { toValue: 0, duration: 500, useNativeDriver: false }).start(); 
		}, 7000);
		animationTimeout.current = setTimeout(() => { animateLabel(); }, 8000);
	};

	const onClickPartItem = (partKey) => {
		if (setPartKey) setPartKey(partKey);
		var pageName;
		if 		(partKey==='chart') { pageName = 'ChartFirst'; }
		else if (partKey==='time') { pageName = 'Timeline'; }
		else if (partKey==='support') { pageName = 'SupportMain'; }
		else if (partKey==='service') { pageName = 'ServiceMain'; }
		else if (partKey==='bill') { pageName = 'InvoiceMain'; }
		else if (partKey==='technical') { pageName = 'TechnicalMain'; }
		if (pageName) navigation.navigate(pageName);
	};

	const onClickModule = (chartKey) => {
		// if (setPartKey) setPartKey('chart');
		if (setChartKey) setChartKey(chartKey);
		navigation.navigate('ChartDetail');
	};

	return (
		<View style={{...MainCss.backBoard}}>
			<TopMenuComponent
				label={'Anlage '+(selSystem?.name || '')}
				openProfile={()=>navigation.navigate('Profile')}
				goBack={e=>navigation.goBack()}
			></TopMenuComponent>
			<ModuleComponent
				moduleLabel='Dein Status.'
				roleInfo={selSystem?.roleInfo}
				onClickModule={itemKey=>onClickModule(itemKey)}
			></ModuleComponent>
			<Text style={{...MainCss.label, textAlign:'left', marginLeft:30}}>Dein nächster Schritt:</Text>
			<View style={{...MainCss.flex, ...TotalCss.techPart}}>
				{/* <Image source={imgTime} style={{...TotalCss.techPartImg}}></Image> */}
				<View style={{...MainCss.flex, height:'100%', backgroundColor:white, width:75}}>
					<Image source={imgCheckBoxGreen} style={{...TotalCss.techCheckImg}}></Image>
				</View>
				
				<View style={{...TotalCss.techPartLabels, flexGrow: 1, flexDirection: 'row', zIndex:-1}}>
					<Animated.View style={[{marginLeft:labelLeft.current, width:labelWidth.current}]}>
						<Text style={{...MainCss.label}}>{lastUpdateStr}</Text>
					</Animated.View>
				</View>
			</View>

			<View style={{flex:1, flexGrow: 1}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
				<ScrollView>
					<ListWrapper
						listArr={mainListArr}
						unRead={unRead}
						onClickListItem={itemKey=>onClickPartItem(itemKey)}
					></ListWrapper>
				</ScrollView>
			</View>
			<FooterComponent onClickFooter={footerKey=>navigation.navigate(footerKey)} type={otherProps.type}></FooterComponent>
		</View>
	);
}

export class FooterComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() { }

	UNSAFE_componentWillReceiveProps(nextProps) { }

	render() {
		return (
			<View style={{...MainCss.flex, ...TotalCss.footer}}>
				{footerArr.map((item, idx)=>
					<View
						onTouchStart={e=>onTouchS(e, this) }
						onTouchEnd={e =>onTouchE(e, this, 'totalBottom', item.pageName)}
						style={{...MainCss.flexColumn, ...TotalCss.footerItem, borderRightWidth:idx===0?1:0, borderRightColor:'#C5C5C5', display:(this.props.type==='companyWorker'&&item.pageName==='Weather')?'none':'flex'}} key={idx}
					>
						<Image source={item.img} style={{...TotalCss.footerImg, marginTop:20}}></Image>
						<Text style={{...MainCss.label, marginBottom:10}}>{item.label}</Text>
					</View>
				)}
			</View>
		);
	}
}