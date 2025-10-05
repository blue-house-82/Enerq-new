import { useEffect, useRef, useState } from 'react';
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
	const {pageKey, selSystem, unRead: propsUnRead} = props;
	const initialLastUpdateStr = selSystem.lastUpdate || 'Not updated yet';
	
	const [state, setState] = useState({
		pageKey, 
		sideKey: '', 
		partKey: '', 
		selSystem, 
		unRead: propsUnRead, 
		lastUpdateStr: initialLastUpdateStr
	});
	
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
		['mainInfo', 'selSystem', 'unRead'].forEach(key => {
			const propValue = key === 'unRead' ? propsUnRead : props[key];
			if (state[key] !== propValue) {
				setState(prevState => ({
					...prevState,
					[key]: propValue
				}));
				if (key === 'selSystem') {
					const lastUpdateStr = props.selSystem.lastUpdate || 'Not updated yet';
					setState(prevState => ({
						...prevState,
						lastUpdateStr
					}));
					labelWidth.current = lastUpdateStr.length * 7.5;
				}
			}
		});
	}, [props.mainInfo, props.selSystem, propsUnRead]);

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
		// props.setPartKey(partKey);
		var pageName;
		if 		(partKey==='chart') { pageName = 'ChartFirst'; }
		else if (partKey==='time') { pageName = 'Timeline'; }
		else if (partKey==='support') { pageName = 'SupportMain'; }
		else if (partKey==='service') { pageName = 'ServiceMain'; }
		else if (partKey==='bill') { pageName = 'InvoiceMain'; }
		else if (partKey==='technical') { pageName = 'TechnicalMain'; }
		if (pageName) props.navigation.navigate(pageName);
	};

	const onClickModule = (chartKey) => {
		// props.setPartKey('chart');
		props.setChartKey(chartKey);
		props.navigation.navigate('ChartDetail');
	};

	const onClickFooter = (footerKey) => {
		props.navigation.navigate(footerKey);
	};

	const { unRead, lastUpdateStr } = state;
	
	return (
			<View style={{...MainCss.backBoard}}>
				<TopMenuComponent
					label={'Anlage '+selSystem.name}
					openProfile={()=>props.navigation.navigate('Profile')}
					goBack={e=>props.navigation.goBack()}
				></TopMenuComponent>
					<ModuleComponent
						moduleLabel='Dein Status.'
						roleInfo={selSystem.roleInfo}
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
				<FooterComponent onClickFooter={footerKey=>props.navigation.navigate(footerKey)}></FooterComponent>
			</View>
		);
}

export function FooterComponent(props) {
	return (
			<View style={{...MainCss.flex, ...TotalCss.footer}}>
				{footerArr.map((item, idx)=>
					<View
						onTouchStart={e=>onTouchS(e, {}) }
						onTouchEnd={e =>onTouchE(e, {}, 'totalBottom', item.pageName)}
						style={{...MainCss.flexColumn, ...TotalCss.footerItem, borderRightWidth:idx===0?1:0, borderRightColor:'#C5C5C5', display:(props.type==='companyWorker'&&item.pageName==='Weather')?'none':'flex'}} key={idx}
					>
						<Image source={item.img} style={{...TotalCss.footerImg, marginTop:20}}></Image>
						<Text style={{...MainCss.label, marginBottom:10}}>{item.label}</Text>
					</View>
				)}
			</View>
		);
}