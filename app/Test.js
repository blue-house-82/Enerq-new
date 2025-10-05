
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

// import QRModalComponent from './ScanQR';
import { MainCss, wholeHeight } from './assets/css';
import imgLogo from './assets/images/logo-image.png';
import imgLabel from './assets/images/logo-label.png';

export default class TestComponent extends React.Component {
    constructor(props) {
        super(props);
        const {} = props;
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
    }

    onClickLogo = () => {
        // this.props.navigation.navigate('Before');
    }

    onClickTest2 = () => {
        // Navigate to Test2 component using navigation props
        this.props.navigation.navigate('Test2');
    }

    render() {
        const {} = this.state;
        return (
            <View style={{...MainCss.backBoard}}>
                <TouchableOpacity style={{...MainCss.flexColumn, height:wholeHeight, marginTop:0}} onPress={() => this.onClickLogo() }>
                    <Image source={imgLogo} style={{width: 100, height: 100}} />
                    <Image source={imgLabel} style={{width: 120, height: 40, marginTop: 10}} />
                    <View>
                        <Text style={{color: 'black', marginTop: 20}}>test</Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={{
                            backgroundColor: '#007bff',
                            paddingHorizontal: 20,
                            paddingVertical: 12,
                            borderRadius: 8,
                            marginTop: 30
                        }}
                        onPress={this.onClickTest2}
                    >
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                            Open Test2
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        );
    }
}
