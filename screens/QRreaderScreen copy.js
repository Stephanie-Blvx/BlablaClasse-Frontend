import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera } from "expo-camera/legacy";
import { buttonStyles } from "../styles/buttonStyles.js";
import { globalStyles } from '../styles/globalStyles.js';
import { useDispatch, useSelector } from "react-redux";
import { login as loginParent} from "../reducers/parent.js";
import { login as loginTeacher } from "../reducers/teacher.js";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//const BACKEND_ADDRESS = "http://192.168.1.30:3000" //===> URL à adapter
const BACKEND_ADDRESS = "http://192.168.5.28:3000"

export default function QRreaderScreen({ navigation }) {
	
	const [hasPermission, setHasPermission] = useState(false);
	const [scannedInfo, setScannedInfo] = useState(null);
	const [isValidInfo, setIsValidInfo] = useState(true);

//--------------------autorisation caméra------------------------------------
	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

//-------------------changement d'autorisation caméra ----------------------------
	function unGrantPermission() { setHasPermission(false) };
	function grantPermission() { setHasPermission(true) };

//--------------------action à la détection de QR Code ------------------------------
	const handleScan = ({ data }) => {
		data ? setScannedInfo(data) : null; //mettre l'info scannée dans l'état si pas d'info déjà enregistrée
		console.log('data', data);
		console.log('scannedInfo', scannedInfo);
	}

	const dispatch = useDispatch();
	const parent = useSelector((state) => state.parent.value);
	const teacher = useSelector((state) => state.teacher.value);

//--------------------------Click Connexion---------------------------------------------
	const handleConnexion = () => { // fonction callback du bouton "Connexion"
		console.log('scannedInfo', scannedInfo);

		const url = new URL(scannedInfo); // scannedInfo récupérée au format url
		const token = url.searchParams.get('token'); // isoler paramètre token
		const email = url.searchParams.get('email'); // isoler paramètre email
		const userType = url.searchParams.get('userType'); // isoler paramètre email

		console.log('token', token);
		console.log('email', email);
		console.log('userType',userType);

		if (!token || !email || !userType) {
			setIsValidInfo(false);
			return;
		}

// -------------------------------actions si userType = Parent----------------------------
		if (userType==="parent") {

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
					dispatch(loginParent({ 
						token: dbData.token,
						email: dbData.email,
						firstname: dbData.firstname,
						lastname: dbData.lastname,
						kids: dbData.kids,
						id: dbData.id,
						userType: dbData.userType,})); //si result = OK, MàJ reducer "parent" avec infos DB
					navigation.navigate("ParentTabNavigator");
				}
			});
		}

		// -------------------------------actions si userType = Parent-------------------------
		// if (userType==="teacher")
		else
			{

			fetch(`${BACKEND_ADDRESS}/teachers/signintoken`, // fetch route parents/signintoken
	
				{	method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token }), // info attendue : {token : token teacher}
				} 
			)
				.then((response) => response.json())
				.then((dbData) => {
					console.log("dbData", dbData); // console.log la réponse de la route / dataBase
					if (!dbData.result) {
						setIsValidInfo(false); //si result : false, setIsValidInfo à false pour message d'erreur 
					} 
					else {
						console.log('dbDataOK', dbData);
						dispatch( // dispatch pour appeler les actions du reducer
							loginTeacher({
							  token: dbData.token,
							  email: dbData.email,
							  firstname: dbData.firstname,
							  lastname: dbData.lastname,
							  username: dbData.username,
							  classes: dbData.classes,
							  id: dbData.id,
							  userType: dbData.userType,
							})
						  ); //si result = OK, MàJ reducer "teacher" avec toutes ses infos
						  navigation.navigate("TeacherTabNavigator");
					}
				});
			}
	}
	console.log("parent", parent);
	console.log("teacher", teacher);

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

