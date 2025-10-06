
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { MainCss, red, wholeWidth } from './assets/css';
import { SetAnimate } from './data/common';

import imgClose from './assets/images/close-white.png';

export default function ErrorComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	
	// Get initial params from route or props
	const {
		error: initialError,
		resetError,
		...otherProps
	} = route.params || props;
	
	const [state, setState] = useState({
		error: initialError,
		top: -60
	});
	
	const timeoutRef = useRef(null);

	useEffect(() => {
		const currentParams = route.params || props;
		const error = currentParams.error;
		
		if (state.error !== error) {
			setState(prevState => ({
				...prevState,
				error: error
			}));
			
			// Clear any existing timeout
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			
			// Animate error display
			SetAnimate('top', error ? -60 : 0, error ? 0 : -60, { setState });
			
			if (error) {
				timeoutRef.current = setTimeout(() => {
					if (resetError) resetError();
				}, 3000);
			}
		}
	}, [route.params, props, state.error]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const { top, error } = state;
	
	return (
			<View style={{...MainCss.flex, position:'absolute', height:60, width:wholeWidth, left:0, top:top, backgroundColor:red}}>
				<Image source={imgClose} style={{width:15, height:15}}></Image>
				<Text style={{marginLeft:20, color:'white'}}>{error}</Text>
			</View>
		);
}
