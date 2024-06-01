import React, { useState, useEffect, useRef } from "react";

import "firebase/firestore";
import {
	FirebaseAppProvider,
	useFirestoreDocData,
	useFirestore,
} from "reactfire";

import firebase from "firebase/app";

import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

import { unregister } from "../serviceWorker";

import { toast } from "react-toastify";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE,
	authDomain: "ohana-rpg.firebaseapp.com",
	projectId: "ohana-rpg",
	storageBucket: "ohana-rpg.appspot.com",
	messagingSenderId: "158410959046",
	appId: "1:158410959046:web:20a6051cbd581536ec8fc7",
	measurementId: "G-9XDPQ58GBF",
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

function showNotification() {
	navigator.serviceWorker.register("sw2.js");
	Notification.requestPermission(function (result) {
		if (result === "granted") {
			navigator.serviceWorker.ready.then(function (registration) {
				var options = {
					body:
						"A new version of this website is available, please reload after saving any work to load new website content.",
					icon: "logo512.png",
					vibrate: [100, 50, 100],
					data: {
						dateOfArrival: Date.now(),
						primaryKey: 1,
					},
				};
				registration.showNotification("Site Update", options);
			});
		}
	});
}
function showNotification2(e) {
	toast(
		"A new version of this website is available, please reload after saving any work to load new website content.",
		{
			position: "top-right",
			autoClose: false,
			containerId: 1,
			hideProgressBar: false,
			closeOnClick: true,
			onClose: () => unregister,
			pauseOnHover: true,
			draggable: true,
		}
	);
}
function Burrito() {
	// easily access the Firestore library
	const burritoRef = useFirestore().collection("version").doc("0");

	// subscribe to a document for realtime updates. just one line!
	const { status, data } = useFirestoreDocData(burritoRef);

	const isInitialMount = useRef(true);

	useEffect(() => {
		if (!isInitialMount.current) {
			return null;
		} else {
			setInterval(() => {
				console.log(localStorage.getItem("appVersion"));
			}, 30000);
			isInitialMount.current = false;
		}
	});

	// easily check the loading status
	if (status === "loading") {
	} else {
		//	console.log(data.version);
		let concData = data.version;
		if (!localStorage.getItem("appVersion")) {
			localStorage.setItem("appVersion", data.version);
		} else if (localStorage.getItem("appVersion") !== data.version) {
			if (localStorage.getItem("appVersion") && data.version) {
				console.log("Sending New Version Notification");

				if (window.location.hostname.includes("10.45.203.124") === false) {
					showNotification();
					showNotification2();

				if (caches) {
					caches.keys().then(function (names) {
						for (let name of names) caches.delete(name);
					});
					localStorage.setItem("appVersion", concData);
				}
			}

			}
			return null;
		}
		return null;
	}
	return null;
}

function CheckVersions() {
	///	console.log("Checking Versions");
	return (
		<FirebaseAppProvider firebaseConfig={firebaseConfig}>
			<Burrito />
		</FirebaseAppProvider>
	);
}

export default CheckVersions;
