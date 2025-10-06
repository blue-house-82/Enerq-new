
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { black, MainCss, red, white, wholeWidth } from './assets/css';
import imgChartWhite from './assets/images/chart-white.png';
import ModuleComponent from './pages/layout/Module';
import TopMenuComponent from './pages/layout/TopMenu';

const subVoltaicArr = [
	{label:'Winkel', value:'70%'},
	{label:'Wirkung', value:'68%'},
	{label:'Output', value:'3 kW'},
]
const subPumpArr = [
	{label:'Innen', value:'21°C'},
	{label:'Außen', value:'12°C'},
	{label:'Verbrauch', value:'0.2 kW/h'},
]
const infoArr = [
	{title:'Photovoltaik:', subArr:subVoltaicArr},
	{title:'Wärmepumpe', subArr:subPumpArr},
	{title:'Ladestation', subArr:subPumpArr},
]

const PartCss = StyleSheet.create({
	content: { flex: 1},
	redBar: { marginTop: 20, marginBottom:10, height: 50, width: wholeWidth, backgroundColor: red},
	redBarImg : {width:22, height:22},
	redBarLabel: {color:white, marginLeft:20},
	chartInfoMainItem:{marginHorizontal:20, marginVertical:20},
	chartInfoTitle:{marginLeft:30, color:black},
	chartInfoDetailRow:{marginTop:10},
	chartInfoDetailItem:{flex:1},
	chartInfoDetailValue:{fontSize:20, color:red, fontWeight: 900, marginBottom: 5},
	chartInfoBottom:{color: red, marginBottom: 20, fontWeight: 700, textAlign: 'center'},
	tempLabel:{...MainCss.label, fontWeight:500, fontSize:20}
});

export default function ChartFirstComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	
	// Get initial params from route or props
	const {
		roleInfo: initialRoleInfo,
		setChartKey,
		...otherProps
	} = route.params || props;
	
	const [state, setState] = useState({
		roleInfo: initialRoleInfo
	});

	useEffect(() => {
		const currentParams = route.params || props;
		['roleInfo'].forEach(key => {
			const propValue = currentParams[key];
			if (state[key] !== propValue && propValue !== undefined) {
				setState(prevState => ({
					...prevState,
					[key]: propValue
				}));
			}
		});
	}, [route.params, props]);

	const onClickModule = (itemKey) => {
		if (setChartKey) setChartKey(itemKey);
		navigation.navigate('ChartMain');
	};

	const {roleInfo} = state;
	
	return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label={'Anlagen'}
					openProfile={()=>navigation.navigate('Profile')}
					goBack={e=>navigation.goBack()}
				></TopMenuComponent>
				<View style={{flex:1}}>
					<ModuleComponent
						moduleLabel='Wähle deine Anlage:'
						roleInfo={roleInfo}
						onClickModule={itemKey=>onClickModule(itemKey)}
					></ModuleComponent>
					<View style={{flex:1}}>
						<View style={{...MainCss.flex, ...PartCss.redBar}}>
							<Image source={imgChartWhite} style={{...PartCss.redBarImg}}></Image>
							<Text style={{...MainCss.title, ...PartCss.redBarLabel}}>{'Anlagen'}</Text>
						</View>

						<View style={{flex:1, flexGrow:1, position:'relative'}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
							<ScrollView>
								{infoArr.map((mainItem, mainIdx)=>
									<View key={mainIdx} style={{...PartCss.chartInfoMainItem}}>
										<Text style={{...MainCss.title, ...PartCss.chartInfoTitle}}>{mainItem.title}</Text>
										<View style={{...MainCss.flex, ...PartCss.chartInfoDetailRow}}>
											{mainItem.subArr.map((subItem, subIdx)=>
												<View style={{...MainCss.flexColumn, ...PartCss.chartInfoDetailItem}} key={subIdx}>
													<Text style={{...PartCss.chartInfoDetailValue}}>{subItem.value}</Text>
													<Text style={{...MainCss.label}}>{subItem.label}</Text>
												</View>
											)}
										</View>
									</View>
								)}
								<Text style={{...MainCss.title, ...PartCss.chartInfoBottom}}>Bereit zum Laden</Text>
							</ScrollView>
							<View style={{width:'100%', height:'100%', position:'absolute', backgroundColor:'#FFFFFFEE', ...MainCss.flexColumn}}>
								<Text style={{...PartCss.tempLabel, color:red}}>Hier finden Sie bald</Text>
								<Text style={{...PartCss.tempLabel, color:red}}>Live-Daten Ihrer</Text>
								<Text style={{...PartCss.tempLabel, color:red}}>ENERQ Anlagen.</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		);
}
