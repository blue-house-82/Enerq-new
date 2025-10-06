import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
// import Pdf from 'react-native-pdf';

import { MainCss, wholeHeight, wholeWidth } from './assets/css';
import { serverUrl } from './data/config';
import TopMenuComponent from './pages/layout/TopMenu';


const PDFCss = StyleSheet.create({
	doc:{width:wholeWidth, height:wholeHeight-100},
});

export default function TechnicalPDFComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	const { selTechnical, setSelTechnical } = props;
	
	const [selTechnicalState, setSelTechnicalState] = useState(selTechnical || null);

	useEffect(() => {
		// Component did mount logic here
	}, []);

	useEffect(() => {
		return () => {
			// Component will unmount
			if (setSelTechnical) {
				setSelTechnical(null);
			}
		};
	}, [setSelTechnical]);

	const tempPDF = 'http://samples.leanpub.com/thereactnativebook-sample.pdf';
	const realPDF = serverUrl+'other/technical_pdf/'+selTechnical+'.pdf';
		const source = { uri: realPDF, cache: true };
        //const source = require('./test.pdf');  // ios only
        //const source = {uri:'bundle-assets://test.pdf' };
        //const source = {uri:'file:///sdcard/test.pdf'};
        //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};
        //const source = {uri:"content://com.example.blobs/xxxxxxxx-...?offset=0&size=xxx"};
        //const source = {uri:"blob:xxxxxxxx-...?offset=0&size=xxx"};
		// console.log();
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label='Rechnungen der Anlage'
					openProfile={()=>navigation.navigate('Profile')}
					goBack={e=>navigation.goBack()}
				></TopMenuComponent>
				<View style={{...MainCss.flex}}>
					{/* <Pdf
						trustAllCerts={false}
						source={source}
						onLoadComplete={(numberOfPages, filePath) => { console.log(`Number of pages: ${numberOfPages}`); }}
						onPageChanged={(page, numberOfPages) => { console.log(`Current page: ${page}`); }}
						onError={(error) => { console.log(error); }}
						onPressLink={(uri) => { console.log(`Link pressed: ${uri}`); }}
						style={{...PDFCss.doc}}/> */}
				</View>
				{/* <FooterComponent onClickFooter={footerKey=>navigation.navigate(footerKey)}></FooterComponent> */}
			</View>
		);
}
