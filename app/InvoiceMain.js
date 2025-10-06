import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { black, green, grey, MainCss, red, wholeWidth } from './assets/css';
import { serverUrl } from './data/config';
import TopMenuComponent from './pages/layout/TopMenu';

import imgBill from './assets/images/bill.png';
import imgCheck from './assets/images/check.png';
import { GetTimeStr } from './data/common';

// 205, 126, 57
const tdPaddingLeft = 10;
const wName = 215, wTime = 136, wPaid = 37, wTotal = wholeWidth / (wName + wTime + wPaid);
const pName = wName * wTotal - tdPaddingLeft,
	pTime = wTime * wTotal - tdPaddingLeft,
	pPaid = wPaid * wTotal;

export const InvoiceMainCss = StyleSheet.create({
	borderRight:{borderRightColor:grey, borderRightWidth:1, height:'100%', paddingLeft:tdPaddingLeft, display:'flex', flexDirection:'row', alignItems:'center'},
	label:{color:black, fontSize:18, fontFamily:'SF Pro Rounded', lineHeight:22}
});

export default function InvoiceMainComponent(props) {
	const navigation = useNavigation();
	const route = useRoute();
	
	// Get initial params from route or props
	const {
		invoiceArr: initialInvoiceArr,
		setSelInvoice,
		...otherProps
	} = route.params || props;
	
	const [state, setState] = useState({
		invoiceArr: initialInvoiceArr || []
	});

	useEffect(() => {
		const currentParams = route.params || props;
		['invoiceArr'].forEach(key => {
			const propValue = currentParams[key];
			if (state[key] !== propValue && propValue !== undefined) {
				setState(prevState => ({
					...prevState,
					[key]: propValue
				}));
			}
		});
	}, [route.params, props]);

	const openInvoicePDF = (pdfName) => {
		Linking.openURL(serverUrl+'other/invoice_pdf/'+pdfName+'.pdf');
	};

	const { invoiceArr } = state;
	
	return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label='Rechnungen der Anlage'
					openProfile={()=>navigation.navigate('Profile')}
					goBack={e=>navigation.goBack()}
				></TopMenuComponent>
				<View style={{...MainCss.flex, width:wholeWidth, marginTop:45, marginBottom:50}}>
					<Image source={imgBill} style={{width:60, height:55, resizeMode:'contain', opacity:0.5}}></Image>
				</View>

				<View style={{flex:1, flexGrow: 1}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
					<ScrollView>
						<View style={{...MainCss.flex, width:wholeWidth, height:50, borderTopColor:grey, borderBottomColor:grey, borderTopWidth:1, borderBottomWidth:1 }}>
							<View style={{width:pName, ...InvoiceMainCss.borderRight}}><Text style={{...MainCss.label}}>Rechnung</Text></View>
							<View style={{width:pTime, ...InvoiceMainCss.borderRight}}><Text style={{...MainCss.label}}>Datum</Text></View>
							<View style={{...MainCss.flex, flex:1, marginLeft:3}}><Image style={{width:20, height:20, resizeMode:'contain'}} source={imgCheck}></Image></View>
						</View>
						{invoiceArr.map((item, idx)=>
							<View style={{...MainCss.flex, width:wholeWidth, height:50, borderBottomColor:grey, borderBottomWidth:idx===invoiceArr.length-1?1:0 }} key={idx}>
								<View style={{width:pName, ...InvoiceMainCss.borderRight}}>
									<TouchableOpacity onPress={e=>setSelInvoice && setSelInvoice(item.name)}>{/*  openInvoicePDF*/}
										<Text style={{...MainCss.label, color:red, textDecorationLine:'underline'}}>{item.name+'.pdf'}</Text>
									</TouchableOpacity>
								</View>
								<View style={{width:pTime, ...InvoiceMainCss.borderRight}}>
									<Text style={{...MainCss.label}}>{GetTimeStr(item.time, 'invoice')}</Text>
								</View>
								<View style={{...MainCss.flex, flex:1, marginLeft:3}}>
									<View style={{...MainCss.flex, width:27, height:27, borderRadius:4, borderWidth:item.paid==='1'?2:1, borderColor:item.paid==='1'?green:grey}}>
										{item.paid==='1' && <Image style={{width:20, height:20, resizeMode:'contain'}} source={imgCheck}></Image>}
									</View>
								</View>
							</View>
						)}
					</ScrollView>
				</View>
				<View style={{...MainCss.flex, width:wholeWidth, paddingVertical:7, borderTopColor:grey, borderTopWidth:1}}>
					<Text style={{...MainCss.label, textAlign:'center', fontSize:15}}>Rechnungen mit grünem Haken wurden beglichen.</Text>
				</View>
			</View>
		);
}
