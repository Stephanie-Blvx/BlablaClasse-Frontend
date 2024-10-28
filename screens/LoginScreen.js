import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,

} from 'react-native'


export default function LoginScreen({ navigation }) {

    const handleHomeScreen = () => {
      
          navigation.navigate('TabNavigator', { screen: 'Home' });
        }
        
      

    return (
        <View style={styles.container}>
            <Text>LOGIN PAGE</Text>
            <TouchableOpacity onPress={() => handleHomeScreen()} style={styles.button} activeOpacity={0.8}>
            <Text style={styles.textButton}>Go to HomeScreen</Text>
          </TouchableOpacity>
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
    button: {
        alignItems: 'center',
        paddingTop: 8,
        width: '100%',
        marginTop: 30,
        backgroundColor: '#67AFAC',
        borderRadius: 1,
      },
      textButton: {
        color:'white',
        fontWeight: '600',
        fontSize: 16,
      },


});
