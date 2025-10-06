import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, View } from 'react-native';

import TopMenuComponent from './pages/layout/TopMenu';

import { black, MainCss, red, wholeWidth } from './assets/css';
import imgBlueArrow from './assets/images/blue-arrow.png';
import imgTimeline from './assets/images/timeline-page.jpg';
// import { timelineSvgXmlStr } from './data/timelinexml';

// const statusPos = [60, 128, 186, 242, 300, 356, 414, 470, 528, 583, 641, 698, 763];
const statusPos = [74, 140, 198, 254, 312, 368, 426, 482, 540, 595, 653, 710, 775];

export default function TimelineComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	const { mainInfo: propMainInfo, selSystem: propSelSystem, setDetailKey } = props;
	
	const circleScale = useRef(new Animated.Value(1)).current;
	const intervalRef = useRef(null);
	
	const [mainInfo, setMainInfo] = useState(propMainInfo || null);
	const [selSystem, setSelSystem] = useState(propSelSystem || null);

	useEffect(() => {
		var scale = 1.5;
		intervalRef.current = setInterval(() => {
			if (scale===1.5) scale = 1;
			else scale = 1.5;
			Animated.timing(circleScale, { toValue: scale, duration: 700, useNativeDriver: false }).start();
		}, 700);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (propMainInfo !== mainInfo) {
			setMainInfo(propMainInfo);
		}
		if (propSelSystem !== selSystem) {
			setSelSystem(propSelSystem);
		}
	}, [propMainInfo, propSelSystem]);

	const onClickModule = (detailKey) => {
		if (setDetailKey) setDetailKey(detailKey);
		navigation.navigate('Detail');
	}

	const status = selSystem ? selSystem.status : 0;
	const svgH = wholeWidth*86/60;
	
	return (
		<View style={{...MainCss.backBoard}}>
			<TopMenuComponent
				label={'Timeline'}
				hideProfile={!(mainInfo&&mainInfo.first)}
				openProfile={()=>navigation.navigate('Profile')}
				goBack={e=>navigation.goBack()}
			></TopMenuComponent>
			
			<View style={{flex:1, marginBottom:20}}>
				<View style={{margin:20, display:'flex', flexDirection:'row'}}>
					<View style={{width:24, height:24, borderRadius:12, backgroundColor:red, marginRight:20}} source={imgBlueArrow} ></View>
					<Text style={{color:black}}>Aktueller Auftragsstand</Text>
				</View>
				<View style={{width:'100%', height:svgH, position:'relative'}}>
					<Image style={{width:'100%', height:'100%', resizeMode:'contain'}} source={imgTimeline} ></Image>
					<Animated.View style={{width:24, height:24, position:'absolute', transform: [{scale: circleScale}], top:statusPos[status] * svgH/860 - 12, left:wholeWidth*27.8/60-12}}>
						<View style={{width:24, height:24, borderRadius:12, backgroundColor:red, opacity:0.8}}></View>
					</Animated.View>
					
				</View>
				
				{/* <SvgUri
					width="100%"
					height="100%"
					uri={apiUrl+'other/images/timeline.svg'}
				/> */}
				{/* <View style={{width:'100%', height:20, backgroundColor:red}}></View> */}
			</View>
		</View>
	);
}
