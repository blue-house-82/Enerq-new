import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import TopMenuComponent from './pages/layout/TopMenu';

import { MainCss, red, white, wholeWidth } from './assets/css';
import { NewsCss } from './News';

import imgWeather from './assets/images/weather.png';
import imgCloudRain from './assets/images/weather/cloud-rain.png';
import imgCloudSun from './assets/images/weather/cloud-sun.png';
import imgCloud from './assets/images/weather/cloud.png';
import imgSunCloud from './assets/images/weather/sun-cloud.png';
import imgSun from './assets/images/weather/sun.png';
import imgSearch from './assets/images/zoom.png';

const WeatherCss = StyleSheet.create({
	inputWraper:{width:250, borderRadius:4, borderWidth:1, borderColor:'#C5C5C5', height:48, paddingHorizontal:15, marginTop:15, marginBottom:30, display:'flex', flexDirection:'row', alignItems:'center'},
	searchInput:{width:200, ...MainCss.label, fontSize:18, height:48, marginTop:12}, // , backgroundColor:'none'
	searchIcon:{width:23, height:23, resizeMode:'contain'},
	weatherItem:{paddingVertical:8, paddingHorizontal:20, display:'flex', flexDirection:'row', alignItems:'center', borderBottomColor:'#C5C5C5', borderBottomWidth:2, borderTopWidth:2, borderTopColor:white},
	weatherImg:{width:41, height:41, resizeMode:'contain'},
	tempText:{color:red, textAlign:'right', fontWeight:700},
})

export default function WeatherComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	
	// Get initial params from route or props
	const {
		weatherArr: initialWeatherArr,
		mainInfo: initialMainInfo,
		setDetailKey,
		...otherProps
	} = route.params || props;
	
	const { zip_code, location } = initialMainInfo || {};
	const initialSearchStr = (zip_code && location) ? `${zip_code} ${location}` : '';
	
	const [state, setState] = useState({
		searchStr: initialSearchStr,
		weatherArr: initialWeatherArr || [],
		mainInfo: initialMainInfo || {}
	});

	useEffect(() => {
		const currentParams = route.params || props;
		['mainInfo', 'systemInfo', 'weatherArr'].forEach(key => {
			const propValue = currentParams[key];
			if (state[key] !== propValue && propValue !== undefined) {
				setState(prevState => ({
					...prevState,
					[key]: propValue
				}));
				if (key === 'mainInfo' && propValue) {
					const { zip_code, location } = propValue;
					const newSearchStr = (zip_code && location) ? `${zip_code} ${location}` : '';
					setState(prevState => ({
						...prevState,
						searchStr: newSearchStr
					}));
				}
			}
		});
	}, [route.params, props]);

	const onClickModule = (detailKey) => {
		if (setDetailKey) setDetailKey(detailKey);
		navigation.navigate('Detail');
	};

	const getLabel = label => {
		// if 		(status === 'clear-day') return 'Sonnig';
		// else if (status === 'rain') return 'Regen';
		// else if (status === 'cloudy') return 'Bewölkt';
		// else if (status === 'partly-cloudy-day') return 'Teils bewölkt';
		// else if (status === 'fog') return 'Nebel';
		// else if (status === 'snow') return 'Schnee';
		// else return 'Unknwon';
		// if 		(status === 0) 				   return 'Sonnig';
		// else if (status === 1 || status === 2) return 'Teils bewölkt';
		// else if (status === 3 || status === 4) return 'Bewölkt';
		// else if (status === 5 || status === 6) return 'Regen';
		// else return 'Unknwon';
		const subArr = label.split(' '), newArr = [];
		subArr.forEach(subStr => {
			const firstLabel = subStr.substring(0, 1).toUpperCase();
			const otherLabel = subStr.substring(1);
			newArr.push(firstLabel+otherLabel)
		});
		return newArr.join(' ');
	};

	const getImg = label => {
		// if 		(status === 'clear-day') return imgSun;
		// else if (status === 'rain') return imgCloudRain;
		// else if (status === 'cloudy') return imgCloud;
		// else if (status === 'partly-cloudy-day') return imgSunCloud;
		// else if (status === 'fog') return imgFog;
		// else if (status === 'snow') return imgSnow;
		// else return imgCloudSun; // if (status === 'cloud-sun');
		// if 		(status === 0) 				   return imgSun;
		// else if (status === 1 || status === 2) return imgSunCloud;
		// else if (status === 3 || status === 4) return imgCloud;
		// else if (status === 5 || status === 6) return imgCloudRain;
		// else return imgCloudSun;

		if (label.includes('Regen')) return imgCloudRain;
		else if (label==='sonnig') return imgSun;
		else if (label==='leicht bewölkt') return imgSunCloud;
		else if (label==='wolkig' || label==='bedeckt') return imgCloud;
		else {console.log(label); return imgCloudSun;}
	};

	const {searchStr, weatherArr} = state;
	
	return (
			<View style={{...MainCss.backBoard}}>
				<TopMenuComponent
					label={'Wetter'}
					openProfile={()=>navigation.navigate('Profile')}
					goBack={e=>navigation.goBack()}
				></TopMenuComponent>
				<View style={{...MainCss.flex, width:wholeWidth, height:70}}>
					<View style={{...NewsCss.iconLine}}></View>
					<Image source={imgWeather} style={{...NewsCss.topIcon}}></Image>
					<View style={{...NewsCss.iconLine}}></View>
				</View>

				<View style={{...MainCss.flex}}>
					<View style={{...WeatherCss.inputWraper}}>
						<TextInput placeholder='Code eingeben' value={searchStr} editable={false} onChangeText={e=>{/*this.setState({searchStr:e})*/}} style={{...WeatherCss.searchInput}}></TextInput>
						<Image source={imgSearch} style={{...WeatherCss.searchIcon}}></Image>
					</View>
				</View>
				
				<View style={{flex:1, flexGrow:1, marginBottom:20}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
					<ScrollView>
						{weatherArr.map((item, idx)=>
							<View style={{...WeatherCss.weatherItem, borderTopColor:idx===0?'#C5C5C5':white}} key={idx}>
								<View style={{flex:1}}>
									<Text style={{...MainCss.label, lineHeight:25}}>{item.date}</Text>
									<Text style={{...MainCss.label, lineHeight:25, opacity:0.5}}>{getLabel(item.label)}</Text>
								</View>
								<Image style={{...WeatherCss.weatherImg}} source={getImg(item.label)}></Image>
								<View style={{marginLeft:20}}>
									<Text style={{...WeatherCss.tempText}}>{item.high} °C</Text>
									<Text style={{...WeatherCss.tempText, opacity:0.5}}>{item.low} °C</Text>
								</View>
							</View>
						)}
					</ScrollView>
				</View>
				<View style={{...MainCss.flex, height:20}}>
					{/* <Text style={{...MainCss.label, opacity:0.5}}>Daten von FreeWeatherAPI.com</Text> */}
				</View>
			</View>
		);
}
