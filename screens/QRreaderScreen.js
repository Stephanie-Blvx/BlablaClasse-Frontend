import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera } from "expo-camera/legacy";
import { buttonStyles } from "../styles/buttonStyles.js";
import { globalStyles } from '../styles/globalStyles.js';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/parent.js";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//const BACKEND_ADDRESS = "http://192.168.1.30:3000" //===> URL à adapter
const BACKEND_ADDRESS = "http://192.168.5.28:3000"

export default function QRreaderScreen({ navigation }) {
	
	const [hasPermission, setHasPermission] = useState(false);
	const [scannedInfo, setScannedInfo] = useState(null);
	const [isValidInfo, setIsValidInfo] = useState(true);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	function unGrantPermission() { setHasPermission(false) };
	function grantPermission() { setHasPermission(true) };


	const handleScan = ({ data }) => {
		data ? setScannedInfo(data) : null; //mettre l'info scannée dans l'état si pas d'info déjà enregistrée
		console.log('data', data);
		console.log('scannedInfo', scannedInfo);
	}

	const dispatch = useDispatch();
	const parent = useSelector((state) => state.parent.value);

	const handleConnexion = () => { // fonction callback du bouton "Connexion"
		console.log('scannedInfo', scannedInfo);

		const url = new URL(scannedInfo); // scannedInfo récupérée au format url
		const token = url.searchParams.get('token'); // isoler paramètre token
		const email = url.searchParams.get('email'); // isoler paramètre email

		console.log('token', token);
		console.log('email', email);

		fetch(`${BACKEND_ADDRESS}/parents/signintoken`, // fetch route parents/signintoken

			{	method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, token }), // info attendue : {email: email parent, token : token parent}
			} 
		)
			.then((response) => response.json())
			.then((dbData) => {
				console.log("dbData", dbData); // console.log la réponse de la route / dataBase
				if (!dbData.result) {
					setIsValidInfo(false); //si result : false, setIsValidInfo à false pour message d'erreur 
				} 
				else {
					console.log('dbDataOK');
					dispatch(login({ token: dbData.token, email: dbData.email, firstname: dbData.firstname, lastname: dbData.lastname, kids: dbData.kids })); //si result = OK, MàJ reducer "parent" avec infos DB
					navigation.navigate("TabNavigator");
				}
			});
	}
	console.log("parent", parent);


	const handleReset = () => { // fonction callback bouton "Nouveau scan" = reinitialiser l'état scannedInfo
		setScannedInfo(null);
	};

	if (!hasPermission) {
		return (
			<View style={globalStyles.QRContainer}>
				<Text style={{ margin: 30 }}>Accès caméra non autorisé </Text>
				<View style={{ flexDirection: 'row' }}>

					<FontAwesome name='check' size={20} color="#69AFAC" onPress={grantPermission} />
					<Text style={{ color: "#69AFAC", fontWeight: '400' }}>Autoriser</Text>

				</View>
			</View>
		);
	}

	let scanContainer;
	if (scannedInfo) {
		scanContainer = (
			<View style={globalStyles.QRContainer}>
				<Text style={{ color: "#69AFAC", fontWeight: '300', marginTop: 10 }}>Accès camera autorisé</Text>
				<Text style={globalStyles.QRtext}>{isValidInfo ? 'QR Code correctement scanné' : 'Données incorrectes, veuillez réessayer'}</Text>
				<View style={globalStyles.QRbuttonContainer}>
					<TouchableOpacity onPress={() => handleReset()} style={buttonStyles.QRbutton}>
						<Text style={globalStyles.buttonText}>Nouveau scan</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleConnexion()} style={buttonStyles.QRbutton}>
						<Text style={globalStyles.buttonText}>Se connecter</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<Camera
				onBarCodeScanned={scannedInfo ? undefined : handleScan}
				style={{ flex: 1 }}
			/>
			{scanContainer}
			<View style={globalStyles.QRContainer}>
				<TouchableOpacity onPress={unGrantPermission}>
					<Text style={{ color: "red", fontWeight: '300', marginBottom: 10 }}>Interdire l'accès à la caméra</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

