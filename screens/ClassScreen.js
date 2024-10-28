import {
    View,
    Text,
    StyleSheet,

} from 'react-native'


export default function ClassScreen() {



    return (
        <View style={styles.container}>
            <Text> CLASS PAGE</Text>
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
