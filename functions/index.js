const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

var dbData = {};
let userID = {};

console.log("Initiating Ohana RPG Server In Offline Mode");

// async function initFirstLoad() {
// 	var db4 = admin.firestore();
// 	db4
// 		.collection("Public")
// 		.get()
// 		.then((snapshot) => {
// 			snapshot.forEach((doc) => {
// 				var key = doc.id;
// 				var data = doc.data();
// 				data["key"] = key;
// 				dbData[key] = data;
// 			});
// 		});
// 	db4.collection("Secrets").doc("MetaData").set(
// 		{
// 			FireConnected: true,
// 		},
// 		{ merge: true }
// 	);
// }
// initFirstLoad();

exports.LoadPlayerIntoGame = functions.https.onRequest((req, res) => {
	res.status(200);
	const cors = require("cors")({ origin: true });
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	try {
		let runOnce = 0;
		//Declare CORs Rules
		const cors = require("cors")({ origin: true });
		res.status(200);
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "Content-Type");
		cors(req, res, () => {
			const cors = require("cors")({ origin: true });
			res.status(200);
			res.set("Access-Control-Allow-Origin", "*");
			res.set("Access-Control-Allow-Headers", "Content-Type");
			const gotUID = JSON.parse(req.headers["headertokens"]).uid;
			const gameMeta = JSON.parse(req.headers["headertokens"]).gameMeta;
			userID = JSON.parse(req.headers["headertokens"]).uid;
			const gotHeaders = JSON.stringify(req.headers["headertokens"]);
			const RTCId = req.body.RTCId;

			async function sendGeneratedData() {
				//

				//
				var db = admin.firestore();
				try {
					db.collection("RTCClients").doc(RTCId).set(
						{
							timeStamp: admin.firestore.FieldValue.serverTimestamp(),
						},
						{ merge: true }
					);
				} catch (error) {}

				res.send(
					JSON.stringify({
						data: gameMeta,
						login: gotUID,
					})
				);
			}

			sendGeneratedData();
			// async function getDBData() {
			// 	var db = admin.firestore();
			// 	db
			// 		.collection("Secrets")
			// 		.get()
			// 		.then((snapshot) => {
			// 			snapshot.forEach((doc) => {
			// 				var key = doc.id;
			// 				var data = doc.data();
			// 				data["key"] = key;
			// 				dbData[key] = data;
			// 			});
			// 			if (dbData.MetaData.TwitchOn === false) {
			// 				//Development block for localhost emulator

			// 				//Begin Auth Comparison
			// 				if (String(gotUID) === String(dbData.Admins[0])) {
			// 					//Successful Admin UID
			// 					res.send(JSON.stringify("Welcome Admin"));
			// 					if (runOnce === 0) {
			// 						//Begin Twitch API Connection & Functions
			// 						async function setTwitchOnline() {
			// 							var db3 = admin.firestore();
			// 							db3
			// 								.collection("Secrets")
			// 								.doc("MetaData")
			// 								.set({ TwitchOn: true, FireConnected: true }, { merge: true });
			// 						}
			// 						//Launch Discord API
			// 						const DiscordTools = require("./components/DiscordTools");
			// 						DiscordTools.DiscordTools((userID = { userID }));
			// 						//Launch TwitchAPI API
			// 						const TwitchTools = require("./components/TwitchTools");
			// 						TwitchTools.TwitchTools((userID = { userID }));
			// 						const YouTubeTools = require("./components/YouTubeData");
			// 						YouTubeTools.YouTubeTools((userID = { userID }));
			// 						setTwitchOnline();
			// 						if (!dbData.MetaData.FireConnected) {
			// 							console.log("|F| Sending FireConnect");
			// 							dbData.MetaData.FireConnected = true;
			// 							//Call Database Every 60s For OffOn Switch
			// 						}
			// 						buildGeneratedData();
			// 					}
			// 				} else {
			// 					//Not Admin UID
			// 					res.send(JSON.stringify("Welcome User"));
			// 				}
			// 				res.status(200).send();
			// 			} else {
			// 				//Not Admin UID
			// 				res.send(JSON.stringify("Bot Already Online"));
			// 			}
			// 		});
			// }
			// getDBData();
		});
	} catch (error) {}
});

