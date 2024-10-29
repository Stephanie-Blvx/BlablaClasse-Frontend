import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera } from "expo-camera/legacy";
// import { CameraView } from "expo-camera";
import * as Linking from "expo-linking";
import { buttonStyles } from "../styles/buttonStyles";
import { globalStyles } from '../styles/globalStyles';

export default function QRreaderScreen() {
	const [hasPermission, setHasPermission] = useState(false);
	const [scannedLink, setScannedLink] = useState(null);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	//si pas de URL déjà enregistrée, mettre l'URL scanée dans l'état
	const handleScan = ({ data }) => {
		if (!scannedLink) {
			setScannedLink(data);
		}
	};

	const handleNavigate = () => { // fonction callback du bouton "Suivre le lien" à modifier
		Linking.openURL(scannedLink);
	};

	const handleReset = () => { // fonction callback bouton "Nouveau scan" = reinitialiser l'état scannedLink
		setScannedLink(null);
	};

	if (!hasPermission) {
		return <View />;
	}

	let scanContainer;
	if (scannedLink) {
		scanContainer = (
			<View style={globalStyles.QRContainer}>
				<Text style={globalStyles.QRtext}>QR Code correctement scanné</Text>
				<View style={globalStyles.QRbuttonContainer}>
					<TouchableOpacity onPress={() => handleNavigate()} style={buttonStyles.QRbutton}>
						<Text style={globalStyles.buttonText}>Suivre le lien</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleReset()} style={buttonStyles.QRbutton}>
						<Text style={globalStyles.buttonText}>Nouveau scan</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<Camera
				onBarCodeScanned={scannedLink ? undefined : handleScan}
				style={{ flex: 1 }}
			/>
			{scanContainer}
		</View>
	);
}

