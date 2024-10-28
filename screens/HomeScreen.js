import {
    View,
    Text,
    StyleSheet,

} from 'react-native'


export default function HomeScreen() {



    return (
        <View style={styles.container}>
            <Text>HOME PAGE</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },


});
