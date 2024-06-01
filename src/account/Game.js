import firebase from "firebase/app";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { GiCancel, GiCheckMark, GiWheat } from "react-icons/gi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import C2Fun from "./Component2";
import NPCAIComponent from "./Game/NPCAIComponent";
import CreateEmitters from "./Game/CreateEmitters";
import GenerateMapData from "./Game/GenerateMapData";
import CreateWSConnection from "./Game/CreateWSConnection";
import HandleUserClick from "./Game/HandleUserClick";
import CreateSpriteSheet from "./Game/CreateSpriteSheet";
import CreateNPCs from "./Game/CreateNPCs";

// import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";

export default function SceneCreator() {
	// const [isMouseDown, setIsMouseDown] = useState(false);
	// const [isMovementHeld, setIsMovementHeld] = useState(false);
	// const [stateMainStackCounter, setStateMainStackCounter] = useState(0);
	// const [saveNameVar, setSaveNameVar] = useState("NameYourSave");
	// const [hideShowState, setHideShowState] = useState("Show");
	const [rightClickMenuHidden, setRightClickMenuHidden] = useState(true);
	const [inventoryHidden, setInventoryHidden] = useState(true);
	const [NPCChatHidden, setNPCChatHidden] = useState(true);
	const [NPCHasChat, setNPCHasChat] = useState(false);
	const [rightClickMenuCoords, setRightClickMenuCoords] = useState({
		x: 0,
		y: 0,
	});

	// const [activeSceneType, setActiveSceneType] = useState("MapEditor");
	// const [animationStateArray, setAnimationStateArray] = useState([]);
	// const [staticSpriteXState, setStaticSpriteXState] = useState(0);
	// const [staticSpriteYState, setStaticSpriteYState] = useState(0);
	// const [isStaticBlockedState, setIsStaticBlockedState] = useState(false);
	// const [heroSpriteXState, setHeroSpriteXState] = useState(0);
	// const [heroSpriteYState, setActiveHeroYState] = useState(0);
	// const [isHeroBlockedState, setIsHeroBlockedState] = useState(false);
	// const [backgroundXState, setBackgroundXState] = useState(0);
	// const [backgroundYState, setBackgroundYState] = useState(0);
	// const [drawScaleState, setDrawScaleState] = useState(1);
	// const [spriteScaleState, setSpriteScaleState] = useState(1);
	// const [parsedInGameTime, setParsedInGameTime] = useState("");
	// const [zoomState, setZoomState] = useState(0.6);
	const [selectedHotBar, setSelectedHotBar] = useState(1);

	var zoomRef = useRef(0.6);
	var playerMovementSpeed = useRef(0.6);
	var heroSpriteX = useRef(0);
	var heroSpriteY = useRef(0);
	var backgroundX = useRef(0);
	var backgroundY = useRef(0);
	var heroFacingDirection = useRef(0);
	var drawScale = useRef(1);
	var mouseXY = useRef(0);
	var inGameMouseXY = useRef(0);
	var rightClickMenuRef = useRef(0);
	var NPCChatRef = useRef(0);
	var NPCChatHiddenRef = useRef(0);
	var rightClickMenuSelect = useRef([]);
	var rightClickMenuGotChat = useRef([]);
	var inGameTimeRef = useRef("");
	var selectedHotBarRef = useRef(1);
	var coolDownRefs = useRef({});
	var modifyTileMapRef = useRef({});
	var selectedItemRef = useRef({});

	const activeSheetKeyframeGroups = useRef(true);
	const activeSheetCurrentKeyframe = useRef(true);
	const activeLoadedSheets = useRef(true);
	const spritePartsPaths = useRef(true);
	const spritePartsSockets = useRef(true);

	var userEXPRef = useRef(0);

	const isInitialMount = useRef(true);
	const KeyPressMoveBool = useRef(true);
	var importedSpriteCounter = useRef(true);

	const auth = firebase.auth();

	// I use function statements over variable declaration
	// when a constructor is involved.
	var canvas = document.getElementById("mainScene");
	var ctx = canvas && canvas.getContext("2d");

	//Begin ListUseEffects
	useEffect(() => {
		console.log("StateRefreshing");
		// console.log("Updating State Refresh UseEffect");
		if (!isInitialMount.current) {
			//loads last, EveryTime
			// console.log("Running UseEffect2");
			// Listen To Snapshot & Update
		} else {
			// Begin Run Once UseEffect
			zoomRef.current = 1;
			playerMovementSpeed.current = 500;
			window.addEventListener("wheel", (event) => {
				if (event.deltaY > 0) {
					if (zoomRef.current > 0.8) {
						zoomRef.current = Math.round((zoomRef.current - 0.2) * 100) / 100;
						if (zoomRef.current === 0.7) {
							zoomRef.current -= 0.2;
						}
					}
				} else if (event.deltaY < 0) {
					if (zoomRef.current < 1.2) {
						zoomRef.current = Math.round((zoomRef.current + 0.2) * 100) / 100;
						if (zoomRef.current === 0.7) {
							zoomRef.current += 0.2;
						}
					}
				}
			});

			rightClickMenuRef.current = true;
			NPCChatRef.current = false;
			NPCChatHiddenRef.current = true;
			// Right Click Script
			// RightClickFunction
			document.addEventListener(
				"contextmenu",
				function (e) {
					//Right Click Menu 1

					if (!rightClickMenuRef.current) {
						// console.log("hiding");
						if (!e.target.id.includes("rightClickMenuSpan")) {
							rightClickMenuRef.current = true;
							setRightClickMenuHidden(rightClickMenuRef.current);
						}
						rightClickMenuRef.current = rightClickMenuHidden;
					} else if (rightClickMenuRef.current) {
						rightClickMenuSelect.current = [];
						rightClickMenuGotChat.current = [];
						// Show liveGameObjects At Coordinates In RightClick Menu

						//Get Cursors Coordinates
						let cursorX = e.pageX;
						let cursorY = e.pageY;

						mouseXY.current = {
							x: cursorX,
							y: cursorY,
						};

						let mapCoordsAtMouseX = inGameMouseXY.current.x + 35;
						let mapCoordsAtMouseY = inGameMouseXY.current.y + 50;

						window.liveGameDataArray.forEach((ele, index) => {
							// Search For Objects at Coordinates

							let RangeX = 64 * drawScale.current;
							let RangeY = 64 * drawScale.current;

							// console.log("GotElements" + ele.x, ele.y, ele.spriteScale || 1);
							// console.log("ClickCoordinates" + mapCoordsAtMouseX, mapCoordsAtMouseY);

							// If Ele Coords + Range === Click Coords
							if (ele.x <= mapCoordsAtMouseX && ele.x >= mapCoordsAtMouseX - RangeX) {
								if (ele.y <= mapCoordsAtMouseY && ele.y >= mapCoordsAtMouseY - RangeY) {
									console.log("True");
									var NPCData = {};
									var db = firebase.firestore();
									db
										.collection("NPCScripts")
										.get()
										.then((userData2) => {
											userData2.forEach((doc) => {
												var key = doc.id;
												var data = doc.data();
												data["key"] = key;
												NPCData[key] = data;
											});
											var NPCDataObjects = Object.values(NPCData);
											NPCDataObjects.forEach((ele2, index) => {
												if (ele2.key === ele.key) {
													console.log(ele2.key);
													console.log(ele2.text);
													rightClickMenuGotChat.current.push({
														key: ele2.key,
														text: ele2.text,
													});
													NPCChatRef.current = true;
													NPCChatHiddenRef.current = false;
													setNPCHasChat(true);
												} else {
													NPCChatRef.current = false;
													NPCChatHiddenRef.current = true;
													setNPCHasChat(false);
												}
											});
										});
									rightClickMenuSelect.current.push({
										key: ele.key,
										meta: ele.meta,
										lastEdit: ele.lastEdit,
										itemName: ele.itemName,
									});

									// console.log(
									// 	ele.y,
									// 	background.y + 2000,
									// 	mapCoordsAtMouseY + RangeY,
									// 	mapCoordsAtMouseY <= RangeY
									// );
									// console.log(" Object " + ele.key + " Here");
								}
							} else {
							}
						});
						rightClickMenuRef.current = false;
					}
					// console.log(rightClickMenuRef.current);
					// console.log(mouseXY.current);
					setRightClickMenuCoords(mouseXY.current);
					setRightClickMenuHidden(rightClickMenuRef.current);

					//
					e.preventDefault();
				},
				false
			);

			var canvas = document.getElementById("mainScene");

			// Create Object JSON
			console.log("Loading GameData");
			let dbData = {};
			window.liveGameDataArray = [];
			window.UserInventoryArray = [];
			window.UserInventoryJSON = {};
			var db = firebase.firestore();
			db
				.collection("GameObjects2")
				.get()
				.then((userData3) => {
					userData3.forEach((doc) => {
						var key = doc.id;
						var data = doc.data();
						data["key"] = key;
						dbData[key] = data;
					});
					let dbDataArray = Object.values(dbData);
					//Check Through Array of User Collections
					console.log("Got Scene Object Data: ");
					console.log(" ");
					dbDataArray.forEach((dbArrayEle, index) => {
						if (dbArrayEle) {
							//Format Into Names
							window.liveGameDataArray.push(dbArrayEle);
						}
					});
					// Send Array To Objects
					//Load Object Properties Array From Database
					console.log("Performing Graphical Settings Render: ");
					window.liveGameDataArray.forEach((ele, index) => {
						//
						importedSpriteCounter.current++;
						//
						//
						var canvasNewAni = document.createElement("canvas");
						var w = 64;
						var h = 64;
						canvasNewAni.width = w;
						canvasNewAni.height = h;
						canvasNewAni.id =
							"SavedCanvasID" + parseInt(importedSpriteCounter.current);
						document
							.getElementById("OffScreenRenderContainer")
							.appendChild(canvasNewAni);
						//
						//
						var savedCanvas = document.getElementById(
							`SavedCanvasID${parseInt(importedSpriteCounter.current)}`
						);
						var ctxIterator = savedCanvas.getContext("2d");
						//
						//
						var img = new Image();
						img.src = ele.images[0];
						img.onload = function () {
							//						console.log(index + " " + img.src.length);
							ctxIterator.drawImage(
								img,
								0,
								0,
								64 * drawScale.current,
								64 * drawScale.current
							);
							var img2 = new Image();
							//Separate Properties, Create Image
							ele.readyVar = false;
							img2.src = savedCanvas.toDataURL("image/png", 1);
							img2.onload = function () {
								if (img.src.length > 40000) {
									console.log(ele.key);
								}

								// if (ele.key === "Monster") {
								// 	console.log("True");
								// 	console.log(img2.src);
								// }

								//	console.log(ele.key + index + " " + img2.src.length + img2.src);
								ele.imgSrcArray = img2;
								ele.readyVar = true;
							};
							// Hero image
						};
						//
					});
					//
					//
					console.log("");
					console.log("");
					console.log("Init Phaser Start");
					console.log("");
					const Phaser = require("phaser");
					//
					//
					let updateCounterVar = 0;
					let tenCounterVar = 0;
					let hundredCounterVar = 0;
					let thousCounterVar = 0;
					let millCounterVar = 0;

					//
					//

					var helpText;

					var showTiles = false;
					var showFaces = false;
					var showProfilePage = false;
					var showBuildingPage = false;
					var showCollidingTiles = false;

					console.log("StartTest Time");

					var startTestTimeVar = new Date();

					class Example extends Phaser.Scene {
						constructor() {
							super("MainLoader");
							this.moveCam = false;
							this.userDatabase = [];
							this.sprites = [];
						}
						preload() {
							//

							window.gameObject = this;
							window.mapSize = 10240 / 2;
							//
							this.load.image("cursorSelector", "images/cursorSelector.webp");

							var db = firebase.firestore();
							db
								.collection("UserInventories")
								.doc(String(auth.currentUser.uid))
								.get()
								.then((doc) => {
									var data = doc.data();
									window.UserInventoryJSON = doc.data();
									//
									if (data) {
										var gotDBDataArray = Object.keys(data).map((key) => [
											String(key),
											data[key],
										]);
									} else {
										gotDBDataArray = [];
										window.UserInventoryJSON = { Carrot: 0 };
									}
									//
									gotDBDataArray.forEach((elem3, index) => {
										if (window.UserInventoryArray < 1) {
											window.UserInventoryArray.push(elem3);
										} else {
											window.UserInventoryArray.forEach((elem4, index2) => {
												//
												if (
													JSON.stringify(window.UserInventoryArray).includes(
														JSON.stringify(elem3)
													)
												) {
												} else {
													window.UserInventoryArray.push(elem3);
												}
												//
											});
										}
									});
									console.log(window.UserInventoryArray);
									// var NPCDataObjects = Object.values(NPCData);
									// NPCDataObjects.forEach((ele2, index) => {});
								});
							//					rightClickMenuSelect.current.push({		});

							//
							//Load Character Spritesheet Animations
							activeSheetKeyframeGroups.current = [];

							let frameXMultiplier = 13;
							let frameYMultiplier = 20;

							for (let i2 = 0; i2 <= frameYMultiplier; i2++) {
								// Each Y
								// 0 - 20  push X series
								//
								// [0=[0,1,2]]
								//
								//
								let startingInt = [];

								for (let i = 0; i < frameXMultiplier; i++) {
									//
									// Skip frames at each group after x
									if (i2 >= 0 && i2 <= 3 && i >= 7) {
										continue;
									} else if (i2 >= 4 && i2 <= 7 && i >= 8) {
										continue;
									} else if (i2 >= 8 && i2 <= 11 && i >= 9) {
										continue;
									} else if (i2 >= 12 && i2 <= 15 && i >= 6) {
										continue;
									} else if (i2 === 20 && i >= 6) {
										continue;
									} else {
										startingInt.push(1 * i2 * frameXMultiplier + i);
									}

									//
									// Each X
									// Create X Frames
									// 0 - 13  push  0, 1, 2...

									//
								}

								activeSheetKeyframeGroups.current.push(startingInt);
							}

							console.log(activeSheetKeyframeGroups.current);
							activeSheetCurrentKeyframe.current = 11;
							activeSheetCurrentKeyframe.current =
								activeSheetKeyframeGroups.current[activeSheetCurrentKeyframe.current];
							spritePartsSockets.current = [
								"body",
								"legs",
								"shirt",
								"hair",
								"shoes",
								"eyes",
								"nose",
								"ears",
								"weapon",
							];

							spritePartsPaths.current = {
								[spritePartsSockets.current[0]]: [
									"/images/SpriteParts/body/male/tanned2.png",
									"/images/SpriteParts/body/male/light.png",
									"/images/SpriteParts/body/male/dark.png",
									"/images/SpriteParts/body/male/tanned.png",
								],
								legs: [
									"/images/SpriteParts/legs/armor/male/metal_pants_male.png",
									"/images/SpriteParts/legs/armor/male/golden_greaves_male.png",
									"/images/SpriteParts/legs/pants/male/white_pants_male.png",
								],
								shirt: [
									"/images/SpriteParts/torso/shirts/longsleeve/male/teal_longsleeve.png",
									"/images/SpriteParts/torso/leather/chest_male.png",
									"/images/SpriteParts/torso/plate/chest_male.png",
									"/images/SpriteParts/torso/chain/tabard/jacket_male.png",
								],
								hair: [
									"/images/SpriteParts/hair/male/loose/light-blonde2.png",
									"/images/SpriteParts/hair/male/loose/brown.png",
									"/images/SpriteParts/hair/male/loose/brunette.png",
									"/images/SpriteParts/hair/male/loose/raven.png",
									"/images/SpriteParts/hair/male/plain/brown.png",
									"/images/SpriteParts/hair/male/plain/raven.png",
									"/images/SpriteParts/hair/male/plain/brunette.png",
									"/images/SpriteParts/hair/male/swoop/light-blonde2.png",
									"/images/SpriteParts/hair/male/swoop/raven.png",
									"/images/SpriteParts/hair/male/page/brown.png",
								],
								shoes: [
									"/images/SpriteParts/feet/shoes/male/brown_shoes_male.png",
									"/images/SpriteParts/feet/armor/male/metal_boots_male.png",
								],
								eyes: [
									"/images/SpriteParts/body/male/eyes/blue.png",
									"/images/SpriteParts/body/male/eyes/green.png",
									"/images/SpriteParts/body/male/eyes/red.png",
									"/images/SpriteParts/body/male/eyes/purple.png",
									"/images/SpriteParts/body/male/eyes/gray.png",
									"/images/SpriteParts/body/male/eyes/yellow.png",
								],
								nose: [
									"/images/SpriteParts/body/male/nose/buttonnose_tanned2.png",
									"/images/SpriteParts/body/male/nose/straightnose_tanned2.png",
									"/images/SpriteParts/body/male/nose/bignose_tanned2.png",
								],
								ears: ["/images/SpriteParts/body/male/ears/bigears_tanned2.png"],
								weapon: ["/images/SpriteParts/weapons/both hand/spear.png"],
							};

							activeLoadedSheets.current = [
								spritePartsPaths.current.body[0],
								spritePartsPaths.current.legs[0],
								spritePartsPaths.current.shirt[0],
								spritePartsPaths.current.hair[0],
								spritePartsPaths.current.shoes[0],
								spritePartsPaths.current.eyes[0],
								spritePartsPaths.current.nose[0],
								spritePartsPaths.current.ears[0],
								spritePartsPaths.current.weapon[0],
							];

							this.load.image("whiteParticle", "images/whiteParticle.png");

							for (let ix123 = 0; ix123 < 9; ix123++) {
								this.load.spritesheet(
									"spriteSheet" + String(ix123),
									activeLoadedSheets.current[ix123],
									{
										frameWidth: 64,
										frameHeight: 64,
									}
								);
							}

							let totalReadyCharacterSheets = 5;
							for (let i = 0; i < totalReadyCharacterSheets; i++) {
								this.load.spritesheet(
									String("LightNPCSheet_" + String(i)),
									"/images/Characters/NPC" + String(i) + ".png",
									{
										frameWidth: 64,
										frameHeight: 64,
									}
								);
							}

							//

							//Load All Possible SpriteSheets
							console.log(spritePartsPaths.current);
							console.log(spritePartsSockets.current);

							for (
								let i2 = 0;
								i2 < spritePartsSockets.current.length;
								i2++ // body
							)
								for (
									let i = 0;
									i < spritePartsPaths.current[spritePartsSockets.current[i2]].length;
									i++
								) {
									this.load.spritesheet(
										String("SpriteSheetPart_" + String(i2)) + String("ID#" + i),
										spritePartsPaths.current[spritePartsSockets.current[i2]][i],
										{
											frameWidth: 64,
											frameHeight: 64,
										}
									);

									//				console.log("%c Loaded Sprite Part:", "color: lightBlue;");

									// console.log(spritePartsSockets.current[i]);

									// console.log(
									// 	spritePartsPaths.current[spritePartsSockets.current[i2]][i]
									// );
									// console.log(
									// 	String("SpriteSheetPart_" + String(i2)) + String("ID#" + i)
									// );
									// console.log("%cNext", "color: lightBlue;");
								}

							//

							let spritePartsFilePathsTempJSON = [
								spritePartsPaths.current.body[Math.floor(Math.random() * 4)],
								spritePartsPaths.current.legs[Math.floor(Math.random() * 3)],
								spritePartsPaths.current.shirt[Math.floor(Math.random() * 4)],
								spritePartsPaths.current.hair[
									Math.floor(Math.random() * spritePartsPaths.current.hair.length)
								],
								spritePartsPaths.current.shoes[Math.floor(Math.random() * 2)],
								spritePartsPaths.current.eyes[Math.floor(Math.random() * 6)],
								spritePartsPaths.current.nose[Math.floor(Math.random() * 3)],
								spritePartsPaths.current.ears[0],
								spritePartsPaths.current.weapon[0],
							];

							console.log(spritePartsFilePathsTempJSON);

							// Old Bad Overloading Method
							// Create Variations Of NPC Sprite Combos
							// i == variations, i2 == spriteParts
							// for (let i = 0; i < 1; i++) {
							// 	let spritePartsFilePathsTempJSON = [
							// 		spritePartsPaths.current.body[Math.floor(Math.random() * 4)],
							// 		spritePartsPaths.current.legs[Math.floor(Math.random() * 3)],
							// 		spritePartsPaths.current.shirt[Math.floor(Math.random() * 4)],
							// 		spritePartsPaths.current.hair[
							// 			Math.floor(Math.random() * spritePartsPaths.current.hair.length)
							// 		],
							// 		spritePartsPaths.current.shoes[Math.floor(Math.random() * 2)],
							// 		spritePartsPaths.current.eyes[Math.floor(Math.random() * 6)],
							// 		spritePartsPaths.current.nose[Math.floor(Math.random() * 3)],
							// 		spritePartsPaths.current.ears[0],
							// 		spritePartsPaths.current.weapon[0],
							// 	];

							// 	console.log(spritePartsFilePathsTempJSON);

							// 	for (let i2YX2 = 0; i2YX2 < 9; i2YX2++) {
							// 		this.load.spritesheet(
							// 			String("NPCSpriteSheet_" + String(i2YX2) + "_Var_" + i),
							// 			spritePartsFilePathsTempJSON[i2YX2],
							// 			{
							// 				frameWidth: 64,
							// 				frameHeight: 64,
							// 			}
							// 		);
							// 	}
							// }

							//
							console.log(this);
							//	this.state.add("StateMain", StateMain);
							var preloadImage = this.load;
							userEXPRef.current = {
								loaded: false,
								powerLevel: 1,
								reputation: 0,
								fame: 0,
								stamina: 0,
								strength: 0,
								charisma: 0,
								intelligence: 0,
								botany: 0,
								crafting: 0,
								melee: 0,
								ranged: 0,
								holy: 0,
								dark: 0,
								x: 0,
								y: 0,
							};

							var db2 = firebase.firestore();
							db2
								.collection("UserGameMeta")
								.doc(auth.currentUser.uid)
								.get()
								.then((expData) => {
									//					console.log(userEXPRef.current);

									if (expData.data()) {
										console.log(expData.data().expData);
										userEXPRef.current = expData.data().expData;
									}

									userEXPRef.current.loaded = true;

									console.log("EXP Data");

									let dbData02 = {};
									var db = firebase.firestore();
									db
										.collection("Users")
										.doc(auth.currentUser.uid)
										.get()
										.then((ele6) => {
											var key = ele6.id;
											var data = ele6.data();
											data["key"] = key;
											dbData02[key] = data;

											let dbDataArray01 = Object.values(dbData02);

											this.userDatabase.push(dbDataArray01[0]);
											console.log(dbDataArray01[0]);

											window.userDatabase = this.userDatabase;
											//
											//start loader
											//
										});
								});
							window.liveGameDataArray.forEach((ele, index) => {
								//
								importedSpriteCounter.current++;
								//
								//
								var canvasNewAni = document.createElement("canvas");
								var w = 64;
								var h = 64;
								canvasNewAni.width = w;
								canvasNewAni.height = h;
								canvasNewAni.id =
									"SavedCanvasID" + parseInt(importedSpriteCounter.current);
								document
									.getElementById("OffScreenRenderContainer")
									.appendChild(canvasNewAni);
								//
								//
								var savedCanvas = document.getElementById(
									`SavedCanvasID${parseInt(importedSpriteCounter.current)}`
								);
								var ctxIterator = savedCanvas.getContext("2d");
								//
								//
								var img = new Image();
								img.src = ele.images[0];
								//						console.log(index + " " + img.src.length);
								ctxIterator.drawImage(
									img,
									0,
									0,
									64 * drawScale.current,
									64 * drawScale.current
								);
								var img2 = new Image();
								//Separate Properties, Create Image
								img2.src = savedCanvas.toDataURL("image/png", 1);
								if (ele.key === "Hero") {
									let image = new Image();
									image.src = ele.images[0];
									this.textures.addSpriteSheet("block", image, {
										frameWidth: 64,
										frameHeight: 64,
									});
									//
								}
								if (ele.meta === "plant") {
									let image = new Image();
									image.src = ele.images[0];
									this.textures.addSpriteSheet(ele.key, image, {
										frameWidth: 64,
										frameHeight: 64,
									});

									//
								} else {
									let image = new Image();
									image.src = ele.images[0];
									this.textures.addSpriteSheet(ele.key, image, {
										frameWidth: 64,
										frameHeight: 64,
									});
								}
							});
							//
							//
							// db
							// 	.collection("Maps")
							// 	.doc("AA")
							// 	.get()
							// 	.then((doc) => {
							// 		doc.data().Background.forEach((el) => {
							// 			//

							// 			console.log(preloadImage);

							// 			//
							// 		});
							// 	});

							// Map Current Map Array To Tiles

							GenerateMapData(this, preloadImage);

							this.load.image("yellowParticle", "images/yellow.png");

							this.load.image("whiteParticle", "images/whiteParticle.png");

							this.load.image(
								"whiteHarderParticle",
								"images/whiteHarderParticle.png"
							).depth = 1;

							this.load.image(
								"whiteHarderParticle",
								"images/whiteHarderParticle.png"
							).depth = 1;

							this.whiteParticle = this.add.particles("whiteParticle");

							this.whiteHarderParticle = this.add.particles(
								"whitePawhiteHarderParticle"
							);
							this.yellowParticle = this.add.particles("yellowParticle");

							var particle = this.load.image(
								"blueParticle",
								"images/blueParticle.png"
							);

							this.bullet = this.load.image(
								"Bullet",
								"images/whiteHarderParticle.png"
							);

							var progress = this.add.graphics();

							this.load.on("progress", function (value) {
								progress.clear();
								progress.fillStyle(0xccccff, 1);
								progress.fillRect(0, 270, window.innerWidth * value, 60);
							});

							this.load.on("complete", function () {
								if (userEXPRef.current.loaded === true) {
									progress.destroy();
								}
							});

							this.load.spritesheet("TestPlant", "images/spriteSheetSprout.png", {
								frameWidth: 64,
								frameHeight: 64,
								endFrame: 2,
							});
						}

						create() {
							///
							////
							C2Fun(this);

							window.useInventoryItem = (props) => {
								if (props.includes("Seed")) {
									console.log(props);
									console.log(props);
									console.log(props);
									this.plantGroup
										.create(this.player.x, this.player.y, "terrainSheet")
										.setPipeline("Light2D")
										.setScale(1)
										.setFrame(937)
										.setInteractive()
										.setDepth(20000 + this.player.y - 32).name =
										"plant_" +
										props.replace(/Seed/gi, "").replace(/ /gi, "") +
										"_age_" +
										window.gameTime;
								} else {
									this.plantGroup
										.create(this.player.x, this.player.y, "terrainSheet")
										.setPipeline("Light2D")
										.setScale(1)
										.setFrame(937)
										.setInteractive()
										.setDepth(20000 + this.player.y - 32).name =
										"plant_" + props + "_age_" + window.gameTime;
								}
							};

							window.GameInput = this.input;
							//
							// Create Character Spritesheets
							CreateSpriteSheet(this, userEXPRef, activeSheetKeyframeGroups);
							// Load Sheets Anims

							//
							this.map = this.make.tilemap({ key: "map2" });

							this.map2 = this.make.tilemap({ key: "map2" });

							this.map3 = this.make.tilemap({ key: "map3" });

							this.map4 = this.make.tilemap({ key: "map3" });

							this.map5 = this.make.tilemap({ key: "map5" });

							var tiles = this.map.addTilesetImage("tilemap4", "tilemap4");

							var tiles2 = this.map2.addTilesetImage("tilemap4", "tilemap4");

							var tiles3 = this.map3.addTilesetImage("tilemap", "tilemap");

							var tiles5 = this.map5.addTilesetImage("tilemap3", "tilemap3");

							console.log(this.tilemapAsJSON);
							console.log(this.map);

							this.mapLayer = this.map
								.createLayer(0, tiles, -window.mapSize, -window.mapSize)
								.setPipeline("Light2D")
								.setAlpha(1);

							this.mapLayer2 = this.map2
								.createLayer(0, tiles2, -window.mapSize, -window.mapSize)
								.setPipeline("Light2D")
								.setAlpha(1);

							this.mapLayer3 = this.map3
								.createLayer(0, tiles3, -window.mapSize, -window.mapSize)
								.setPipeline("Light2D")
								.setAlpha(1)
								.setDepth(40000);

							this.mapLayer4 = this.map4
								.createLayer(0, tiles3, -window.mapSize, -window.mapSize)
								.setPipeline("Light2D")
								.setAlpha(1);

							this.mapLayer5 = this.map5
								.createLayer(0, tiles5, -window.mapSize, -window.mapSize)
								.setPipeline("Light2D")
								.setAlpha(1);

							var rt = this.add.renderTexture(0, 0, -window.mapSize, -window.mapSize);
							rt.draw(this.mapLayer);

							this.map.setCollision([
								14, 15, 16, 20, 21, 22, 23, 24, 25, 27, 28, 29, 33, 39, 40,
							]);

							this.debugGraphics = this.add.graphics();

							this.input.keyboard.on("keydown-P", function (event) {
								showProfilePage = !showProfilePage;
							});

							this.input.keyboard.on("keydown-B", function (event) {
								showBuildingPage = !showBuildingPage;
							});

							this.input.keyboard.on("keydown-TWO", function (event) {
								showCollidingTiles = !showCollidingTiles;
								window.drawDebug();
							});

							this.input.keyboard.on("keydown-THREE", function (event) {
								showFaces = !showFaces;
								window.drawDebug();
							});

							var tileColor = showTiles
								? new Phaser.Display.Color(105, 210, 231, 200)
								: null;
							var colldingTileColor = showCollidingTiles
								? new Phaser.Display.Color(243, 134, 48, 200)
								: null;
							var faceColor = showFaces
								? new Phaser.Display.Color(40, 39, 37, 255)
								: null;

							this.map.renderDebug(this.debugGraphics, {
								tileColor: tileColor, // Non-colliding tiles
								collidingTileColor: colldingTileColor, // Colliding tiles
								faceColor: faceColor, // Interesting faces, i.e. colliding edges
							});

							var endTestTimeVar = new Date();
							const diffTime = Math.abs(startTestTimeVar - endTestTimeVar);
							console.log("");
							console.log("%cTest Time Results:", "color:yellow;");
							console.log(diffTime);
							console.log("");

							this.input.on("gameobjectdown", function (pointer, propObj) {
								window.runDestroyPlant = function () {
									async function runFunction() {
										let useEmulator = false;
										if (window.location.pathname === "/game") {
											console.log("Sending 25s Interval Status");
											require("firebase/functions");

											async function sendRequest(props) {
												//Emulator local url for development:
												let fetchURL = "";
												const urlLocal = `http://localhost:5001/ohana-rpg/us-central1/UserApproveEXP`;

												// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)
												//Live  url:
												const urlLive =
													"https://us-central1-ohana-rpg.cloudfunctions.net/UserApproveEXP";

												if (useEmulator && window.location.hostname.includes("localhost")) {
													fetchURL = urlLocal;
												} else {
													fetchURL = urlLive;
												}

												//Send Details
												const rawResponse = await fetch(fetchURL, {
													method: "POST",
													mode: "cors",
													headers: new Headers({
														"Content-Type": "application/json",
														Accept: "application/json",
														HeaderTokens: JSON.stringify({
															refreshToken: auth.currentUser.refreshToken,
															authDomain: auth.currentUser.authDomain,
															uid: auth.currentUser.uid,
															email: auth.currentUser.email,
															hostname: auth.currentUser.hostname,
															gameMeta: {
																x: heroSpriteX.current.x,
																y: heroSpriteX.current,
															},
															hostname2: window.location.hostname,
														}),
													}),
													body: JSON.stringify({
														UUID: auth.currentUser.uuid,
														userExp: userEXPRef.current,
														userInv: window.UserInventoryJSON,
														playerCoords: {
															x: heroSpriteX.current,
															y: heroSpriteY.current,
														},
													}),
												});
												console.log(rawResponse);
											}
											sendRequest();
										}
									}

									userEXPRef.current.botany++;
									propObj.destroy();

									//
									runFunction();
									//
								};
							});

							this.anims.create({
								key: "run",
								frames: "TestPlant",
								frameRate: 0.1,
								repeat: 0,
							});

							const layer = this.add.layer();

							// console.log(game);
							// console.log(this);
							// console.log(Phaser);
							// console.log(Phaser.Scene);

							this.bouncersGroup = this.physics.add.group();
							var connectedPlayersGroup = this.physics.add.group();
							var connectedPlayersPointerGroup = this.physics.add.group();

							var staticType = this.physics.add.group();
							this.plantGroup = this.physics.add.group();
							this.toolObjects = this.physics.add.group();
							this.itemDropsGroup = this.physics.add.group();
							this.monsterGroup = this.physics.add.group({
								bounceX: 0.01,
								bounceY: 0.01,
							});

							this.bulletGroup = this.physics.add.group({
								bounceX: 0.01,
								bounceY: 0.01,
							});

							var group = this.physics.add.group({
								bounceX: 0.1,
								bounceY: 0.1,
							});

							//  Set the camera and physics bounds
							this.cameras.main.setBounds(
								-window.mapSize,
								-window.mapSize,
								window.mapSize * 2,
								window.mapSize * 2
							);
							this.physics.world.setBounds(
								-window.mapSize,
								-window.mapSize,
								window.mapSize * 2,
								window.mapSize * 2
							);

							//

							this.physics.add.collider(
								this.bulletGroup,
								this.monsterGroup,
								function (bodyA, bodyB) {
									if (bodyB.hitCounter === undefined) {
										bodyB.hitCounter = 0;
									} else {
										bodyB.hitCounter++;
									}
									//	console.log(bodyB.hitCounter);
									// console.log("BulletHitMonster");
									bodyA.destroy();
									bodyB.setTint("0xff0000");
									setTimeout(() => {
										bodyB.clearTint();
									}, 250);
									if (bodyB.hitCounter > 10) {
										console.log("BulletPopMonster");

										bodyB.destroy();
										userEXPRef.current.reputation++;
										userEXPRef.current.ranged++;
										async function runSendFunction() {
											let useEmulator = false;
											if (window.location.pathname === "/game") {
												console.log("Sending 25s Interval Status");
												require("firebase/functions");

												async function sendRequest(props) {
													//Emulator local url for development:
													let fetchURL = "";
													const urlLocal = `http://localhost:5001/ohana-rpg/us-central1/UserApproveEXP`;

													// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)
													//Live  url:
													const urlLive =
														"https://us-central1-ohana-rpg.cloudfunctions.net/UserApproveEXP";

													if (
														useEmulator &&
														window.location.hostname.includes("localhost")
													) {
														fetchURL = urlLocal;
													} else {
														fetchURL = urlLive;
													}

													//Send Details
													const rawResponse = await fetch(fetchURL, {
														method: "POST",
														mode: "cors",
														headers: new Headers({
															"Content-Type": "application/json",
															Accept: "application/json",
															HeaderTokens: JSON.stringify({
																refreshToken: auth.currentUser.refreshToken,
																authDomain: auth.currentUser.authDomain,
																uid: auth.currentUser.uid,
																email: auth.currentUser.email,
																hostname: auth.currentUser.hostname,
																gameMeta: {
																	x: heroSpriteX.current.x,
																	y: heroSpriteX.current,
																},
																hostname2: window.location.hostname,
															}),
														}),
														body: JSON.stringify({
															UUID: auth.currentUser.uuid,
															userExp: userEXPRef.current,
															userInv: window.UserInventoryJSON,
															playerCoords: {
																x: heroSpriteX.current,
																y: heroSpriteY.current,
															},
														}),
													});
													console.log(rawResponse);
												}
												sendRequest();
											}
										}
										runSendFunction();
										console.log("MonsterDestroyed");
									}
								}
							);
							// i

							/*
													(Math.random() < 0.5
														? -1 * Math.random() * 2000
														: 1 * Math.random() * 2000)


														*/
							window.liveGameDataArray.forEach((ele, index) => {
								if (ele.meta === "monster") {
									this.monsterGroup
										.create(ele.x, ele.y, ele.key)
										.setDepth(ele.y + 20000)
										.setDrag(200)
										.setCollideWorldBounds(true)
										.setPipeline("Light2D")
										.setAlpha(0.9)
										.setInteractive()
										.setVelocity(0)
										.setScale(ele.spriteScale || 0.2)
										.setName(ele.meta + "_" + ele.key);
									// monster.create(
									// 	360 + Math.random() * 200,
									// 	120 + Math.random() * 200,
									// 	ele.key
									// );
								}
								if (ele.meta === "static") {
									staticType
										.create(ele.x, ele.y, ele.key)
										.setDepth(ele.y + 20000)
										.setCollideWorldBounds(true)
										.setPipeline("Light2D")
										.setAlpha(0.9)
										.setScale(ele.spriteScale || 0.2)
										.setImmovable();
								}
								if (ele.meta === "plant") {
									if (ele.harvested === true) {
										console.log("Hiding Harvested");
									} else {
										this.plantGroup
											.create(ele.x, ele.y, ele.key)
											.setDepth(ele.y + 20000)
											.setFrame(2)
											.setInteractive()
											.setPipeline("Light2D")
											.setAlpha(0.9)
											.setScale(0.15)
											.setName(ele.meta);

										//	console.log(this.plantGroup);
									}
								}
							});

							this.input.on("pointerdown", changeTexture);

							/////
							// var bouncers = this.physics.add.group({
							// 	key: "Monster",
							// 	quantity: 154,
							// 	bounceX: 0.5,
							// 	bounceY: 0.5,
							// 	collideWorldBounds: true,
							// 	velocityX: 300,
							// 	velocityY: 150,
							// });
							// Phaser.Actions.RandomRectangle(
							// 	bouncers.getChildren(),
							// 	this.physics.world.bounds
							// );
							// ////
							// this.physics.add.collider(bouncers);
							//

							var sendMouseInput = this.input;
							var sendKeyInput = this.input;
							var sendPlayerInfo = this.player;
							var sendPlayerMove;
							this.connectedPlayer = { id: "x", x: 1, y: 1 };
							var connectedPlayer = this.connectedPlayer;
							//

							// Init
							console.log("RTC1");
							console.log("%cInit RTC", "color:blue;");
							let confirmedRTCLinks = [];
							var peer = new Peer();
							// Get ID
							peer.on("open", openRTC);
							function openRTC(e) {
								console.log(" RTC 2");
								console.log("RTC Open, Sending IDs");
								console.log(e);
								window.thisUserRTCId = e;
								let dbData2 = {};
								let data2 = {};
								var db = firebase.firestore();
								db.collection("RTCClients").doc(e).set({
									id: e,
									timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
								});

								//
								//
								//
								function runRTCConnect() {
									console.log(" ");
									console.log("RTC Interval 1");
									db
										.collection("RTCClients")
										.get()
										.then((userData) => {
											userData.forEach((doc) => {
												var key = doc.id;
												var data = doc.data();
												data2["key"] = key;
												dbData2[key] = data;
											});
											window.localRTCDataArray = Object.values(dbData2);
											console.log(" ");
											console.log(window.localRTCDataArray);
											//
											//
											setInterval(() => {
												setTimeout(() => {
													AttemptEstablishWS();
												}, 1000);

												setTimeout(() => {
													AttemptEstablishWS();
												}, 5000);

												setTimeout(() => {
													AttemptEstablishWS();
												}, 30000);
											}, 60000);
											//
											// Updating RTC TimeStamp
											try {
												// Todo: If RTC In Collection, Do not add
												// db.collection("RTCClients").doc(e).set({
												// 	id: e,
												// 	timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
												// });
											} catch (error) {}
											console.log("RTC Link Finished");
										});

									function AttemptEstablishWS() {
										window.localRTCDataArray.forEach((ele, index) => {
											if (JSON.stringify(ele).includes(JSON.stringify(e))) {
												window.localRTCDataArray.splice(index, 1);
												// console.log("");
												// console.log(" RTC Int 2");
												// console.log(" RTC Has ELE ID");
											}
											if (
												JSON.stringify(confirmedRTCLinks).includes(
													JSON.stringify(ele.id)
												) === false
											) {
												// console.log("");
												// console.log(" RTC Int 3");
												// console.log("Comparing To Stale Connections");
												function isFunction(functionToCheck) {
													return (
														functionToCheck &&
														{}.toString.call(functionToCheck) === "[object Function]"
													);
												}
												if (
													(ele.id && JSON.stringify(ele.id).includes(e)) ||
													(ele.timeStamp &&
														new Date(
															(isFunction(ele.timeStamp.toDate) && ele.timeStamp.toDate()) ||
																ele.timeStamp
														) -
															new Date(Date.now()) <
															-60000 * 2.1)
												) {
													window.localRTCDataArray.splice(index, 1);
													//		console.log(" Ignoring Own ID & Stale");
												} else {
													console.log("%cAttempting New RTC At:", "color: green;");
													console.log(ele.id);
													setTimeout(() => {
														var c = peer.connect(ele.id);
														c.on("open", function () {
															//
															//
															console.log("%cConnection Opened!", "color: green;"); //
															c.send({
																meta: "ConnStart",
																RTCdata: JSON.stringify(confirmedRTCLinks),
															});
															//
															setInterval(() => {
																console.log("Sending 5s Conn Data: ");
																//							console.log(c);
																c.send({
																	meta: "ConnStart",
																	RTCdata: JSON.stringify(confirmedRTCLinks),
																});
															}, 5000);

															//
															setTimeout(() => {
																console.log(window.thisUserRTCId);
																c.send({
																	meta: "Login",
																	MidX: cam.midPoint.x,
																	MidY: cam.midPoint.y,
																	mouseX: sendKeyInput.activePointer.worldX || 0,
																	mouseY: sendKeyInput.activePointer.worldY || 0,
																	id: { id: window.thisUserRTCId, timeStamp: Date.now() },
																});
															}, 1000);
															//
															setTimeout(() => {
																console.log("Connection Established: ");
																console.log(c);
																c.send({
																	meta: "ConnStart",
																	RTCdata: JSON.stringify(confirmedRTCLinks),
																});
																console.log("Sending Login");
															}, 2000);

															//
															console.log("");
															console.log(" RTC Int 2");
															console.log(
																"%cConnection to New  RTC Established",
																"color: green;"
															);
															console.log(ele.id);
															//
															//				console.log(sendKeyInput.keyboard);
															//				console.log(sendKeyInput);
															var keyDownList = [];
															sendKeyInput.keyboard.on("keydown", function (keyProps) {
																keyDownList[keyProps.key] = true;
																// console.log(keyDownList);
																// console.log(keyDownList.keys.length);
																c.send({
																	meta: "Send",
																	MidX: cam.midPoint.x,
																	MidY: cam.midPoint.y,
																	id: { id: window.thisUserRTCId },
																});

																var keyDownInterval = setInterval(() => {
																	c.send({
																		meta: "Send",
																		MidX: cam.midPoint.x,
																		MidY: cam.midPoint.y,
																		id: { id: window.thisUserRTCId },
																	});

																	if (!keyDownList[keyProps.key]) {
																		clearInterval(keyDownInterval);
																	}
																}, 42);

																sendKeyInput.keyboard.on("keyup", function (keyProps) {
																	delete keyDownList[keyProps.key];
																});

																let sendCountVar = 0;
																setInterval(() => {
																	sendCountVar++;
																}, 50);
																sendMouseInput.on("pointermove", function () {
																	if (sendCountVar === 1) {
																		c.send({
																			meta: "MouseMoveData",
																			isClicking: sendKeyInput.activePointer.isDown,
																			mouseX: sendKeyInput.activePointer.worldX,
																			mouseY: sendKeyInput.activePointer.worldY,
																			MidX: cam.midPoint.x,
																			MidY: cam.midPoint.y,
																			id: { id: window.thisUserRTCId },
																		});
																	}
																	sendCountVar = 0;
																});
															});

															console.log(" ");
															console.log("Setting data send listeners");
															console.log(" ");

															sendMouseInput.on("pointerdown", function (pointer) {
																this.mouseDown = true;
																c.send({
																	meta: "Click",
																	userID: auth.currentUser.uid,
																	mouseX: sendKeyInput.activePointer.worldX,
																	mouseY: sendKeyInput.activePointer.worldY,
																	ScrollX: cam.scrollX,
																	ScrollY: cam.scrollY,
																	MidX: cam.midPoint.x,
																	MidY: cam.midPoint.y,
																	winW: window.innerWidth,
																	id: { id: window.thisUserRTCId },
																});

																var mouseInterval = setInterval(() => {
																	if (this.mouseDown) {
																		c.send({
																			meta: "Click",
																			userID: auth.currentUser.uid,
																			mouseX: sendKeyInput.activePointer.worldX,
																			mouseY: sendKeyInput.activePointer.worldY,
																			ScrollX: cam.scrollX,
																			ScrollY: cam.scrollY,
																			MidX: cam.midPoint.x,
																			MidY: cam.midPoint.y,
																			winW: window.innerWidth,
																			winH: window.innerHeight,
																			id: { id: window.thisUserRTCId },
																		});
																	}
																	if (!this.mouseDown) {
																		clearInterval(mouseInterval);
																	}
																}, 42);
															});
															//
															sendMouseInput.on("pointerup", function (pointer) {
																this.mouseDown = false;
																c.send({
																	meta: "ClickUp",
																	userID: auth.currentUser.uid,
																	mouseX: sendKeyInput.activePointer.worldX,
																	mouseY: sendKeyInput.activePointer.worldY,
																	ScrollX: cam.scrollX,
																	ScrollY: cam.scrollY,
																	MidX: cam.midPoint.x,
																	MidY: cam.midPoint.y,
																	winW: window.innerWidth,
																	winH: window.innerHeight,
																	id: { id: window.thisUserRTCId },
																});
															});
															console.log("");
															console.log(" RTC Int 4");
															//		c.send("RTC Link Established ");
															//	c.send(ele.id);
															confirmedRTCLinks.push(window.localRTCDataArray[index]);
															//		window.localRTCDataArray.splice(index, 1);
															console.log(window.localRTCDataArray);
															console.log(confirmedRTCLinks);
															console.log("");
															console.log(" RTC  Fin");
															console.log("");
														});
													}, 100 * index);
												}
											}
										});
									}
								}

								setTimeout(() => {
									runRTCConnect();
								}, 2500);

								//
								//
								setInterval(() => {
									runRTCConnect();
								}, 240000);
							}
							//

							if (window.location.pathname === "/game") {
								console.log("Creating Intervals DB Check Intervals Effect");
								// Send Your Status Two Minutes  || 2min
								window.playerLoggedInReport = setInterval(() => {
									async function sendBackendReport() {
										if (window.location.pathname === "/game") {
											console.log("Sending 2m Backend Status Report");
											require("firebase/functions");

											async function sendRequest(props) {
												//Emulator local url for development:
												const urlLive =
													"https://us-central1-ohana-rpg.cloudfunctions.net/LoadPlayerIntoGame";

												//Send Details
												fetch(urlLive, {
													method: "POST",
													mode: "cors",
													headers: new Headers({
														"Content-Type": "application/json",
														Accept: "application/json",
														HeaderTokens: JSON.stringify({
															refreshToken: auth.currentUser.refreshToken,
															authDomain: auth.currentUser.authDomain,
															uid: auth.currentUser.uid,
															email: auth.currentUser.email,
															hostname: auth.currentUser.hostname,
															gameMeta: { x: heroSpriteX.current.x, y: heroSpriteX.current },
															hostname2: window.location.hostname,
														}),
													}),
													body: JSON.stringify({
														UUId: auth.currentUser.uuid,
														RTCId: window.thisUserRTCId,
													}),
												});
											}
											sendRequest();
										} else {
											clearInterval(window.playerLoggedInReport);
										}
									}
									sendBackendReport();
								}, 120000);
							} else {
								return null;
							}

							//

							window.localRTCDataArray = [];
							CreateWSConnection(
								this,
								peer,
								connectedPlayersGroup,
								connectedPlayersPointerGroup,
								confirmedRTCLinks,
								window.localRTCDataArray
							);

							function changeTexture() {
								console.log("Running Click Function");
								// sprite.smoothed = false;
							}

							this.cursors = this.input.keyboard.addKeys({
								w: Phaser.Input.Keyboard.KeyCodes.W,
								s: Phaser.Input.Keyboard.KeyCodes.S,
								a: Phaser.Input.Keyboard.KeyCodes.A,
								d: Phaser.Input.Keyboard.KeyCodes.D,
								up: Phaser.Input.Keyboard.KeyCodes.UP,
								down: Phaser.Input.Keyboard.KeyCodes.DOWN,
								left: Phaser.Input.Keyboard.KeyCodes.LEFT,
								right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
								shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
								one: Phaser.Input.Keyboard.KeyCodes.ONE,
								two: Phaser.Input.Keyboard.KeyCodes.TWO,
								three: Phaser.Input.Keyboard.KeyCodes.THREE,
								four: Phaser.Input.Keyboard.KeyCodes.FOUR,
								five: Phaser.Input.Keyboard.KeyCodes.FIVE,
								six: Phaser.Input.Keyboard.KeyCodes.SIX,
								seven: Phaser.Input.Keyboard.KeyCodes.SEVEN,
								eight: Phaser.Input.Keyboard.KeyCodes.EIGHT,
								nine: Phaser.Input.Keyboard.KeyCodes.NINE,
								zero: Phaser.Input.Keyboard.KeyCodes.ZERO,
							});

							this.mouse = this.input.mouse;

							this.player = this.physics.add.image(
								userEXPRef.current.x,
								userEXPRef.current.y,
								"block"
							);

							this.player.setCollideWorldBounds(true);

							this.player.setVisible(false);

							this.cameras.main.startFollow(this.player, true);

							if (userEXPRef.current.loaded === true) {
								setTimeout(() => {
									console.log(this.playerGroup.children.entries[0]);
									this.cameras.main.startFollow(
										this.playerGroup.children.entries[0],
										true
									);

									this.physics.add.collider(this.monsterGroup, this.playerGroup);
								}, 250);
							}

							this.physics.add.collider(this.monsterGroup, this.monsterGroup);

							this.physics.add.collider(this.player, group);

							this.physics.add.collider(this.player, this.monsterGroup);

							this.physics.add.collider(this.monsterGroup, monster);

							this.physics.add.collider(this.monsterGroup, staticType);

							this.physics.add.collider(this.bulletGroup, this.bulletGroup);

							//			this.physics.add.collider(this.player, staticType);
							//
							//
							//
							var cam = this.cameras.main;
							console.log(this.input);
							//
							//
							var sizer = new Phaser.Structs.Size(
								this.scene.width,
								this.scene.height,
								Phaser.Structs.Size.FIT,
								this.scene.parent
							);

							this.scale.on("resize", resize, this);
							function resize(gameSize, baseSize, displaySize, resolution) {
								const width = gameSize.width;
								const height = gameSize.height;

								gameSize.setSize(window.innerWidth, window.innerHeight);

								const camera = this.cameras.main;

								const scaleX = sizer.width;
								const scaleY = sizer.height;

								this.cameras.resize(width, height);

								camera.setZoom(Math.max(scaleX, scaleY));
								camera.centerOn(this.player.x, this.player.y);

								// 'this' means to the current scene that is running
							}
							// function resize(gameSize, baseSize, displaySize, resolution) {
							// 	this.cameras.resize(window.innerWidth, window.innerHeight);
							// }
							this.cameras.main.setZoom(zoomRef.current);
							//
							this.text = this.add
								.text(window.innerWidth / 2 - 53, window.innerHeight / 2 - 34)
								.setFontSize(22 / zoomRef.current)
								.setScrollFactor(0)
								.setDepth(400000)
								.setStyle({ align: "center" })
								.setColor("#ffffff");
							//a

							this.profileText = this.add
								.text(-100, -100)
								.setFontSize((16 / zoomRef.current) * 2)
								.setScrollFactor(0)
								.setStyle({ align: "left" })
								.setDepth(400000)
								.setColor("#ffffff");
							///

							this.buildingText = this.add
								.text(250, 250)
								.setFontSize((16 / zoomRef.current) * 2)
								.setScrollFactor(0)
								.setStyle({
									font: "36px 'Montserrat', sans-serif",
								})
								.setVisible(false)
								.setDepth(400001)
								.setColor("#ffffff");
							///

							this.profilePageText = this.add
								.text(250, 250)
								.setFontSize((16 / zoomRef.current) * 2)
								.setScrollFactor(0)
								.setStyle({
									font: "36px 'Montserrat', sans-serif",
								})
								.setVisible(false)
								.setDepth(41001)
								.setColor("#ffffff");
							///

							console.log(this.profileText);
							console.log(this.cameras.main);
							// Create Particles

							//Emitter
							CreateEmitters(this);

							// this.mouseEmitter.onParticleDeath(function (particle) {
							// 	particle.resetPosition();
							// 	particle.emitter.emitParticle();
							// });

							//				console.log(this.emitter);

							//

							this.lights.enable().setAmbientColor(0x5555aa);

							//		this.lights.addLight(-64, -64, 400000).setIntensity(1);

							console.log("%c Creating Sunlight", "color: lightBlue;");

							this.sunLight = this.lights
								.addLight(this.player.x, this.player.y, 40000000000000)
								.setIntensity(0.3);

							this.sunLight2 = this.lights
								.addLight(this.player.x - 750, this.player.y - 500, 40000000000000)
								.setIntensity(1);

							this.sunLight3 = this.lights
								.addLight(this.player.x - 100, this.player.y + 100, 40000000000000)
								.setIntensity(0.3);

							this.sunLight4 = this.lights
								.addLight(this.player.x - 100, this.player.y + 0, 40000000000000)
								.setIntensity(0.3);

							this.sunLight.isSunlight = true;
							this.sunLight2.isSunlight = true;
							this.sunLight3.isSunlight = true;
							this.sunLight4.isSunlight = true;

							this.player.setPipeline("Light2D").setAlpha(1);

							modifyTileMapRef.current = { tileId: [5] };

							coolDownRefs.current = {
								playerTP: 5,
								playerTPActive: false,
								playerBullet: 5,
								playerBulletCount: 0,
								playerBulletActive: false,
								playerStaticFieldCD: 25,
								playerStaticFieldCount: 0,
								playerStaticFieldActive: false,
								playerHolyHeal: 250,
								playerHolyHealActive: false,
								cullBulletGroup: 100,
								hundmsCount: 0,
							};

							this.input.setPollAlways();

							window.triggerUpdate = () => {
								this.hasUpdated = 0;
							};

							window.triggerUpdate();
							window.loadSpriteSheet();
							this.hasUpdated = 0;
							console.log(this.player);

							this.text2 = this.add.text(100, 150, "", {
								font: "20px Arial",
								backgroundColor: "#000000",
								fill: "#ffffff",
							});

							window.drawDebug = () => {
								var tileColor = showTiles
									? new Phaser.Display.Color(105, 210, 231, 200)
									: null;
								var colldingTileColor = showCollidingTiles
									? new Phaser.Display.Color(243, 134, 48, 200)
									: null;
								var faceColor = showFaces
									? new Phaser.Display.Color(40, 39, 37, 255)
									: null;

								this.debugGraphics.clear();

								// Pass in null for any of the style options to disable drawing that component
								this.map.renderDebug(this.debugGraphics, {
									tileColor: tileColor, // Non-colliding tiles
									collidingTileColor: colldingTileColor, // Colliding tiles
									faceColor: faceColor, // Interesting faces, i.e. colliding edges
								});

								helpText.setText(window.getHelpMessage());
							};

							window.getHelpMessage = () => {
								return (
									"Press 2 to toggle colliding tiles: " +
									(showCollidingTiles ? "on" : "off") +
									"\nPress 3 to toggle interesting faces: " +
									(showFaces ? "on" : "off")
								);
							};
							//
							helpText = this.add.text(-525, 250, window.getHelpMessage(), {
								fontSize: "18px",
								padding: { x: 10, y: 5 },
								backgroundColor: "#000000",
								fill: "#ffffff",
							});

							//

							this.input.addPointer(3);

							this.text3 = this.add.text(-300, 100, "Use up to 4 fingers at once", {
								font: "'Montserrat', sans-serif",
								fill: "#00ff00",
							});

							this.cursor = this.input.setDefaultCursor(
								"url(images/1x1.webp), pointer"
							);

							this.cursorImage = this.add
								.image(userEXPRef.current.x, userEXPRef.current.y, "cursorSelector")
								.setDepth(42000)
								.setPipeline("Light2D")
								.setScale(0.5)
								.setAlpha(0.9);

							console.log(this.cursor);

							//b
							//

							var tileMapImg = this.add
								.image(200, 300, "tilemap")
								.setScale(0.1)
								.setScrollFactor(0)
								.setDepth(40004)
								.setInteractive();
							var tileMapImg2 = this.add
								.image(400, 300, "tilemap2")
								.setScale(0.1)
								.setScrollFactor(0)
								.setDepth(40004)
								.setInteractive();
							var tileMapImg3 = this.add
								.image(200, 600, "tilemap3")
								.setScale(0.1)
								.setInteractive()
								.setDepth(40004)
								.setScrollFactor(0);

							var tileMapImg4 = this.add
								.image(400, 600, "tilemap4")
								.setScale(0.1)
								.setScrollFactor(0)
								.setDepth(40004)
								.setInteractive();

							this.buildingTextContainer = this.add
								.container(0, 0, [this.buildingText])
								.setDepth(40002)
								.setScrollFactor(0)
								.setDepth(40002)
								.setInteractive(
									new Phaser.Geom.Circle(0, 0, 1600),
									Phaser.Geom.Circle.Contains
								);

							this.input.setDraggable(tileMapImg);
							this.input.setDraggable(tileMapImg2);
							this.input.setDraggable(tileMapImg3);
							this.input.setDraggable(tileMapImg4);

							window.gameObject.tileMapGrid = window.gameObject.add
								.grid(
									0,
									0,
									tileMapImg4.width,
									tileMapImg4.height,
									32,
									32,
									null,
									null,
									0xffffff
								)
								.setScrollFactor(0)
								.setDepth(40003)
								.setInteractive();

							window.gameObject.tileMapGrid.visible = false;

							tileMapImg.on("pointerdown", function (pointer) {
								console.log("Clicked");
								tileMapImg.setScale(1);
								window.gameObject.tileMapGrid.visible = true;
							});
							tileMapImg2.on("pointerdown", function (pointer) {
								console.log("Clicked");
								tileMapImg2.setScale(1);
								window.gameObject.tileMapGrid.visible = true;
							});
							tileMapImg3.on("pointerdown", function (pointer) {
								console.log("Clicked");
								tileMapImg3.setScale(1);
								window.gameObject.tileMapGrid.visible = true;
							});
							tileMapImg4.on("pointerdown", function (pointer) {
								console.log("Clicked");
								window.gameObject.tileMapGrid.visible = true;
								//
								//
								tileMapImg4.setScale(1);
							});

							window.gameObject.tileMapGrid.on(
								"pointerdown",
								function (pointer, prop, prop2, prop3, prop4) {
									console.log("Clicked");
									console.log(pointer);
									console.log(prop);
									console.log(prop2);
									console.log(prop3);
									console.log(window.gameObject.tileMapGrid);
									console.log(tileMapImg4);
								}
							);
							this.buildingTextContainer.add(window.gameObject.tileMapGrid);
							this.buildingTextContainer.add(tileMapImg);
							this.buildingTextContainer.add(tileMapImg2);
							this.buildingTextContainer.add(tileMapImg3);
							this.buildingTextContainer.add(tileMapImg4);

							this.buildingTextContainer.on("pointerover", function (pointer) {
								tileMapImg.setScale(0.1).setX(200).setY(300);
								tileMapImg2.setScale(0.1).setX(400).setY(300);
								tileMapImg3.setScale(0.1).setX(200).setY(600);
								tileMapImg4.setScale(0.1).setX(400).setY(600);

								window.gameObject.tileMapGrid.visible = false;
							});
							//

							//
							this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
								gameObject.x = dragX;
								gameObject.y = dragY;
								window.gameObject.tileMapGrid.x = dragX;
								window.gameObject.tileMapGrid._displayOriginX =
									gameObject._displayOriginX;
								window.gameObject.tileMapGrid._displayOriginY =
									gameObject._displayOriginY;
								window.gameObject.tileMapGrid.y = dragY;
								window.gameObject.tileMapGrid.width = gameObject.width;
								window.gameObject.tileMapGrid.height = gameObject.height;
							});
							//
							selectedItemRef.current = { id: "hand" };
							//

							this.sprite.x = userEXPRef.current.x;
							this.sprite.y = userEXPRef.current.y;

							this.player.x = userEXPRef.current.x;
							this.player.y = userEXPRef.current.y;
							//

							//
							function getRandomColor() {
								var letters = "0123456789ABCDEF";
								var color = "";
								for (var i = 0; i < 6; i++) {
									color += letters[Math.floor(Math.random() * 16)];
								}
								return color;
							}
							console.log(getRandomColor());
							//
							// Create NPC :
							// Deploy NPC Sprite Part Combos
							// i = NPC_ID , i2 == NPC_Part
							this.totalNPCCount = 2;
							CreateNPCs(this);
							this.playerVelocity = { x: 0, y: 0 };
						}

						//// end create
						//

						//// begin update loop1

						update(time, delta) {
							if (userEXPRef.current.loaded === true) {
								window.gameTime = time;
								//Post Update Init Run Once
								if (this.initUpdateBool === false) {
									//

									//
									this.toolObjects
										.create(160, -160, "sheetVar1")
										.setCollideWorldBounds(true)
										.setPipeline("Light2D")
										.setScale(1)
										.setFrame(8)
										.setInteractive()
										.setVelocity(0)
										.setDepth(20000 - 170).name = "utility_Chest";

									setTimeout(() => {
										this.toolObjects.getChildren()[0].itemsInChest = { "Corn Seed": 500 };
									}, 250);
									// Light Flicker
									setInterval(() => {
										for (let i = 0; i < this.lights.lights.length; i++) {
											//		console.log(this.lights);

											if (this.lights.lights[i].isSunlight === false) {
												this.lights.lights[i].x += 5;
												setTimeout(() => {
													this.lights.lights[i].x -= 5;
												}, 100 + Math.random() * 400);

												setTimeout(() => {
													this.lights.lights[i].x -= 5;
												}, 200 + Math.random() * 400);

												setTimeout(() => {
													this.lights.lights[i].x += 10;
												}, 400 + Math.random() * 400);

												setTimeout(() => {
													this.lights.lights[i].x -= 10;
												}, 600 + Math.random() * 400);

												setTimeout(() => {
													this.lights.lights[i].x += 10;
												}, 800 + Math.random() * 400);

												setTimeout(() => {
													this.lights.lights[i].x -= 10;
												}, 1000 + Math.random() * 400);

												setTimeout(() => {
													this.lights.lights[i].x += 5;
												}, 1200 + Math.random() * 400);
											}
										}
									}, 2000);
									//

									//
									setTimeout(() => {
										console.log("NPC GROUP DATA");
										console.log(this.NPCSpritesGroup.length);
										console.log(this.NPCSpritesGroup);
										console.log("NPC GROUP DATA");
										//
										//
										//
										for (let i = 0; i < this.totalNPCCount; i++) {
											for (let i2 = 0; i2 < this.totalNPCCount; i2++) {
												this.physics.add.collider(
													this.NPCSpritesGroup[i],
													this.NPCSpritesGroup[i2],

													function (bodyA, bodyB) {
														// console.log(
														// 	bodyA.hasItems["Corn Seed"],
														// 	bodyB.hasItems["Corn Seed"]
														// );
														if (Math.random() > 0.8) {
															//
															var tempVar1 = parseInt(
																Math.floor(parseInt(bodyA.hasItems["Corn Seed"]) / 2)
															);
															var tempVar2 = Math.floor(
																parseInt(bodyB.hasItems["Corn Seed"]) / 2
															);

															var tempVar3 = tempVar1 + tempVar2;

															bodyA.hasItems["Corn Seed"] = tempVar3;

															bodyB.hasItems["Corn Seed"] = tempVar3;
															//			console.log(bodyA.hasItems);
														}
													}
												);
											}
											this.physics.add.collider(this.NPCSpritesGroup[i], this.playerGroup);

											this.physics.add.collider(
												this.NPCSpritesGroup[i],
												this.bouncersGroup,

												(bodyA, bodyB) => {
													//					console.log(bodyA);
													//					console.log(bodyB);
													//			console.log("Bouncer NPC Hit1!");
													if (bodyB.hitCounter === undefined) {
														bodyB.hitCounter = 0;
													} else {
														bodyB.hitCounter++;
													}
													//		console.log(bodyB.hitCounter);
													bodyB.setTint("0xff0000");
													setTimeout(() => {
														bodyB.clearTint();
													}, 250);
													if (bodyB.hitCounter > 5) {
														bodyB.destroy();
														userEXPRef.current.reputation++;
														console.log("MonsterDestroyed");
													}
												}
											);
										}

										var tempItemsGroup = this.itemDropsGroup;

										this.physics.add.collider(
											this.bulletGroup,
											this.bouncersGroup,
											function (bodyA, bodyB) {
												if (bodyB.hitCounter === undefined) {
													bodyB.hitCounter = 0;
												} else {
													bodyB.hitCounter++;
												}
												//			console.log(bodyB.hitCounter);
												bodyA.destroy();
												bodyB.setTint("0xff0000");
												setTimeout(() => {
													bodyB.clearTint();
												}, 250);
												if (bodyB.hitCounter > 10) {
													bodyB.destroy();
													//
													createItemDrop(tempItemsGroup, bodyB, time);
													//
													userEXPRef.current.ranged++;
													userEXPRef.current.reputation++;
													console.log("Monster Destroyed By BulletObject");
												}
											}
										);

										//
										this.physics.add.collider(
											this.itemDropsGroup,
											this.sprite,
											function (bodyA, bodyB) {
												console.log(bodyB);
												console.log(bodyB.name.split("_")[1]);
												if (bodyB.hitCounter === undefined) {
													bodyB.hitCounter = 0;
												} else {
													bodyB.hitCounter++;
												}
												//			console.log(bodyB.hitCounter);
												bodyB.destroy();
												bodyB.setTint("0xff0000");
												setTimeout(() => {
													bodyB.clearTint();
												}, 250);

												userEXPRef.current.botany++;
												var doesUserHaveItem = 0;

												console.log("%c Adding Item To Inventory", "color: lightBlue;");
												console.log(window.UserInventoryJSON);

												window.UserInventoryArray.forEach((elem4, index2) => {
													console.log(elem4[0]);
													if (bodyB.name.split("_")[0] === "seed") {
														if (elem4[0] === String(bodyB.name.split("_")[1] + " Seed")) {
															console.log(
																"%c Seed Type Item Name Is In Inventory",
																"color: lightBlue;"
															);
															doesUserHaveItem++;

															window.UserInventoryJSON[bodyB.name.split("_")[1] + " Seed"] =
																parseInt(elem4[1] + 1);

															console.log(window.UserInventoryJSON);
															window.UserInventoryArray[index2][1] = parseInt(elem4[1] + 1);
														}
													} else if (elem4[0] === bodyB.name.split("_")[1]) {
														console.log("No Type Item Name Is In Inventory");
														doesUserHaveItem++;
														console.log(elem4[0]);
														console.log(bodyB.name.split("_")[1]);
														if (elem4[0] === bodyB.name.split("_")[1]) {
															window.UserInventoryJSON[bodyB.name.split("_")[1]] = parseInt(
																elem4[1] + 1
															);

															window.UserInventoryArray[index2][1] = parseInt(elem4[1] + 1);
														}
													} else if (index2 === window.UserInventoryArray.length - 1) {
														console.log("Last Item In Array");
														if (doesUserHaveItem === 0) {
															if (bodyB.name.split("_")[0] === "seed") {
																console.log("Seed Type Item Not In Inventory");
																doesUserHaveItem++;

																window.UserInventoryJSON[bodyB.name.split("_")[1] + " Seed"] =
																	parseInt(1);

																window.UserInventoryArray.push([
																	String(bodyB.name.split("_")[1] + " Seed"),
																	1,
																]);
															} else if (doesUserHaveItem === 0) {
																if (bodyB.name.split("_")[0] !== "seed") {
																	console.log(
																		"%c Not Seed Type Item Not In Inventory",
																		"color: lightBlue;"
																	);
																	window.UserInventoryJSON[bodyB.name.split("_")[1]] =
																		parseInt(1);
																	window.UserInventoryJSON[bodyB.name.split("_")[1]] = 1;
																	console.log(
																		window.UserInventoryJSON[bodyB.name.split("_")[1]]
																	);
																}
															}
														}
													}
												});
												var tempEntries = Object.entries(window.UserInventoryJSON);
												window.UserInventoryArray = tempEntries;
												console.log("%c Item Picked Up Fin", "color: lightBlue;");
											}
										);
										//
										//
										for (let i = 0; i < this.totalNPCCount; i++) {
											this.physics.add.collider(
												this.NPCSpritesGroup[i],
												this.itemDropsGroup,
												function (bodyA, bodyB) {
													//			console.log(bodyB);
													// console.log(bodyA);
													// console.log(bodyB.name.split("_")[1]);
													if (bodyB.hitCounter === undefined) {
														bodyB.hitCounter = 0;
													} else {
														bodyB.hitCounter++;
													}
													//			console.log(bodyB.hitCounter);
													bodyB.setTint("0xff0000");
													setTimeout(() => {
														bodyB.clearTint();
													}, 250);

													userEXPRef.current.botany++;

													//					console.log("%c Adding Item To NPC", "color: lightBlue;");

													bodyA.hasItems[bodyB.name.split("_")[1] + " Seed"] += 1;

													bodyB.destroy();
												}
											);

											this.physics.add.collider(
												this.NPCSpritesGroup[i],
												this.monsterGroup,

												(bodyA, bodyB) => {
													//					console.log(bodyA);
													//					console.log(bodyB);
													//			console.log("Bouncer NPC Hit1!");
													if (bodyB.hitCounter === undefined) {
														bodyB.hitCounter = 0;
													} else {
														bodyB.hitCounter++;
													}
													//		console.log(bodyB.hitCounter);
													bodyB.setTint("0xff0000");
													setTimeout(() => {
														bodyB.clearTint();
													}, 250);
													if (bodyB.hitCounter > 5) {
														bodyB.destroy();
														userEXPRef.current.reputation++;
														console.log("MonsterDestroyed");
													}
												}
											);
										}
										this.physics.add.collider(this.monsterGroup, this.bouncersGroup);
									}, 250);

									this.physics.add.collider(this.sprite, this.bouncersGroup);
									this.physics.add.collider(this.mapLayer, this.bouncersGroup);
									this.physics.add.collider(this.mapLayer, this.monsterGroup);

									this.physics.add.collider(this.bouncersGroup, this.bouncersGroup);
									//

									console.log(this.playerGroup);

									for (let isps = 0; isps < spritePartsSockets.current.length; isps++) {
										this.physics.add.collider(
											this.mapLayer,
											this.playerGroup.getChildren()[isps]
										);
									}

									for (let i = 0; i < this.totalNPCCount; i++) {
										this.physics.add.collider(this.mapLayer, this.NPCSpritesGroup[i]);
									}

									console.log(this.input.keyboard);
									this.input.keyboard.keys[87].plugin.manager.preventDefault = false;

									setTimeout(() => {
										var curImg = this.cursorImage;
										var inputVar = this.input;

										var itemGroupVar = this.itemDropsGroup;

										this.input.on("gameobjectover", function (pointer, gameObject) {
											if (gameObject.name.includes("NPC")) {
												console.log(gameObject);
												curImg.setTint(0x00ff00);
												gameObject.setTint(0x00ff00);
											}
											if (gameObject.name.includes("plant")) {
												curImg.setTint(0x0000ff);
												gameObject.setTint(0x00ff00);
												console.log(gameObject);
												console.log(gameObject.name.split("_")[1]);
												if (gameObject.harvestReady) {
													curImg.setTint(0xffff00);

													window.harvestInterval = setInterval(() => {
														if (selectedItemRef.current.id === "Scythe") {
															if (inputVar.activePointer.isDown) {
																//
																itemGroupVar
																	.create(gameObject.x - 16, gameObject.y, "terrainSheet")
																	.setCollideWorldBounds(true)
																	.setPipeline("Light2D")
																	.setScale(1)
																	.setFrame(974)
																	.setDrag(250)
																	.setInteractive()
																	.setVelocity(0)
																	.setDepth(20032).name =
																	"seed_" + gameObject.name.split("_")[1] + "_age_" + time;
																//
																//
																itemGroupVar
																	.create(gameObject.x + 16, gameObject.y, "terrainSheet")
																	.setCollideWorldBounds(true)
																	.setPipeline("Light2D")
																	.setScale(1)
																	.setFrame(974)
																	.setDrag(250)
																	.setInteractive()
																	.setVelocity(0)
																	.setDepth(20032).name =
																	"food_" + gameObject.name.split("_")[1] + "_age_" + time;

																var getTileX = this.map.worldToTileX(gameObject.x);
																var getTileY = this.map.worldToTileY(gameObject.y);

																var tileAtNPC = this.map.getTileAt(getTileX, getTileY);

																tileAtNPC.properties.isOccupied = false;

																gameObject.destroy();
																clearInterval(window.harvestInterval);
															}
															curImg.setTint(0x00ff00);
														}
													}, 100);
												}
											}

											if (gameObject.name.includes("Chest")) {
												gameObject.itemsInChest = Object.assign(
													{},
													window.UserInventoryJSON
												);

												console.log(gameObject);
												curImg.setTint(0xffdd66);
												gameObject.setTint(0x00ff00);
												if (gameObject.name.includes("readyToHarvest")) {
													setInterval(() => {
														if (selectedItemRef.current.id === "Scythe")
															if (inputVar.activePointer.isDown) gameObject.destroy();
													}, 100);
												}
											}
											if (gameObject.name.includes("monster")) {
												curImg.setTint(0xff0000);
												gameObject.setTint(0xff0000);
											}
										});
										this.input.on("gameobjectout", function (pointer, gameObject) {
											clearInterval(window.harvestInterval);
											curImg.clearTint();
											try {
												gameObject.clearTint();
											} catch (error) {}
											//		console.log(gameObject);
										});
									}, 200);

									this.map2.putTilesAt(
										[
											[618, 618],
											[618, 618],
										],
										319,
										319
									);

									var startLight = this.lights
										.addLight(-128, -128, 1000)
										.setIntensity(0.5);

									this.playerLight = this.lights
										.addLight(-128, -128, 300)
										.setIntensity(0.5);

									this.mouseLight = this.lights
										.addLight(-128, -128, 120)
										.setIntensity(0.25);

									var gotTileData = require("./tilearray.json");

									console.log("LoadedTiles");

									console.log(gotTileData);
									console.log(gotTileData.length);

									console.log("%c Generating Tiles", "color: green;");
									for (let i = 0; i < gotTileData.length; i++) {
										//	console.log(gotTileData[i].tileId[0]);

										// Building 1
										if (
											(gotTileData[i].tileId[0] === [481, 482, 483, 484, 485],
											[513, 514, 515, 516, 517],
											[545, 546, 547, 548, 549],
											[577, 578, 579, 580, 581],
											[609, 610, 611, 612, 613] ||
												gotTileData[i].tileId[0] === 545 ||
												gotTileData[i].tileId[0] === 546 ||
												gotTileData[i].tileId[0] === 577 ||
												gotTileData[i].tileId[0] === 613 ||
												gotTileData[i].tileId[0] === 613 ||
												gotTileData[i].tileId[0] === 614 ||
												gotTileData[i].tileId[0] === 604 ||
												gotTileData[i].tileId[0] === 600)
										) {
											this.map4.putTilesAt(
												gotTileData[i].tileId,
												gotTileData[i].tileX,
												gotTileData[i].tileY
											);
										} else if (
											gotTileData[i].tileId[0] === 31 ||
											gotTileData[i].tileId[0] === 63 ||
											gotTileData[i].tileId[0] === 95 ||
											gotTileData[i].tileId[0] === 127
										) {
											this.map3.putTilesAt(
												gotTileData[i].tileId,
												gotTileData[i].tileX,
												gotTileData[i].tileY
											);
										} else if (gotTileData[i].tileId[0] === 159) {
											this.map3.putTilesAt(
												gotTileData[i].tileId,
												gotTileData[i].tileX,
												gotTileData[i].tileY
											);
											this.map
												.getTileAt(gotTileData[i].tileX, gotTileData[i].tileY)
												.setCollision(true, true, true, true);
											this.map
												.getTileAt(gotTileData[i].tileX + 1, gotTileData[i].tileY)
												.setCollision(true, true, true, true);
										} else {
											this.map2.putTilesAt(
												gotTileData[i].tileId,
												gotTileData[i].tileX,
												gotTileData[i].tileY
											);
										}
										if (gotTileData[i].tileId[0] === 159) {
											this.map
												.getTileAt(gotTileData[i].tileX, gotTileData[i].tileY)
												.setCollision(true, true, true, true);
											this.map
												.getTileAt(gotTileData[i].tileX + 1, gotTileData[i].tileY)
												.setCollision(true, true, true, true);
										}
										if (gotTileData[i].tileId[0] === 726) {
											this.map
												.getTileAt(gotTileData[i].tileX, gotTileData[i].tileY)
												.setCollision(true, true, true, true);
										}
										if (gotTileData[i].tileId[0] === 1360) {
											// console.log("%c Generating Tiles", "color: green;");

											// console.log(
											// 	this.map.getTileAt(gotTileData[i].tileX, gotTileData[i].tileY)
											// 		.pixelX
											// );
											// console.log(
											// 	this.map.getTileAt(gotTileData[i].tileX, gotTileData[i].tileY)
											// 		.pixelY
											// );

											this.lights
												.addLight(
													this.map.getTileAt(gotTileData[i].tileX, gotTileData[i].tileY)
														.pixelX -
														window.mapSize +
														16,
													this.map.getTileAt(gotTileData[i].tileX, gotTileData[i].tileY)
														.pixelY - window.mapSize,
													500
												)
												.setIntensity(0.5);

											this.map2.putTilesAt(
												[[1360]],
												gotTileData[i].tileX,
												gotTileData[i].tileY
											);
										}
										if (gotTileData[i].tileId[0] === 1147) {
											var tile = this.map
												.getTileAt(gotTileData[i].tileX, gotTileData[i].tileY)
												.setCollision(true, true, true, true);
											this.map2.putTilesAt(
												[[1147]],
												gotTileData[i].tileX,
												gotTileData[i].tileY
											);
										}
									}

									this.map2.putTilesAt([[1360]], 316, 316);

									console.log("LoadedTiles");

									// this.map.replaceByIndex(
									// 	tile.index,
									// 	modifyTileMapRef.current.tileId[0]
									// );

									setInterval(() => {
										startLight.x += 5;
										this.map2.putTilesAt([[1360]], 316, 316);

										setTimeout(() => {
											startLight.x -= 10;
											this.map2.putTilesAt([[1361]], 316, 316);
										}, 100 + Math.random() * 400);

										setTimeout(() => {
											startLight.x += 10;
											this.map2.putTilesAt([[1362]], 316, 316);
										}, 200 + Math.random() * 400);

										setTimeout(() => {
											startLight.x -= 10;
											this.map2.putTilesAt([[1363]], 316, 316);
										}, 400 + Math.random() * 400);

										setTimeout(() => {
											startLight.x += 10;
											this.map2.putTilesAt([[1362]], 316, 316);
										}, 600 + Math.random() * 400);

										setTimeout(() => {
											startLight.x -= 10;
											this.map2.putTilesAt([[1361]], 316, 316);
										}, 800 + Math.random() * 400);

										setTimeout(() => {
											startLight.x += 10;
											this.map2.putTilesAt([[1360]], 316, 316);
										}, 1000 + Math.random() * 400);

										setTimeout(() => {
											startLight.x -= 5;
											this.map2.putTilesAt([[1360]], 316, 316);
										}, 1200 + Math.random() * 400);
									}, 2000);

									console.log(this.sprite);
									console.log(userEXPRef.current.x);

									this.initUpdateBool = true;
								} else if (this.initUpdateBool === undefined) {
									this.initUpdateBool = false;
								}

								//
								//
								let tempVarCounter;
								if (tempVarCounter === undefined) tempVarCounter = 0;

								////

								if (coolDownRefs.current.hundmsCount <= 2) {
									this.sprite.x = userEXPRef.current.x;
									this.sprite.y = userEXPRef.current.y;

									this.player.x = userEXPRef.current.x;
									this.player.y = userEXPRef.current.y;

									for (let i = 0; i < this.totalNPCCount; i++) {
										if (this.NPCSpritesGroup[i]) {
											if (
												parseInt(
													this.NPCSpritesGroup[i].getChildren()[0].name.split("_")[1]
												) === i
											) {
												if (
													this.NPCSpritesGroup[i].getChildren()[0].isNearbyMonster ===
													undefined
												) {
													this.NPCSpritesGroup[i].getChildren()[0].isNearbyMonster = false;

													this.NPCSpritesGroup[i].getChildren()[0].isNearbyMonsterB = false;

													this.NPCSpritesGroup[i].getChildren()[0].hasItems = {
														"Corn Seed": 0,
													};
												}

												this.NPCSpritesGroup[i].getChildren()[0].isNearbyMonster =
													this.NPCSpritesGroup[i].getChildren()[0].isNearbyMonster;

												this.NPCSpritesGroup[i].getChildren()[0].isNearbyMonster =
													this.NPCSpritesGroup[i].getChildren()[0].isNearbyMonsterB;

												this.NPCSpritesGroup[i].getChildren()[0].x =
													this.NPCSpritesGroup[i].getChildren()[0].x;

												this.NPCSpritesGroup[i].getChildren()[0].y =
													this.NPCSpritesGroup[i].getChildren()[0].y;
											}
										}
									}
								}
								// Create BulletCullCD
								//
								if (time - coolDownRefs.current.cullBulletGroup > 100) {
									coolDownRefs.current.hundmsCount++;
									userEXPRef.current.x = this.sprite.x;
									userEXPRef.current.y = this.sprite.y;
									coolDownRefs.current.cullBulletGroup = time;

									//
									//
									//

									//a
									//
									//
									//

									for (let i = 0; i < this.bulletGroup.children.entries.length; i++) {
										//If Bullet Is StaticField
										if (this.bulletGroup.children.entries[0]) {
											if (
												this.bulletGroup.children.entries[i].name.split("_")[0] ===
													"StaticFieldBulletAge" &&
												parseInt(
													time - this.bulletGroup.children.entries[i].name.split("_")[1]
												) >= 250
											) {
												this.bulletGroup.children.entries[i].destroy();
											}

											// If Bullet is rockBullet
											else if (
												this.bulletGroup.children.entries[i].name.split("_")[0] ===
													"RockBulletAge" &&
												parseInt(
													time - this.bulletGroup.children.entries[i].name.split("_")[1]
												) >= 1250
											) {
												this.bulletGroup.children.entries[i].destroy();
											}
										}
									}
									this.emitter.lifespan.propertyValue = 1;
									this.emitter.stop();
								}
								////
								//Post Init UpdateLoop
								////
								////
								if (this.playerLight) {
									this.playerLight.x = this.sprite.x;
									this.playerLight.y = this.sprite.y + 32;

									this.cursorImage.x = this.input.activePointer.worldX;
									this.cursorImage.y = this.input.activePointer.worldY;

									this.mouseLight.x = this.input.activePointer.worldX;
									this.mouseLight.y = this.input.activePointer.worldY;

									this.mouseEmitter.setPosition(
										this.input.activePointer.worldX,
										this.input.activePointer.worldY
									);
								}

								//
								// Update Cursor
								if (this.lastCursorUpdate === undefined) {
									this.lastCursorUpdate = { lastRun: 0, counter: 0, rotation: 0 };
								}
								this.cursorImage.setRotation(this.lastCursorUpdate.rotation / 100);

								if (this.lastCursorUpdate.rotation > 36000) {
									this.lastCursorUpdate.rotation = 0;
								} else {
									this.lastCursorUpdate.rotation++;
								}
								if (time - this.lastCursorUpdate.lastRun > 100) {
									this.lastCursorUpdate.counter++;
									if (this.lastCursorUpdate.counter === 1) {
										this.cursorImage.setScale(0.5);
									} else if (this.lastCursorUpdate.counter === 10) {
										this.cursorImage.setScale(0.55);
									} else if (this.lastCursorUpdate.counter === 12) {
										this.cursorImage.setScale(0.55);
									} else if (this.lastCursorUpdate.counter === 15) {
										this.cursorImage.setScale(0.55);
										this.lastCursorUpdate.counter = 0;
									}

									this.lastCursorUpdate.lastRun = time;
								}
								//
								//
								// Update Monster Group Movements
								//this.monsterGroup
								if (this.lastMonsterGroupUpdate === undefined) {
									this.lastMonsterGroupUpdate = { lastRun: 0, counter: 0, rotation: 0 };
								}

								if (this.lastMonsterGroupUpdate.rotation > 36000) {
									this.lastMonsterGroupUpdate.rotation = 0;
								} else {
									this.lastMonsterGroupUpdate.rotation++;
								}

								if (this.plantGroupUpdate === undefined) {
									this.plantGroupUpdate = { lastRun: 0 };
									//
									//
								} else if (time - this.plantGroupUpdate.lastRun > 1111) {
									//									console.log(this.plantGroup.children.entries.length);

									for (
										let ipg = 0;
										ipg < this.plantGroup.children.entries.length;
										ipg++
									) {
										//	console.log(this.plantGroup.children.entries[ipg].name.split("_")[3])

										if (this.plantGroup.children.entries[ipg].name.includes("plant")) {
											if (
												this.plantGroup.children.entries[ipg].growStageCount === undefined
											) {
												this.plantGroup.children.entries[ipg].growStageCount = 0;
											}

											if (this.plantGroup.children.entries[ipg].growStageCount === 0) {
												if (
													time -
														parseInt(
															this.plantGroup.children.entries[ipg].name.split("_")[3]
														) >
													30000
												) {
													this.plantGroup.children.entries[ipg].setFrame(777);
													this.plantGroup.children.entries[ipg].growStageCount++;
												}
											}
											if (this.plantGroup.children.entries[ipg].growStageCount === 1) {
												if (
													time -
														parseInt(
															this.plantGroup.children.entries[ipg].name.split("_")[3]
														) >
													60000
												) {
													this.plantGroup.children.entries[ipg].setFrame(809);
													this.plantGroup.children.entries[ipg].growStageCount++;
												}
											} else if (
												this.plantGroup.children.entries[ipg].growStageCount === 2
											) {
												if (
													time -
														parseInt(
															this.plantGroup.children.entries[ipg].name.split("_")[3]
														) >
													90000
												) {
													this.plantGroup.children.entries[ipg].setFrame(809 + 32);
													this.plantGroup.children.entries[ipg].growStageCount++;
												}
											} else if (
												this.plantGroup.children.entries[ipg].growStageCount === 3
											) {
												if (
													time -
														parseInt(
															this.plantGroup.children.entries[ipg].name.split("_")[3]
														) >
													120000
												) {
													//		console.log(this.plantGroup.children.entries[ipg])

													this.plantGroup.children.entries[ipg].harvestReady = true;
													this.plantGroup.children.entries[ipg].setFrame(809 + 64);
													this.plantGroup.children.entries[ipg].growStageCount++;
												}
											}
										}
									}
									//
									this.plantGroupUpdate.lastRun = time;
								}

								//
								//
								if (time - this.lastMonsterGroupUpdate.lastRun > 300) {
									// Update every 300ms
									//

									NPCAIComponent(this, time);
									//			this.runUpdateGameObjects300MSInterval(time);
									for (
										let iDrops = 0;
										iDrops < this.itemDropsGroup.children.entries.length;
										iDrops++
									) {
										var distItemsAndSprite = Phaser.Math.Distance.BetweenPoints(
											this.itemDropsGroup.children.entries[iDrops],
											this.sprite
										);
										if (distItemsAndSprite < 400) {
											this.physics.moveToObject(
												this.itemDropsGroup.children.entries[iDrops],
												this.sprite,
												100
											);
										}
									}
								}

								////
								let relMouseX = this.input.activePointer.worldX;
								let relMouseY = this.input.activePointer.worldY;

								let angle = Phaser.Math.Angle.Between(
									this.player.x,
									this.player.y,
									relMouseX,
									relMouseY
								);

								this.playerVelocity.y =
									this.playerGroup.children.entries[0].body.velocity.y;
								this.playerVelocity.x =
									this.playerGroup.children.entries[0].body.velocity.x;

								let boundary = 180 - 45;
								let degrees = angle * 50 * 1.145 - 45;

								if (degrees < -boundary - 45) {
									this.playerFacingDirection = "left";
									if (this.playerVelocity.y === 0 && this.playerVelocity.x === 0) {
										this.sprite.setFrame(13 * 9);
										this.sprite2.setFrame(13 * 9);
										this.sprite3.setFrame(13 * 9);
										this.sprite4.setFrame(13 * 9);
										this.sprite5.setFrame(13 * 9);
										this.sprite6.setFrame(13 * 9);
										this.sprite7.setFrame(13 * 9);
										this.sprite8.setFrame(13 * 9);
										this.sprite9.setFrame(13 * 9);
									}
								} else if (-boundary - 45 <= degrees && degrees <= -boundary / 2) {
									//  Left
									this.playerFacingDirection = "up";
									if (this.playerVelocity.y === 0 && this.playerVelocity.x === 0) {
										this.sprite.setFrame(13 * 8);
										this.sprite2.setFrame(13 * 8);
										this.sprite3.setFrame(13 * 8);
										this.sprite4.setFrame(13 * 8);
										this.sprite5.setFrame(13 * 8);
										this.sprite6.setFrame(13 * 8);
										this.sprite7.setFrame(13 * 8);
										this.sprite8.setFrame(13 * 8);
										this.sprite9.setFrame(13 * 9);
									}
								} else if (-boundary / 2 <= degrees && degrees <= 0) {
									this.playerFacingDirection = "right";
									// Bottom Right
									if (this.playerVelocity.y === 0 && this.playerVelocity.x === 0) {
										this.sprite.setFrame(13 * 11);
										this.sprite2.setFrame(13 * 11);
										this.sprite3.setFrame(13 * 11);
										this.sprite4.setFrame(13 * 11);
										this.sprite5.setFrame(13 * 11);
										this.sprite6.setFrame(13 * 11);
										this.sprite7.setFrame(13 * 11);
										this.sprite8.setFrame(13 * 11);
										this.sprite9.setFrame(13 * 11);
									}
								} else if (0 <= degrees && degrees <= boundary / 2) {
									this.playerFacingDirection = "down";
									if (this.playerVelocity.y === 0 && this.playerVelocity.x === 0) {
										this.sprite.setFrame(13 * 10);
										this.sprite2.setFrame(13 * 10);
										this.sprite3.setFrame(13 * 10);
										this.sprite4.setFrame(13 * 10);
										this.sprite5.setFrame(13 * 10);
										this.sprite6.setFrame(13 * 10);
										this.sprite7.setFrame(13 * 10);
										this.sprite8.setFrame(13 * 10);
										this.sprite9.setFrame(13 * 10);
									}
								} else if (boundary / 2 <= degrees && degrees <= boundary) {
									this.playerFacingDirection = "left";
									if (this.playerVelocity.y === 0 && this.playerVelocity.x === 0) {
										this.sprite.setFrame(13 * 9);
										this.sprite2.setFrame(13 * 9);
										this.sprite3.setFrame(13 * 9);
										this.sprite4.setFrame(13 * 9);
										this.sprite5.setFrame(13 * 9);
										this.sprite6.setFrame(13 * 9);
										this.sprite7.setFrame(13 * 9);
										this.sprite8.setFrame(13 * 9);
										this.sprite9.setFrame(13 * 9);
									}
								}

								if (
									this.playerFacingDirectionLast !== this.playerFacingDirection ||
									this.playerAnimationLast !== activeSheetCurrentKeyframe.current
								) {
									this.isPlayerAnimated = true;
									console.log(this.playerFacingDirection);
									window.triggerUpdate();
								}
								this.playerAnimationLast = activeSheetCurrentKeyframe.current;
								this.playerFacingDirectionLast = this.playerFacingDirection;

								this.text3.setText([
									"pointer1.isDown: " + this.input.pointer1.isDown,
									"pointer2.isDown: " + this.input.pointer2.isDown,
									"pointer3.isDown: " + this.input.pointer3.isDown,
									"pointer4.isDown: " + this.input.pointer4.isDown,
								]);

								var message = [
									"Ohana RPG Alpha Development",
									"Time: " + Math.round(time),
									" FPS " + Math.round(1000 / delta),
									"\n Performance : " + Math.round(delta * 10000),
								];
								var worldPoint = this.input.activePointer.positionToCamera(
									this.cameras.main
								);

								message.push(
									"Mouse Position: " +
										Math.round(worldPoint.x) +
										", " +
										Math.round(worldPoint.y)
								);

								var tile = this.map.getTileAtWorldXY(worldPoint.x, worldPoint.y);

								if (tile) {
									HandleUserClick(this, worldPoint, time, tile, selectedItemRef);
									message.push(
										"\r\nTile Center Position: " +
											tile.getCenterX() +
											", " +
											tile.getCenterY()
									);
									message.push("Tile Properties: " + JSON.stringify(tile.properties));
									message.push("Tile Properties: " + JSON.stringify(tile.properties));
									//
									//
									tile.properties.viewed = true;
									if (tile.properties.viewedCount == null) {
										tile.properties.viewedCount = 0;
									}
									if (tile.properties.viewedCount < 101) {
										tile.properties.viewedCount++;
									}

									if (tile.properties.viewedCount === 10) {
										// console.log(tile);
										// if (showCollidingTiles) {
										// 	function hitSecretDoor() {
										// 		tile.properties.hasTouchedPlayer = true;
										// 	}
										// 	tile.setCollisionCallback(hitSecretDoor, true);
										// 	window.drawDebug();
										// 	//	this.physics.add.overlap(this.mapLayer, this.playerGroup);
										// 	this.physics.add.collider(this.mapLayer, this.playerGroup);
										// //	console.log(tile);
										// }
									}

									message.push(
										"Tile Bounds: " +
											tile.getLeft() +
											", " +
											tile.getTop() +
											" -> " +
											tile.getRight() +
											", " +
											tile.getBottom()
									);
								}

								this.text2.setText(message);

								//
								if (showProfilePage) {
									this.profilePageText
										.setText(
											`\r\n ${String(
												this.userDatabase &&
													this.userDatabase[0] &&
													this.userDatabase[0].userDisplayName
											)}
									\n

									\nPower Lvl: ${userEXPRef.current.powerLevel}
									\n
									\nReputation: ${userEXPRef.current.reputation}${"       "}Fame: ${
												userEXPRef.current.fame
											}${"       "}
									\nStamina: ${userEXPRef.current.stamina}${"         "}Strength: ${
												userEXPRef.current.strength
											}
									\nIntelligence: ${userEXPRef.current.intelligence}${"         "}Charisma: ${
												userEXPRef.current.charisma
											}${"      "}
									\r\nBotany: ${userEXPRef.current.botany}${"          "}Crafting: ${
												userEXPRef.current.crafting
											}
									\nMelee: ${userEXPRef.current.melee}${"          "}Ranged: ${
												userEXPRef.current.ranged
											}
									\nHoly: ${userEXPRef.current.holy}${"       "}Dark: ${userEXPRef.current.dark}

									`
										)
										.setVisible(true)
										.setBackgroundColor("0x222222DD")
										.setStyle({
											align: "center",
											font: "'Montserrat', sans-serif",
											lineSpacing: 20,
										})
										.setFontSize((12 / zoomRef.current) * 2)
										.setFixedSize(
											window.innerWidth / zoomRef.current - 200 / zoomRef.current,
											window.innerHeight / zoomRef.current - 200 / zoomRef.current
										);

									this.profilePageText.width = window.innerWidth;

									this.profilePageText.x =
										-(window.innerWidth / 2) / zoomRef.current +
										window.innerWidth / 2 +
										100 / zoomRef.current;

									this.profilePageText.y =
										-(window.innerHeight / 2) / zoomRef.current +
										window.innerHeight / 2 +
										zoomRef.current / 250 +
										100 / zoomRef.current;
								} else {
									this.profilePageText.setVisible(false);
								}

								if (showBuildingPage) {
									this.buildingText
										.setText(
											`\r\n
									Saved Construction Recipes: ${userEXPRef.current.powerLevel}
									\n

									`
										)
										.setVisible(true)
										.setBackgroundColor("0x222222DD")
										.setStyle({
											align: "center",
											font: "'Montserrat', sans-serif",
											lineSpacing: 20,
										})
										.setFontSize((12 / zoomRef.current) * 2)
										.setFixedSize(
											window.innerWidth / zoomRef.current - 200 / zoomRef.current,
											window.innerHeight / zoomRef.current - 200 / zoomRef.current
										);

									this.buildingTextContainer.setVisible(true);

									this.buildingText.width = window.innerWidth;

									this.buildingText.x =
										-(window.innerWidth / 2) / zoomRef.current +
										window.innerWidth / 2 +
										100 / zoomRef.current;

									this.buildingText.y =
										-(window.innerHeight / 2) / zoomRef.current +
										window.innerHeight / 2 +
										zoomRef.current / 250 +
										100 / zoomRef.current;
								} else {
									this.buildingTextContainer.setVisible(false);
								}

								//
								this.profileText
									.setText(
										this.userDatabase &&
											this.userDatabase[0] &&
											this.userDatabase[0].userDisplayName +
												//				"\r\nLahaina" +
												"\r\nLv:" +
												userEXPRef.current.powerLevel
									)
									.setFontSize((22 / zoomRef.current) * 2);

								this.profileText.x =
									-(window.innerWidth / 2) / zoomRef.current + window.innerWidth / 2;

								this.profileText.y =
									-(window.innerHeight / 2) / zoomRef.current + window.innerHeight / 2;

								this.player.x = this.sprite.x;
								this.player.y = this.sprite.y;

								this.sprite2.x = this.sprite.x;
								this.sprite2.y = this.sprite.y;
								this.sprite3.x = this.sprite.x;
								this.sprite3.y = this.sprite.y;
								this.sprite4.x = this.sprite.x;
								this.sprite4.y = this.sprite.y;
								this.sprite5.x = this.sprite.x;
								this.sprite5.y = this.sprite.y;
								this.sprite6.x = this.sprite.x;
								this.sprite6.y = this.sprite.y;
								this.sprite7.x = this.sprite.x;
								this.sprite7.y = this.sprite.y;
								this.sprite8.x = this.sprite.x;
								this.sprite8.y = this.sprite.y;
								this.sprite9.x = this.sprite.x;
								this.sprite9.y = this.sprite.y;

								//
								this.sprite.setVelocity(0);
								this.sprite2.setVelocity(0);
								this.sprite3.setVelocity(0);
								this.sprite4.setVelocity(0);
								this.sprite5.setVelocity(0);
								this.sprite6.setVelocity(0);
								this.sprite7.setVelocity(0);
								this.sprite8.setVelocity(0);
								this.sprite9.setVelocity(0);

								//
								if (coolDownRefs.current.playerTP > 0) {
									coolDownRefs.current.playerTP--;
								}
								if (coolDownRefs.current.playerHolyHeal > 0) {
									coolDownRefs.current.playerHolyHeal--;
								}
								//
								this.sunLight.x++;
								this.sunLight2.x++;
								this.sunLight3.x++;
								this.sunLight4.x++;
								this.player.depth = this.player.y + 20000;
								this.sprite.depth = this.player.y + 20000;
								this.sprite2.depth = this.player.y + 20000;
								this.sprite3.depth = this.player.y + 20000;
								this.sprite4.depth = this.player.y + 20000;
								this.sprite5.depth = this.player.y + 20000;
								this.sprite6.depth = this.player.y + 20000;
								this.sprite7.depth = this.player.y + 20000;
								this.sprite8.depth = this.player.y + 20000;
								this.sprite9.depth = this.player.y + 20000;
								//
								//
								//Player Animations
								if (this.hasUpdated === 0) {
									// spritePartsPaths.current.nose[0],
									// spritePartsPaths.current.ears[0],
									// spritePartsPaths.current.weapon[0],
									this.sprite.anims.play(
										"bodyAnimKey_" + String(activeSheetCurrentKeyframe.current)
									);
									this.sprite2.anims.play(
										"legsAnimKey_" + String(activeSheetCurrentKeyframe.current)
									);
									this.sprite3.anims.play(
										"shirtAnimKey_" + String(activeSheetCurrentKeyframe.current)
									);
									this.sprite4.anims.play(
										"hairAnimKey_" + String(activeSheetCurrentKeyframe.current)
									);
									this.sprite5.anims.play(
										"shoesAnimKey_" + String(activeSheetCurrentKeyframe.current)
									);
									this.sprite6.anims.play(
										"eyesAnimKey_" + String(activeSheetCurrentKeyframe.current)
									);
									this.sprite7.anims.play(
										"noseAnimKey_" + String(activeSheetCurrentKeyframe.current)
									);
									this.sprite8.anims.play(
										"earsAnimKey_" + String(activeSheetCurrentKeyframe.current)
									);
									this.sprite9.anims.play(
										"weaponAnimKey_" + String(activeSheetCurrentKeyframe.current)
									);
									this.hasUpdated++;
								}

								// Update CD In Relation To Time
								if (this.lastCDLog === undefined) {
									this.lastCDLog = { bullet: 0 };
								}

								if (time - this.lastCDLog.bullet > 100) {
									coolDownRefs.current.playerBullet = 0;
									this.lastCDLog.bullet = time;
								}

								//
								if (this.input.pointer1.isDown) {
									let relMouseX = this.input.activePointer.worldX;
									let relMouseY = this.input.activePointer.worldY;
									let angle = Phaser.Math.Angle.Between(
										this.player.x,
										this.player.y,
										relMouseX,
										relMouseY
									);

									let boundary = 180 - 45;
									let degrees = angle * 50 * 1.145 - 45;

									if (degrees < -boundary - 45) {
										// left overflow
										this.playerGroup.setVelocityX(-playerMovementSpeed.current);
										if (
											this.playerVelocity.x !==
											this.playerGroup.children.entries[0].body.velocity.x
										) {
											activeSheetCurrentKeyframe.current = String(9);
											window.triggerUpdate();
											this.isPlayerAnimated = true;
											//		console.log("Update Ani");
										}
										this.playerVelocity.x =
											this.playerGroup.children.entries[0].body.velocity.x;
										//
									} else if (-boundary - 45 <= degrees && degrees <= -boundary / 2) {
										//  up
										this.playerGroup.setVelocityY(-playerMovementSpeed.current);
										if (
											this.playerVelocity.y !==
											this.playerGroup.children.entries[0].body.velocity.y
										) {
											activeSheetCurrentKeyframe.current = String(8);
											window.triggerUpdate();
											this.isPlayerAnimated = true;
											//		console.log("Update Ani");
										}
										this.playerVelocity.y =
											this.playerGroup.children.entries[0].body.velocity.y;
										//
									} else if (-boundary / 2 <= degrees && degrees <= 0) {
										this.playerGroup.setVelocityX(playerMovementSpeed.current);
										if (
											this.playerVelocity.x !==
											this.playerGroup.children.entries[0].body.velocity.x
										) {
											activeSheetCurrentKeyframe.current = String(11);
											window.triggerUpdate();
											this.isPlayerAnimated = true;
											//		console.log("Update Ani");
										}
										this.playerVelocity.x =
											this.playerGroup.children.entries[0].body.velocity.x;
										//
										// down
									} else if (0 <= degrees && degrees <= boundary / 2) {
										// right
										this.playerGroup.setVelocityY(playerMovementSpeed.current);
										if (
											this.playerVelocity.y !==
											this.playerGroup.children.entries[0].body.velocity.y
										) {
											activeSheetCurrentKeyframe.current = String(10);
											window.triggerUpdate();
											this.isPlayerAnimated = true;
											//		console.log("Update Ani");
										}
										this.playerVelocity.y =
											this.playerGroup.children.entries[0].body.velocity.y;
										//
									} else if (boundary / 2 <= degrees && degrees <= boundary) {
										// left
										this.playerGroup.setVelocityX(-playerMovementSpeed.current);
										if (
											this.playerVelocity.x !==
											this.playerGroup.children.entries[0].body.velocity.x
										) {
											activeSheetCurrentKeyframe.current = String(9);
											window.triggerUpdate();
											this.isPlayerAnimated = true;
											//		console.log("Update Ani");
										}
										this.playerVelocity.x =
											this.playerGroup.children.entries[0].body.velocity.x;
										//
									}
								}
								//
								//HotBarMoves
								if (
									(selectedItemRef.current.id === "slingshot" &&
										this.input.mousePointer.isDown) ||
									(selectedItemRef.current.id === "slingshot" &&
										this.input.pointer2.isDown)
								) {
									if (coolDownRefs.current.playerBulletActive === false) {
										if (coolDownRefs.current.playerBullet === 0) {
											let totalBullets = this.bulletGroup.children.entries.length;

											if (!coolDownRefs.current.playerBulletCount) {
												coolDownRefs.current.playerBulletCount = 0;
											}

											// console.log(coolDownRefs.current.playerBulletCount);
											// console.log(totalBullets);

											this.bulletGroup
												.create(this.player.x, this.player.y, "Bullet")
												.setScale(0.2)
												.setBounceX(0.1)
												.setBounceY(0.1)
												.setGravityY(200)
												.setVelocity(
													(this.input.activePointer.worldX - this.player.x) * 3,
													(this.input.activePointer.worldY - this.player.y) * 3
												).name = String("RockBulletAge_" + time);

											coolDownRefs.current.playerBulletCount++;

											coolDownRefs.current.playerBulletActive = true;
											coolDownRefs.current.playerBullet = 5;
											setTimeout(() => {
												coolDownRefs.current.playerBulletActive = false;
											}, 15);
										}
									}
								}

								if (this.cursors.one.isDown) {
									selectedHotBarRef.current = 1;
									activeSheetCurrentKeyframe.current = String(5);
									window.triggerUpdate();
								} else if (this.cursors.two.isDown) {
									selectedHotBarRef.current = 2;
									activeSheetCurrentKeyframe.current = String(5);
									window.triggerUpdate();
								} else if (this.cursors.three.isDown) {
									selectedHotBarRef.current = 3;
									activeSheetCurrentKeyframe.current = String(5);
									window.triggerUpdate();
								} else if (this.cursors.four.isDown) {
									selectedHotBarRef.current = 4;
									activeSheetCurrentKeyframe.current = String(5);
									window.triggerUpdate();
								} else if (this.cursors.five.isDown) {
									selectedHotBarRef.current = 5;
									activeSheetCurrentKeyframe.current = String(5);
									window.triggerUpdate();
								} else if (this.cursors.six.isDown) {
									selectedHotBarRef.current = 6;
									activeSheetCurrentKeyframe.current = String(5);
									window.triggerUpdate();
								} else if (this.cursors.seven.isDown) {
									selectedHotBarRef.current = 7;
									activeSheetCurrentKeyframe.current = String(5);
									window.triggerUpdate();
								} else if (this.cursors.eight.isDown) {
									selectedHotBarRef.current = 8;
									activeSheetCurrentKeyframe.current = String(5);
									window.triggerUpdate();
								} else if (this.cursors.nine.isDown) {
									selectedHotBarRef.current = 9;
									activeSheetCurrentKeyframe.current = String(5);
									window.triggerUpdate();
								} else if (this.cursors.zero.isDown) {
									selectedHotBarRef.current = 0;
									activeSheetCurrentKeyframe.current = String(5);
									window.triggerUpdate();
								}
								// Move Emitter To Player
								// Loop Particles
								if (selectedHotBarRef.current === 2 && this.input.mousePointer.isDown) {
									if (this.playerFacingDirection === "down")
										activeSheetCurrentKeyframe.current = String(2);

									if (this.playerFacingDirection === "left")
										activeSheetCurrentKeyframe.current = String(1);

									if (this.playerFacingDirection === "right")
										activeSheetCurrentKeyframe.current = String(3);

									if (this.playerFacingDirection === "up")
										activeSheetCurrentKeyframe.current = String(0);

									setTimeout(() => {
										if (this.isPlayerAnimated === false) {
											window.triggerUpdate();
											this.isPlayerAnimated = true;
										}
									}, 100);

									if (time - coolDownRefs.current.playerStaticFieldCD >= 50) {
										this.bulletGroup
											.create(this.player.x + 0, this.player.y + 0, "Bullet")
											.setScale(2)
											.setBounceX(0.1)
											.setBounceY(0.1)
											.setGravityY(0)
											.setAlpha(1)
											.setVelocity(
												(Math.random() - 0.5) * 2 * 150,
												(Math.random() - 0.5) * 2 * 150
											).name = String("StaticFieldBulletAge_" + time);

										this.bulletGroup
											.create(this.player.x + 32, this.player.y + 0, "Bullet")
											.setScale(2)
											.setBounceX(0.1)
											.setBounceY(0.1)
											.setGravityY(0)
											.setAlpha(1)
											.setVelocity(
												150 + (Math.random() - 0.5) * 2 * 150,
												150 + (Math.random() - 0.5) * 2 * 150
											).name = String("StaticFieldBulletAge_" + time);

										this.bulletGroup
											.create(this.player.x - 32, this.player.y - 0, "Bullet")
											.setScale(2)
											.setBounceX(0.1)
											.setBounceY(0.1)
											.setGravityY(0)
											.setAlpha(1)
											.setVelocity(
												-150 + (Math.random() - 0.5) * 2 * 150,
												-150 + (Math.random() - 0.5) * 2 * 150
											).name = String("StaticFieldBulletAge_" + time);

										this.bulletGroup
											.create(this.player.x + 0, this.player.y - 32, "Bullet")
											.setScale(2)
											.setGravityY(0)
											.setBounceX(0.1)
											.setBounceY(0.1)
											.setAlpha(1)
											.setVelocity(
												150 + (Math.random() - 0.5) * 2 * 150,
												-150 + (Math.random() - 0.5) * 2 * 150
											).name = String("StaticFieldBulletAge_" + time);

										this.bulletGroup
											.create(this.player.x - 0, this.player.y + 32, "Bullet")
											.setScale(2)
											.setBounceX(0.1)
											.setBounceY(0.1)
											.setGravityY(0)
											.setAlpha(1)
											.setVelocity(
												-150 + (Math.random() - 0.5) * 2 * 150,
												150 + (Math.random() - 0.5) * 2 * 150
											).name = String("StaticFieldBulletAge_" + time);

										coolDownRefs.current.playerStaticFieldCD = time;
									}

									let relMouseX = this.input.mousePointer.worldX;
									let relMouseY = this.input.mousePointer.worldY;
									this.emitter.visible = true;
									this.emitter.lifespan.propertyValue = 100;
									this.emitter.start();

									this.emitter.moveTo = true;
									this.emitter.moveToX.propertyValue = relMouseX;
									this.emitter.moveToY.propertyValue = relMouseY;
								} else {
								}

								if (selectedHotBarRef.current === 3 && this.input.mousePointer.isDown) {
									let relMouseX = this.input.mousePointer.worldX;
									let relMouseY = this.input.mousePointer.worldY;
									let angle = Phaser.Math.Angle.Between(
										this.player.x,
										this.player.y,
										relMouseX,
										relMouseY
									);

									this.emitter2.visible = true;
									this.emitter2.lifespan.propertyValue = 1000;
									this.emitter2.start();
									this.emitter2.setAngle(angle * 50 * 1.145);

									this.emitter2.moveTo = true;
									this.emitter2.moveToX.propertyValue = relMouseX;
									this.emitter2.moveToY.propertyValue = relMouseY;

									// Sprite Particle Active Loop
								} else {
									this.emitter2.lifespan.propertyValue = 1;
									this.emitter2.stop();
								}

								if (selectedHotBarRef.current === 4) {
									if (this.input.mousePointer.isDown) {
										let relMouseX = this.input.mousePointer.worldX;
										let relMouseY = this.input.mousePointer.worldY;

										if (coolDownRefs.current.playerTPActive === false) {
											this.emitter3.visible = true;
											this.emitter3.lifespan.propertyValue = 1000;
											this.emitter3.start();
											this.emitter3.moveTo = true;

											if (coolDownRefs.current.playerTP === 0) {
												this.emitter3.moveToX.propertyValue = relMouseX;
												this.emitter3.moveToY.propertyValue = relMouseY;
												setTimeout(() => {
													this.sprite.x = relMouseX;
													this.sprite.y = relMouseY;
													this.emitter3.moveTo = true;
												}, 10);
												coolDownRefs.current.playerTP = 10;
											}
											coolDownRefs.current.playerTPActive = true;

											setTimeout(() => {
												let gotPlayerX = this.player.x;
												let gotPlayerY = this.player.Y;
												coolDownRefs.current.playerTPActive = false;
												this.emitter3.lifespan.propertyValue = 1;
												this.emitter3.stop();
												this.emitter3.moveTo = true;
												this.emitter3.moveToX.propertyValue = this.player.x;
												this.emitter3.moveToY.propertyValue = this.player.Y;
											}, 50);
										} else {
										}
									}
								}

								if (selectedHotBarRef.current === 5 && this.input.mousePointer.isDown) {
									let relMouseX = this.input.mousePointer.worldX;
									let relMouseY = this.input.mousePointer.worldY;

									let screenMouseX = this.input.mousePointer.x;
									let screenMouseY = this.input.mousePointer.y;
									this.emitter4.visible = true;
									this.emitter4.lifespan.propertyValue = 600;
									this.emitter4.start();

									var curve4 = new Phaser.Curves.Spline([
										0,
										0,
										(screenMouseX - window.innerWidth / 2) * zoomRef.current,
										(screenMouseY - window.innerHeight / 2) * zoomRef.current,
									]);

									this.yellowParticle.setDepth(3 + 20000);
									this.emitter4.depth = 3 + 20000;

									this.emitter4.setEmitZone({
										type: "edge",
										source: curve4,
										quantity: 48,
									});

									this.emitter4.moveTo = true;
									this.emitter4.moveToX.propertyValue = relMouseX;
									this.emitter4.moveToY.propertyValue = relMouseY;
								} else {
									this.emitter4.lifespan.propertyValue = 1;
									this.emitter4.stop();
								}

								if (selectedHotBarRef.current === 6) {
									if (this.input.mousePointer.isDown) {
										let relMouseX = this.input.mousePointer.worldX;
										let relMouseY = this.input.mousePointer.worldY;

										if (coolDownRefs.current.playerHolyHeal === 0) {
											if (coolDownRefs.current.playerHolyHealActive === false) {
												this.emitter6.visible = true;
												this.emitter6.lifespan.propertyValue = 1000;
												this.emitter6.start();

												this.emitter6.moveTo = true;
												this.emitter6.moveToX.propertyValue = relMouseX;
												this.emitter6.moveToY.propertyValue = relMouseY;

												setTimeout(() => {}, 25);
												coolDownRefs.current.playerHolyHeal = 250;

												coolDownRefs.current.playerHolyHealActive = true;
												setTimeout(() => {
													coolDownRefs.current.playerHolyHealActive = false;
													this.emitter6.lifespan.propertyValue = 1;
													this.emitter6.stop();
												}, 500);
											}
										}
									}
								}
								if (selectedHotBarRef.current === 7 && this.input.mousePointer.isDown) {
									let relMouseX = this.input.mousePointer.worldX;
									let relMouseY = this.input.mousePointer.worldY;

									let screenMouseX = this.input.mousePointer.x;
									let screenMouseY = this.input.mousePointer.y;
									this.emitter7.visible = true;
									this.emitter7.lifespan.propertyValue = 600;
									this.emitter7.start();

									var curve7 = new Phaser.Curves.Spline([
										0,
										0,
										(screenMouseX - window.innerWidth / 2) * zoomRef.current,
										(screenMouseY - window.innerHeight / 2) * zoomRef.current,
									]);

									this.whiteParticle.setDepth(3 + 20000);
									this.emitter7.depth = 3 + 20000;

									this.emitter7.setEmitZone({
										type: "edge",
										source: curve7,
										quantity: 48,
									});

									this.emitter7.moveTo = true;
									this.emitter7.moveToX.propertyValue = relMouseX;
									this.emitter7.moveToY.propertyValue = relMouseY;
								} else {
									this.emitter7.lifespan.propertyValue = 1;
									this.emitter7.stop();
								}
								// temp for performance
								var startTestTimeVar = performance.now();
								////
								////

								if (
									Math.round(this.player.x) >
										Math.round(this.cameras.main.midPoint.x + 5) ||
									Math.round(this.player.x) <
										Math.round(this.cameras.main.midPoint.x - 5) ||
									Math.round(this.player.y) >
										Math.round(this.cameras.main.midPoint.y + 5) ||
									Math.round(this.player.y) <
										Math.round(this.cameras.main.midPoint.y - 5)
								) {
									this.text.setScrollFactor(1);
									this.text.x = this.player.x - this.text.width / 2;
									this.text.y = this.player.y - 34;
								} else {
									this.text.x = window.innerWidth / 2 - this.text.width / 2;
									this.text.y = window.innerHeight / 2 - 34;

									this.text.setFontSize(16 / zoomRef.current).setScrollFactor(0);
								}

								this.cameras.main.setZoom(zoomRef.current);
								heroSpriteX.current = this.player.x;
								heroSpriteY.current = this.player.y;
								inGameMouseXY.current = {
									x: this.input.mousePointer.worldX,
									y: this.input.mousePointer.worldY,
								};

								var cam = this.cameras.main;

								if (time - this.lastLogSpawn >= 10000) {
									console.log("10000 ms RealTime Counter");
									//
									//
									if (this.spawnQuantityVar === undefined) this.spawnQuantityVar = 35;
									else {
										if (this.bouncersGroup.children.entries.length > 1) {
											this.spawnQuantityVar = Math.abs(
												this.bouncersGroup.children.entries.length - 35
											);
										}
									}
									console.log(this.bouncersGroup);

									var rectOuter = new Phaser.Geom.Rectangle(-5000, -5000, 10000, 10000);
									var rectInner = new Phaser.Geom.Rectangle(-3000, -2000, 2000, 2000);
									console.log(
										"%c Spawn Interval, Spawning: " + this.spawnQuantityVar + "Monsters",
										"color: green;"
									);

									for (let i = 0; i < this.spawnQuantityVar; i++) {
										var p = Phaser.Geom.Rectangle.RandomOutside(rectOuter, rectInner);

										if (Math.random() < 0.5) {
											this.bouncersGroup
												.create(p.x, p.y, "Squirrel")
												.setBounceX(1)
												.setBounceY(1)
												.setVelocityX((Math.random() - 0.5) * 2 * 450)
												.setVelocityY((Math.random() - 0.5) * 2 * 450)
												.setPipeline("Light2D")
												.setScale(0.5)
												.setName("monster")
												.setDrag(150)
												.setInteractive()
												.setCollideWorldBounds(true);
										} else
											this.bouncersGroup
												.create(p.x, p.y, "Monster")
												.setBounceX(1)
												.setBounceY(1)
												.setVelocityX((Math.random() - 0.5) * 2 * 450)
												.setVelocityY((Math.random() - 0.5) * 2 * 450)
												.setPipeline("Light2D")
												.setScale(0.4)
												.setName("monster")
												.setDrag(150)
												.setInteractive()
												.setCollideWorldBounds(true);
									}
									//
									////
									//

									this.lastLogSpawn = time;
								}

								if (this.lastLogSpawn === undefined) {
									console.log(this.lastLog);
									this.lastLogSpawn = 0;
								}

								//

								// this.connectedPlayersGroup.setVelocity(0);

								backgroundX.current = cam.scrollX - 1000;
								backgroundY.current = cam.scrollY - 1000;

								this.text
									.setText
									//				this.userDatabase[0] && this.userDatabase[0].userDisplayName
									();
								this.player.setVelocity(0);
								if (this.cursors.shift.isDown) {
									playerMovementSpeed.current = 250;
								} else {
									playerMovementSpeed.current = 150;
								}
								if (this.cursors.left.isDown || this.cursors.a.isDown) {
									this.playerGroup.setVelocityX(-playerMovementSpeed.current);

									if (
										this.playerVelocity.x !==
										this.playerGroup.children.entries[0].body.velocity.x
									) {
										//		console.log("Update Ani");
										activeSheetCurrentKeyframe.current = String(9);

										window.triggerUpdate();
										this.isPlayerAnimated = true;
									}
								}
								if (this.cursors.right.isDown || this.cursors.d.isDown) {
									this.playerGroup.setVelocityX(playerMovementSpeed.current);

									if (
										this.playerVelocity.x !==
										this.playerGroup.children.entries[0].body.velocity.x
									) {
										//			console.log("Update Ani");
										activeSheetCurrentKeyframe.current = String(11);

										window.triggerUpdate();
										this.isPlayerAnimated = true;
									}
								}
								// Player Movement W_Key
								if (this.cursors.up.isDown || this.cursors.w.isDown) {
									//
									this.playerGroup.setVelocityY(-playerMovementSpeed.current);
									if (
										this.playerVelocity.y !==
										this.playerGroup.children.entries[0].body.velocity.y
									) {
										activeSheetCurrentKeyframe.current = String(8);
										window.triggerUpdate();
										this.isPlayerAnimated = true;
										//		console.log("Update Ani");
									}
									this.playerVelocity.y =
										this.playerGroup.children.entries[0].body.velocity.y;
									//
									//			console.log(this.playerVelocity);
									//

									//					this.connectedPlayersGroup.setVelocityY(-400);
								}
								if (this.cursors.down.isDown || this.cursors.s.isDown) {
									this.playerGroup.setVelocityY(playerMovementSpeed.current);
									if (
										this.playerVelocity.y !==
										this.playerGroup.children.entries[0].body.velocity.y
									) {
										//		console.log("Update Ani");
										activeSheetCurrentKeyframe.current = String(10);

										window.triggerUpdate();
										this.isPlayerAnimated = true;
									}
									this.playerVelocity.y =
										this.playerGroup.children.entries[0].body.velocity.y;
									//
									//			console.log(this.playerVelocity);
								}
								if (
									!this.cursors.down.isDown &&
									!this.cursors.s.isDown &&
									!this.cursors.w.isDown &&
									!this.cursors.a.isDown &&
									!this.cursors.d.isDown &&
									!this.input.mousePointer.isDown
								) {
									this.isPlayerAnimated = false;
								}
							}
						}

						NPCHasItemsAction(i) {
							if (this.NPCSpritesGroup[i].getChildren()[0].hasItems["Corn Seed"] <= 0)
								if (
									this.toolObjects.getChildren()[0] &&
									this.toolObjects.getChildren()[0].itemsInChest &&
									this.toolObjects.getChildren()[0].itemsInChest["Corn Seed"] > 0
								) {
									//
									this.physics.moveToObject(
										this.NPCSpritesGroup[i].getChildren()[0],
										this.toolObjects.getChildren()[0],
										150
									);
									//
									var distNPCandChest = Phaser.Math.Distance.BetweenPoints(
										this.toolObjects.getChildren()[0],
										this.NPCSpritesGroup[i].getChildren()[0]
									);
									//
									if (distNPCandChest < 100) {
										//
										// console.log(this.NPCSpritesGroup);
										// console.log(this.NPCSpritesGroup);
										//
										this.NPCSpritesGroup[i].getChildren()[0].hasItems =
											this.toolObjects.getChildren()[0].itemsInChest;
										//
										//
									}
									//
								}

							if (Math.random() > 0.5) {
								if (
									this.NPCSpritesGroup[i].getChildren()[0] &&
									this.NPCSpritesGroup[i].getChildren()[0].hasItems &&
									this.NPCSpritesGroup[i].getChildren()[0].hasItems["Corn Seed"] > 0
								) {
									this.spritePartMoveRandomizerQx = (Math.random() - 0.5) * 2 * 150;
									this.spritePartMoveRandomizerQy = (Math.random() - 0.5) * 2 * 150;

									this.spritePartMoveRandomizer = Math.random() < 1;

									//	this.runPlayNPCAnimations(i);
									//	console.log(	this.NPCSpritesGroup[i].getChildren()[0].name);
									this.NPCSpritesGroup[i]
										.getChildren()[0]
										.setVelocityX(this.spritePartMoveRandomizerQx)
										.setVelocityY(this.spritePartMoveRandomizerQy);

									this.NPCSpritesGroup[i]
										.getChildren()[0]
										.setDepth(20000 + this.NPCSpritesGroup[i].getChildren()[0].y - 12);

									if (Math.random() > 0.95) {
										var getTileX = this.map.worldToTileX(
											this.NPCSpritesGroup[i].getChildren()[0].x
										);
										var getTileY = this.map.worldToTileY(
											this.NPCSpritesGroup[i].getChildren()[0].y
										);

										var tileAtNPC = this.map.getTileAt(getTileX, getTileY);

										if (
											(tileAtNPC.properties.isOccupied === false ||
												tileAtNPC.properties.isOccupied === undefined) &&
											tileAtNPC.index >= 592 &&
											tileAtNPC.index <= 614 &&
											tileAtNPC.index !== 598 &&
											tileAtNPC.index !== 597 &&
											tileAtNPC.index !== 593 &&
											tileAtNPC.index !== 595 &&
											tileAtNPC.index !== 601 &&
											tileAtNPC.index !== 603 &&
											tileAtNPC.index !== 605 &&
											tileAtNPC.index !== 607 &&
											tileAtNPC.index !== 609 &&
											tileAtNPC.index !== 611 &&
											tileAtNPC.index !== 613 &&
											tileAtNPC.index !== 599
										) {
											//	console.log(tileAtNPC);

											this.plantGroup
												.create(
													tileAtNPC.pixelX - window.mapSize + 16,
													tileAtNPC.pixelY - window.mapSize + 16,
													"terrainSheet"
												)
												.setPipeline("Light2D")
												.setScale(1)
												.setFrame(937)
												.setInteractive()
												.setDepth(
													20000 + this.NPCSpritesGroup[i].getChildren()[0].y - 22
												).name = "plant_Corn_age_" + window.gameTime;

											this.NPCSpritesGroup[i].getChildren()[0].hasItems["Corn Seed"] =
												parseInt(
													this.NPCSpritesGroup[i].getChildren()[0].hasItems["Corn Seed"]
												) - 1;
											tileAtNPC.properties.isOccupied = true;

											//	tileAtNPC.properties.isOccupied = true;
											// console.log(
											// 	this.NPCSpritesGroup[i].getChildren()[0].hasItems["Corn Seed"]
											// );}
											//	}
										} else {
											this.NPCSpritesGroup[i]
												.getChildren()[0]
												.setVelocityX((Math.random() - 0.5) * 2 * 250)
												.setVelocityY((Math.random() - 0.5) * 2 * 250);
										}
									}
								}
							}
						}

						runPlayNPCAnimations(i) {
							//		console.log(i);
							// if (
							// 	i ===
							// 	parseInt(this.NPCSpritesGroup[i].getChildren()[0].name.split("_")[1])
							// ) {
							// 	this.NPCSpritesGroup[i].getChildren()[0].playAnimation(
							// 		String(
							// 			"NPC_" +
							// 				this.NPCSpritesGroup[i].getChildren()[0].name.split("_")[1] +
							// 				"EarsAnimKey_11"
							// 		)
							// 	);
							// 	//
							// 	this.NPCSpritesGroup[i].getChildren()[0].playAnimation(
							// 		String(
							// 			"NPC_" +
							// 				this.NPCSpritesGroup[i].getChildren()[0].name.split("_")[1] +
							// 				"LegsAnimKey_11"
							// 		)
							// 	);
							// 	this.NPCSpritesGroup[i].getChildren()[0].playAnimation(
							// 		String(
							// 			"NPC_" +
							// 				this.NPCSpritesGroup[i].getChildren()[0].name.split("_")[1] +
							// 				"bodyAnimKey_11"
							// 		)
							// 	);
							// 	this.NPCSpritesGroup[i].getChildren()[0].playAnimation(
							// 		String(
							// 			"NPC_" +
							// 				this.NPCSpritesGroup[i].getChildren()[0].name.split("_")[1] +
							// 				"EyesAnimKey_11"
							// 		)
							// 	);
							// 	this.NPCSpritesGroup[i].getChildren()[0].playAnimation(
							// 		String(
							// 			"NPC_" +
							// 				this.NPCSpritesGroup[i].getChildren()[0].name.split("_")[1] +
							// 				"NoseAnimKey_11"
							// 		)
							// 	);
							// 	this.NPCSpritesGroup[i].getChildren()[0].playAnimation(
							// 		String(
							// 			"NPC_" +
							// 				this.NPCSpritesGroup[i].getChildren()[0].name.split("_")[1] +
							// 				"ShoesAnimKey_11"
							// 		)
							// 	);
							// 	this.NPCSpritesGroup[i].getChildren()[0].playAnimation(
							// 		String(
							// 			"NPC_" +
							// 				this.NPCSpritesGroup[i].getChildren()[0].name.split("_")[1] +
							// 				"HairAnimKey_11"
							// 		)
							// 	);
							// 	this.NPCSpritesGroup[i].getChildren()[0].playAnimation(
							// 		String(
							// 			"NPC_" +
							// 				this.NPCSpritesGroup[i].getChildren()[0].name.split("_")[1] +
							// 				"ShirtAnimKey_11"
							// 		)
							// 	);
							// 	this.NPCSpritesGroup[i].getChildren()[0].playAnimation(
							// 		String(
							// 			"NPC_" +
							// 				this.NPCSpritesGroup[i].getChildren()[0].name.split("_")[1] +
							// 				"WeaponAnimKey_11"
							// 		)
							// 	);
							//		}
						}
					}
					const config = {
						type: Phaser.AUTO,
						maxLights: 50,
						scale: {
							mode: Phaser.Scale.RESIZE,
							parent: "SceneStack2",
							width: window.innerWidth,
							height: window.innerHeight,
						},
						physics: {
							default: "arcade",
						},
						scene: [Example],
					};

					new Phaser.Game(config);

					console.log("Phaser Frameworks Initiated");

					console.log(" ");
					//
					//
					console.log("Frameworks Initiated Syncing GameClock");
					console.log(" ");

					let minutes = 55;
					let hours = 11;
					let minutesParsed = 0;
					let hoursParsed = 0;

					//  1s Clock Interval
					setInterval(() => {
						//		console.log(navigator);
						// console.log("");
						// console.log(minutes);
						// console.log(minutesParsed);
						// console.log(hoursParsed);
						// console.log("");
						//
						// Parse 0 to Minutes if less than 10
						if (minutes < 10) {
							minutes++;
							minutesParsed = String(String(0) + String(minutes));
						}
						if (minutes >= 10) {
							minutes++;
							minutesParsed = String(minutes);
						}
						//
						//
						if (minutes > 59) {
							hours++;
							minutes = 0;
							minutesParsed = String(minutes);
						}
						//
						// Parse 0 to Hours if less than 10
						if (hours < 10) {
							hoursParsed = String(String(0) + hours);
						}
						if (hours > 10) {
							hoursParsed = String(hours);
						}
						//
						//
						if (hours === 24) {
							hours = 0;
							hoursParsed = String(hours);
						}

						if (hoursParsed === "0") {
							hoursParsed = String("00");
						}
						if (minutesParsed === "0") {
							minutesParsed = String("00");
						}
						inGameTimeRef.current = String(hoursParsed + " : " + minutesParsed);
						//		setParsedInGameTime(String(hoursParsed + " : " + minutesParsed));
					}, 1000);

					console.log("Map Data Loading Complete!");
				});
			//Group To Singular Object

			// Create Array From Loaded Object List
			// For Each Scene Import Define Interactive Variables

			// Background image
			var bgReady = false;
			var bgImage = new Image();
			bgImage.onload = function () {
				bgReady = true;
			};
			bgImage.src = "images/background.webp";
			// Monster image
			// Game objects
			var hero = {
				speed: 500, // movement in pixels per second
			};
			var monster = {};
			var bush = {};
			var background = {};
			var staticSprite = {};
			var locDrawScale = {};
			var locSpriteScale = {};

			var locIsHeroBlocked = {
				up: false,
				left: false,
				right: false,
				down: false,
			};

			var locIsStaticBlocked = {
				up: false,
				left: false,
				right: false,
				down: false,
			};

			var locIsBGBlocked = {
				up: false,
				left: false,
				right: false,
				down: false,
			};

			// Handle keyboard controls
			var keysDown = {};
			window.addEventListener(
				"keydown",
				function (e) {
					keysDown[e.code] = true;
					//       console.log(e.code)
				},
				false
			);
			window.addEventListener(
				"keyup",
				function (e) {
					delete keysDown[e.code];
				},
				false
			);
			// Reset/Init the game
			// Draw everything

			// The main game loop
			// Pre Load - Loads Once
			document.addEventListener("keydown", (e, i) => {
				KeyPressMoveBool.current = true;
				if (e.code === "Enter") {
					var ChatBoxInput = document.getElementById("ChatBoxInput");
					if (document.activeElement.id === "ChatBoxInput") {
						//	window.sendMessage();
						ChatBoxInput.blur();
						ChatBoxInput.value = "";
					} else {
						ChatBoxInput.focus();
					}
				}
				if (e.code === "KeyI") {
					console.log("Inventory");

					var InventorySpan = document.getElementById("InventorySpan");
					if (InventorySpan.hidden) {
						//
						var tempEntries = Object.entries(window.UserInventoryJSON);
						window.UserInventoryArray = tempEntries;
						//

						console.log(window.UserInventoryArray);
						setInventoryHidden(false);
						// var NPCDataObjects = Object.values(NPCData);
						// NPCDataObjects.forEach((ele2, index) => {});
						//					rightClickMenuSelect.current.push({		});
					} else {
						setInventoryHidden(true);
					}
				}
			});
			document.addEventListener("keyup", (e) => {
				KeyPressMoveBool.current = false;
				// After Pre -- Load OnStateUpdate
			});
			isInitialMount.current = false;

			// document.addEventListener("mousedown", (e) => {
			// 	// Get Swipe Image From OffScreen
			// 	// console.log(e.target.id);
			// 	if (e.target.id === "mainScene") {
			// 		if (selectedHotBarRef.current === 1) {
			// 			window.liveGameDataArray.forEach((localGameEle, index2) => {
			// 				if (localGameEle.key === "Swipe") {
			// 					var img = new Image();
			// 					if (heroFacingDirection.current === 0) {
			// 						// Facing Down
			// 						try {
			// 							img.onload = function () {
			// 								localGameEle.imgSrcArray = img;
			// 								localGameEle.readyVar = true;
			// 							};
			// 							img.src = localGameEle.images[3] || null;
			// 						} catch (error) {}
			// 						localGameEle.x = hero.x + 25;
			// 						localGameEle.y = hero.y + 125;
			// 						localGameEle.action = true;
			// 					}
			// 					if (heroFacingDirection.current === 1) {
			// 						// Facing Left
			// 						try {
			// 							img.onload = function () {
			// 								localGameEle.imgSrcArray = img;
			// 								localGameEle.readyVar = true;
			// 							};
			// 							img.src = localGameEle.images[0] || null;
			// 						} catch (error) {}

			// 						localGameEle.x = hero.x - 25;
			// 						localGameEle.y = hero.y + 50;
			// 						localGameEle.action = true;
			// 					}
			// 					if (heroFacingDirection.current === 2) {
			// 						// Facing Up
			// 						try {
			// 							img.onload = function () {
			// 								localGameEle.imgSrcArray = img;
			// 								localGameEle.readyVar = true;
			// 							};
			// 							img.src = localGameEle.images[2] || null;
			// 						} catch (error) {}
			// 						localGameEle.x = hero.x + 25;
			// 						localGameEle.y = hero.y - 30;
			// 						localGameEle.action = true;
			// 					}
			// 					if (heroFacingDirection.current === 3) {
			// 						// Facing Right
			// 						try {
			// 							img.onload = function () {
			// 								localGameEle.imgSrcArray = img;
			// 								localGameEle.readyVar = true;
			// 							};
			// 							img.src = localGameEle.images[1] || null;
			// 						} catch (error) {}
			// 						localGameEle.x = hero.x + 75;
			// 						localGameEle.y = hero.y + 50;
			// 						localGameEle.action = true;
			// 					}
			// 				}
			// 			});
			// 		}
			// 		if (selectedHotBarRef.current === 2) {
			// 			//
			// 			//
			// 			console.log(window.liveGameDataArray);
			// 			console.log(auth.currentUser.uid);
			// 		}
			// 	}
			// 	// Move to Player Location
			// 	// Appear For One Frame Then Remove
			// 	//	// Close NPC Chat If Open

			// 	//
			// 	// Close Right Click Menu If Open
			// 	// console.log("|||");
			// 	if (!rightClickMenuRef.current) {
			// 		// console.log("hiding");
			// 		if (String(e.target.id) !== "rightClickMenuIcon") {
			// 			if (String(e.target.className) !== "rightClickMenuClass") {
			// 				if (
			// 					!JSON.stringify(
			// 						String(e.target.className).includes(`SVGAnimatedString
			// 				`)
			// 					)
			// 				) {
			// 					rightClickMenuRef.current = true;
			// 					setRightClickMenuHidden(rightClickMenuRef.current);
			// 				}
			// 				rightClickMenuRef.current = rightClickMenuHidden;
			// 			}
			// 		}
			// 	}
			// 	// console.log(" ");
			// 	// console.log(rightClickMenuRef.current);
			// 	if (!rightClickMenuRef.current) {
			// 		// console.log(e.target.id);
			// 		// console.log(JSON.stringify(String(e.target.className)));
			// 		if (String(e.target.id) !== "rightClickMenuIcon") {
			// 			if (String(e.target.className) !== "rightClickMenuClass") {
			// 				if (
			// 					!JSON.stringify(
			// 						String(e.target.className).includes(`SVGAnimatedString
			// 				`)
			// 					)
			// 				) {
			// 					rightClickMenuRef.current = true;
			// 					setRightClickMenuHidden(true);
			// 				}
			// 			}
			// 		}
			// 	} else {
			// 		// console.log(" ");
			// 		// console.log("X2True");
			// 		// console.log(" ");
			// 		rightClickMenuRef.current = true;
			// 		setRightClickMenuHidden(true);
			// 	}
			// 	if (NPCChatHiddenRef.current) {
			// 		// console.log("X3True");
			// 		// console.log(e.target.id);
			// 		// console.log(JSON.stringify(String(e.target.className)));
			// 		if (String(e.target.id) !== "NPCSendInteractionIcon") {
			// 			if (String(e.target.className) !== "NPCSendInteractionClass") {
			// 				if (
			// 					!JSON.stringify(
			// 						String(e.target.className).includes(`SVGAnimatedString
			// 				`)
			// 					)
			// 				) {
			// 					setNPCChatHidden(true);
			// 					NPCChatRef.current = false;
			// 					NPCChatHiddenRef.current = true;
			// 				}
			// 			}
			// 		}
			// 	}
			// 	// console.log(NPCChatRef.current, NPCChatHidden);
			// });
		}
	}, [
		ctx,
		rightClickMenuHidden,
		rightClickMenuCoords,
		NPCChatHidden,
		auth.currentUser.uid,
		auth.currentUser.refreshToken,
		auth.currentUser.authDomain,
		auth.currentUser.email,
		auth.currentUser.hostname,
		auth.currentUser.uuid,
	]);

	//end useEffect

	// Begin ListFunctions
	return (
		<div>
			<span
				style={{
					width: "100%",
					marginTop: "-15px",
					userSelect: "none",
					marginRight: "10px",
					zIndex: 999,
					textAlign: "center",
					fontSize: "16px",
					textShadow: " 0 0 5px #DDCCFF",
					color: "#DDEEFF",
				}}
			>
				<span
					style={{
						position: "absolute",
						top: "55px",
						fontSize: "22px",
						zIndex: 999,
						right: "15px",
					}}
				>
					<small>
						Alpha <br />
						{localStorage.getItem("appVersion")} &nbsp;
					</small>
				</span>
				<span
					style={{
						position: "absolute",
						top: "155px",
						zIndex: 999,
						fontSize: "22px",
						textAlign: "left",
						left: "25px",
					}}
				>
					{/*

					<button
						onClick={() => {
							var docRef = document.getElementById("StatsHideID");

							if (docRef.hidden === true) {
								docRef.hidden = false;
								setHideShowState(" Hide");
							} else {
								docRef.hidden = true;
								setHideShowState(" Show Debug");
							}
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "6px",
						}}
					>
						<FaEye
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-8px",
								top: "-3px",
							}}
						/>
					</button>

			*/}
					<span hidden={true} id="StatsHideID">
						<br />
						{/* Scene Type: {activeSceneType} */}
						<br />
						Hero Coords: {Math.round(heroSpriteX.current)}{" "}
						{Math.round(heroSpriteY.current)}
						<br />
						Map Coords: {backgroundX.current} {backgroundY.current}
						<br />
						Scene Dimensions : {canvas && canvas.width}
						{" x "}
						{canvas && canvas.height}
						<br />
						Total Sprites: {importedSpriteCounter.current}
						<br />
						Facing: {heroFacingDirection.current}
					</span>
				</span>
				<span
					style={{
						top: 6,
						position: "absolute",
						right: 175,
						zIndex: 998,
					}}
				></span>
			</span>
			<span hidden id="SceneStack"></span>
			<span
				style={{
					top: 0,
					right: 0,
					height: "100%",
					width: "100%",
					position: "absolute",
					overflow: "hidden",
					zIndex: 998,
				}}
				id="SceneStack2"
			></span>
			<div
				style={{
					position: "absolute",
					color: "white",
					zIndex: 1005,
					left: "5px",
					top: "125px",
				}}
				id="inGameTime"
			>
				{inGameTimeRef.current}
				<br />
			</div>
			<div
				id="ChatBox"
				style={{
					position: "absolute",
					color: "white",
					zIndex: 1005,
					left: "15px",
					bottom: "42px",
					wordWrap: "break-word",
					overflow: "auto",
					height: "100px",
					fontSize: "10px",
					width: "30%",
					backgroundColor: "#FFFFFF22",
				}}
			></div>
			<input
				onChange={(e) => {
					if (document.getElementById("ChatBoxInput").value.includes("/tile")) {
						modifyTileMapRef.current.tileId = [e.target.value.split(" ")[1]];
						console.log(e.target.value.split(" ")[1]);
					} else if (
						document.getElementById("ChatBoxInput").value.includes("/item")
					) {
						selectedItemRef.current.id = String(e.target.value.split(" ")[1]);
						console.log(selectedItemRef.current);
					} else if (
						document.getElementById("ChatBoxInput").value.includes("/setHammer")
					) {
						window.hammerMakeTileId = parseInt(e.target.value.split(" ")[1]);
						console.log(selectedItemRef.current);
					}
				}}
				id="ChatBoxInput"
				style={{
					position: "absolute",
					color: "white",
					zIndex: 1006,
					left: "15px",
					bottom: "15px",
					border: "0",
					height: "25px",
					width: "30%",
					backgroundColor: "#FFFFFF22",
				}}
			></input>
			<span
				id="HotBar"
				style={{
					position: "absolute",
					color: "white",
					zIndex: 1007,
					left: "33%",
					bottom: "15px",
					height: "50px",
					width: "50%",
					backgroundColor: "#FFFFFF22",
				}}
			>
				<button
					id="HotBar1"
					style={{
						color: "white",
						zIndex: 1007,
						height: "50px",
						position: "relative",
						width: "10%",
						backgroundColor: selectedHotBar === 1 ? "#FFFFFF55" : "#FFFFFF22",
					}}
					onClick={() => {
						setSelectedHotBar(1);
						selectedHotBarRef.current = 1;
						// console.log(window.liveGameDataArray);
						// console.log(auth.currentUser.uid);
						// window.liveGameDataArray.forEach((localGameEle, index2) => {
						// 	if (localGameEle.key === "Bush") {
						// 		//		console.log(window.liveGameDataArray[index2].images[0]);
						// 		var img = new Image();
						// 		img.src = String(window.liveGameDataArray[index2].images[0]);
						// 		img.onload = function () {
						// 			let jsonEle = {
						// 				readyVar: true,
						// 				imgSrcArray: img,
						// 				meta: "static",
						// 				key: "Obj",
						// 				x: { x: heroSpriteX.current.x, y: heroSpriteX.current }.x + (backgroundX.current + 2000),
						// 				y: { x: heroSpriteX.current.x, y: heroSpriteX.current }.y + (backgroundY.current + 2100),
						// 			};

						// 			window.liveGameDataArray.push(jsonEle);
						// 		};
						// 	}
						// });
						// let interval = setInterval(function () {
						// 	window.moveHeroForward();
						// 	window.moveMonsterForward();
						// }, 0);
						// document.addEventListener("mouseup", function () {
						// 	clearInterval(interval);
						// 	console.log("End");
						// });
					}}
				>
					1
				</button>
				<button
					id="HotBar2"
					onMouseDown={(e) => {
						setSelectedHotBar(2);
						selectedHotBarRef.current = 2;
						// window.checkDB(e);
					}}
					style={{
						color: "white",
						zIndex: 1007,
						height: "50px",

						position: "relative",
						width: "10%",
						backgroundColor: selectedHotBar === 2 ? "#FFFFFF55" : "#FFFFFF22",
					}}
				>
					2
				</button>
				<button
					id="HotBar3"
					onMouseDown={(e) => {
						// console.log(window.gameObjectDataElement);
						// console.log(auth.currentUser.uid);
						// var img = new Image();
						// img.src = window.gameObjectDataElement["Hero"].images[0];
						// img.onload = function () {
						// 	window.gameObjectDataElement[auth.currentUser.uid] = {
						// 		readyVar: true,
						// 		imgSrcArray: img,
						// 		meta: "static",
						// 		key: auth.currentUser.uid,
						// 		x: canvas.width / 2,
						// 		y: canvas.height / 2,
						// 	};
						// 	window.liveGameDataArray.push(
						// 		window.gameObjectDataElement[auth.currentUser.uid]
						// 	);
						// 	//
						// };
					}}
					style={{
						color: "white",
						zIndex: 1007,
						height: "50px",

						position: "relative",
						width: "10%",
						backgroundColor: "#FFFFFF22",
					}}
				>
					3
				</button>
				<button
					id="HotBar4"
					onMouseDown={(e) => {
						// console.log(window.gameObjectDataElement);
						// console.log(auth.currentUser.uid);
						// var img = new Image();
						// img.src = window.gameObjectDataElement["Hero"].images[0];
						// img.onload = function () {
						// 	window.gameObjectDataElement[auth.currentUser.uid] = {
						// 		readyVar: true,
						// 		imgSrcArray: img,
						// 		meta: "static",
						// 		key: auth.currentUser.uid,
						// 		x: canvas.width / 2,
						// 		y: canvas.height / 2,
						// 	};
						// 	window.liveGameDataArray.push(
						// 		window.gameObjectDataElement[auth.currentUser.uid]
						// 	);
						// 	//
						// };
					}}
					style={{
						color: "white",
						zIndex: 1007,
						height: "50px",

						position: "relative",
						width: "10%",
						backgroundColor: "#FFFFFF22",
					}}
				>
					4
				</button>
				<button
					id="HotBar5"
					onClick={(e) => {
						// window.setDrawScale((drawScale.current += 0.1));
					}}
					style={{
						color: "white",
						zIndex: 1007,
						height: "50px",

						position: "relative",
						width: "10%",
						backgroundColor: "#FFFFFF22",
					}}
				>
					5
				</button>
				<button
					id="HotBar6"
					onClick={(e) => {
						// window.addEventListener("wheel", (event) => {
						// 	console.info(event.deltaY);
						// 	if (event.deltaY > 0) {
						// 		window.setDrawScale((drawScale.current -= 0.1));
						// 	} else if (event.deltaY < 0) {
						// 		window.setDrawScale((drawScale.current += 0.1));
						// 	}
						// });
						// ctx.translate(pt.x, pt.y);
						// ctx.scale(factor, factor);
						// ctx.translate(-pt.x, -pt.y);
					}}
					style={{
						color: "white",
						zIndex: 1007,
						height: "50px",

						position: "relative",
						width: "10%",
						backgroundColor: "#FFFFFF22",
					}}
				>
					6
				</button>
				<button
					id="HotBar7"
					onClick={(e) => {
						// let useEmulator = false;
						// //Run StartAPI Call To Functions
						// setInterval(() => {
						// 	async function runFunction() {
						// 		console.log("Running");
						// 		require("firebase/functions");
						// 		async function sendRequest(props) {
						// 			//Emulator local url for development:
						// 			let fetchURL = "";
						// 			const urlLocal = `http://localhost:5001/ohana-rpg/us-central1/LoadPlayerIntoGame`;
						// 			// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)
						// 			//Live  url:
						// 			const urlLive =
						// 				"https://us-central1-ohana-rpg.cloudfunctions.net/LoadPlayerIntoGame";
						// 			if (useEmulator && window.location.hostname.includes("localhost")) {
						// 				fetchURL = urlLocal;
						// 			} else {
						// 				fetchURL = urlLive;
						// 			}
						// 			//Send Details
						// 			const rawResponse = await fetch(fetchURL, {
						// 				method: "POST",
						// 				mode: "cors",
						// 				headers: new Headers({
						// 					"Content-Type": "application/json",
						// 					Accept: "application/json",
						// 					HeaderTokens: JSON.stringify({
						// 						refreshToken: auth.currentUser.refreshToken,
						// 						authDomain: auth.currentUser.authDomain,
						// 						uid: auth.currentUser.uid,
						// 						email: auth.currentUser.email,
						// 						hostname: auth.currentUser.hostname,
						// 						gameMeta: { x: heroSpriteX.current.x, y: heroSpriteX.current },
						// 						hostname2: window.location.hostname,
						// 					}),
						// 				}),
						// 				body: JSON.stringify({
						// 					UUID: auth.currentUser.uuid,
						// 				}),
						// 			});
						// 			const resp = await rawResponse.json();
						// 			console.log(resp);
						// 			console.log(resp.data);
						// 			console.log(resp.data.x);
						// 			var img = new Image();
						// 			img.src = window.gameObjectDataElement["Hero"].images[0];
						// 			img.onload = function () {
						// 				window.gameObjectDataElement[auth.currentUser.uid] = {
						// 					readyVar: true,
						// 					imgSrcArray: img,
						// 					meta: "static",
						// 					key: auth.currentUser.uid,
						// 					x: resp.data.x + (backgroundX.current + 2000),
						// 					y: resp.data.y + (backgroundY.current + 2000),
						// 				};
						// 				window.liveGameDataArray.push(
						// 					window.gameObjectDataElement[auth.currentUser.uid]
						// 				);
						// 				console.log("Running Get Difference:");
						// 				console.log(" ");
						// 				console.log("Got Data: " + resp.data.x + " " + resp.data.y);
						// 				console.log(" ");
						// 				console.log(
						// 					"Difference: " +
						// 						(backgroundX.current + 2000) +
						// 						" " +
						// 						(backgroundY.current + 2000)
						// 				);
						// 				console.log(" ");
						// 			};
						// 		}
						// 		sendRequest();
						// 	}
						// 	runFunction();
						// }, 5000);
						// ctx.translate(pt.x, pt.y);
						// ctx.scale(factor, factor);
						// ctx.translate(-pt.x, -pt.y);
					}}
					style={{
						color: "white",
						zIndex: 1007,
						height: "50px",
						position: "relative",
						width: "10%",
						backgroundColor: "#FFFFFF22",
					}}
				>
					7
				</button>
				<button
					id="HotBar8"
					onClick={(e) => {
						// Begin Update GameObjects from DB
						// setInterval(() => {
						// 	window.handleDBGameObjects().forEach((liveGameObjectsEle) => {
						// 		window.liveGameDataArray.forEach((localGameObjectsEle, index) => {
						// 			let dbDataArray = Object.values(window.handleDBGameObjects());
						// 			dbDataArray.forEach((dbArrayEle, index) => {
						// 				if (dbArrayEle.key === localGameObjectsEle.key) {
						// 					console.log(dbArrayEle);
						// 					if (JSON.parse(liveGameObjectsEle).key !== "Hero") {
						// 						localGameObjectsEle.x =
						// 							JSON.parse(liveGameObjectsEle).x + (backgroundX.current + 2000);
						// 						localGameObjectsEle.y =
						// 							JSON.parse(liveGameObjectsEle).y + (backgroundY.current + 2000);
						// 					}
						// 				}
						// 			});
						// 		});
						// 	});
						// }, 1200);
						// setInterval(() => {
						// 	handleDBGameObjects().forEach((dbArrayEle) => {
						// 		db
						// 			.collection("GameObjects")
						// 			.get()
						// 			.then((userData) => {
						// 				userData.forEach((doc) => {
						// 					var key = doc.id;
						// 					var data = doc.data();
						// 					data["key"] = key;
						// 					dbData[key] = data;
						// 				});
						// 				let dbDataArray = Object.values(dbData);
						// 				dbDataArray.forEach((dbArrayEle, index) => {
						// 					if (dbArrayEle) {
						// 						window.liveGameDataArray.forEach((elem2, index) => {
						// 							if (elem2.key === dbArrayEle.key) {
						// 								if (elem2.key !== "Hero") {
						// 									elem2.x = dbArrayEle.x + (backgroundX.current + 2000);
						// 									elem2.y = dbArrayEle.y + (backgroundY.current + 2000);
						// 								}
						// 							}
						// 						});
						// 					}
						// 				});
						// 			});
						// 	});
						// }, 200);
					}}
					style={{
						color: "white",
						zIndex: 1007,
						height: "50px",

						position: "relative",
						width: "10%",
						backgroundColor: "#FFFFFF22",
					}}
				>
					8
				</button>
				<button
					id="HotBar9"
					onClick={(e) => {
						// let dbDataArray = Object.values(window.handleDBGameObjects());
						// dbDataArray.forEach((gotGameDBEle, index) => {
						// 	if (gotGameDBEle.data.loginTime) {
						// 		console.log(gotGameDBEle.data.loginTime);
						// 		console.log(gotGameDBEle.key);
						// 	}
						// });
					}}
					style={{
						color: "white",
						zIndex: 1007,
						height: "50px",
						position: "relative",
						width: "10%",
						backgroundColor: "#FFFFFF22",
					}}
				>
					9
				</button>
				<button
					style={{
						color: "white",
						zIndex: 1007,
						height: "50px",

						position: "relative",
						width: "10%",
						backgroundColor: "#FFFFFF22",
					}}
				>
					0
				</button>
			</span>
			<span
				style={{
					position: "absolute",
					top: "0",
					left: "0",
					display: "inline-block",
					zIndex: 1008,
					leftMargin: "auto",
					width: "100%",
					alignContent: "center",
					alignItems: "center",
				}}
			>
				<span
					hidden
					id="PlayerStatusBar"
					style={{
						color: "white",
						position: "absolute",
						borderRadius: "50px",
						zIndex: 1008,
						left: "50%",
						top: "0",
						margin: "auto",
						transform: "translate(-50%, 0)",
						height: "100px",
						width: "200px",
						backgroundColor: "#FFFFFF11",
					}}
				>
					<svg height="100" width="100">
						<radialGradient id="g" r="1" cx="33%" cy="33%">
							<stop stopOpacity=".6" stopColor="red" offset=".1" />
							<stop stopOpacity="0" stopColor="darkRed" offset=".9" />
							<stop stopOpacity=".3" stopColor="darkRed" offset=".9" />
						</radialGradient>
						<circle
							cx="50"
							cy="50"
							r="40"
							stroke="black"
							strokeWidth="3"
							fill="url(#g)"
						/>
					</svg>

					<svg style={{ float: "right" }} height="100" width="100">
						<radialGradient id="g2" r="1" cx="33%" cy="33%">
							<stop stopOpacity=".6" stopColor="blue" offset=".1" />
							<stop stopOpacity="0" stopColor="darkBlue" offset=".9" />
							<stop stopOpacity=".3" stopColor="darkBlue" offset=".9" />
						</radialGradient>
						<circle
							cx="50"
							cy="50"
							r="40"
							stroke="black"
							strokeWidth="3"
							fill="url(#g2)"
						/>
					</svg>
				</span>
			</span>
			<span hidden id="OffScreenRenderContainer"></span>
			<span
				id={"InventorySpan"}
				hidden={inventoryHidden}
				style={{
					position: "absolute",
					backgroundColor: "#000000DD",
					zIndex: 1008,
					leftMargin: "auto",
					left: 100,
					top: 100,
					width: "70%",
					height: "70%",
					alignContent: "center",
					alignItems: "center",
					color: "whitesmoke",
					fontWeight: "1",
					fontFamily: "courier",
					textShadow: "1px 1px 15px #FFFFFF,1px 1px 15px #FFFFFF",
					fontSize: "20px",
					borderRadius: "25px",
				}}
			>
				<div style={{ width: "100%" }}>
					<center> Inventory</center>
				</div>
				<br />
				<span id="InventoryContainer" style={{ margin: "5px", padding: "5px" }}>
					&nbsp;
					<span id="InventoryItem" style={{ marginLeft: "5px", paddingLeft: "5px" }}>
						{window.UserInventoryArray &&
							window.UserInventoryArray.map((el) => {
								return (
									<span
										key={String(el).split(",")[0]}
										id="InventoryItem"
										style={{
											marginLeft: "5px",
											paddingLeft: "5px",
											display: "inline-flex",
											maxWidth: "100%",
										}}
									>
										{String(el).split(",")[0]} x {String(el).split(",")[1]} &nbsp;
										<button
											onClick={() => {
												window.useInventoryItem(String(el).split(",")[0]);
												setInventoryHidden(true);
												async function runFunction() {
													let useEmulator = false;
													if (window.location.pathname === "/game") {
														console.log("Sending 25s Interval Status");
														require("firebase/functions");

														async function sendRequest(props) {
															//Emulator local url for development:
															let fetchURL = "";
															const urlLocal = `http://localhost:5001/ohana-rpg/us-central1/UseInventoryItem`;

															// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)
															//Live  url:
															const urlLive =
																"https://us-central1-ohana-rpg.cloudfunctions.net/UseInventoryItem";

															if (
																useEmulator &&
																window.location.hostname.includes("localhost")
															) {
																fetchURL = urlLocal;
															} else {
																fetchURL = urlLive;
															}

															//Send Details
															const rawResponse = await fetch(fetchURL, {
																method: "POST",
																mode: "cors",
																headers: new Headers({
																	"Content-Type": "application/json",
																	Accept: "application/json",
																	HeaderTokens: JSON.stringify({
																		refreshToken: auth.currentUser.refreshToken,
																		authDomain: auth.currentUser.authDomain,
																		uid: auth.currentUser.uid,
																		email: auth.currentUser.email,
																		hostname: auth.currentUser.hostname,
																		gameMeta: {
																			x: heroSpriteX.current.x,
																			y: heroSpriteX.current,
																		},
																		hostname2: window.location.hostname,
																	}),
																}),
																body: JSON.stringify({
																	UUID: auth.currentUser.uuid,
																	UsedItem: String(el).split(",")[0],
																	playerCoords: {
																		x: heroSpriteX.current,
																		y: heroSpriteY.current,
																	},
																}),
															});
															console.log(rawResponse);
														}
														sendRequest();
													}
												}
												runFunction();
												console.log("Running Backend NPC Interaction");
											}}
										>
											X
										</button>
										&nbsp;
									</span>
								);
							})}
					</span>
				</span>
			</span>
			<span
				id={"NPCChatSpan"}
				hidden={NPCChatHidden}
				style={{
					position: "absolute",
					backgroundColor: "#000000DD",
					zIndex: 1008,
					leftMargin: "auto",
					left: 100,
					top: "20%",
					width: "70%",
					height: "40%",
					alignContent: "center",
					alignItems: "center",
					color: "whiteSmoke",
					fontWeight: "1",
					fontFamily: "courier",
					textShadow: "1px 1px 15px #FFFFFF,1px 1px 15px #FFFFFF",
					fontSize: "20px",
				}}
			>
				<div style={{ width: "100%" }}>
					<br />
					<center>
						{rightClickMenuGotChat.current[0] && rightClickMenuGotChat.current[0].key}
					</center>
					<br />
					<br />
					<center>
						{rightClickMenuGotChat.current[0] &&
							rightClickMenuGotChat.current[0].text}
					</center>
					<br />
					<span
						id="NPCInteractionButtonsSpan"
						style={{ position: "relative", top: "100px" }}
					>
						<center>
							<button
								id="NPCSendInteraction"
								hidden={!NPCHasChat}
								className="NPCSendInteractionClass"
								onClick={() => {
									async function runFunction() {
										let useEmulator = false;
										if (window.location.pathname === "/game") {
											console.log("Sending 25s Interval Status");
											require("firebase/functions");

											async function sendRequest(props) {
												//Emulator local url for development:
												let fetchURL = "";
												const urlLocal = `http://localhost:5001/ohana-rpg/us-central1/GetFromNPC`;

												// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)
												//Live  url:
												const urlLive =
													"https://us-central1-ohana-rpg.cloudfunctions.net/GetFromNPC";

												if (useEmulator && window.location.hostname.includes("localhost")) {
													fetchURL = urlLocal;
												} else {
													fetchURL = urlLive;
												}

												//Send Details
												const rawResponse = await fetch(fetchURL, {
													method: "POST",
													mode: "cors",
													headers: new Headers({
														"Content-Type": "application/json",
														Accept: "application/json",
														HeaderTokens: JSON.stringify({
															refreshToken: auth.currentUser.refreshToken,
															authDomain: auth.currentUser.authDomain,
															uid: auth.currentUser.uid,
															email: auth.currentUser.email,
															hostname: auth.currentUser.hostname,
															gameMeta: { x: heroSpriteX.current.x, y: heroSpriteX.current },
															hostname2: window.location.hostname,
														}),
													}),
													body: JSON.stringify({
														UUID: auth.currentUser.uuid,
														NPCName: "FarmerJohn",
													}),
												});
												console.log(rawResponse);
											}
											sendRequest();
										}
									}
									runFunction();
									console.log("Running Backend NPC Interaction");
								}}
							>
								<GiCheckMark
									id="NPCSendInteractionIcon"
									className="NPCSendInteractionClass"
									size="25px"
								/>
							</button>
							&nbsp;
							<button
								id="NPCCancelInteractionButton"
								hidden={!NPCHasChat}
								className="NPCCancelInteractionClass"
								onClick={() => {
									setNPCChatHidden(true);
									NPCChatRef.current = false;
									NPCChatHiddenRef.current = true;
								}}
							>
								<GiCancel
									id="NPCCancelInteractionIcon"
									className="NPCCancelInteractionClass"
									size="25px"
								/>
							</button>
						</center>
					</span>
				</div>
			</span>
			<span
				onMouseLeave={() => {
					setRightClickMenuHidden(true);
				}}
				className="rightClickMenuClass"
				id={"rightClickMenuSpan" + rightClickMenuCoords.x + rightClickMenuCoords.y}
				hidden={rightClickMenuHidden}
				style={{
					position: "absolute",
					backgroundColor: "#000000DD",
					zIndex: 1008,
					leftMargin: "auto",
					left: rightClickMenuCoords.x,
					top: rightClickMenuCoords.y,
					width: "fit",
					alignContent: "center",
					padding: "auto",
					alignItems: "center",
					userSelect: "none",
					color: "gray",
					fontWeight: "1",
					fontFamily: "courier",
					textShadow: "1px 1px 5px #FFFFFF",
					fontSize: "19px",
					borderTopRightRadius: "10px",
					borderBottomRightRadius: "10px",
					borderBottomLeftRadius: "10px",
				}}
			>
				<span style={{ position: "absolute", top: "-9px", left: "1px" }}>
					<svg height="21" width="50">
						<polygon
							color="white"
							file="white"
							points="0,10 0,20 10,10"
							style={{ fill: "whiteSmoke" }}
						/>
					</svg>
				</span>
				{!rightClickMenuRef.current &&
					rightClickMenuSelect.current.map((ele, index) => {
						if (ele.meta === "static") {
							return (
								<div
									className="rightClickMenuClass"
									style={{
										color: "white",
										textShadow: "1px 1px 15px white,1px 1px 15px white",
									}}
									key={"NPCChat" + ele.key}
								>
									&nbsp;{ele.key}&nbsp;
									<button
										key={"NPCChat2" + ele.key}
										id={
											rightClickMenuGotChat.current[0] &&
											rightClickMenuGotChat.current[0].text
										}
										hidden={!NPCHasChat}
										className="rightClickMenuClass"
										onMouseDown={() => {
											setRightClickMenuHidden(true);

											setNPCChatHidden(false);
											NPCChatRef.current = true;
											NPCChatHiddenRef.current = true;
											console.log(
												rightClickMenuGotChat.current[index] &&
													rightClickMenuGotChat.current[index].text
											);
										}}
									>
										<IoChatboxEllipsesOutline
											id="rightClickMenuIcon"
											className="rightClickMenuClass"
											size="25px"
										/>
									</button>
								</div>
							);
						} else if (ele.meta === "monster") {
							return (
								<div
									style={{
										color: "red",
										textShadow: "1px 1px 15px red,1px 1px 15px red",
									}}
									key={"RCM" + ele.key}
								>
									&nbsp;{ele.key}&nbsp;
								</div>
							);
						} else if (ele.meta === "plant") {
							return (
								<div
									style={{
										color: "green",
										textShadow: "1px 1px 10px green,1px 1px 10px green",
									}}
									key={"RCM" + ele.key}
								>
									<span style={{ position: "relative", top: "5px", left: "15px" }}>
										&nbsp;{ele.itemName}&nbsp;
									</span>
									<button
										style={{
											position: "relative",
											margin: "4px",
											float: "right",
											backgroundColor: "#227722",
											borderRadius: "5px",
											border: "none",
										}}
										key={"NPCChat2" + ele.key}
										id={
											rightClickMenuGotChat.current[0] &&
											rightClickMenuGotChat.current[0].text
										}
										className="rightClickMenuClass"
										onMouseDown={() => {
											setRightClickMenuHidden(true);
											async function runFunction() {
												let useEmulator = false;
												if (window.location.pathname === "/game") {
													console.log("Sending 25s Interval Status");
													require("firebase/functions");

													async function sendRequest(props) {
														//Emulator local url for development:
														let fetchURL = "";
														const urlLocal = `http://localhost:5001/ohana-rpg/us-central1/HarvestPlant`;

														// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)
														//Live  url:
														const urlLive =
															"https://us-central1-ohana-rpg.cloudfunctions.net/HarvestPlant";

														if (
															useEmulator &&
															window.location.hostname.includes("localhost")
														) {
															fetchURL = urlLocal;
														} else {
															fetchURL = urlLive;
														}

														//Send Details
														const rawResponse = await fetch(fetchURL, {
															method: "POST",
															mode: "cors",
															headers: new Headers({
																"Content-Type": "application/json",
																Accept: "application/json",
																HeaderTokens: JSON.stringify({
																	refreshToken: auth.currentUser.refreshToken,
																	authDomain: auth.currentUser.authDomain,
																	uid: auth.currentUser.uid,
																	email: auth.currentUser.email,
																	hostname: auth.currentUser.hostname,
																	gameMeta: { x: heroSpriteX.current.x, y: heroSpriteX.current },
																	hostname2: window.location.hostname,
																}),
															}),
															body: JSON.stringify({
																UUID: auth.currentUser.uuid,
																HarvestObjKey: ele.key,
																itemName: ele.itemName,
															}),
														});
														console.log(rawResponse);
													}
													sendRequest();
												}
											}
											runFunction();

											console.log(ele.lastEdit);
											window.runDestroyPlant();
										}}
									>
										<GiWheat
											id="rightClickMenuIcon"
											className="rightClickMenuClass"
											size="25px"
										/>
									</button>
								</div>
							);
						} else {
							return false;
						}
					})}
				<span id="RightClickMenuList"></span>
				<br />
				<small style={{ margin: "5px" }}>
					{" "}
					X: {Math.round(inGameMouseXY.current.x)} Y:{" "}
					{Math.round(inGameMouseXY.current.y)}
				</small>
			</span>
		</div>
	);

	function createItemDrop(tempItemsGroup, bodyB, time) {
		tempItemsGroup
			.create(bodyB.x, bodyB.y, "terrainSheet")
			.setCollideWorldBounds(true)
			.setPipeline("Light2D")
			.setScale(1)
			.setFrame(974)
			.setDrag(150)
			.setInteractive()
			.setVelocity(0)
			.setDepth(20032).name = "seed_Corn_age_" + time;
	}
}