//Send User Sprite To GlobalDB
exports.sendUserSpriteToGlobalDB = functions.https.onRequest((req, res) => {
	res.status(200);
	const cors = require("cors")({ origin: true });
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	try {
		let runOnce = 0;
		//Declare CORs Rules
		const cors = require("cors")({ origin: true });
		res.status(200);
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "Content-Type");
		cors(req, res, () => {
			const cors = require("cors")({ origin: true });
			res.status(200);
			res.set("Access-Control-Allow-Origin", "*");
			res.set("Access-Control-Allow-Headers", "Content-Type");
			const gotUID = JSON.parse(req.headers["headertokens"]).uid;
			userID = JSON.parse(req.headers["headertokens"]).uid;
			const gotHeaders = JSON.stringify(req.headers["headertokens"]);
			const gotPixelData = req.body.pixelData;
			const gotPixelDataID = String(req.body.pixelDataID);

			async function getDBData() {
				var db = admin.firestore();
				db
					.collection("SpriteLibrary")
					.get()
					.then((snapshot) => {
						snapshot.forEach((doc) => {
							var key = doc.id;
							var data = doc.data();
							data["key"] = key;
							dbData[key] = data;
						});
						if (dbData !== undefined) {
							console.log(gotPixelDataID);

							try {
								db
									.collection("SpriteLibrary")
									.doc(String(gotPixelDataID.replace(/"/g, "")))
									.set({
										PixelSaveData: [gotPixelData],
										lastEdit: admin.firestore.FieldValue.serverTimestamp(),
										publisher: gotUID,
									});
								res.send(JSON.stringify("Pixel Send Ran"));
								res.status(200).send();
							} catch (error) {
								res.send(JSON.stringify(error));
								res.status(200).send();
								console.log(error);
							}
						}
					});
			}
			getDBData();
		});
	} catch (error) {}
});

//User Requesting From NPC
exports.GetFromNPC = functions.https.onRequest((req, res) => {
	res.status(200);
	const cors = require("cors")({ origin: true });
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	try {
		let runOnce = 0;
		//Declare CORs Rules
		const cors = require("cors")({ origin: true });
		res.status(200);
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "Content-Type");
		cors(req, res, () => {
			const cors = require("cors")({ origin: true });
			res.status(200);
			res.set("Access-Control-Allow-Origin", "*");
			res.set("Access-Control-Allow-Headers", "Content-Type");
			const gotUID = JSON.parse(req.headers["headertokens"]).uid;
			userID = JSON.parse(req.headers["headertokens"]).uid;
			const gotHeaders = JSON.stringify(req.headers["headertokens"]);
			const gotPixelData = req.body.pixelData;
			const gotPixelDataID = String(req.body.pixelDataID);
			const NPCName = String(req.body.NPCName);

			async function getDBData() {
				console.log(NPCName);
				var db = admin.firestore();
				db
					.collection("NPCScripts")
					.doc(String(NPCName))
					.get()
					.then((doc) => {
						dbData = doc.data();
						if (dbData !== undefined) {
							console.log(dbData.giveItem.split(" ")[0]);

							try {
								db
									.collection("UserInventories")
									.doc(userID)
									.set(
										{
											[dbData.giveItem.split(" ")[0]]: parseInt(
												dbData.giveItem.split(" ")[1]
											),
										},
										{ merge: true }
									);
								res.send(JSON.stringify("Pixel Send Ran"));
								res.status(200).send();
							} catch (error) {
								res.send(JSON.stringify(error));
								res.status(200).send();
								console.log(error);
							}
						}
					});
			}
			getDBData();
		});
	} catch (error) {}
});
//
//
//User Requesting From NPC
exports.HarvestPlant = functions.https.onRequest((req, res) => {
	res.status(200);
	const cors = require("cors")({ origin: true });
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	try {
		let runOnce = 0;
		//Declare CORs Rules
		const cors = require("cors")({ origin: true });
		res.status(200);
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "Content-Type");
		cors(req, res, () => {
			const cors = require("cors")({ origin: true });
			res.status(200);
			res.set("Access-Control-Allow-Origin", "*");
			res.set("Access-Control-Allow-Headers", "Content-Type");
			const gotUID = JSON.parse(req.headers["headertokens"]).uid;
			userID = JSON.parse(req.headers["headertokens"]).uid;
			const gotHeaders = JSON.stringify(req.headers["headertokens"]);
			const gotPixelData = req.body.pixelData;
			const gotPixelDataID = String(req.body.pixelDataID);
			const HarvestObjKey = String(req.body.HarvestObjKey);
			const itemName = String(req.body.itemName);

			async function getDBData() {
				console.log(HarvestObjKey);
				console.log(itemName);
				var db = admin.firestore();
				db
					.collection("GameObjects")
					.doc(HarvestObjKey)
					.get()
					.then((doc) => {
						dbData = doc.data();
						if (dbData !== undefined) {
							try {
								db
									.collection("UserInventories")
									.doc(userID)
									.set(
										{
											[itemName]: admin.firestore.FieldValue.increment(1) || 1,
										},
										{ merge: true }
									);
								db.collection("GameObjects").doc(HarvestObjKey).set(
									{
										harvested: true,
									},
									{ merge: true }
								);
								res.send(JSON.stringify("Pixel Send Ran"));
								res.status(200).send();
							} catch (error) {
								res.send(JSON.stringify(error));
								res.status(200).send();
								console.log(error);
							}
						}
					});
			}
			getDBData();
		});
	} catch (error) {}
});
//
//
//
//
//User Requesting From NPC
exports.UseInventoryItem = functions.https.onRequest((req, res) => {
	res.status(200);
	const cors = require("cors")({ origin: true });
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	try {
		let runOnce = 0;
		//Declare CORs Rules
		const cors = require("cors")({ origin: true });
		res.status(200);
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "Content-Type");
		cors(req, res, () => {
			const cors = require("cors")({ origin: true });
			res.status(200);
			res.set("Access-Control-Allow-Origin", "*");
			res.set("Access-Control-Allow-Headers", "Content-Type");
			const gotUID = JSON.parse(req.headers["headertokens"]).uid;
			userID = JSON.parse(req.headers["headertokens"]).uid;
			const gotHeaders = JSON.stringify(req.headers["headertokens"]);
			const gotPixelData = req.body.pixelData;
			const gotPixelDataID = String(req.body.pixelDataID);
			const UsedItem = String(req.body.UsedItem);
			const playerCoords = JSON.parse(JSON.stringify(req.body)).playerCoords;

			console.log(UsedItem);
			console.log(userID);
			console.log(playerCoords);
			//
			var db = admin.firestore();
			db
				.collection("GameObjects")
				.doc("Carrot")
				.get()
				.then((doc1) => {
					let dbData2 = doc1.data();
					//		console.log(dbData2.images);
					db
						.collection("UserInventories")
						.doc(userID)
						.get()
						.then((doc) => {
							let dbData = doc.data();
							if (dbData !== undefined) {
								console.log(dbData);
								console.log(UsedItem);
								console.log("User Has Item");
								db
									.collection("GameObjects")
									.doc()
									.set(
										{
											images: [dbData2.images[0]],
											meta: "plant",
											spriteScale: 0.5,
											itemName: UsedItem,
											x: playerCoords.x,
											y: playerCoords.y,
											lastEdit: admin.firestore.FieldValue.serverTimestamp(),
										},
										{ merge: true }
									);

								db
									.collection("UserInventories")
									.doc(userID)
									.set(
										{
											[UsedItem]: dbData[UsedItem] - 1,
										},
										{ merge: true }
									);
								res.send(JSON.stringify("UserInventories Send Ran"));
								res.status(200).send();
							}
						});
				});
		});
	} catch (error) {}
});

