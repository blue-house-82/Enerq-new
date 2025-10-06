import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';

import TopMenuComponent from './pages/layout/TopMenu';

import { MainCss } from './assets/css';

const styles = StyleSheet.create({
	centerText: { flex: 1, fontSize: 18, padding: 32, color: '#777', textAlign:'center' },
	textBold: { color: '#000', textAlign:'center' },
	// fontWeight: '500', 
	buttonText: { fontSize: 21, color: 'rgb(0,122,255)' },
	buttonTouchable: { padding: 16 }
});

export default function CameraComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	const { setCodeStr: propSetCodeStr } = props;
	
	const [codeStr, setCodeStr] = useState('');

	useEffect(() => {
		// Component did mount logic here
	}, []);

	const onSuccess = (e) => {
		const str = e.data;
		setCodeStr(str);
		if (str.length !== 12) return;
		if (propSetCodeStr) propSetCodeStr(str);
		navigation.goBack();
		// Linking.openURL(e.data).catch(err =>
		// 	console.error('An error occured', err)
		// );
	};

	return (
		<View style={{...MainCss.backBoard}}>
			<TopMenuComponent
				label={'QR-Code Scanner'}
				openProfile={()=>navigation.navigate('Profile')}
				goBack={e=>navigation.goBack()}
			></TopMenuComponent>
			{/* <QRCodeScanner
				onRead={onSuccess}
				// flashMode={RNCamera.Constants.FlashMode.torch}
				topContent={
					<View style={{margin:5}}>
						<Text style={{...MainCss.label, color:black}}>Halten Sie den QR-Code auf Ihrem Neukunden-Brief in den Sucher der Kamera.</Text>
						<Text style={{...MainCss.label, color:black}}>Bewegen Sie sie etwas vor und zurück.</Text>
					</View>
				}
				topViewStyle={{display:'flex', flexDirection:'row', alignItems:'flex-start'}}
				bottomViewStyle={{backgroundColor:'none', height:50}}
				bottomContent={
					<TouchableOpacity style={styles.buttonTouchable} onPress={e=>navigation.goBack()}>
						<Text style={styles.buttonText}>Go Back</Text>
					</TouchableOpacity>
				}
			/> */}
		</View>
	);
}
