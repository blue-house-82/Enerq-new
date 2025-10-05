import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MainCss, black, red, white, wholeWidth } from './assets/css';
import TopMenuComponent from './pages/layout/TopMenu';

import imgChevron from './assets/images/chevron-white.png';
import imgClockWhite from './assets/images/clock-white.png';
import imgHome from './assets/images/home.png';

import { GetTimeLabel, onTouchE, onTouchS } from './data/common';
import { moduleArr } from './data/constant';
import { ListsCss } from './pages/layout/ListWrapper';
import { FooterComponent } from './Total';

export const ComMainCss = StyleSheet.create({
	redBar:{width:wholeWidth, height:55, backgroundColor:red},
	label:{color:black, fontSize:18, fontFamily:'SF Pro Rounded', lineHeight:22}
});

export default function ComMainComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	
	// Get initial params from route or props
	const {
		comCustomerArr: initialComCustomerArr,
		mainInfo: initialMainInfo,
		setSelCustomer,
		setLogout
	} = route.params || props;

	// Convert class state to useState hooks
	const [comCustomerArr, setComCustomerArr] = useState(initialComCustomerArr || []);
	const [mainInfo, setMainInfo] = useState(initialMainInfo || {});

	// Convert componentDidMount to useEffect
	useEffect(() => {
		// Component mounted - currently empty in original
	}, []);

	// Convert componentWillReceiveProps to useEffect
	useEffect(() => {
		if (initialComCustomerArr !== undefined) {
			setComCustomerArr(initialComCustomerArr);
		}
	}, [initialComCustomerArr]);

	useEffect(() => {
		if (initialMainInfo !== undefined) {
			setMainInfo(initialMainInfo);
		}
	}, [initialMainInfo]);

	// Convert componentWillUnmount to useEffect cleanup
	useEffect(() => {
		return () => {
			// componentWillUnmount logic here (currently empty)
		};
	}, []);

	// Convert class methods to regular functions
	const onClickComCustomer = (key) => {
		const selCustomer = comCustomerArr.find(item => item.key === key);
		if (!selCustomer || selCustomer.disable) { return; }
		setSelCustomer && setSelCustomer(selCustomer);
		setTimeout(() => { navigation.navigate('ComPart') }, 0);
	};

	// Create a reference object for onTouchE and onTouchS functions
	const componentRef = {
		onClickComCustomer
	};

	const firstItem = comCustomerArr[0];
	const firstModule = firstItem ? moduleArr.find(item => item.key === firstItem.mainKey) : {};
	const name = mainInfo ? mainInfo.first + ' ' + mainInfo.last : '';

	return (
		<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
			<TopMenuComponent
				label={'Hallo ' + name}
				openProfile={() => navigation.navigate('Profile')}
				goBack={() => {
					setLogout && setLogout();
					navigation.goBack();
				}}
			></TopMenuComponent>
			<View style={{...MainCss.flex, ...ComMainCss.redBar}}>
				<Image source={imgClockWhite} style={{marginLeft:10, width:35, height:35, resizeMode:'contain'}}></Image>
				<Text style={{...ComMainCss.label, flex:1, textAlign:'center', color:white}}>Dein nächster Termin:</Text>
			</View>
			<View style={{padding:15, borderBottomColor:'#C5C5C5', borderBottomWidth:2, width:wholeWidth}}>
				{firstItem &&
					<View>
						<Text style={{...MainCss.title, color:black}}>{GetTimeLabel(firstItem.dateStr, firstItem.timeStr)}</Text>
						{/* {firstItem.dateStr} / {firstItem.timeStr} */}
						<View style={{...MainCss.flex, marginVertical:20}}>
							<Image source={firstModule.imgBlack} style={{width:40, height:40, resizeMode:'contain', marginRight:15}}></Image>
							<View style={{flex:1}}>
								<Text style={{...ComMainCss.label}}>{firstModule.label}</Text>
								<Text style={{...ComMainCss.label, fontWeight:700}}>{firstItem.fieldLabel}</Text>
							</View>
						</View>
						<Text style={{...ComMainCss.label}}>Kunde: {firstItem.name}</Text>
						<Text style={{...ComMainCss.label}}>Anlage: {firstItem.location}</Text>
					</View>
				}
			</View>

			<View style={{flex:1, flexGrow: 1}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
				<ScrollView>
					<Text style={{...ComMainCss.label, marginTop:15, marginLeft:30, marginBottom:10}}>Deine zugeteilten Kunden:</Text>
					<View style={{...MainCss.flexColumn}}>
						{comCustomerArr.map((item, idx) =>
							<View style={{...ListsCss.listItem, opacity:item.disable?0.3:1}} key={idx}>
								<View style={{...ListsCss.icon}}>
									<Image source={imgHome} style={{...ListsCss.iconImg}}></Image>
								</View>
								<View style={{...ListsCss.label}}>
									<Text style={{...ComMainCss.label }}>{item.name}</Text>
									<Text style={{...ComMainCss.label }}>{item.location}</Text>
								</View>
								<View onTouchStart={e => onTouchS(e, componentRef)}
									onTouchEnd={e => onTouchE(e, componentRef, 'comCustomer', item.key)}
									style={{...MainCss.flex, width:43, height:43, borderRadius:8, backgroundColor:red}}>
									<Image source={imgChevron} style={{...ListsCss.chevronImg}}></Image>
								</View>
							</View>
						)}
						{comCustomerArr.length === 0 &&
							<Text style={{...ComMainCss.label}}>There is not any related data</Text>
						}
					</View>
				</ScrollView>
			</View>
			<FooterComponent type={'companyWorker'} onClickFooter={footerKey => navigation.navigate(footerKey)}></FooterComponent>
		</View>
	);
}