//
//User Requesting From NPC
exports.UserApproveEXP = functions.https.onRequest((req, res) => {
	res.status(200);
	const cors = require("cors")({ origin: true });
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	try {
		let runOnce = 0;
		//Declare CORs Rules
		const cors = require("cors")({ origin: true });
		res.status(200);
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "Content-Type");
		cors(req, res, () => {
			const cors = require("cors")({ origin: true });
			res.status(200);
			res.set("Access-Control-Allow-Origin", "*");
			res.set("Access-Control-Allow-Headers", "Content-Type");
			const gotUID = JSON.parse(req.headers["headertokens"]).uid;
			userID = JSON.parse(req.headers["headertokens"]).uid;
			const gotHeaders = JSON.stringify(req.headers["headertokens"]);
			const gotPixelData = req.body.pixelData;
			const gotPixelDataID = String(req.body.pixelDataID);
			const userExp = req.body.userExp;
			const userInv = req.body.userInv;
			const playerCoords = JSON.parse(JSON.stringify(req.body)).playerCoords;

			console.log(userExp);
			console.log(userInv);
			console.log(userID);
			console.log(playerCoords);
			var db = admin.firestore();
			db
				.collection("UserGameMeta")
				.doc(gotUID)
				.get()
				.then((doc1) => {
					db.collection("UserGameMeta").doc(userID).set(
						{
							expData: userExp,
						},
						{ merge: true }
					);
					res.send(JSON.stringify("UserEXP Send Ran"));
					res.status(200).send();
				});

			db
				.collection("UserInventories")
				.doc(gotUID)
				.get()
				.then((doc1) => {
					db.collection("UserInventories").doc(gotUID).set(userInv, { merge: true });
					res.send(JSON.stringify("UserEXP Send Ran"));
					res.status(200).send();
				});
		});
	} catch (error) {}
});

