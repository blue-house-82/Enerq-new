
import { Image, TouchableOpacity, View } from 'react-native';

// import QRModalComponent from './ScanQR';
import { MainCss, wholeHeight } from './assets/css';
import imgLogo from './assets/images/logo-image.png';
import imgLabel from './assets/images/logo-label.png';

import { useNavigation } from '@react-navigation/native';

const LogoComponent = () => {
	const navigation = useNavigation();

	const onClickLogo = () => {
		navigation.navigate('Before');
	};

	return (
		<View style={{...MainCss.backBoard}}>
			<TouchableOpacity style={{...MainCss.flexColumn, height:wholeHeight, marginTop:0}} onPress={onClickLogo}>
				<Image source={imgLogo} style={{width:121, height:121, marginVertical:28, resizeMode: 'contain'}} />
				<Image source={imgLabel} style={{width:210, resizeMode: 'contain'}} />
			</TouchableOpacity>
		</View>
	);
};

export default LogoComponent;
