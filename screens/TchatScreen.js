import {View,Text,StyleSheet,FlatList} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const messages =[
{author: 'parent1',timestamp: new Date(), seen: true, content: "bonjour, mon fils est malade aujourd'hui"},
{author: 'teacher1',timestamp: new Date(), seen: true, content: "c'est noté, bon rétablissement à lui, tenez-moi informé svp"},
{author: 'parent1',timestamp: new Date(), seen: true, content: "bien sûr, bonne journée à vous. Mr Drucker"},
]

export default function TchatScreen() {

    const renderMessage = ({ item }) => (
        <View style={[styles.messageContainer, item.author === 'parent1' ? styles.parentMessage : styles.teacherMessage]}>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.timestamp}>{item.timestamp.toLocaleString()}</Text> 
          {item.seen && <FontAwesome name="check" size={14} color="green" style={styles.seenIcon} />}
        </View>
      );
    
      return (
        <View style={styles.container}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#f8f8f8',
    },
    messageContainer: {
      padding: 10,
      borderRadius: 10,
      marginVertical: 5,
      maxWidth: '75%',
    },
    parentMessage: {
      backgroundColor: '#ffffff',
      alignSelf: 'flex-end',
    },
    teacherMessage: {
      backgroundColor: '#c6d3b7',
      alignSelf: 'flex-start',
    },
    author: {
      fontWeight: 'bold',
    },
    content: {
      marginTop: 5,
    },
    timestamp: {
        marginTop: 5,
        fontSize: 12,
        color: 'gray',
      },
    seenIcon: {
        position: 'absolute', 
        bottom: 10,
        right: 10,
      },
  });
  