// //Shutdown Function
// exports.FireFunctionShutDown = functions.https.onRequest((req, res) => {
// 	res.status(200);
// 	const cors = require("cors")({ origin: true });
// 	res.set("Access-Control-Allow-Origin", "*");
// 	res.set("Access-Control-Allow-Headers", "Content-Type");
// 	try {
// 		let runOnce = 0;
// 		//Declare CORs Rules
// 		const cors = require("cors")({ origin: true });
// 		res.status(200);
// 		res.set("Access-Control-Allow-Origin", "*");
// 		res.set("Access-Control-Allow-Headers", "Content-Type");
// 		cors(req, res, () => {
// 			const cors = require("cors")({ origin: true });
// 			res.status(200);
// 			res.set("Access-Control-Allow-Origin", "*");
// 			res.set("Access-Control-Allow-Headers", "Content-Type");
// 			const gotUID = JSON.parse(req.headers["headertokens"]).uid;
// 			userID = JSON.parse(req.headers["headertokens"]).uid;
// 			const gotHeaders = JSON.stringify(req.headers["headertokens"]);

// 			async function getDBData() {
// 				var db = admin.firestore();
// 				db
// 					.collection("Secrets")
// 					.get()
// 					.then((snapshot) => {
// 						snapshot.forEach((doc) => {
// 							var key = doc.id;
// 							var data = doc.data();
// 							data["key"] = key;
// 							dbData[key] = data;
// 						});
// 						if (dbData !== undefined) {
// 							//Begin Auth Comparison
// 							if (String(gotUID) === String(dbData.Admins[0])) {
// 								//Successful Admin UID
// 								res.send(JSON.stringify("Shutting Down Via Admin"));

// 								const authProvider = new StaticAuthProvider(
// 									twitchClientId,
// 									twitchClientAccess
// 								);
// 								const chatClient = new ChatClient(authProvider, {
// 									channels: ["JasonHoku"],
// 								});
// 								async function setTwitchOffline() {
// 									var db3 = admin.firestore();
// 									db3
// 										.collection("Secrets")
// 										.doc("MetaData")
// 										.set({ TwitchOn: false }, { merge: true });
// 								}

// 								chatClient.quit();
// 								setTwitchOffline();
// 							} else {
// 								//Not Admin UID
// 								res.send(JSON.stringify("No Access For Regular User"));
// 							}
// 							res.status(200).send();
// 						}
// 					});
// 			}
// 			getDBData();
// 		});
// 	} catch (error) {}
// });

