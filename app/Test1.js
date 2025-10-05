
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

// import QRModalComponent from './ScanQR';
import { MainCss, wholeHeight } from './assets/css';
import imgLogo from './assets/images/logo-image.png';
import imgLabel from './assets/images/logo-label.png';

export default class Test1Component extends React.Component {
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
        this.props.navigation.navigate('Before');
    }

    render() {
        const {} = this.state;
        return (
            <View style={{...MainCss.backBoard}}>
                <TouchableOpacity style={{...MainCss.flexColumn, height:wholeHeight, marginTop:0}} onPress={() => this.onClickLogo() }>
                    <Image source={imgLogo} style={{width: 100, height: 100}} />
                    <Image source={imgLabel} style={{width: 120, height: 40, marginTop: 10}} />
                    <View>
                        <Text style={{color: 'black', marginTop: 20}}>test 1</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
