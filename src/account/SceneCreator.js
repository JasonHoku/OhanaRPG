import firebase from "firebase/app";

import React, { useState, useEffect, useRef } from "react";

import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
// import {
//   FirebaseAppProvider,
//   useFirestoreDocData,
//   useFirestore,
// } from "reactfire";

// import { IoPencil, IoEyedrop } from "react-icons/io5";
import { FaEraser, FaRegCircle, FaEye } from "react-icons/fa";
// import { AiOutlineLine } from "react-icons/ai";
import { RiDownloadFill, RiUpload2Fill } from "react-icons/ri";
import { IoSave } from "react-icons/io5";
import { VscDebugRestart } from "react-icons/vsc";

// import { MdLocalMovies } from "react-icons/md";

// import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";

export default function SceneCreator() {
	const [popoverOpen2, setPopoverOpen2] = useState(false);
	const [popoverOpen3, setPopoverOpen3] = useState(false);
	// const [isMouseDown, setIsMouseDown] = useState(false);
	// const [isMovementHeld, setIsMovementHeld] = useState(false);
	const [stateMainStackCounter, setStateMainStackCounter] = useState(0);

	const [readyLoadToSceneMeta, setReadyLoadToSceneMeta] = useState({
		meta: "",
		x: "",
		y: "",
	});

	var readyLoadToSceneRef = useRef({
		meta: "",
		x: "",
		y: "",
	});

	// const [saveNameVar, setSaveNameVar] = useState("NameYourSave");
	const [hideShowState, setHideShowState] = useState("Hide");

	const [activeSceneType, setActiveSceneType] = useState("MapEditor");
	const [activeSpriteXState, setActiveSpriteXState] = useState(0);
	const [activeSpriteYState, setActiveSpriteYState] = useState(0);

	const [animationStateArray, setAnimationStateArray] = useState([]);

	var CanvasStackID = useRef(0);
	var activeSpriteX = useRef(0);
	var activeSpriteY = useRef(0);
	var backgroundX = useRef(0);
	var backgroundY = useRef(0);

	var animationFrameCounter = useRef(0);
	const [selectedCanvasID, setSelectedCanvasID] = useState(0);

	const [stateMetaData, setStateMetaData] = useState({
		selectedCanvasID: selectedCanvasID,
	});

	var staticSpriteX = useRef(0);
	var staticSpriteY = useRef(0);
	const isInitialMount = useRef(true);
	const KeyPressMoveInterval = useRef(true);
	const KeyPressMoveBool = useRef(true);
	var movementIntervalCounter = useRef(true);
	var importedSpriteCounter = useRef(true);
	var activeAnimationIntervalCounter = useRef(true);
	var movementIntervalCheck = useRef(true);

	var monsterMovementIntervalCounter = useRef(true);

	const auth = firebase.auth();

	const toggle2 = () => setPopoverOpen2(!popoverOpen2);
	const toggle3 = () => setPopoverOpen3(!popoverOpen3);

	const [loadedSaveFiles, setLoadedSaveFiles] = useState([]);

	let saveDataArray = [];
	let loadedVarKeys = [];

	let countVar = 0;
	let counterVar = 0;

	var canvas = document.getElementById("mainScene");
	var ctx = canvas && canvas.getContext("2d");

	const prettyButtons = {
		width: "103px",
		backgroundColor: "#3322AA",
		height: "30px",
		alignSelf: "center",
		zIndex: 999,
		float: "center",
		textAlign: "center",
		borderRadius: "10px",
		fontSize: "15px",
	};
	const prettyButtonReset = {
		width: "103px",
		backgroundColor: "#AA2233",
		height: "30px",
		alignSelf: "center",
		float: "center",
		textAlign: "center",
		borderRadius: "10px",
		fontSize: "15px",
	};
	const prettyText = {
		color: "whitesmoke",
		zIndex: 999,
		fontWeight: "1",
		fontFamily: "courier",
		textShadow: "1px 1px 15px #FFFFFF,1px 1px 15px #FFFFFF",
		fontSize: "20px",
		position: "relative",
		top: "0px",
	};

	//Begin ListUseEffects
	useEffect(() => {
		console.log("Updating State Refresh UseEffect");
		if (!isInitialMount.current) {
			//loads last
		} else {
			var canvas = document.getElementById("mainScene");
			var ctx = canvas && canvas.getContext("2d");

			// Create Object JSON
			console.log("Loading GameData");
			let dbData = {};
			let imgSrcArray = [];
			let gotLoadedObjectData = [];
			let gameObjectData = {};
			var db = firebase.firestore();
			db
				.collection("GameObjects")
				.get()
				.then((userData) => {
					userData.forEach((doc) => {
						var key = doc.id;
						var data = doc.data();
						data["key"] = key;
						dbData[key] = data;
					});
					let dbDataArray = Object.values(dbData);
					//Check Through Array of User Collections
					dbDataArray.forEach((dbArrayEle, index) => {
						if (dbArrayEle) {
							console.log("Got Scene Object Data: ");
							//Format Into Names
							gotLoadedObjectData.push(dbArrayEle);
						}
					});
					// Send Array To Objects
					//Load Object Properties Array From Database
					gotLoadedObjectData.forEach((ele, index) => {
						importedSpriteCounter.current++;
						try {
							//Separate Properties, Create Image
							ele.readyVar = false;
							var img = new Image();
							img.onload = function () {
								//          console.log("||| Is Loaded: " + index + " ||| " + img.src);
								ele.imgSrcArray = img;
								ele.readyVar = true;
							};
							img.src = ele.images[0];

							// Hero image
						} catch (error) {}
					});

					console.log(gotLoadedObjectData);
					console.log(imgSrcArray);
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

			var bushReady = false;
			var bushImage = new Image();
			bushImage.onload = function () {
				bushReady = true;
			};
			bushImage.src = "images/bush.png";

			// Game objects
			var hero = {
				speed: 500, // movement in pixels per second
			};

			var monster = {};
			var bush = {};
			var background = {};
			var staticSprite = {};

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
			var reset = function () {
				console.log("Updated Img Src:");
				console.log(" ");

				// Define Object Types Based On MetaData
				hero.x = 300;
				hero.y = 300;
				bush.x = 300;
				bush.y = 100;
				staticSprite.x = 0;
				staticSprite.y = 0;
				background.x = -2000;
				background.y = -2000;
				monster.x = 432 + Math.random() * (600 - 64);
				monster.y = -32 + Math.random() * (-600 - 64);
			};

			// Update Game Objects
			var update = function (modifier) {
				// If not on /create stop updating
				if (window.location.pathname === "/create") {
					//  Resize Canvas To Window
					canvas.width = window.innerWidth;
					canvas.height = window.innerHeight;
					//
					// Count Frames
					activeAnimationIntervalCounter.current++;
					if (activeAnimationIntervalCounter.current >= 50) {
						activeAnimationIntervalCounter.current = 0;
					}

					//Set Refs
					activeSpriteX.current = Math.round(hero.x);
					activeSpriteY.current = Math.round(hero.y);
					backgroundX.current = Math.round(background.x);
					backgroundY.current = Math.round(background.y);
					staticSpriteX.current = Math.round(staticSprite.x);
					staticSpriteY.current = Math.round(staticSprite.y);

					//Set State
					setActiveSpriteXState(activeSpriteX.current);
					setActiveSpriteYState(activeSpriteX.current);
					setActiveSpriteXState(backgroundY.current);
					setActiveSpriteXState(backgroundX.current);
					setActiveSpriteXState(staticSpriteX.current);
					setActiveSpriteYState(staticSpriteY.current);

					// NYI: Choose Objects
					setSelectedCanvasID(1);
					setStateMainStackCounter(1);

					//Count Frames For Movement
					ctx.width = document.body.clientWidth;
					movementIntervalCounter.current++;

					gotLoadedObjectData.forEach((el, index) => {
						var key = el.key;
						var data = el;
						data["key"] = key;
						gameObjectData[key] = data;

						// varArray.array.forEach((element) => {
						//   window[varArray[element]] = element;
						// });
						// console.log(varArray); // => name1

						backgroundX.current = Math.round(background.x);
						backgroundY.current = Math.round(background.y);

						setActiveSpriteXState(activeSpriteX.current);
						setActiveSpriteYState(activeSpriteX.current);
						if (el.meta === "hero") {
							hero.x = el.x;
							hero.y = el.y;
						}

						if (el.meta === "monster") {
							monster.x = el.x;
							monster.y = el.y;
						}

						if (el.meta === "hero") {
							activeSpriteX.current = Math.round(el.x);
							activeSpriteY.current = Math.round(el.y);

							//Map Controls To Window
							window.moveHeroForward = function moveHeroForward() {
								el.y -= hero.speed * modifier;
								// If  Sprite Y too high :: Stop Sprite Start BG
								if (el.y <= 250) {
									el.y += hero.speed * modifier;
									bush.y += hero.speed * modifier;
									el.y = 250;

									if (background.y <= 0) {
										background.y += hero.speed * modifier;
									}
								}
							};
							if ("KeyW" in keysDown) {
								// Moving Forward
								window.moveHeroForward();
							}
							if ("KeyS" in keysDown) {
								// Moving Forward
								el.y += hero.speed * modifier;
								// If  Sprite Y too high :: Stop Sprite Start BG
								if (el.y >= canvas.height - canvas.height / 2) {
									el.y -= hero.speed * modifier;

									el.y = canvas.height - canvas.height / 2;
									// If background y too low :: Stop Everything
									bush.y -= hero.speed * modifier;
									if (background.y > -4000 + canvas.height) {
										background.y -= hero.speed * modifier;
									}
								}
							}

							if ("KeyA" in keysDown) {
								// Moving Forward
								el.x -= hero.speed * modifier;
								// If  Sprite Y too high :: Stop Sprite Start BG
								if (el.x <= 300) {
									el.x += hero.speed * modifier;
									el.x = 300;
									// If background y too low :: Stop Everything
									bush.x += hero.speed * modifier;
									if (background.x <= 0) {
										background.x += hero.speed * modifier;
									}
								}
							}
							if ("KeyD" in keysDown) {
								// Moving Forward
								el.x += hero.speed * modifier;
								// If  Sprite Y too high :: Stop Sprite Start BG
								if (el.x >= canvas.height - canvas.height / 2) {
									el.x -= hero.speed * modifier;
									el.x = canvas.height - canvas.height / 2; // If background y too low :: Stop Everything
									bush.x -= hero.speed * modifier;
									if (background.x > -4000 + canvas.width) {
										background.x -= hero.speed * modifier;
									}
								}
							}
						}

						/// Non Mobing Object Types
						if (el.meta === "static") {
							staticSprite.x = el.x;
							staticSprite.y = el.y;
							if ("KeyW" in keysDown) {
								// Moving Forward
								// If  Hero Sprite Y too high :: Stop Sprite Start BG
								if (hero.y <= 250) {
									el.y += hero.speed * modifier;
								}
							}
							if ("KeyS" in keysDown) {
								// If  Sprite Y too high :: Stop Sprite Start BG
								if (hero.y >= canvas.height - canvas.height / 2) {
									el.y -= hero.speed * modifier;
								}
							}

							if ("KeyA" in keysDown) {
								// If  Sprite Y too high :: Stop Sprite Start BG
								if (hero.x <= 300) {
									el.x += hero.speed * modifier;
								}
							}
							if ("KeyD" in keysDown) {
								// If  Sprite Y too high :: Stop Sprite Start BG
								if (hero.x >= canvas.height - canvas.height / 2) {
									el.x -= hero.speed * modifier;
								}
							}
						}

						if (el.meta === "monster") {
							window.moveMonsterForward = function () {
								if (hero.y <= 250) {
									el.y += hero.speed * modifier;
								}
							};

							if ("KeyW" in keysDown) {
								// Moving Forward
								// If  Hero Sprite Y too high :: Stop Sprite Start BG
								window.moveMonsterForward();

								staticSprite.y += hero.speed * modifier;
							}

							if ("KeyS" in keysDown) {
								// If  Sprite Y too high :: Stop Sprite Start BG
								if (hero.y >= canvas.height - canvas.height / 2) {
									el.y -= hero.speed * modifier;
								}
							}

							if ("KeyA" in keysDown) {
								// If  Sprite Y too high :: Stop Sprite Start BG
								if (hero.x <= 300) {
									el.x += hero.speed * modifier;
								}
							}
							if ("KeyD" in keysDown) {
								// If  Sprite Y too high :: Stop Sprite Start BG
								if (hero.x >= canvas.height - canvas.height / 2) {
									el.x -= hero.speed * modifier;
								}
							}

							if (!monsterMovementIntervalCounter.current) {
								monsterMovementIntervalCounter.current = 0;
							}
							monsterMovementIntervalCounter.current++;

							if (Math.floor(Math.random() * 100) >= 95) {
								//Separate movements for monsters
								if (Math.random() >= 0.5) {
									if (monsterMovementIntervalCounter.current <= 500) {
										if (el.y < canvas.clientHeight) {
											if (el.x < canvas.clientWidth) {
												el.x -= 2;
											}
										}
									}
								} else {
									if (monsterMovementIntervalCounter.current <= 500) {
										if (el.y < canvas.clientHeight) {
											if (el.x < canvas.clientWidth) {
												el.x += 2;
											}
										}
									}
								}
								if (Math.random() >= 0.5) {
									if (monsterMovementIntervalCounter.current >= 501) {
										if (el.y < canvas.clientHeight) {
											if (el.x < canvas.clientWidth) {
												el.y += 2;
											}
										}
									}
								} else {
									if (monsterMovementIntervalCounter.current >= 501) {
										if (el.y < canvas.clientHeight) {
											if (el.x < canvas.clientWidth) {
												el.y -= 2;
											}
										}
									}
								}
							}

							if (monsterMovementIntervalCounter.current === 1000) {
								monsterMovementIntervalCounter.current = 0;
							}
							if (movementIntervalCounter.current === 144) {
								movementIntervalCounter.current = 0;
							}
						}
					});
					if ("Space" in keysDown) {
						// Player holding  Space
						if (activeAnimationIntervalCounter.current < 30) {
							hero.y -= 6;
						}
						if (activeAnimationIntervalCounter.current >= 30) {
							hero.y += 6;
						}
					}

					// Join Staged DB to Game Function
					window.gameObjectData = gameObjectData;
					window.gotLoadedObjectData = gotLoadedObjectData;
					gotLoadedObjectData = window.gotLoadedObjectData;
					gameObjectData = window.gameObjectData;

					//End Game Keybindings
					//Begin Game Functions

					// function resetMonster() {
					//   return false;
					// }

					// Check Database For New Data

					// Attach Function To Outside Window
					window.checkDB = function checkDB(props) {
						console.log("Check Database Test");
						console.log(props);
					};

					// End Game If Not On Game Page
				} else return null;
			};
			// Draw everything
			var render = function () {
				if (bgReady) {
					ctx.drawImage(bgImage, background.x, background.y, 4000, 4000);
				}
				if (bushReady) {
					ctx.drawImage(bushImage, bush.x, bush.y, 160, 200);
				}
				// Todo: ZIndexCanvas Here: if Ele meta for each?
				gotLoadedObjectData.forEach((ele) => {
					if (ele.readyVar) ctx.drawImage(ele.imgSrcArray, ele.x, ele.y, 160, 200);
				});
			};
			// The main game loop
			var main = function () {
				var now = Date.now();
				var delta = now - then;
				then = now;
				update(delta / 1000);
				render();
				requestAnimationFrame(main);
			};

			// Cross-browser support for requestAnimationFrame

			// Let's play this game!
			var then = Date.now();
			reset();
			main();

			console.log("Rendering Main Scene");
			const EL = (sel) => document.querySelector(sel);
			const ctx2 = EL("#mainScene").getContext("2d");
			var mainScene = document.getElementById("mainScene");
			mainScene.style.width = document.body.clientWidth;
			mainScene.style.height = document.body.clientHeight;
			mainScene.style.position = "absolute";
			mainScene.style.left = "0px";
			mainScene.style.top = "0px";

			ctx2.canvas.width = document.body.clientWidth;
			ctx2.canvas.height = document.body.clientHeight;

			ctx2.imageSmoothingEnabled = false;

			// Pre Load - Loads Once
			document.addEventListener("keydown", (e, i) => {
				KeyPressMoveBool.current = true;
				// let gotCurrentPixelAsDataURL = String(
				//   document
				//     .querySelector(`#CanvasStackID${CanvasStackID.current}`)
				//     .toDataURL("image/png", 1)
				// );
				// let getCanvasByID = document.getElementById(
				//   `CanvasStackID${CanvasStackID.current}`
				// );
				// let ctx = getCanvasByID.getContext("2d");
				// const img = new Image();
				// img.src = gotCurrentPixelAsDataURL;
				// img.onload = function () {
				//   ctx.clearRect(0, 0, getCanvasByID.width, getCanvasByID.height);
				//   ctx.drawImage(img, 10, 0);
				// };
			});
			document.addEventListener("keyup", (e) => {
				KeyPressMoveBool.current = false;
				// After Pre -- Load OnStateUpdate
			});
			isInitialMount.current = false;
			document.addEventListener("mousedown", (e) => {
				setPopoverOpen3(false);
				if (e.target.id !== "NameYourSaveInput") {
					setPopoverOpen2(false);
				}
			});
		}
	}, [ctx]);
	//end useEffect

	// Begin ListFunctions
	function decideLoadMainScene() {
		return (
			<canvas
				style={{
					position: "absolute",
					top: "0px",
					left: "0px",
					width: "100%",
					height: "100%",
					zIndex: 0,
				}}
				onMouseDown={(e) => {
					if (e.detail > 1) {
						e.preventDefault();
					}
				}}
				id="mainScene"
			></canvas>
		);
	}
	function decideRenderSavedLoads() {
		console.log("Loading Loads");
		let dbData = {};
		let gotLoadedSaves = [];
		let gotLoadedIDs = [];
		let gotLoadedAnimations = [];
		const auth = firebase.auth();
		var db = firebase.firestore();
		db
			.collection("Users")
			.doc(auth.currentUser.uid)
			.get()
			.then((userData) => {
				var key = userData.id;
				var data = userData.data();
				data["key"] = key;
				dbData[key] = data;

				let dbDataArray = Object.values(dbData[auth.currentUser.uid]);
				//Check Through Array of User Collections
				dbDataArray.forEach((dbArrayEle, index) => {
					if (dbArrayEle.PixelSaveData) {
						console.log("Got Data: ");

						//Format Into Names
						gotLoadedIDs.push(
							String(index) +
								"$%^^%$" +
								JSON.stringify(dbArrayEle.PixelSaveData).split("{")[1].split(":")[0]
						) &&
							//Format into IDs
							gotLoadedSaves.push(
								String(index) +
									"$%^^%$" +
									JSON.stringify(dbArrayEle.PixelSaveData)
										.split(`":"`)[1]
										.replace(`"}`, "")
							);

						gotLoadedAnimations.push(dbArrayEle.AnimationData);
					}
				});

				console.log(gotLoadedSaves);

				var arrLength = Array.apply(null, Array(gotLoadedSaves.length));
				let pixelArray = [];

				arrLength.forEach((each, index) => {
					if (
						String(
							gotLoadedIDs[index]
								.substring(1)
								.replace(`"`, "")
								.split("$%^^%$")[1]
								.replace(`"`, "")[0] !== "d"
						)
					) {
						console.log("True");
					}

					console.log(
						String(
							gotLoadedIDs[index]
								.substring(1)
								.replace(`"`, "")
								.split("$%^^%$")[1]
								.replace(`"`, "")[0]
						)
					);
					console.log(index);
					pixelArray.push(
						<div
							key={
								gotLoadedIDs[index]
									.substring(1)
									.replace(`"`, "")
									.replace(`"`, "")
									.split("$%^^%$")[1]
							}
							style={{
								minWidth: "165px",
								boxShadow: "0px 2px 2px 2px #666666",
								textAlight: "right",
								margin: "2px",
							}}
							id={"loadedPixelsSpan" + index}
						>
							{
								gotLoadedIDs[index]
									.substring(1)
									.replace(`"`, "")
									.replace(`"`, "")
									.split("$%^^%$")[1]
							}
							&nbsp;
							<span style={{ display: "inline-flex", float: "right" }}>
								<button
									style={{
										width: "95px",
										height: "20px",
										color: "white",
										backgroundColor: "darkgreen",
									}}
									onClick={(e) => {
										setPopoverOpen3(() => setPopoverOpen3(false));
										toggle3();
										e.preventDefault();
										console.log("Sending To Live!");
										const auth = firebase.auth();
										var db = firebase.firestore();
										db
											.collection("Users")
											.doc(auth.currentUser.uid)
											.get()
											.then((userData2) => {
												let dbData2 = {};
												var key2 = userData2.id;
												var data2 = userData2.data();
												data2["key"] = key2;
												dbData2[key2] = data2;

												let dbDataArray = Object.values(dbData[auth.currentUser.uid]);
												dbDataArray.sort();
												//Check Through Array of User Collections
												gotLoadedAnimations &&
													gotLoadedAnimations.forEach((LoadedAnimationElements, index) => {
														console.log("Pushing Loaded Animations To Workspace");
														console.log(LoadedAnimationElements);
														var dataURL = LoadedAnimationElements;
														var w = 160;
														var h = 200;
														var canvas = document.createElement("canvas");
														canvas.id = "SavedCanvasID" + parseInt(index);
														canvas.width = w;
														canvas.height = h;
														canvas.style.zIndex = 8;
														var img = new Image();
														img.src = dataURL;
														img.height = w;
														img.width = h;
													});
												dbDataArray.forEach((dbArrayEle) => {
													if (dbArrayEle.PixelSaveData) {
														console.log("Got Data: ");

														//Format Into Names
														gotLoadedIDs.push(
															JSON.stringify(dbArrayEle.PixelSaveData)
																.split("{")[1]
																.split(":")[0]
																.split("$%^^%$")[1]
														) &&
															//Format into
															gotLoadedSaves.push(
																JSON.stringify(dbArrayEle.PixelSaveData)
																	.split(`":"`)[1]
																	.replace(`"}`, "")
																	.split("$%^^%$")[1]
															);
														// console.log(
														//   JSON.stringify(String(dbArrayEle.PixelSaveData).split("{")[0])
														// );
													}
												});
												gotLoadedAnimations[index] &&
													// gotLoadedAnimations[index].forEach(
													//   (loadedAniElements, index6) => {
													//     console.log(index6);
													//     console.log(loadedAniElements);
													//     if (isNaN(animationFrameCounter.current)) {
													//       animationFrameCounter.current = 0;
													//     }
													//     console.log(
													//       "||| AniFrameCount.current " +
													//         animationFrameCounter.current
													//     );
													//     animationFrameCounter.current++;
													//     var dataURL = loadedAniElements;
													//     var w = 160;
													//     var h = 200;

													//     var canvasNewAni = document.createElement(
													//       "canvas"
													//     );
													//     canvasNewAni.id =
													//       "SavedCanvasID" +
													//       parseInt(animationFrameCounter.current);
													//     canvasNewAni.width = w;
													//     canvasNewAni.height = h;
													//     canvasNewAni.style.zIndex = 8;
													//     var savedCanvas = document.getElementById(
													//       `SavedCanvasID${parseInt(
													//         animationFrameCounter.current
													//       )}`
													//     );
													//     var ctxPreviewNew = savedCanvas.getContext("2d");
													//     var img = new Image();
													//     img.src = dataURL;
													//     img.height = w;
													//     img.width = h;
													//     img.onload = function () {
													//       ctxPreviewNew.drawImage(img, 0, 0, w, h);
													//       //push new frame to State Animation Array
													//       let joinedArray = animationStateArray;
													//       joinedArray.push(img.src);
													//       setAnimationStateArray(joinedArray);
													//       console.log(animationStateArray);
													//       console.log(animationFrameCounter.current);
													//     };
													//   }
													// );
													console.log(gotLoadedSaves[index]);
												console.log(gotLoadedIDs[index]);

												document.getElementById("ChatBox").innerHTML =
													gotLoadedSaves[index];
												setReadyLoadToSceneMeta({
													images: gotLoadedSaves[index],
												});
												// Send To editorSceneSpan
												// var canvas = document.querySelector("#activeCanvas");
												// var ctx = canvas.getContext("2d");

												// var dataURL = gotLoadedSaves[index].substring(1);
												// ctx.imageSmoothingEnabled = true;
												// var img = new Image();
												// img.src = dataURL;
												// img.onload = function () {
												//   ctx.drawImage(img, 0, 0);
												// };
											});
									}}
								>
									<span
										style={{
											position: "relative",
											left: "-6px",
										}}
									>
										Choose
									</span>
								</button>
							</span>
							<br />
						</div>
					);
				});

				pixelArray.sort((a, b) =>
					a.props.children[0].localeCompare(b.props.children[0])
				);

				return setLoadedSaveFiles(pixelArray);
			});
	}
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
				<span style={{ position: "absolute", top: "35px", right: "25px" }}>
					Welcome, {auth.currentUser.displayName}
				</span>
				<span
					style={{
						position: "absolute",
						top: "35px",
						fontSize: "22px",
						zIndex: 999,
						right: "15px",
					}}
				>
					Scene Creator &nbsp;
				</span>
				<span
					style={{
						position: "absolute",
						top: "125px",
						zIndex: 999,
						fontSize: "22px",
						textAlign: "left",
						left: "25px",
					}}
				>
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
					{hideShowState}&nbsp;
					<span id="StatsHideID">
						<button
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								top: "6px",
							}}
						>
							<a
								href="#/"
								id="dl"
								download="Canvas.png"
								style={{
									height: "25px",
									textDecoration: "none",
									color: "black",
									width: "25px",
									position: "relative",
									top: "1px",
								}}
							>
								<RiDownloadFill
									style={{
										height: "25px",
										width: "25px",
										position: "relative",
										left: "-8px",
										top: "-3px",
									}}
								/>
							</a>
						</button>
						DL&nbsp;
						<input
							style={{ width: "180px", position: "relative", top: "-4px" }}
							type="file"
							id="fileUpload"
							hidden
						/>{" "}
						<button
							id="Popover3"
							style={prettyButtons}
							onClick={(e) => {
								if (!popoverOpen3) {
									e.preventDefault();
									decideRenderSavedLoads();
								}
							}}
						>
							<span style={prettyText}>
								Load
								<Popover
									placement="bottom"
									isOpen={popoverOpen3}
									target="Popover3"
									toggle={toggle3}
								>
									<PopoverBody
										style={{
											minWidth: "255px",
											backgroundColor: "black",
											color: "white",
										}}
									>
										{loadedSaveFiles}
									</PopoverBody>
								</Popover>
							</span>
						</button>
						<input
							style={{ width: "180px", position: "relative", top: "-4px" }}
							type="file"
							id="fileUpload"
							hidden
						/>
						<button
							onClick={() => {
								console.log("Save Object Set to DB");
							}}
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								top: "6px",
							}}
						>
							<IoSave
								style={{
									height: "25px",
									width: "25px",
									position: "relative",
									left: "-8px",
									top: "-3px",
								}}
							/>
						</button>
						Save&nbsp;
						<input
							style={{ width: "180px", position: "relative", top: "-4px" }}
							type="file"
							id="fileUpload"
							hidden
						/>
						<button
							onClick={() => {
								if (window.confirm("Clear Current Workspace?")) {
								} else {
									return false;
								}
							}}
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								top: "6px",
							}}
						>
							<VscDebugRestart
								style={{
									height: "25px",
									width: "25px",
									position: "relative",
									left: "-8px",
									top: "-3px",
								}}
							/>
						</button>
						Reset &nbsp;
						<br />
						Scene Type: {activeSceneType}
						<br />
						Active Sprite: {selectedCanvasID}
						<br />
						Sprite Coords: {activeSpriteX.current} {activeSpriteY.current}
						<br />
						Map Coords: {backgroundX.current} {backgroundY.current}
						<br />
						Scene Dimensions : {canvas && canvas.width}
						{" x "}
						{canvas && canvas.height}
						<br />
						Total Sprites: {importedSpriteCounter.current}
						<br />
						Active Z-Index: {stateMainStackCounter}
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
			<span id="SceneStack">{decideLoadMainScene()}</span>
			<span id="editorSceneSpan">
				<canvas
					style={{
						position: "absolute",
						top: "0px",
						left: "0px",
						width: "100%",
						height: "100%",
						zIndex: 0,
					}}
					onMouseDown={(e) => {
						if (e.detail > 1) {
							e.preventDefault();
						}
					}}
					id="editorScene"
				></canvas>
			</span>
			<div
				style={{
					position: "absolute",
					color: "white",
					zIndex: 1005,
					left: "5px",
					top: "5px",
				}}
				id="fps"
			>
				--
			</div>
			<div
				id="ChatContainer"
				style={{
					position: "absolute",
					color: "white",
					zIndex: 1005,
					left: "15px",
					fontSize: "12px",
					bottom: "15px",
					wordWrap: "break-word",
					overflow: "auto",
					height: "150px",
					width: "30%",
					backgroundColor: "#FFFFFF22",
				}}
			>
				<div
					id="ChatBox"
					style={{
						position: "absolute",
						color: "white",
						zIndex: 1005,
						fontSize: "12px",
						bottom: "25px",
						wordWrap: "break-word",
						overflow: "auto",
						height: "150px",
						width: "100%",
						backgroundColor: "#FFFFFF22",
					}}
				></div>
				<input
					onChange={(e) => {
						chatInputFunction(e);
					}}
					style={{
						position: "absolute",
						color: "white",
						zIndex: 1006,
						left: "0",
						bottom: "0",
						border: "0",
						height: "25px",
						width: "75%",
						backgroundColor: "#FFFFFF22",
					}}
				></input>
				<button
					style={{
						position: "absolute",
						color: "white",
						zIndex: 1006,
						right: "0",
						bottom: "0",
						border: "0",
						height: "25px",
						width: "25%",
						backgroundColor: "#FFFFFF22",
					}}
				>
					Send
				</button>
			</div>
			<span
				id="HotBar"
				style={{
					position: "absolute",
					color: "white",
					zIndex: 1007,
					left: "33%",
					bottom: "15px",
					height: "100px",
					width: "50%",
					backgroundColor: "#FFFFFF22",
				}}
			></span>
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
					id="PlayerStatusBar"
					style={{
						color: "white",
						position: "absolute",
						zIndex: 1008,
						left: "50%",
						top: "0",
						margin: "auto",
						transform: "translate(-50%, 0)",
						height: "100px",
						width: "50%",
						backgroundColor: "#FFFFFF22",
					}}
				>
					<svg height="100" width="100">
						<radialGradient id="g" r="1" cx="33%" cy="33%">
							<stop stop-opacity=".6" stop-color="red" offset=".1" />
							<stop stop-opacity="0" stop-color="darkRed" offset=".9" />
							<stop stop-opacity=".3" stop-color="darkRed" offset=".9" />
						</radialGradient>
						<circle
							cx="50"
							cy="50"
							r="40"
							stroke="black"
							stroke-width="3"
							fill="url(#g)"
						/>
					</svg>

					<span
						style={{
							color: "white",
							position: "absolute",
							zIndex: 1008,
							left: "50%",
							transform: "translate(-50%, 0)",
							top: "0",
							margin: "auto",
							height: "100px",
							textAlign: "center",
							width: "65%",
							backgroundColor: "#FFFFFF22",
						}}
					>
						<span>Hoku</span>

						<div
							style={{
								fontSize: "16px",
							}}
						>
							Lv.1
						</div>
						<div
							style={{
								fontSize: "16px",
							}}
						>
							Lahaina Town
						</div>
					</span>
					<svg style={{ float: "right" }} height="100" width="100">
						<radialGradient id="g2" r="1" cx="33%" cy="33%">
							<stop stop-opacity=".6" stop-color="blue" offset=".1" />
							<stop stop-opacity="0" stop-color="darkBlue" offset=".9" />
							<stop stop-opacity=".3" stop-color="darkBlue" offset=".9" />
						</radialGradient>
						<circle
							cx="50"
							cy="50"
							r="40"
							stroke="black"
							stroke-width="3"
							fill="url(#g2)"
						/>
					</svg>
				</span>
			</span>
		</div>
	);
	function chatInputFunction(e) {
		let gotChatData = document.getElementById("ChatBox").innerHtml;
		const gotText = e.target.value;
		const gotText1 = gotText.split(" ")[1];
		const gotText2 = gotText.split(" ")[2];
		const gotText3 = gotText.split(" ")[3];
		const gotText4 = gotText.split(" ")[4];

		if (gotText.includes("/add")) {
			console.log(" ");
			console.log("||| STarting /add command : 3Vars: /add name meta x y ");
			console.log(" ");

			// if (gotText1) {
			//   console.log(gotText1);
			// }
			// if (gotText2) {
			//   console.log(gotText2);
			// }

			if (gotText4) {
				console.log("||| Sending /add command 4Var Detected");
				var db = firebase.firestore();
				db
					.collection("GameObjects")
					.doc(gotText1)
					.set(
						{
							images: [readyLoadToSceneMeta.images],
							meta: gotText2,
							x: parseInt(gotText3),
							y: parseInt(gotText4),
						},
						{ merge: true }
					);
			}
		}
		if (gotText.includes("/get")) {
			let dbData = {};
			db = firebase.firestore();
			console.log("/ get detected");
			console.log("Loading GameData");
			if (gotText2) {
				db
					.collection("GameObjects")
					.get()
					.then((userData) => {
						userData.forEach((doc) => {
							var key = doc.id;
							var data = doc.data();
							data["key"] = key;
							dbData[key] = data;
						});
						//
						let dbDataArray = Object.values(dbData);
						//Check Through Array of User Collections
						console.log("Got Scene Object Data, Iterating: ");
						dbDataArray.forEach((dbArrayEle, index) => {
							if (dbArrayEle) {
								if (dbDataArray[index].key === gotText1) {
									console.log("||| Match Found :");

									document.getElementById("ChatBox").innerHTML =
										dbDataArray[index].images[0];
									setReadyLoadToSceneMeta({
										images: dbDataArray[index].images,
									});

									console.log(dbDataArray[index].key);
									console.log(dbDataArray[index].meta);
									console.log(dbDataArray[index].images);
									console.log(dbDataArray[index].x);
									console.log(dbDataArray[index].y);
									console.log("||| Match End.");
								}
							}
						});
					});
			}
		}
		console.log(gotText);
	}
}
