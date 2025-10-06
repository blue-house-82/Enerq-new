
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { black, grey, MainCss, ModalCss, wholeHeight } from './assets/css';

import imgClose from './assets/images/close.png';

export default function VersionNoteComponent(props) {
	const { verNote: propVerNote, otherHeight, appVerInstall, closeNoteModal } = props;
	
	const [verNote, setVerNote] = useState(propVerNote || null);

	useEffect(() => {
		// Component did mount logic here
	}, []);

	useEffect(() => {
		if (propVerNote !== verNote) {
			setVerNote(propVerNote);
		}
	}, [propVerNote]);

	return (
		<View style={{...ModalCss.back, height:wholeHeight-otherHeight, zIndex:verNote?5:-1}}>
			<View style={{...ModalCss.wrapper, height:280, paddingBottom:0}}>
				<View>
					<Text style={{...MainCss.label, fontSize:18, marginBottom:20, color:black}}>Ihre Version der ENERQ App ist veraltet.</Text>
					<Text style={{...MainCss.label, fontSize:18, color:black}}>Um die Funktionalität wieder zu ermöglichen, aktualisieren Sie bitte Ihre App.</Text>
					<Text style={{...MainCss.label, fontSize:14, color:grey, marginTop:30, textAlign:'center'}}>Version {appVerInstall}</Text>
				</View>
				<TouchableOpacity style={{...MainCss.flex, position:'absolute', top:10, right:10, width:30, height:30}} onPress={e=>closeNoteModal && closeNoteModal()}>
					<Image source={imgClose} style={{width:16, height:16, resizeMode:'contain', opacity:0.7}}></Image>
				</TouchableOpacity>
			</View>
		</View>
	);
}
