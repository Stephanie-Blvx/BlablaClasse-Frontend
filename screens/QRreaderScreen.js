import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera } from "expo-camera/legacy";
import { buttonStyles } from "../styles/buttonStyles.js";
import { globalStyles } from '../styles/globalStyles.js';
import { useDispatch, useSelector } from "react-redux";
import { login as loginParent } from "../reducers/parent.js";
import { login as loginTeacher } from "../reducers/teacher.js";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//const BACKEND_ADDRESS = "http://192.168.3.174:3000"; //===> URL à adapter
const BACKEND_ADDRESS = "http://192.168.5.28:3000";

export default function QRreaderScreen({ navigation }) 
{
	const [hasPermission, setHasPermission] = useState(false);
	const [scannedInfo, setScannedInfo] = useState(null);
	const [isValidInfo, setIsValidInfo] = useState(true);

	//-------------------- Autorisation caméra ------------------------------------
	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	//------------------- Changement d'autorisation caméra ----------------------------
	const unGrantPermission = () => setHasPermission(false);
	const grantPermission = () => setHasPermission(true);

	//-------------------- Action à la détection de QR Code ------------------------------
	const handleScan = ({ data }) => {
		if (data) {
			setScannedInfo(data); // Mettre l'info scannée dans l'état
		}
		console.log('data', data);
		console.log('scannedInfo', scannedInfo);
	};

	const dispatch = useDispatch();
	const parent = useSelector((state) => state.parent.value);
	const teacher = useSelector((state) => state.teacher.value);

	//-------------------------- Click Connexion ---------------------------------------------
	const handleConnexion = () => {
		console.log('scannedInfo', scannedInfo);

		const url = new URL(scannedInfo); // scannedInfo récupérée au format URL
		const token = url.searchParams.get('token'); // Isoler paramètre token
		const email = url.searchParams.get('email'); // Isoler paramètre email
		const userType = url.searchParams.get('userType'); // Isoler paramètre userType

		console.log('token', token);
		console.log('email', email);
		console.log('userType', userType);

		if (!token || !email || !userType) {
			setIsValidInfo(false);
			return;
		}

		//------------------------ Fetch de la BDD en fonction du type d'utilisateur ------------------------------------------
		const endpoint = userType === "parent" ? "parents/signintoken" : "teachers/signintoken";

		fetch(`${BACKEND_ADDRESS}/${endpoint}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token }),
		})
		.then((response) => response.json())
		.then((dbData) => {
			console.log("dbData", dbData); // console log de la réponse de la route / dataBase

			if (!dbData.result) {
				setIsValidInfo(false); // Si result : false, setIsValidInfo à false pour message d'erreur
			} else {
				console.log('dbDataOK');

				if (userType === "parent") { // Si parent, MàJ reducer "parent" avec infos DB
					dispatch(loginParent({
						token: dbData.token,
						email: dbData.email,
						firstname: dbData.firstname,
						lastname: dbData.lastname,
						kids: dbData.kids,
						id: dbData.id,
						userType: dbData.userType,
					}));
					navigation.navigate("ParentTabNavigator");
				} else { // Sinon, MàJ reducer "teacher" avec infos DB
					dispatch(loginTeacher({ 
						token: dbData.token,
						email: dbData.email,
						firstname: dbData.firstname,
						lastname: dbData.lastname,
						username: dbData.username,
						classes: dbData.classes,
						id: dbData.id,
						userType: dbData.userType,
					}));
					navigation.navigate("TeacherTabNavigator");
				}
			}
		})
		.catch((error) => {
			console.error("Erreur lors de la connexion :", error);
			setIsValidInfo(false); // Signaler l'erreur
		});
	}

		console.log("parent", parent);
		console.log("teacher", teacher);

		const handleReset = () => {setScannedInfo(null);} // Fonction callback bouton "Nouveau scan" = réinitialiser l'état scannedInfo
	
		if (!hasPermission) {
			return (
				<View style={globalStyles.QRContainer}>
					<Text style={{ margin: 30 }}>Accès caméra non autorisé</Text>
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
					<Text style={{ color: "#69AFAC", fontWeight: '300', marginTop: 10 }}>Accès caméra autorisé</Text>
					<Text style={globalStyles.QRtext}>{isValidInfo ? 'QR Code correctement scanné' : 'Données incorrectes, veuillez réessayer'}</Text>
					<View style={globalStyles.QRbuttonContainer}>
						<TouchableOpacity onPress={handleReset} style={buttonStyles.QRbutton}>
							<Text style={globalStyles.buttonText}>Nouveau scan</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleConnexion} style={buttonStyles.QRbutton}>
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