// // Detect FireStoreData
// function buildGeneratedData() {
// 	console.log("|F| Running Start Build Generated Data Interval");
// 	//console.log("Running Build Public Data Interval");
// 	let todoList = "";
// 	let listArray = [];
// 	var db = admin.firestore();
// 	db
// 		.collection("Secrets")
// 		.get()
// 		.then((snapshot) => {
// 			snapshot.forEach((doc) => {
// 				var key = doc.id;
// 				var data = doc.data();
// 				data["key"] = key;
// 				dbData[key] = data;
// 			});
// 			var DetectPublicDataBuildInterval;
// 			if (DetectPublicDataBuildInterval) {
// 				clearInterval(DetectPublicDataBuildInterval);
// 				console.log("|F| Stopping FireStore Public Data Build Interval");
// 			}
// 			//dbData.MetaData.FireConnected
// 			if (true) {
// 				console.log("|F| Starting FireStore Public Data Build Interval");
// 				DetectPublicDataBuildInterval = setInterval(() => {
// 					let listArray = [];
// 					//			console.log("||| Building GeneratedData");
// 					var db = admin.firestore();
// 					db
// 						.collection("GameObjects")
// 						.get()
// 						.then((snapshot) => {
// 							snapshot.forEach((doc) => {
// 								var key = doc.id;
// 								var data = doc.data();
// 								data["key"] = key;
// 								dbData[key] = data;
// 							});

// 							// console.log(dbData)

// 							//Got Secrets then Build Public Data
// 							// 		var db = admin.firestore();
// 							// 		db
// 							// 			.collection("Users")
// 							// 			.doc(String(dbData.Admins[0]))
// 							// 			.get()
// 							// 			.then((doc) => {
// 							// 				todoList = JSON.parse(JSON.stringify(doc.data())).Todo;
// 							// 				todoList.forEach((todo) => listArray.push(String(todo + " ")));
// 							// 				//Got Admin ToDo Now Generate Text

// 							// 				async function sendGeneratedData() {
// 							// 					db
// 							// 						.collection("Public")
// 							// 						.doc("GeneratedData")
// 							// 						.set(
// 							// 							{
// 							// 								LatestRun: admin.firestore.FieldValue.serverTimestamp(),
// 							// 								RawText: ` ${
// 							// 									Date(dbData.GeneratedData.LatestRun).split("(")[0]
// 							// 								} -@!%!%!@-  ${String(parseInt(dbData.RunCounter.count) + 1)}
// 							// -@!%!%!@-  ${String(listArray).replace(/,/g, " ")}`,
// 							// 							},
// 							// 							{ merge: true }
// 							// 						);
// 							// 				}
// 							// 				if (!dbData.MetaData.FireConnected) {
// 							// 					console.log("||| Connection Quit");
// 							// 					sendGeneratedData().then(() => {
// 							// 						clearInterval(DetectPublicDataBuildInterval);
// 							// 					});
// 							// 				}
// 							// 				sendGeneratedData();
// 							// 			});
// 						});
// 				}, 60000);
// 			}
// 		});
// }
// buildGeneratedData();
exports.fiveMinuteInterval = functions.pubsub
	.schedule("every 5 minutes")
	.onRun((context) => {
		//		console.log("Cleansing Old RTCs");

		let dbData2 = {};
		let data2 = {};
		var db = admin.firestore();
		//			console.log(" ");
		//		console.log("Cleansing RTCs ");
		db
			.collection("RTCClients")
			.get()
			.then((userData) => {
				userData.forEach((doc) => {
					var key = doc.id;
					var data = doc.data();
					data2["key"] = key;
					dbData2[key] = data;

					if (
						new Date(doc.data().timeStamp.toDate()) - new Date(Date.now()) <
						-60000 * 3
					) {
						// If RTC Older than 3 Minutes
						db
							.collection("RTCClients")
							.doc(doc.id)
							.delete()
							.then(() => {
								//								console.log("Old RTC successfully deleted!");
							})
							.catch((error) => {
								console.error("Error removing document: ", error);
							});
					}
				});
			});
		//		console.log(" ");
		//		console.log("Cleansing Harvested Plants ");
		// db
		// 	.collection("GameObjects")
		// 	.get()
		// 	.then((dataEl) => {
		// 		dataEl.forEach((doc) => {
		// 			var key = doc.id;
		// 			var data = doc.data();
		// 			data2["key"] = key;
		// 			dbData2[key] = data;

		// 			if (doc.data().harvested) {
		// 				db
		// 					.collection("GameObjects")
		// 					.doc(doc.id)
		// 					.delete()
		// 					.then(() => {
		// 						console.log("Old RTC successfully deleted!");
		// 					})
		// 					.catch((error) => {
		// 						console.error("Error removing document: ", error);
		// 					});
		// 			}
		// 		});
		// 	});
	});
