// Install: npx expo install expo-camera
import { useNavigation, useRoute } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MainCss } from './assets/css';
import TopMenuComponent from './pages/layout/TopMenu';

export default function CameraComponent(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const { setCodeStr: propSetCodeStr } = route.params || props;
    
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        
        if (data.length !== 12) {
            alert('Invalid QR Code - Must be 12 characters');
            setScanned(false);
            return;
        }
		
        if (propSetCodeStr) propSetCodeStr(data);
        navigation.goBack();
    };

    if (!permission) {
        return (
            <View style={{...MainCss.backBoard, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={{...MainCss.backBoard, justifyContent: 'center', alignItems: 'center'}}>
                <TopMenuComponent
                    label={'QR-Code Scanner'}
                    openProfile={()=>navigation.navigate('Profile')}
                    goBack={e=>navigation.goBack()}
                />
                <Text style={{textAlign: 'center', margin: 20}}>
                    No access to camera. Please enable camera permissions in settings.
                </Text>
                <TouchableOpacity 
                    style={{backgroundColor: '#007AFF', padding: 10, borderRadius: 5}} 
                    onPress={requestPermission}
                >
                    <Text style={{color: 'white'}}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{...MainCss.backBoard}}>
            <TopMenuComponent
                label={'QR-Code Scanner'}
                openProfile={()=>navigation.navigate('Profile')}
                goBack={e=>navigation.goBack()}
            />
            <CameraView
                style={{flex: 1}}
                facing={'back'}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'pdf417'],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanArea} />
                    <Text style={styles.instructions}>
                        Halten Sie den QR-Code in den Rahmen
                    </Text>
                    {scanned && (
                        <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
                            <Text style={styles.scannedText}>
                                Tap to scan again
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#00ff00',
        backgroundColor: 'transparent',
    },
    instructions: {
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 15,
        borderRadius: 8,
    },
    scanAgainButton: {
        position: 'absolute',
        bottom: 60,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    scannedText: {
        color: '#00ff00',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});