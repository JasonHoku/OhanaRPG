import firebase from "firebase/app";

import React, { useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";
import html2canvas from "html2canvas";
import {
	FirebaseAppProvider,
	useFirestoreDocData,
	useFirestore,
} from "reactfire";

import { IoPencil, IoEyedrop } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { FaEraser, FaRegCircle } from "react-icons/fa";
import { AiOutlineLine } from "react-icons/ai";
import { RiDownloadFill, RiUpload2Fill } from "react-icons/ri";
import {
	IoSwapHorizontalOutline,
	IoSave,
	IoSquareOutline,
	IoSquare,
} from "react-icons/io5";
import { VscDebugRestart } from "react-icons/vsc";
import { TiZoomIn, TiZoomOut } from "react-icons/ti";

import { CgColorBucket } from "react-icons/cg";

import { MdLocalMovies, MdMore, MdGridOn } from "react-icons/md";

import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";

export default function SpriteBuilder() {
	const [pixelColor, setPixelColor] = useState("#000000");
	const [activePixelDataURL, setActivePixelDataURL] = useState("");
	const [saveNameVar, setSaveNameVar] = useState("NameYourSave");
	const [activeCanvasType, setActiveCanvasType] = useState("CharacterBuilder");

	const [animationStateArray, setAnimationStateArray] = useState([]);
	const [activeCanvasZoomStateArray, setActiveCanvasZoomStateArray] = useState(
		[]
	);
	const [frameCounter, setFrameCounter] = useState(0);
	const [lineBrushCounter, setLineBrushCounter] = useState(0);
	const [frameRateControl, setFrameRateControl] = useState(1000);
	const [brushSizeControl, setBrushSizeControl] = useState(5);
	const [brushSoftControl, setBrushSoftControl] = useState(1);
	const [activeCanvasX, setActiveCanvasX] = useState(320);
	const [activeCanvasY, setActiveCanvasY] = useState(400);
	const [activePixelCanvasX, setActivePixelCanvasX] = useState(32);
	const [activePixelCanvasY, setActivePixelCanvasY] = useState(40);
	const [activePixelSize, setActivePixelSize] = useState(10);
	const [recentColors, setRecentColors] = useState([]);
	const [loadedSaveFiles, setLoadedSaveFiles] = useState([]);
	const [loadedGlobalFiles, setLoadedGlobalFiles] = useState([]);
	const [activeFrameCounter, setActiveFrameCounter] = useState(0);
	const [isMouseDown, setIsMouseDown] = useState(false);
	const [isGridActive, setIsGridActive] = useState(false);
	const [isKeyRegisterActive, setIsKeyRegisterActive] = useState(true);
	const [activeBrushTool, setActiveBrushTool] = useState("Pen");
	const [changeColorTimer, setChangeColorTimer] = useState(0);
	const [popoverOpen2, setPopoverOpen2] = useState(false);
	const [popoverOpen3, setPopoverOpen3] = useState(false);
	const [popoverOpen4, setPopoverOpen4] = useState(false);

	var PlayAnimationInterval = useRef(true);
	var animationFrameCounter = useRef(0);
	var mouseMoveFrameReducer = useRef(0);
	var PixelXCount = useRef(activePixelCanvasX);
	var PixelYCount = useRef(activePixelCanvasY);
	var activePixelSizeRef = useRef(activePixelSize);
	const isInitialMount = useRef(true);
	const itemCountRef = useRef(true);

	const activeSheetKeyframeGroups = useRef(true);
	const activeSheetCurrentKeyframe = useRef(true);
	const activeSheetDimensions = useRef(true);
	const activeLoadedSheets = useRef(true);

	const spritePartsPaths = useRef(true);
	const spritePartsSockets = useRef(true);

	const toggle2 = () => setPopoverOpen2(!popoverOpen2);
	const toggle3 = () => setPopoverOpen3(!popoverOpen3);
	const toggle4 = () => setPopoverOpen4(!popoverOpen4);

	const Phaser = require("phaser");
	const auth = firebase.auth();

	let countVar = 0;

	var MyGame = {};

	class PhaserScene extends Phaser.Scene {
		constructor() {
			super("MainLoader");
		}
		preload() {
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

					console.log("%c Loaded Sprite Part:", "color: lightBlue;");

					console.log(spritePartsSockets.current[i]);

					console.log(spritePartsPaths.current[spritePartsSockets.current[i2]][i]);
					console.log(String("SpriteSheetPart_" + String(i2)) + String("ID#" + i));
					console.log("%cNext", "color: lightBlue;");
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

			console.log("%c Loaded Sheet Frames:", "color: lightBlue;");
			console.log(activeSheetKeyframeGroups.current);
		}
		//
		create() {
			///
		
			//
			window.triggerUpdate = () => {
				console.log(activeSheetCurrentKeyframe.current);
				this.hasUpdated = 0;
			};
			window.restartScene = () => {
				this.registry.destroy();
				this.events.off();
				this.scene.restart();
			};
			//

			this.NPCSpritesGroup = this.physics.add.group();

			window.loadSpriteSheet = () => {
				//
				var staticType = this.physics.add.group();

				// Load Sheets Anims

				//
			};
			var textGroup = this.add.group();
			textGroup.classType = Phaser.GameObjects.Text;

			function triggerRestart() {
				console.log("Clicked");
				window.restartScene();
			}

			console.log("Loading Characters");

			//

			// Get Array From JSON
			//		const partsArray = Object.keys(partsJSON);
			itemCountRef.current = 0;

			//Iterate And Count Categories
			// for (let i = 0; i < partsArray.length; i++) {
			// 	const key = partsArray[i];
			// 	itemCountRef.current += partsArray[i].length;

			// 	//			console.log(key, partsJSON[key]);

			// partsJSON[key].forEach((el) => {
			// 	//			console.log(el);
			// 	// Get Array From JSON
			// 	const partsArray2 = Object.keys(el);
			// 	//Iterate And Count Categories
			// 	for (let i2 = 0; i2 < partsArray2.length; i2++) {
			// 		const key2 = partsArray2[i2];
			// 		//									itemCount += keys[i2].length;
			// 		if (Array.isArray(el[key2])) {
			// 			//						console.log("  Array 2");
			// 			//						console.log(el[key2]);
			// 			el[key2].forEach(() => {
			// 				itemCountRef.current++;
			// 			});
			// 		}
			// 	}
			// });
			//		}

			var text = textGroup.create(
				275,
				0,
				`Categories: ${spritePartsPaths.current.length} \r\nTotal Parts: ${
					itemCountRef.current
				}
				\r\nKeyFrames: \r\n${
					activeSheetKeyframeGroups.current[activeSheetCurrentKeyframe.current]
				}

			`
			);

			text.setInteractive(
				new Phaser.Geom.Rectangle(0, 0, text.width, text.height),
				Phaser.Geom.Rectangle.Contains
			);

			Object.entries(spritePartsPaths.current).forEach((el, index) => {
				var text2 = textGroup.create(0, 20 * index, String(el[0]));
				text2.setInteractive(
					new Phaser.Geom.Rectangle(0, 0, text2.width, text2.height),
					Phaser.Geom.Rectangle.Contains
				);
			});

			this.input.on("gameobjectover", function (pointer, gameObject) {
				// MouseOver RunOnce Script
				if (!gameObject.hasMouseOver) {
					console.log(gameObject.text);
					gameObject.hasMouseOver = true;
				}
				gameObject.setTint(0xff0000, 0xff0000, 0xffff00, 0xff00ff);

				if (gameObject.name && gameObject.name.includes("NPC")) {
					console.log(gameObject);
					gameObject.setTint(0x00ff00);
				}
			});

			this.input.on("gameobjectout", function (pointer, gameObject) {
				if (gameObject.hasMouseOver) {
					if (gameObject.text && gameObject.text.includes("weapon")) {
						triggerRestart();
					}
					gameObject.hasMouseOver = false;
				}
				// MouseOver RunOnce Script
				gameObject.clearTint();
			});

			// console.log("Parts Categories: " + partsArray.length);
			// console.log("Total Parts: " + itemCountRef.current);
			// console.log(partsJSON);
			console.log("Character Parts List Finished");
			setTimeout(() => {}, 5000);

			console.log(PhaserScene);
			this.input.setPollAlways();

			this.load.image("yellowParticle", "images/yellow.png");

			this.emitter = this.add.particles("whiteParticle").createEmitter({
				name: "sparks",
				x: 0,
				y: 600,
				lifespan: 6000,
				visible: true,
				gravityY: 10,
				quantity: 3,
				moveToX: 1,
				moveToY: 600,
				tint: [0xff0000, 0x00ff00, 0x0000ff],
				speed: 0.01,
				angle: { min: 1, max: 360 },
				scale: { start: 0.1, end: 0 },
				alpha: { start: 1, end: 0.1 },
				blendMode: "SCREEN",
			});
			window.loadSpriteSheet();

			this.text = this.add
				.text(200, 0)
				.setFontSize(10)
				.setScrollFactor(0)
				.setStyle({ align: "center" })
				.setColor("#ffffff");

			this.hasUpdated = 0;

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

			for (let i = 0; i < 1; i++) {
				let tempNegBool = (Math.random() - 0.5) * 2 * -64;
				let tempNegBool2 = (Math.random() - 0.5) * 2 * -64;
				console.log(tempNegBool);
				console.log(tempNegBool2);

				this.NPCSpritesGroup[i] = this.physics.add.group();

				window.gotRandomParts = [];

				var partRand = {};

				for (let i2Y = 0; i2Y < 9; i2Y++) {
					if (i2Y === 1) {
						partRand = Math.floor(
							Math.random() *
								spritePartsPaths.current[spritePartsSockets.current[i2Y]].length
						);

						this.NPCSpritesGroup[i]
							.create(
								200,
								300,
								String("SpriteSheetPart_" + String(i2Y)) + String("ID#" + partRand)
							)
							.setCollideWorldBounds(true)
							.setInteractive()
							.setScale(1)
							.setTint("0x" + String(getRandomColor()))
							.setFrame(13 * 10)
							.setDrag(250)
							.setVelocity(0)
							.setDepth(20000 + tempNegBool2 * i).name = String("NPC_" + i);
						window.gotRandomParts.push("Part_" + String(i2Y) + " ID#" + partRand);
					} else if (i2Y === 2 || i2Y === 3 || i2Y === 4) {
						partRand = Math.floor(
							Math.random() *
								spritePartsPaths.current[spritePartsSockets.current[i2Y]].length
						);

						this.NPCSpritesGroup[i]
							.create(
								200,
								300,
								String("SpriteSheetPart_" + String(i2Y)) +
									String(
										"ID#" +
											Math.floor(
												Math.random() *
													spritePartsPaths.current[spritePartsSockets.current[i2Y]].length
											)
									)
							)
							.setCollideWorldBounds(true)
							.setScale(1)
							.setFrame(13 * 10)
							.setInteractive()
							.setTint("0x" + String(getRandomColor()))
							.setDrag(250)
							.setVelocity(0)
							.setDepth(20000 + tempNegBool2 * i).name = String("NPC_" + i);

						window.gotRandomParts.push("Part_" + String(i2Y) + " ID#" + partRand);
					} else {
						partRand = Math.floor(
							Math.random() *
								spritePartsPaths.current[spritePartsSockets.current[i2Y]].length
						);
						this.NPCSpritesGroup[i]
							.create(
								200,
								300,
								String("SpriteSheetPart_" + String(i2Y)) +
									String(
										"ID#" +
											Math.floor(
												Math.random() *
													spritePartsPaths.current[spritePartsSockets.current[i2Y]].length
											)
									)
							)
							.setCollideWorldBounds(true)
							.setScale(1)
							.setFrame(13 * 10)
							.setDrag(250)
							.setInteractive()
							.setVelocity(0)
							.setDepth(20000 + tempNegBool2 * i).name = String("NPC_" + i);

						window.gotRandomParts.push("Part_" + String(i2Y) + " ID#" + partRand);
					}
				}
				console.log("%c Got Random Parts:", "color: lightBlue;");

				window.gotRandomParts.forEach((ele, index) => {
					console.log(
						spritePartsPaths.current[spritePartsSockets.current[index]][
							parseInt([ele.split("#")[1]])
						]
					);
				});

				console.log("%c Got Random Parts:", "color: lightBlue;");
			}
		}

		update() {
			if (this.hasUpdated === 0) {
				this.hasUpdated++;
			}

			this.text.setText(activeSheetCurrentKeyframe.current);

			let relMouseX = this.input.mousePointer.worldX;
			let relMouseY = this.input.mousePointer.worldY;
			this.emitter.moveTo = true;
			this.emitter.moveToX.propertyValue = relMouseX;
			this.emitter.moveToY.propertyValue = relMouseY;
		}
	}

	function runZoomInFun(e, i, props) {
		alert("Under Development");
		//   console.log(props.dataURL);
		//   var canvas = props.canvas;
		//   var ctx = canvas.getContext("2d");
		//   var context = canvas.getContext("2d");
		//   var dataURL = props.dataURL;
		//   console.log(dataURL);
		//   var scale = 1.1;
		//   var translatePos = {
		//     x: canvas.width / scale,
		//     y: canvas.height / scale,
		//   };
		//   var img = new Image();
		//   img.src = dataURL;
		//   ctx.clearRect(0, 0, canvas.width, canvas.height);
		//   img.onload = function () {
		//     ctx.scale(scale, scale);
		//     ctx.beginPath();
		//     ctx.fill();
		//     ctx.save();
		//     ctx.translate(translatePos.x, translatePos.y);
		//     ctx.scale(scale, scale);
		//     ctx.beginPath(); // begin custom shape
		//     ctx.moveTo(-119, -20);
		//     ctx.closePath(); // complete custom shape
		//     ctx.fill();
		//     ctx.stroke();
		//     ctx.restore();
		//     ctx.drawImage(img, 0, 0, activeCanvasX, activeCanvasY);
		//   };
	}
	function runZoomOutFun(e, i, props) {
		alert("Under Development");

		//   console.log(props);
		//   console.log(props.dataURL);
		//   var canvas = props.canvas;
		//   var ctx = canvas.getContext("2d");
		//   var dataURL = props.dataURL;
		//   let context = canvas.getContext("2d");
		//   var scale = 0.9;
		//   var translatePos = {
		//     x: canvas.width / scale,
		//     y: canvas.height / scale,
		//   };
		//   var img = new Image();
		//   img.src = dataURL;
		//   ctx.clearRect(0, 0, canvas.width, canvas.height);
		//   img.onload = function () {
		//     ctx.scale(scale, scale);
		//     ctx.beginPath();
		//     ctx.fill();
		//     ctx.save();
		//     ctx.translate(translatePos.x, translatePos.y);
		//     ctx.scale(scale, scale);
		//     ctx.beginPath(); // begin custom shape
		//     ctx.moveTo(-119, -20);
		//     ctx.closePath(); // complete custom shape
		//     ctx.fill();
		//     ctx.stroke();
		//     ctx.restore();
		//     ctx.drawImage(img, 0, 0, activeCanvasX, activeCanvasY);
		//   };
	}

	//useEffect// Rotate Benefit Details
	useEffect(() => {
		window.DLCharacter = () => {
			var canvas = document.querySelector("#activeCanvas");
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			console.log(activeSheetCurrentKeyframe.current);

			window.gotRandomParts.forEach((ele, index) => {
				setTimeout(() => {
					var canvas = document.querySelector("#activeCanvas");
					var ctx = canvas.getContext("2d");

					const img = new Image();

					img.src = String(
						spritePartsPaths.current[spritePartsSockets.current[index]][
							parseInt([ele.split("#")[1]])
						]
					);

					img.addEventListener(
						"load",
						() => {
							setActiveCanvasX(img.width);
							setActiveCanvasY(img.height);

							setActivePixelCanvasX(img.width / 10);
							PixelXCount.current = activePixelCanvasX;
							setActiveCanvasX(img.width);

							setActivePixelCanvasY(img.height / 10);
							PixelYCount.current = activePixelCanvasY;
							setActiveCanvasY(img.height);

							ctx.drawImage(img, 0, 0, img.width, img.height);

							setActiveCanvasType("Phaser");
						},
						250 * index
					);
				});
			});

			console.log("%c Got Random Parts:", "color: lightBlue;");
		};
		
		PixelYCount.current = activePixelCanvasY;
		PixelXCount.current = activePixelCanvasX;
		activePixelSizeRef.current = activePixelSize;
		var canvas = document.querySelector("#activeCanvas");
		var ctx = canvas.getContext("2d");

		let rotationInterval = setInterval(() => {
			// console.log(frameRateControl.length);
			// console.log(frameRateControl);
			countVar++;
			let SpanElementCounter =
				document.getElementById("AnimationContainer").childElementCount;
			//  console.log("TotalAniFrames" + parseInt(SpanElementCounter));
			//Send To Canvas
			var c = document.getElementById("SavedCanvasID" + parseInt(countVar));
			// console.log(c);
			if (c) {
				//    imageElement.src = c && c.toDataURL("image/png",1);

				var getFrame = document.querySelector(
					"#SavedCanvasID" + parseInt(countVar)
				);

				var ctxGot = getFrame.getContext("2d");
				var previewCanvas = document.querySelector("#previewCanvas");
				var gotDataURL = getFrame.toDataURL("image/png", 1);
				c.src = previewCanvas.src;

				// console.log("|Count" + countVar);
				// console.log("SavedCanvasID" + parseInt(countVar));

				var ctxPreview = previewCanvas.getContext("2d");
				var w = 160;
				var h = 200;

				var img = new Image();
				img.src = gotDataURL;
				img.onload = function () {
					ctxPreview.clearRect(0, 0, canvas.width, canvas.height);
					ctxPreview.drawImage(c, 0, 0, w, h);
				};

				//  document.getElementById("AnimationContainer").appendChild(c);
				// img.id = "SavedCanvasID" + parseInt(frameCounter + 1);

				//     console.log("Showing SavedCanvasID" + parseInt(countVar));
			}
			if (countVar >= parseInt(SpanElementCounter)) {
				countVar = 0;
			}
			//     console.log(SpanElementCounter);
			//   console.log("Frame Increment");
			setFrameCounter(SpanElementCounter);
		}, frameRateControl);
		return () => {
			clearInterval(rotationInterval);
		};
	}, [frameRateControl, activePixelSize]);

	function dlCanvas() {
		var canvas = document.querySelector("#activeCanvas");
		var ctx = canvas.getContext("2d");
		var dt = canvas.toDataURL("image/png", 1);
		dt = dt.replace(/^data:image\/[^;]*/, "data:application/octet-stream");
		dt = dt.replace(
			/^data:application\/octet-stream/,
			"data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png"
		);
		this.href = dt;
	}
	useEffect(() => {
		if (!isInitialMount.current) {
			return null;
		} else {
			const config = {
				type: Phaser.AUTO,
				scale: {
					mode: Phaser.Scale.RESIZE,
					parent: "SceneEditor",
					width: "100%",
					height: "100%",
				},
				transparent: true,
				"render.transparent": true,
				backgroundColor: "#4488aa",
				physics: {
					default: "arcade",
				},
				scene: [PhaserScene],
			};

			var game = new Phaser.Game(config);

			game.scene.add("Boot", PhaserScene.Boot, true);

			console.log("Phaser Frameworks Initiated");

			console.log(" ");

			document.addEventListener("mousedown", (e) => {
				if (popoverOpen3) {
					toggle3(e);
					setPopoverOpen3(false);
				}
				if (popoverOpen2) {
					if (e.target.id !== "NameYourSaveInput") {
						setPopoverOpen2(false);
					}
				}
			});
			/// Begin ClipBoard Paste Listening
			const EL = (sel) => document.querySelector(sel);
			const ctx2 = EL("#activeCanvas").getContext("2d");

			function readImage() {
				if (!this.files || !this.files[0]) return;
				console.log(this.files[0]);
				const FR = new FileReader();
				FR.addEventListener("load", (evt) => {
					const img = new Image();
					img.addEventListener("load", () => {
						canvas.width = img.width;
						canvas.height = img.height;
						canvas.style.width = img.width;
						canvas.style.height = img.height;

						setActiveCanvasX(img.width);
						setActiveCanvasY(img.height);

						setActiveCanvasType("Custom");

						setActivePixelCanvasX(img.width / 10);
						PixelXCount.current = activePixelCanvasX;
						setActiveCanvasX(img.width);

						setActivePixelCanvasY(img.height / 10);
						PixelYCount.current = activePixelCanvasY;
						setActiveCanvasY(img.height);

						ctx2.drawImage(img, 0, 0, img.width, img.height);
					});

					img.src = evt.target.result;
				});
				FR.readAsDataURL(this.files[0]);
			}

			EL("#fileUpload").addEventListener("change", readImage);
			var CLIPBOARD = new CLIPBOARD_CLASS("activeCanvas", true);
			/**
			 * image pasting into canvas
			 *
			 * @param {string} canvas_id - canvas id
			 * @param {boolean} autoresize - if canvas will be resized
			 */
			function CLIPBOARD_CLASS(canvas_id, autoresize) {
				var _self = this;
				var canvas = document.getElementById("activeCanvas");
				var ctx = document.getElementById("activeCanvas").getContext("2d");

				//handlers
				document.addEventListener(
					"paste",
					function (e) {
						_self.paste_auto(e);
					},
					false
				);

				//on paste
				this.paste_auto = function (e) {
					if (e.clipboardData) {
						var items = e.clipboardData.items;
						if (!items) return;
						//access data directly
						for (var i = 0; i < items.length; i++) {
							if (items[i].type.indexOf("image") !== -1) {
								var blob = items[i].getAsFile();
								var URLObj = window.URL || window.webkitURL;
								var source = URLObj.createObjectURL(blob);
								this.paste_createImage(source);
							}
						}
						e.preventDefault();
					}
				};
				//draw pasted image to canvas
				this.paste_createImage = function (source) {
					var pastedImage = new Image();
					pastedImage.src = source;

					pastedImage.onload = function () {
						if (autoresize == true) {
							//resize
							canvas.width = pastedImage.width;
							canvas.height = pastedImage.height;
							canvas.style.width = pastedImage.width;
							canvas.style.height = pastedImage.height;

							setActiveCanvasX(pastedImage.width);
							setActiveCanvasY(pastedImage.height);

							ctx.canvas.width = activeCanvasX;
							setActiveCanvasType("Custom");
							setActivePixelCanvasX(pastedImage.width / 10);
							PixelXCount.current = activePixelCanvasX;
							setActiveCanvasX(pastedImage.width * 1);

							setActivePixelCanvasY(pastedImage.height / 10);
							PixelYCount.current = activePixelCanvasY;
							setActiveCanvasY(pastedImage.height);
						} else {
							//clear canvas
						}
						ctx.drawImage(pastedImage, 0, 0);
					};
				};
			}

			//Begin PreLoad
			console.log(" UseEffect Preload");
			document.getElementById("dl").addEventListener("click", dlCanvas, false);
			var canvas = document.querySelector("#activeCanvas");
			var ctx = canvas.getContext("2d");

			// AddListeners
			canvas.removeEventListener("mousemove", (e) => {
				mouseMoveListener(e);
			});
			canvas.addEventListener("mousemove", (e) => {
				mouseMoveListener(e);
			});
			canvas.addEventListener("mouseleave", (e) => {
				setIsMouseDown(false);
			});
			//mousedowneventlistener
			canvas.addEventListener("mousedown", (e) => {
				setIsMouseDown(true);
				setIsMouseDown(
					(isMouseDown) =>
						setIsMouseDown(isMouseDown) & mouseDownListener(canvas, e, ctx)
				);
			});
			isInitialMount.current = false;
			// First Load / Pre-load

			canvas.addEventListener("mouseup", (e) => {
				setIsMouseDown(false);
				cPush();
			});

			ColorizePicker();

			document.addEventListener("keydown", (e) => {
				if (e.code === "KeyE") {
					setPixelColor("#00000000");
					setActiveBrushTool("Eraser");
				}
				if (e.code === "KeyC") {
					setActiveBrushTool("DrawCircle");
				}
				if (e.code === "KeyQ") {
					setActiveBrushTool("Pixel");
				}
				if (e.code === "KeyW") {
					setActiveBrushTool("PixelEraser");
				}
				if (e.code === "KeyH") {
					setActiveBrushTool("Line");
				}
				if (e.code === "NumpadMultiply") {
					runNewFrame(frameCounter);
				}
				if (e.code === "KeyZ") {
					return cUndo();
				}
				if (e.code === "ArrowUp") {
					let ctx = document.getElementById("activeCanvas").getContext("2d");
					var canvasPic = new Image();
					canvasPic.src = cPushArray[cPushArray.length - 1];
					canvasPic.onload = function () {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(canvasPic, 0, -1);
					};
					cPush();
				}
				if (e.code === "ArrowDown") {
					let ctx = document.getElementById("activeCanvas").getContext("2d");
					var canvasPic = new Image();
					canvasPic.src = cPushArray[cPushArray.length - 1];
					canvasPic.onload = function () {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(canvasPic, 0, 1);
					};
					cPush();
				}
				if (e.code === "ArrowLeft") {
					let ctx = document.getElementById("activeCanvas").getContext("2d");
					var canvasPic = new Image();
					canvasPic.src = cPushArray[cPushArray.length - 1];
					canvasPic.onload = function () {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(canvasPic, -1, 0);
					};
					cPush();
				}
				if (e.code === "ArrowRight") {
					let ctx = document.getElementById("activeCanvas").getContext("2d");
					var canvasPic = new Image();
					canvasPic.src = cPushArray[cPushArray.length - 1];
					canvasPic.onload = function () {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(canvasPic, 1, 0);
					};
					cPush();
				}
				if (e.code === "KeyX") {
					return cRedo();
				}
				if (e.code === "KeyG") {
					setActiveBrushTool("GetColor");
				}
				if (e.code === "KeyO") {
					setActiveBrushTool("GetColor");
				}
				if (e.code === "NumpadAdd" || e.code === "Equal") {
					setBrushSizeControl((brushSizeControl) => {
						if (brushSizeControl) {
							setBrushSizeControl(brushSizeControl + 1);
						}
					});
				}
				if (e.code === "Equal") {
					setBrushSizeControl((brushSizeControl) => {
						if (brushSizeControl) {
							setBrushSizeControl(brushSizeControl + 1);
						}
					});
				}
				if (e.code === "Minus") {
					setBrushSizeControl((brushSizeControl) => {
						console.log(brushSizeControl);
						if (brushSizeControl) {
							if (brushSizeControl > 1) {
								console.log(brushSizeControl);
								setBrushSizeControl(brushSizeControl - 1);
							} else {
								setBrushSizeControl(brushSizeControl);
							}
						}
					});
				}
				if (e.code === "NumpadSubtract") {
					setBrushSizeControl((brushSizeControl) => {
						if (brushSizeControl) {
							if (brushSizeControl > 1) {
								console.log(brushSizeControl);

								setBrushSizeControl(brushSizeControl - 1);
							} else {
								setBrushSizeControl(brushSizeControl);
							}
						}
					});
				}
				if (e.code === "Escape") {
					var txt;
					if (window.confirm("Delete Current ActiveCanvas?")) {
						txt = "OK!";
						resetPixels();
					} else {
						txt = "You pressed Cancel!";
					}
					console.log(txt);
				}
				if (e.code === "KeyP") {
					setActiveBrushTool("Pen");
					setPixelColor(recentColors[recentColors.length - 1]);
				}
				if (e.code === "Digit1") {
					setPixelColor(recentColors[recentColors.length - 1]);
				}
				if (e.code === "Digit2") {
					setPixelColor(recentColors[recentColors.length - 2]);
				}
				if (e.code === "Digit2") {
					setPixelColor(recentColors[recentColors.length - 2]);
				}
				if (e.code === "Digit3") {
					setPixelColor(recentColors[recentColors.length - 3]);
				}
				if (e.code === "Digit4") {
					setPixelColor(recentColors[recentColors.length - 4]);
				}
				if (e.code === "Digit5") {
					setPixelColor(recentColors[recentColors.length - 5]);
				}
				if (e.code === "Digit6") {
					setPixelColor(recentColors[recentColors.length - 6]);
				}
				if (e.code === "Digit7") {
					setPixelColor(recentColors[recentColors.length - 7]);
				}
			});
		}
	});
	var cPushArray = new Array([]);
	var cStep = -1;
	var ctx5;
	function mouseDownListener(canvas, e, ctx) {
		setPixelColor((pixelColor) => {
			setPixelColor(pixelColor);
			setBrushSizeControl((brushSizeControl) => {
				if (brushSizeControl) {
					setBrushSizeControl(brushSizeControl);

					setPixelColor((pixelColor) => {
						if (pixelColor) {
							setPixelColor(pixelColor);

							setActiveBrushTool((activeBrushTool) => {
								if (activeBrushTool) {
									setActiveBrushTool(activeBrushTool);

									setActivePixelSize((activePixelSize) => {
										if (activePixelSize) {
											setActivePixelSize(activePixelSize);

											setActivePixelCanvasX((activePixelCanvasX) => {
												if (activePixelCanvasX) {
													setActivePixelCanvasX(activePixelCanvasX);

													setActivePixelCanvasY((activePixelCanvasY) => {
														if (activePixelCanvasY) {
															setActivePixelCanvasY(activePixelCanvasY);

															setBrushSoftControl((brushSoftControl) => {
																if (brushSoftControl) {
																	BrushTypeMouseDownFunction(
																		brushSoftControl,
																		activeBrushTool,
																		e,
																		pixelColor,
																		brushSizeControl,
																		activePixelCanvasX,
																		activePixelCanvasY,
																		activePixelSize
																	);
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		});
	}
	function BrushTypeMouseDownFunction(
		brushSoftControl,
		activeBrushTool,
		e,
		pixelColor,
		brushSizeControl,
		activePixelCanvasX,
		activePixelCanvasY,
		activePixelSize
	) {
		setBrushSoftControl(brushSoftControl) && setIsMouseDown(true);

		// MouseDown Brush Controls
		//Get Mouse X, Y of Canvas
		var canvas = document.getElementById("activeCanvas");
		var rect = canvas.getBoundingClientRect();
		var x = e.clientX - rect.left;
		var y = e.clientY - rect.top;
		var ctx = canvas.getContext("2d");
		if (activeBrushTool === "Pen") {
			//Set Brush's Color to recentColors Latest
			setPixelColor(recentColors[recentColors.length - 1]);

			ctx.save();
			ctx.fillStyle = pixelColor;
			x = Math.floor((canvas.width * x) / canvas.clientWidth);
			y = Math.floor((canvas.height * y) / canvas.clientHeight);
			ctx.shadowColor = pixelColor;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = brushSoftControl;
			ctx.fillRect(x, y, brushSizeControl, brushSizeControl);
			ctx.beginPath();
			ctx.restore();
			ctx.stroke();
			ctx.save();
			cPush();
		} else if (activeBrushTool === "Eraser") {
			console.log("Penning");
			x = Math.floor((canvas.width * x) / canvas.clientWidth);
			y = Math.floor((canvas.height * y) / canvas.clientHeight);
			ctx.clearRect(x, y, brushSizeControl, brushSizeControl);
			ctx.beginPath();
			ctx.restore();
			ctx.save();
			cPush();
		} else if (activeBrushTool === "ZoomTool") {
			setActiveBrushTool("Pen");
		} else if (activeBrushTool === "PaintBucket") {
			x = Math.floor((canvas.width * x) / canvas.clientWidth);
			y = Math.floor((canvas.height * y) / canvas.clientHeight);
			var p = ctx.getImageData(x, y, 1, 1).data;
			var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
			//Add to Recent Colors
			alert("Not Finished" + String(x + y + hex + p));
			console.log(x, y, hex, p);
			setActiveBrushTool("Pen");
		} else if (activeBrushTool === "PixelEraser") {
			ctx.save();
			ctx.fillStyle = pixelColor;
			ctx.shadowColor = pixelColor;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = brushSoftControl;
			ctx.clearRect(
				Math.round(
					(x - (activePixelSize - activePixelSize / 2)) /
						(canvas.width / activePixelCanvasX)
				) * activePixelSize,
				Math.round(
					(y - (activePixelSize - activePixelSize / 2)) /
						(canvas.height / activePixelCanvasY)
				) * activePixelSize,
				activePixelSize,
				activePixelSize
			);
			ctx.beginPath();
			ctx.restore();
			ctx.stroke();
			ctx.save();
			cPush();
			console.log("Push 2");
			mouseMoveFrameReducer.current = 1;
		} else if (activeBrushTool === "Line") {
			//Set Brush's Color to recentColors Latest
			setPixelColor(recentColors[recentColors.length - 1]);

			setLineBrushCounter((lineBrushCounter) => {
				setLineBrushCounter(lineBrushCounter);

				setLineBrushCounter(lineBrushCounter + 1);
				if (lineBrushCounter < 1) {
					console.log("FirstLine");
					console.log("Line Tooling Click");
					ctx.beginPath();
					ctx.lineJoin = "round";
					ctx.lineWidth = brushSizeControl;
					ctx.moveTo(x, y);
					ctx.lineTo(x, y);
					ctx.save();
				}
				if (lineBrushCounter === 1) {
					console.log("SecondLine");
					console.log(lineBrushCounter);
					console.log("Line Tooling Click");
					ctx.lineJoin = "round";
					ctx.lineTo(x, y);
					ctx.lineWidth = brushSizeControl;
					ctx.stroke();
					ctx.save();
					cPush();
					setLineBrushCounter(0);
				}
			});
		} else if (activeBrushTool === "GetColor") {
			p = ctx.getImageData(x, y, 1, 1).data;
			hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
			//Add to Recent Colors
			let joinedArray = recentColors;
			//	console.log(recentColors[recentColors.length - 1]);
			if (recentColors[recentColors.length - 1] !== hex) {
				joinedArray.push(hex);
				setRecentColors(joinedArray);
			}

			setPixelColor(hex);
			//Set Tool States
			//setActiveBrushTool("");
		} else if (activeBrushTool === "GridMode") {
			// Create Col * Row Divides
			// Fill Selected ColRow
			// Pixel art!
			// console.log(" ");
			// console.log("Start Pixel Mode");
			// console.log(" ");
			// console.log("||| Define Mouse Coords");
			// console.log("Coords:X: " + x + ", Y: " + y);
			// console.log(" ");
			// console.log("||| Define Canvas Dimensions");
			// console.log("Canvas Width: " + canvas.width);
			// console.log("Canvas Height: " + canvas.height);
			// console.log(" ");
			// console.log("||| Define Grid Count");
			// console.log("Total Pixel Cols: " + activePixelCanvasX);
			// console.log("Total Pixel Rows: " + activePixelCanvasY);
			// console.log(" ");
			// console.log("||| Define Pixel Size");
			// console.log("Pixels Per Col: " + canvas.width / activePixelCanvasX);
			// console.log("Pixels Per Row: " + canvas.height / activePixelCanvasY);
			// console.log(" ");
			// console.log("||| Define Selected Pixel of Grid");
			// console.log("|||  for 32 | cols : 1 through 32 ");
			// console.log(
			//   "Active X : " + Math.round(x / (canvas.width / activePixelCanvasX))
			// );
			// console.log("Active Y : " + y / (canvas.width / activePixelCanvasY));
		} else if (activeBrushTool === "DrawCircle") {
			if (brushSizeControl > 0) {
				setPixelColor(recentColors[recentColors.length - 1]);

				x = Math.floor((canvas.width * x) / canvas.clientWidth);
				y = Math.floor((canvas.height * y) / canvas.clientHeight);
				ctx.save();
				ctx.fillStyle = pixelColor;
				x = Math.floor((canvas.width * x) / canvas.clientWidth);
				y = Math.floor((canvas.height * y) / canvas.clientHeight);
				ctx.shadowColor = pixelColor; // string
				ctx.shadowOffsetX = 0; // integer
				ctx.shadowOffsetY = 0; // integer
				ctx.shadowBlur = brushSoftControl; // integer
				ctx.fillRect(x, y, 2, brushSizeControl);
				ctx.beginPath();
				ctx.restore();
				ctx.beginPath();
				ctx.arc(x, y, brushSizeControl, 0, 2 * Math.PI, false);
				ctx.fillStyle = pixelColor;
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = pixelColor;
				ctx.stroke();
				ctx.save();
				cPush();
			} else {
				setPixelColor(recentColors[recentColors.length - 1]);

				x = Math.floor((canvas.width * x) / canvas.clientWidth);
				y = Math.floor((canvas.height * y) / canvas.clientHeight);
				ctx.save();
				ctx.fillStyle = pixelColor;
				x = Math.floor((canvas.width * x) / canvas.clientWidth);
				y = Math.floor((canvas.height * y) / canvas.clientHeight);
				ctx.shadowColor = pixelColor; // string
				ctx.shadowOffsetX = 0; // integer
				ctx.shadowOffsetY = 0; // integer
				ctx.shadowBlur = brushSoftControl; // integer
				ctx.fillRect(x, y, 2, 1);
				ctx.beginPath();
				ctx.restore();
				ctx.beginPath();
				ctx.arc(x, y, 1, 0, 2 * Math.PI, false);
				ctx.fillStyle = pixelColor;
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = pixelColor;
				ctx.stroke();
				ctx.save();
				cPush();
			}
		} else if (activeBrushTool === "Pixel") {
			// Create Col * Row Divides
			// Fill Selected ColRow
			// Pixel art!
			// console.log(" ");
			// console.log("Start Pixel Mode");

			// console.log(" ");
			// console.log("||| Define Mouse Coords");
			// console.log("Coords:X: " + x + ", Y: " + y);

			// console.log(" ");
			// console.log("||| Define Canvas Dimensions");
			// console.log("Canvas Width: " + canvas.width);
			// console.log("Canvas Height: " + canvas.height);

			// console.log(" ");
			// console.log("||| Define Grid Count");
			// console.log("Total Pixel Cols: " + activePixelCanvasX);
			// console.log("Total Pixel Rows: " + activePixelCanvasY);

			// console.log(" ");
			// console.log("||| Define Pixel Size");
			// console.log("Pixels Per Col: " + canvas.width / activePixelCanvasX);
			// console.log("Pixels Per Row: " + canvas.height / activePixelCanvasY);

			// console.log(" ");
			// console.log("||| Define Selected Pixel of Grid");
			// console.log("|||  for 32 | cols : 1 through 32 ");
			// console.log(
			//   "Active X : " + Math.round(x / (canvas.width / activePixelCanvasX))
			// );
			// console.log("Active Y : " + y / (canvas.width / activePixelCanvasY));
			// console.log(" ");
			// console.log(x, y);
			// console.log(activePixelCanvasX);
			// console.log(activeCanvasX);
			// console.log(activePixelSize);

			// console.log(
			// 	((x - 5) / (canvas.width / activePixelCanvasX)) * activePixelSize
			// );

			ctx.save();
			ctx.fillStyle = pixelColor;
			ctx.shadowColor = pixelColor;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = brushSoftControl;
			ctx.fillRect(
				Math.round(
					(x - (activePixelSize - activePixelSize / 2)) /
						(canvas.width / activePixelCanvasX)
				) * activePixelSize,
				Math.round(
					(y - (activePixelSize - activePixelSize / 2)) /
						(canvas.height / activePixelCanvasY)
				) * activePixelSize,
				activePixelSize,
				activePixelSize
			);
			ctx.beginPath();
			ctx.restore();
			ctx.stroke();
			ctx.save();
			cPush();
			mouseMoveFrameReducer.current = 1;
		}

		cPush();
	}

	//listfunctions functionslist

	function rgbToHex(r, g, b) {
		if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
		return ((r << 16) | (g << 8) | b).toString(16);
	}

	function mouseMoveListener(e) {
		function checkIsDown(props) {
			if (props) {
				setPixelColor((pixelColor) => {
					setPixelColor(pixelColor);

					setBrushSizeControl((brushSizeControl) => {
						if (brushSizeControl) {
							setBrushSizeControl(brushSizeControl);

							setActiveBrushTool((activeBrushTool) => {
								if (activeBrushTool) {
									setActiveBrushTool(activeBrushTool);

									setActiveBrushTool((activeBrushTool) => {
										if (activeBrushTool) {
											setActiveBrushTool(activeBrushTool);

											setActivePixelSize((activePixelSize) => {
												if (activePixelSize) {
													setActivePixelSize(activePixelSize);

													setActivePixelCanvasX((activePixelCanvasX) => {
														if (activePixelCanvasX) {
															setActivePixelCanvasX(activePixelCanvasX);

															setActivePixelCanvasY((activePixelCanvasY) => {
																if (activePixelCanvasY) {
																	setActivePixelCanvasY(activePixelCanvasY);
																	setBrushSoftControl((brushSoftControl) => {
																		if (brushSoftControl) {
																			setBrushSoftControl(brushSoftControl);

																			mouseMoveListenerFunctionInside(
																				props,
																				e,
																				activeBrushTool,
																				pixelColor,
																				brushSoftControl,
																				brushSizeControl,
																				activePixelCanvasX,
																				activePixelCanvasY,
																				activePixelSize
																			);
																			// End MouseMove Functions
																		}
																	});
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				});
			}
		}
		setIsMouseDown(
			(isMouseDown) => setIsMouseDown(isMouseDown) & checkIsDown(isMouseDown)
		);
	}

	function mouseMoveListenerFunctionInside(
		props,
		e,
		activeBrushTool,
		pixelColor,
		brushSoftControl,
		brushSizeControl,
		activePixelCanvasX,
		activePixelCanvasY,
		activePixelSize
	) {
		if (!mouseMoveFrameReducer.current) {
			mouseMoveFrameReducer.current = 1;
			console.log("Push 1");
			cPush();
		} else {
			mouseMoveFrameReducer.current++;
			if (mouseMoveFrameReducer.current >= 15) {
				var canvas = document.getElementById("activeCanvas");
				var ctx = canvas.getContext("2d");
				if (props) {
					var rect = canvas.getBoundingClientRect();
					var x = e.clientX - rect.left;
					var y = e.clientY - rect.top;
				}

				//Begin Tool Check
				if (activeBrushTool === "Pen") {
					ctx.save();
					ctx.fillStyle = pixelColor;
					x = Math.floor((canvas.width * x) / canvas.clientWidth);
					y = Math.floor((canvas.height * y) / canvas.clientHeight);
					ctx.shadowColor = pixelColor;
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = brushSoftControl;
					ctx.fillRect(x, y, brushSizeControl, brushSizeControl);
					ctx.beginPath();
					ctx.restore();
				} else if (activeBrushTool === "Eraser") {
					x = Math.floor((canvas.width * x) / canvas.clientWidth);
					y = Math.floor((canvas.height * y) / canvas.clientHeight);
					ctx.clearRect(x, y, brushSizeControl, brushSizeControl);
					ctx.beginPath();
					ctx.save();
				} else if (activeBrushTool === "Line") {
					console.log("Line Tooling Move");
				} else if (activeBrushTool === "ZoomTool") {
					setActiveBrushTool("Pen");
				} else if (activeBrushTool === "GridMode") {
					// Create Col * Row Divides
					// Fill Selected ColRow
					// Pixel art!
					// console.log(" ");
					// console.log("Start Pixel Mode");
					// console.log(" ");
					// console.log("||| Define Mouse Coords");
					// console.log("Coords:X: " + x + ", Y: " + y);
					// console.log(" ");
					// console.log("||| Define Canvas Dimensions");
					// console.log("Canvas Width: " + canvas.width);
					// console.log("Canvas Height: " + canvas.height);
					// console.log(" ");
					// console.log("||| Define Grid Count");
					// console.log("Total Pixel Cols: " + activePixelCanvasX);
					// console.log("Total Pixel Rows: " + activePixelCanvasY);
					// console.log(" ");
					// console.log("||| Define Pixel Size");
					// console.log("Pixels Per Col: " + canvas.width / activePixelCanvasX);
					// console.log("Pixels Per Row: " + canvas.height / activePixelCanvasY);
					// console.log(" ");
					// console.log("||| Define Selected Pixel of Grid");
					// console.log("|||  for 32 | cols : 1 through 32 ");
					// console.log(
					//   "Active X : " + Math.round(x / (canvas.width / activePixelCanvasX))
					// );
					// console.log("Active Y : " + y / (canvas.width / activePixelCanvasY));
					ctx.save();
					ctx.fillStyle = pixelColor;
					ctx.shadowColor = pixelColor;
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = brushSoftControl;
					ctx.fillRect(
						Math.round(x / (canvas.width / activePixelCanvasX)) * activePixelSize,
						Math.round(y / (canvas.height / activePixelCanvasY)) * activePixelSize,
						activePixelSize,
						activePixelSize
					);
					ctx.beginPath();
					ctx.restore();
					ctx.stroke();
					ctx.save();
					cPush();
				} else if (activeBrushTool === "DrawCircle") {
					if (brushSizeControl > 0) {
						ctx.save();
						ctx.fillStyle = pixelColor;
						x = Math.floor((canvas.width * x) / canvas.clientWidth);
						y = Math.floor((canvas.height * y) / canvas.clientHeight);
						ctx.shadowColor = pixelColor; // string
						ctx.shadowOffsetX = 0; // integer
						ctx.shadowOffsetY = 0; // integer
						ctx.shadowBlur = brushSoftControl; // integer
						ctx.fillRect(x, y, 2, 2);
						ctx.beginPath();
						ctx.restore();
						ctx.beginPath();
						ctx.arc(x, y, brushSizeControl, 0, 2 * Math.PI, false);
						ctx.fillStyle = pixelColor;
						ctx.fill();
						ctx.lineWidth = 1;
						ctx.strokeStyle = pixelColor;
						ctx.stroke();
						ctx.save();
					} else {
						setPixelColor(recentColors[recentColors.length - 1]);
						x = Math.floor((canvas.width * x) / canvas.clientWidth);
						y = Math.floor((canvas.height * y) / canvas.clientHeight);
						ctx.save();
						ctx.fillStyle = pixelColor;
						x = Math.floor((canvas.width * x) / canvas.clientWidth);
						y = Math.floor((canvas.height * y) / canvas.clientHeight);
						ctx.shadowColor = pixelColor; // string
						ctx.shadowOffsetX = 0; // integer
						ctx.shadowOffsetY = 0; // integer
						ctx.shadowBlur = brushSoftControl; // integer
						ctx.fillRect(x, y, 2, 1);
						ctx.beginPath();
						ctx.restore();
						ctx.beginPath();
						ctx.arc(x, y, 1, 0, 2 * Math.PI, false);
						ctx.fillStyle = pixelColor;
						ctx.fill();
						ctx.lineWidth = 1;
						ctx.strokeStyle = pixelColor;
						ctx.stroke();
						ctx.save();
						cPush();
					}
				} else if (activeBrushTool === "Pixel") {
					// console.log(" ");
					// console.log(x, y);
					// console.log(activePixelCanvasX);
					// console.log(activeCanvasX);
					// console.log(activePixelSize);

					// console.log(
					// 	((x - 5) / (canvas.width / activePixelCanvasX)) * activePixelSize
					// );

					ctx.save();
					ctx.fillStyle = pixelColor;
					ctx.shadowColor = pixelColor;
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = brushSoftControl;
					ctx.fillRect(
						Math.round(
							(x - (activePixelSize - activePixelSize / 2)) /
								(canvas.width / activePixelCanvasX)
						) * activePixelSize,
						Math.round(
							(y - (activePixelSize - activePixelSize / 2)) /
								(canvas.height / activePixelCanvasY)
						) * activePixelSize,
						activePixelSize,
						activePixelSize
					);
					ctx.beginPath();
					ctx.restore();
					ctx.stroke();
					ctx.save();
					cPush();
					mouseMoveFrameReducer.current = 1;
				} else if (activeBrushTool === "PixelEraser") {
					ctx.save();
					ctx.fillStyle = pixelColor;
					ctx.shadowColor = pixelColor;
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = brushSoftControl;
					ctx.clearRect(
						Math.round(
							(x - (activePixelSize - activePixelSize / 2)) /
								(canvas.width / activePixelCanvasX)
						) * activePixelSize,
						Math.round(
							(y - (activePixelSize - activePixelSize / 2)) /
								(canvas.height / activePixelCanvasY)
						) * activePixelSize,
						activePixelSize,
						activePixelSize
					);
					ctx.beginPath();
					ctx.restore();
					ctx.stroke();
					ctx.save();
					cPush();
					console.log("Push 2");
					mouseMoveFrameReducer.current = 1;
				}
			}
		}
	}

	// ctx5 = document.getElementById("activeCanvas").getContext("2d") && document.getElementById("activeCanvas").getContext("2d");

	function cPush() {
		let latestCTX = document.getElementById("activeCanvas").toDataURL();

		cStep++;
		if (cStep < cPushArray.length) {
			cPushArray.length = cStep;
		}

		//if incoming push is dupe : don't push
		if (JSON.stringify(cPushArray).includes(latestCTX)) {
			cStep--;
			cStep--;
		} else {
			cPushArray.push(latestCTX);
		}
		if (cPushArray.length < 1) {
			cPushArray.push(latestCTX);
		}
	}
	function cUndo() {
		console.log("Running Undo");
		if (cStep > 0) {
			cStep--;
			var canvasPic = new Image();

			var w = 320;
			var h = 400;
			console.log(cPushArray[cStep]);
			canvasPic.src = cPushArray[cStep];
			canvasPic.onload = function () {
				let ctx = document.getElementById("activeCanvas").getContext("2d");
				ctx.beginPath();
				ctx.clearRect(0, 0, w, h);
				ctx.drawImage(canvasPic, 0, 0);
			};
		}
	}

	function cRedo() {
		console.log("Running Redo");
		if (cStep < cPushArray.length - 1) {
			cStep++;
			var canvasPic = new Image();
			canvasPic.src = cPushArray[cStep];
			let ctx = document.getElementById("activeCanvas").getContext("2d");
			canvasPic.onload = function () {
				ctx.drawImage(canvasPic, 0, 0);
			};
		}
	}

	function fileUploadButton() {
		document.getElementById("fileUpload").click();
	}
	function runOutsideDrawFlippedFunction(props) {
		console.log(props);
		var activeCanvas = document.querySelector("#activeCanvas");
		var ctxActive = activeCanvas.getContext("2d");
		var dataURL = props;
		console.log("YYYY");

		var w = activeCanvas.clientWidth;
		var h = activeCanvas.clientHeight;
		ctxActive.beginPath();
		ctxActive.clearRect(0, 0, w, h);

		ctxActive.beginPath();
		var img = new Image();
		img.src = dataURL;
		img.onload = function () {
			ctxActive.drawImage(img, 0, 0);
			ctxActive.translate(w, 0);
			ctxActive.scale(-1, 1);
			console.log("Second Run X");
		};
	}

	function ColorizePicker() {
		let ColorPickerBG = document.querySelector("#\\#ColorPickerContainer > div");
		let ColorPickerFont = document.querySelector(
			"#\\#ColorPickerContainer > div > div:nth-child(3) > div:nth-child(1) > div > label"
		);
		let ColorPickerFont2 = document.querySelector(
			"#\\#ColorPickerContainer > div > div:nth-child(3) > div:nth-child(2) > div > label"
		);
		let ColorPickerFont3 = document.querySelector(
			"#\\#ColorPickerContainer > div > div:nth-child(3) > div:nth-child(3) > div > label"
		);
		let ColorPickerFont4 = document.querySelector(
			"#\\#ColorPickerContainer > div > div:nth-child(3) > div:nth-child(4) > div > label"
		);
		let ColorPickerFont5 = document.querySelector(
			"#\\#ColorPickerContainer > div > div:nth-child(3) > div:nth-child(5) > div > label"
		);

		ColorPickerBG.style.backgroundColor = "transparent";
		ColorPickerFont.style.color = "white";
		ColorPickerFont2.style.color = "white";
		ColorPickerFont3.style.color = "white";
		ColorPickerFont4.style.color = "white";
		ColorPickerFont5.style.color = "white";
	}

	function resetPixels() {
		var canvas = document.querySelector("#activeCanvas");
		var ctx = canvas.getContext("2d");

		var canvas2 = document.querySelector("#previewCanvas");
		var ctx2 = canvas2.getContext("2d");

		ctx.strokeStyle = "rgba(0,0,0,1)";
		var x = canvas.clientWidth;
		var y = canvas.clientHeight;
		ctx.clearRect(0, 0, x, y);

		ctx2.strokeStyle = "rgba(0,0,0,1)";
		var x2 = canvas2.clientWidth;
		var y2 = canvas2.clientHeight;
		ctx2.clearRect(0, 0, x2, y2);

		console.log(frameCounter);
		var frameCountArray = Array.apply(null, Array(frameCounter));

		// let animationArray = document.getElementById(
		//   "SavedCanvasID" + parseInt(frameCounter)
		// );

		// document.getElementById("AnimationContainer").removeChild(animationArray);
		// console.log(animationArray);
		frameCountArray.forEach((e, index) => {
			console.log(e);
			let animationArray = document.getElementById(
				"SavedCanvasID" + parseInt(index + 1)
			);
			document.getElementById("AnimationContainer").removeChild(animationArray);
			console.log(animationArray);
		});
	}
	function decideRenderGlobalSaves() {
		console.log("Loading Globals");
		let dbData = {};
		let dbDataArray = [];
		let gotLoadedSaves = [];
		let gotLoadedIDs = [];
		let gotLoadedAnimations = [];
		const auth = firebase.auth();
		var db = firebase.firestore();
		db
			.collection("SpriteLibrary")
			.get()
			.then((userData) => {
				console.log(userData);

				userData.forEach((ele) => {
					dbDataArray.push(ele);
				});

				//Check Through Array of User Collections
				dbDataArray.forEach((dbArrayEle, index) => {
					console.log(dbArrayEle.data());
					console.log(dbArrayEle.id);

					if (dbArrayEle.data().PixelSaveData) {
						console.log("Got Data: ");

						// console.log(
						// 	"TEST" +
						// 		String(index) +
						// 		"$%^^%$" +
						// 		JSON.stringify(dbArrayEle.PixelSaveData).split("{")[1].split(":")[0]
						// );
						//Format Into Names
						gotLoadedIDs.push(
							String(index) + "$%^^%$" + JSON.stringify(dbArrayEle.id)
						) &&
							//Format into IDs
							gotLoadedSaves.push(
								String(index) +
									"$%^^%$" +
									JSON.stringify(dbArrayEle.data().PixelSaveData[0]).replace(`"}`, "")
							);

						gotLoadedAnimations.push(dbArrayEle.data().AnimationData);
					}
				});

				console.log(gotLoadedSaves);

				var arrLength = Array.apply(null, Array(gotLoadedSaves.length));
				let pixelArray = [];

				arrLength.forEach((each, index) => {
					console.log(gotLoadedSaves[index].split("$%^^%$")[1].replace(`"`, ""));
					pixelArray.push(
						<div
							key={gotLoadedIDs[index]
								.substring(1)
								.replace(`"`, "")
								.split("$%^^%$")[1]
								.replace(`"`, "")}
							style={{
								minWidth: "170px",
								boxShadow: "0px 2px 2px 2px #666666",
								textAlight: "right",
								margin: "2px",
							}}
							id={"loadedPixelsSpan" + index}
						>
							{gotLoadedIDs[index]
								.split("$%^^%$")[1]
								.replace(`"`, "")
								.replace(`"`, "")}
							&nbsp;
							<span style={{ display: "inline-flex", float: "right" }}>
								<button
									style={{
										width: "35px",
										height: "20px",
										color: "white",
										backgroundColor: "darkGreen",
									}}
									onClick={(e) => {
										e.preventDefault();
										console.log("Load Save");

										var canvas = document.querySelector("#activeCanvas");
										var ctx = canvas.getContext("2d");

										var img = new Image();

										img.src = String(
											gotLoadedSaves[index].split("$%^^%$")[1].replace(/"/g, "")
										);

										let w = 320;
										let h = 400;
										img.height = w;
										img.width = h;
										img.onload = function () {
											ctx.drawImage(img, 0, 0, w, h);
											setPopoverOpen3(() => setPopoverOpen3(false));
											toggle3();
										};
									}}
								>
									<span
										id="LoadButton1"
										style={{
											position: "relative",
											left: "-6px",
										}}
									>
										Load
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

				return setLoadedGlobalFiles(pixelArray);
			});
	}

	function decideRenderUserSaves() {
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

						// console.log(
						// 	"TEST" +
						// 		String(index) +
						// 		"$%^^%$" +
						// 		JSON.stringify(dbArrayEle.PixelSaveData).split("{")[1].split(":")[0]
						// );
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
					pixelArray.push(
						<div
							key={gotLoadedIDs[index]
								.substring(1)
								.replace(`"`, "")
								.split("$%^^%$")[1]
								.replace(`"`, "")}
							style={{
								minWidth: "170px",
								boxShadow: "0px 2px 2px 2px #666666",
								textAlight: "right",
								margin: "2px",
							}}
							id={"loadedPixelsSpan" + index}
						>
							{gotLoadedIDs[index]
								.split("$%^^%$")[1]
								.replace(`"`, "")
								.replace(`"`, "")}
							&nbsp;
							<span style={{ display: "inline-flex", float: "right" }}>
								<button
									style={{
										width: "35px",
										height: "20px",
										color: "white",
										backgroundColor: "darkgreen",
									}}
									onClick={(e) => {
										setPopoverOpen3(() => setPopoverOpen3(false));
										toggle3();
										e.preventDefault();
										console.log("Load Save");

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
													gotLoadedAnimations[index].forEach((loadedAniElements, index6) => {
														console.log(index6);
														console.log(loadedAniElements);
														if (isNaN(animationFrameCounter.current)) {
															animationFrameCounter.current = 0;
														}
														console.log(
															"||| AniFrameCount.current " + animationFrameCounter.current
														);
														animationFrameCounter.current++;
														var dataURL = loadedAniElements;
														var w = 160;
														var h = 200;

														var canvasNewAni = document.createElement("canvas");
														canvasNewAni.id =
															"SavedCanvasID" + parseInt(animationFrameCounter.current);
														canvasNewAni.width = w;
														canvasNewAni.height = h;
														canvasNewAni.style.zIndex = 8;
														document
															.getElementById("AnimationContainer")
															.appendChild(canvasNewAni);

														var savedCanvas = document.getElementById(
															`SavedCanvasID${parseInt(animationFrameCounter.current)}`
														);
														var ctxPreviewNew = savedCanvas.getContext("2d");
														var img = new Image();
														img.src = dataURL;
														img.height = w;
														img.width = h;
														img.onload = function () {
															ctxPreviewNew.drawImage(img, 0, 0, w, h);
															//push new frame to State Animation Array
															let joinedArray = animationStateArray;
															joinedArray.push(img.src);
															setAnimationStateArray(joinedArray);
															// console.log(animationStateArray);
															// console.log(animationFrameCounter.current);
														};
													});
												// console.log(gotLoadedSaves[index]);
												// console.log(gotLoadedIDs[index]);
												// console.log(gotLoadedSaves[index]);
												var canvas = document.querySelector("#activeCanvas");
												var ctx = canvas.getContext("2d");

												var dataURL = gotLoadedSaves[index].substring(1).split("$%^^%$")[1];
												ctx.imageSmoothingEnabled = true;
												var img = new Image();
												img.src = dataURL;
												img.onload = function () {
													ctx.drawImage(img, 0, 0);
												};
											});
									}}
								>
									<span
										id="LoadButton2"
										style={{
											position: "relative",
											left: "-6px",
										}}
									>
										Load
									</span>
								</button>
								&nbsp;{" "}
								<button
									id="PublishButton"
									style={{
										width: "48px",
										height: "20px",
										color: "white",
										backgroundColor: "#886600",
									}}
									onClick={(e) => {
										// Start Publish Function
										setPopoverOpen3(() => setPopoverOpen3(false));
										toggle3();
										e.preventDefault();
										if (window.location.pathname === "/build") {
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
														gotLoadedAnimations[index].forEach(
															(loadedAniElements, index6) => {
																console.log(index6);
																console.log(loadedAniElements);
																if (isNaN(animationFrameCounter.current)) {
																	animationFrameCounter.current = 0;
																}
																console.log(
																	"||| AniFrameCount.current " + animationFrameCounter.current
																);
																animationFrameCounter.current++;
																var dataURL = loadedAniElements;
																var w = 160;
																var h = 200;

																var canvasNewAni = document.createElement("canvas");
																canvasNewAni.id =
																	"SavedCanvasID" + parseInt(animationFrameCounter.current);
																canvasNewAni.width = w;
																canvasNewAni.height = h;
																canvasNewAni.style.zIndex = 8;
																document
																	.getElementById("AnimationContainer")
																	.appendChild(canvasNewAni);

																var savedCanvas = document.getElementById(
																	`SavedCanvasID${parseInt(animationFrameCounter.current)}`
																);
																var ctxPreviewNew = savedCanvas.getContext("2d");
																var img = new Image();
																img.src = dataURL;
																img.height = w;
																img.width = h;
																img.onload = function () {
																	// Decide Animations
																};
															}
														);
													// console.log(gotLoadedSaves[index]);
													// console.log(gotLoadedIDs[index]);
													// console.log(gotLoadedSaves[index]);
													var canvas = document.querySelector("#activeCanvas");
													var ctx = canvas.getContext("2d");

													var dataURL = gotLoadedSaves[index]
														.substring(1)
														.split("$%^^%$")[1];

													var dataURLID = gotLoadedIDs[index]
														.substring(1)
														.split("$%^^%$")[1];

													ctx.imageSmoothingEnabled = true;
													var img = new Image();
													img.src = dataURL;
													img.onload = function () {
														// Write Selected Pixel To SendGlobal Function
														let useEmulator = false;
														require("firebase/functions");

														async function sendRequest(props) {
															//Emulator local url for development:
															let fetchURL = "";
															const urlLocal = `http://localhost:5001/ohana-rpg/us-central1/sendUserSpriteToGlobalDB`;

															// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)
															//Live  url:
															const urlLive =
																"https://us-central1-ohana-rpg.cloudfunctions.net/sendUserSpriteToGlobalDB";

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
																		hostname2: window.location.hostname,
																	}),
																}),
																body: JSON.stringify({
																	UUID: auth.currentUser.uuid,
																	pixelData: dataURL,
																	pixelDataID: String(dataURLID),
																}),
															});
															console.log(JSON.stringify(rawResponse));
														}
														sendRequest();
													};
												});
										}
									}}
								>
									<span
										id="PublishButton"
										style={{
											position: "relative",
											left: "-6px",
										}}
									>
										Publish
									</span>
								</button>
								&nbsp;
								<button
									style={{
										width: "30px",
										height: "20px",
										backgroundColor: "darkred",
									}}
									onClick={() => {
										//Delete Save?
										console.log("Delete Save ?");
										if (
											window.confirm(
												"Delete " + gotLoadedIDs[index].split("$%^^%$")[1] + " Workspace?"
											)
										) {
											setPopoverOpen3(() => setPopoverOpen3(false));
											toggle3();
											const auth = firebase.auth();
											var db = firebase.firestore();
											console.log(
												gotLoadedIDs[index].substring(1).replace(`"`, "").replace(`"`, "")
											);
											db
												.collection("Users")
												.doc(auth.currentUser.uid)
												.set(
													{
														[gotLoadedIDs[index]
															.split("$%^^%$")[1]
															.replace(`"`, "")
															.replace(`"`, "")]: firebase.firestore.FieldValue.delete(),
													},
													{ merge: true }
												);
											console.log("RanX");
										} else {
										}
									}}
								>
									<span style={{ position: "relative", left: "-5px" }}>Del</span>
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

	const prettyButtons = {
		width: "103px",
		backgroundColor: "#3322AA",
		height: "30px",
		alignSelf: "center",
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
		fontWeight: "1",
		fontFamily: "courier",
		textShadow: "1px 1px 15px #FFFFFF,1px 1px 15px #FFFFFF",
		fontSize: "20px",
		position: "relative",
		top: "0px",
	};

	let joinedLoadedItemsArray = [];

	return (
		<div
			style={{
				width: "100%",
				marginTop: "-15px",
				marginRight: "10px",
				textAlign: "center",
				textShadow: " 0 0 5px #DDCCFF",
				color: "#DDEEFF",
			}}
		>
			<span
				style={{
					width: "100%",
					marginTop: "-15px",
					userSelect: "none",
					marginRight: "10px",
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
						top: "65px",
						fontSize: "22px",
						right: "25px",
					}}
				>
					Sprite Builder &nbsp;
				</span>
				<span
					style={{
						position: "absolute",
						top: "65px",
						fontSize: "22px",
						left: "25px",
					}}
				>
					<button
						onClick={(activePixelDataURL) => {
							var w = 320;
							var h = 400;
							var activeCanvas = document.querySelector("#activeCanvas");
							var ctxActive = activeCanvas.getContext("2d");
							var dataURL = activeCanvas.toDataURL("image/png", 1);
							setActivePixelDataURL(dataURL);
							setActivePixelDataURL((activePixelDataURL) => {
								if (activePixelDataURL) {
									setActivePixelDataURL(dataURL);
									console.log(activePixelDataURL);

									var img = new Image();
									img.src = activePixelDataURL;

									img.onload = function () {
										var canvasClear = document.querySelector("#activeCanvas");
										console.log("Canvas Cleared, Draw Flipped");
										console.log("Flipped Canvas Now Remake");
										console.log(img.src);
										ctxActive.beginPath();
										ctxActive.clearRect(0, 0, w, h);

										ctxActive.beginPath();
										//          ctxActive.drawImage(img, 0, 0);
										console.log("Final Draw");
										// ctxActive.translate(320, 0);
										// ctxActive.scale(-1, 1);
										// ctxActive.drawImage(img2, 0, 0);
									};

									runOutsideDrawFlippedFunction(activePixelDataURL);
								}
							});
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "6px",
						}}
					>
						<IoSwapHorizontalOutline
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-8px",
								top: "-3px",
							}}
						/>
					</button>
					Flip &nbsp;
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
						onClick={() => {
							//Activate FileUpload
							fileUploadButton();
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "6px",
						}}
					>
						<RiUpload2Fill
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-8px",
								top: "-3px",
							}}
						/>
					</button>
					Upload &nbsp;
					<button
						onClick={() => {
							runNewFrame(frameCounter);
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "6px",
						}}
					>
						<MdLocalMovies
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-8px",
								top: "-3px",
							}}
						/>
					</button>
					+Frame &nbsp;
					<button
						onClick={() => {
							console.log(isGridActive);
							var canvas6 = document.getElementById("gridCanvas");
							var ctx6 = canvas6.getContext("2d");
							if (!isGridActive) {
								// Create Array From Count Of Total ArtPixel Cols(Y)
								var gridArrayY = Array.apply(null, Array(parseInt(activePixelCanvasY)));
								// Create Array From Count Of Total ArtPixel Cols(X)
								var gridArrayX = Array.apply(null, Array(parseInt(activePixelCanvasX)));
								// For Each ArtPixel
								gridArrayY.forEach((ele, indexY) => {
									gridArrayX.forEach((ele, indexX) => {
										console.log("Test 2 " + indexX);
										// Draw Fours Lines For Every ArtPixel
										// Draw from indexXStart,indexYStart to indexEnd aka (index + 10)

										ctx6.fillRect(indexX * 10, indexY * 10, 10, 1);

										ctx6.fillRect(indexX * 10, indexY * 10, 1, 10);

										//Top Line
										//Move To Integer Start (TOP RIGHT)
										// //Right Line
										//   ctx.fillRect(indexX * 10, indexY * 10, 10, 1);
										// //Left Line
										// ctx.fillRect(indexX * 10, 1, 1, 10);
										// //Bottom Line
										// ctx.fillRect(indexX * 10, 1, 1, 10);

										setIsGridActive(true);
									});
								});
							} else {
								ctx6.clearRect(0, 0, canvas6.clientWidth, canvas6.clientHeight);

								setIsGridActive(false);
							}
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "6px",
						}}
					>
						<MdGridOn
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-8px",
								top: "-3px",
							}}
						/>
					</button>
					Toggle Grid &nbsp;
					<button
						onClick={() => {
							if (window.confirm("Clear Current Workspace?")) {
								resetPixels();
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
					<span
						style={{
							position: "absolute",
							top: "65px",
							fontSize: "22px",
							left: "25px",
						}}
						id="SavedPixels"
					></span>
				</span>
				<span style={{ top: "15px", position: "absolute", left: 0, right: 0 }}>
					<button
						onClick={() => {
							setTimeout(() => {
								document.getElementById("NameYourSaveInput") &&
									document.getElementById("NameYourSaveInput").focus();
							}, 200);
						}}
						id="Popover2"
						style={prettyButtons}
					>
						<span style={prettyText}>
							Save
							<Popover
								placement="auto"
								isOpen={popoverOpen2}
								target="Popover2"
								toggle={toggle2}
							>
								<PopoverBody
									style={{
										maxWidth: "155px",
										backgroundColor: "transparent",
										whiteSpace: "nowrap",
										color: "white",
									}}
								>
									<input
										id="NameYourSaveInput"
										style={{
											width: "165px",
											height: "35px",
											position: "relative",
											fontSize: "22px",
											top: "-44px",
										}}
										value={saveNameVar}
										onChange={(e) => {
											e.preventDefault();
											setSaveNameVar(e.target.value);
										}}
									></input>
									<button
										style={{
											width: "40px",
											height: "40px",
											position: "relative",
											top: "-33px",
										}}
										onClick={(e) => {
											let dbData = {};
											e.preventDefault();
											console.log("Save To New Collection In User");
											setIsMouseDown(isMouseDown);
											let gotCurrentPixelAsDataURL = String(
												document.querySelector("#activeCanvas").toDataURL("image/png", 1)
											);
											console.log(saveNameVar);
											console.log(gotCurrentPixelAsDataURL);
											let formattedObj = {
												[saveNameVar]: gotCurrentPixelAsDataURL,
											};

											toggle2();
											const auth = firebase.auth();
											var db = firebase.firestore();
											db
												.collection("Users")
												.doc(auth.currentUser.uid)
												.get()
												.then((ele6) => {
													var key = ele6.id;
													var data = ele6.data();
													data["key"] = key;
													dbData[key] = data;

													let gotPixelDataArray = [];

													let dbDataArray = Object.values(dbData);

													dbDataArray.forEach((dbArrayEle) => {
														console.log(dbArrayEle.PixelSaveData);
														gotPixelDataArray.push(dbArrayEle);
													});

													db
														.collection("Users")
														.doc(auth.currentUser.uid)
														.set(
															{
																[saveNameVar]: {
																	PixelSaveData: formattedObj,
																	AnimationData: animationStateArray,
																	createdAt: firebase.firestore.FieldValue.serverTimestamp(),
																},
															},
															{ merge: true }
														);
												});
											decideRenderUserSaves();
										}}
									>
										<IoSave
											color="green"
											size="35px"
											style={{
												position: "relative",
												left: "-7px",
											}}
										/>
									</button>
									<br />
								</PopoverBody>
							</Popover>
						</span>
					</button>
					&nbsp;
					<button id="Popover3" style={prettyButtons}>
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
										minWidth: "245px",
										backgroundColor: "black",
										color: "white",
									}}
								>
									<Button
										onClick={() => {
											var locSpanId = document.getElementById("UserSaveSpan");

											if (!locSpanId.hidden) {
												locSpanId.hidden = true;
											} else {
												locSpanId.hidden = false;
												decideRenderUserSaves();
											}
										}}
										style={{
											width: "100%",
											backgroundColor: "#337722",
											height: "30px",
											alignSelf: "center",
											float: "center",
											color: "whiteSmoke",
											textAlign: "center",
											borderRadius: "10px",
											fontSize: "15px",
										}}
									>
										Your Saves
									</Button>
									<span hidden={true} id="UserSaveSpan">
										{loadedSaveFiles}
									</span>
									<br />
									<Button
										onClick={() => {
											var locSpanId = document.getElementById("GlobalSaveSpan");

											if (!locSpanId.hidden) {
												locSpanId.hidden = true;
											} else {
												locSpanId.hidden = false;
												decideRenderGlobalSaves();
											}
										}}
										style={{
											width: "100%",
											height: "30px",
											alignSelf: "center",
											float: "center",
											textAlign: "center",
											borderRadius: "10px",
											color: "whiteSmoke",
											fontSize: "15px",
											backgroundImage:
												"radial-gradient(rgb(101, 115, 255), rgb(111, 114, 247), rgb(120, 114, 239), rgb(130, 113, 231), rgb(139, 112, 223), rgb(149, 111, 215), rgb(158, 111, 208), rgb(168, 110, 200), rgb(177, 109, 192), rgb(187, 108, 184), rgb(196, 108, 176), rgb(206, 107, 168))",
										}}
									>
										Global Saves
									</Button>

									<span hidden={true} id="GlobalSaveSpan">
										{loadedGlobalFiles}
									</span>
								</PopoverBody>
							</Popover>
						</span>
					</button>
				</span>
			</span>
			<div
				style={{
					flexDirection: "column",
					width: "100%",
				}}
			>
				<span
					onMouseLeave={(e) => {
						return false;
					}}
					id="#ColorPickerContainer"
					onMouseDown={(e) => {
						return false;
					}}
					style={{
						position: "absolute",
						left: "25px",
						top: "215px",
						maxWidth: "450px",
					}}
				>
					<SketchPicker
						id="SketchPickerID"
						color={pixelColor}
						onChange={(e) => {
							if (changeColorTimer === 0) {
								setChangeColorTimer(Date.now());
							}
							if (Date.now() > changeColorTimer + 250) {
								setChangeColorTimer(Date.now());

								setPixelColor(e.hex);
								let joinedArray = recentColors;

								if (
									recentColors[recentColors.length - 1] &&
									!recentColors[recentColors.length - 1].includes(e.hex)
								) {
									joinedArray.push(e.hex);
								}
								if (recentColors.length < 1) {
									joinedArray.push(e.hex);
								}
								setRecentColors(joinedArray);
							}
						}}
						onChangeComplete={(e) => {
							setPixelColor(e.hex);
							let joinedArray = recentColors;
							if (
								recentColors[recentColors.length - 1] &&
								!recentColors[recentColors.length - 1].includes(e.hex)
							) {
								joinedArray.push(e.hex);
							}
							if (recentColors.length < 1) {
								joinedArray.push(e.hex);
							}
							setRecentColors(joinedArray);
						}}
					/>
				</span>
				<span
					id="#ColorPickerContainer"
					style={{
						position: "absolute",
						userSelect: "none",
						left: "25px",
						top: "530px",
						textAlign: "left",
						maxWidth: "650px",
					}}
				>
					{" "}
					RecentColors: &nbsp;
					<button
						onClick={() => {
							setPixelColor(recentColors[recentColors.length - 1]);
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "1px",
							backgroundColor: recentColors[recentColors.length - 1],
						}}
					>
						<span
							style={{
								width: "100%",
								fontSize: "22px",
								position: "relative",
								left: "-2px",
								top: "-2px",
							}}
						>
							1
						</span>
					</button>
					&nbsp;
					<button
						onClick={() => {
							setPixelColor(recentColors[recentColors.length - 2]);

							var temp = recentColors[recentColors.length - 1];
							recentColors[recentColors.length - 1] =
								recentColors[recentColors.length - 2];

							recentColors[recentColors.length - 2] = temp;
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "1px",
							backgroundColor: recentColors[recentColors.length - 2],
						}}
					>
						<span
							style={{
								width: "100%",
								fontSize: "22px",
								position: "relative",
								left: "-2px",
								top: "-2px",
							}}
						>
							2
						</span>
					</button>
					&nbsp;
					<button
						onClick={() => {
							setPixelColor(recentColors[recentColors.length - 3]);

							var temp = recentColors[recentColors.length - 1];
							recentColors[recentColors.length - 1] =
								recentColors[recentColors.length - 3];

							recentColors[recentColors.length - 3] = temp;
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "1px",
							backgroundColor: recentColors[recentColors.length - 3],
						}}
					>
						<span
							style={{
								width: "100%",
								fontSize: "22px",
								position: "relative",
								left: "-2px",
								top: "-2px",
							}}
						>
							3
						</span>
					</button>
					&nbsp;
					<button
						onClick={() => {
							setPixelColor(recentColors[recentColors.length - 4]);
							var temp = recentColors[recentColors.length - 1];
							recentColors[recentColors.length - 1] =
								recentColors[recentColors.length - 4];

							recentColors[recentColors.length - 4] = temp;
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "1px",
							backgroundColor: recentColors[recentColors.length - 4],
						}}
					>
						<span
							style={{
								width: "100%",
								fontSize: "22px",
								position: "relative",
								left: "-2px",
								top: "-2px",
							}}
						>
							4
						</span>
					</button>
					&nbsp;
					<button
						onClick={() => {
							setPixelColor(recentColors[recentColors.length - 5]);
							var temp = recentColors[recentColors.length - 1];
							recentColors[recentColors.length - 1] =
								recentColors[recentColors.length - 5];

							recentColors[recentColors.length - 5] = temp;
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "1px",
							backgroundColor: recentColors[recentColors.length - 5],
						}}
					>
						<span
							style={{
								width: "100%",
								fontSize: "22px",
								position: "relative",
								left: "-2px",
								top: "-2px",
							}}
						>
							5
						</span>
					</button>
					&nbsp;
					<button
						onClick={() => {
							setPixelColor(recentColors[recentColors.length - 6]);
							var temp = recentColors[recentColors.length - 1];
							recentColors[recentColors.length - 1] =
								recentColors[recentColors.length - 6];

							recentColors[recentColors.length - 6] = temp;
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "1px",
							backgroundColor: recentColors[recentColors.length - 6],
						}}
					>
						<span
							style={{
								width: "100%",
								fontSize: "22px",
								position: "relative",
								left: "-2px",
								top: "-2px",
							}}
						>
							6
						</span>
					</button>
					&nbsp;
					<button
						onClick={() => {
							setPixelColor(recentColors[recentColors.length - 7]);
							var temp = recentColors[recentColors.length - 1];
							recentColors[recentColors.length - 1] =
								recentColors[recentColors.length - 7];

							recentColors[recentColors.length - 7] = temp;
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "1px",
							backgroundColor: recentColors[recentColors.length - 7],
						}}
					>
						<span
							style={{
								width: "100%",
								fontSize: "22px",
								position: "relative",
								left: "-2px",
								top: "-2px",
							}}
						>
							7
						</span>
					</button>
					&nbsp;
					<br />
					Brush Tools: &nbsp;&nbsp;
					<button
						onClick={() => {
							setActiveBrushTool("Pixel");
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "-3px",
						}}
					>
						<IoSquare
							style={{
								height: "15px",
								width: "15px",
								position: "relative",
								left: "-3px",
								top: "1px",
							}}
						/>
					</button>
					&nbsp;
					<button
						onClick={() => {
							setActiveBrushTool("PixelEraser");
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "-3px",
						}}
					>
						<IoSquareOutline
							style={{
								height: "15px",
								width: "15px",
								position: "relative",
								left: "-3px",
								top: "1px",
							}}
						/>
					</button>
					&nbsp;
					<button
						onClick={() => {
							setActiveBrushTool("Pen");
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "6px",
						}}
					>
						<IoPencil
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-8px",
								top: "-3px",
							}}
						/>
					</button>
					&nbsp;
					<button
						onClick={() => {
							setActiveBrushTool("DrawCircle");
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "6px",
						}}
					>
						<FaRegCircle
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-8px",
								top: "-3px",
							}}
						/>
					</button>
					&nbsp;
					<button
						onClick={() => {
							setActiveBrushTool("Line");
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "6px",
						}}
					>
						<AiOutlineLine
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-8px",
								top: "-3px",
							}}
						/>
					</button>
					&nbsp;
					<button
						onClick={() => {
							setActiveBrushTool("Eraser");
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "6px",
						}}
					>
						<FaEraser
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-8px",
								top: "-3px",
							}}
						/>
					</button>
					{/*
            <button
            onClick={(e, i) => {
              var canvas = document.getElementById("activeCanvas");
              var dataURL = canvas.toDataURL("image/png", 1);
              console.log(dataURL);
              runZoomInFun(e, i, { dataURL: dataURL, canvas: canvas });
            }}
            style={{
              height: "25px",
              width: "25px",
              position: "relative",
              top: "6px",
            }}
          >
            <TiZoomIn
              style={{
                height: "25px",
                width: "25px",
                position: "relative",
                left: "-8px",
                top: "-3px",
              }}
            />
          </button>
          F&nbsp;
          <button
            onClick={(e, i) => {
              var canvas = document.getElementById("activeCanvas");
              var dataURL = canvas.toDataURL("image/png", 1);
              console.log(dataURL);
              runZoomOutFun(e, i, { dataURL: dataURL, canvas: canvas });
            }}
            style={{
              height: "25px",
              width: "25px",
              position: "relative",
              top: "6px",
            }}
          >
            <TiZoomOut
              style={{
                height: "25px",
                width: "25px",
                position: "relative",
                left: "-8px",
                top: "-3px",
              }}
            />
          </button>
          G&nbsp;
          */}
					&nbsp;
					<button
						onClick={() => {
							setActiveBrushTool("GetColor");
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "6px",
						}}
					>
						<IoEyedrop
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-8px",
								top: "-3px",
							}}
						/>
					</button>
					&nbsp;
					<button
						hidden={true}
						onClick={() => {
							setActiveBrushTool("PaintBucket");
						}}
						style={{
							height: "25px",
							width: "25px",
							position: "relative",
							top: "6px",
						}}
					>
						<CgColorBucket
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-8px",
								top: "-3px",
							}}
						/>
					</button>
					<span
						style={{
							color: "lightgreen",
							position: "absolute",
							top: "-35px",
							left: "225px",
						}}
					>
						Tool:&nbsp;
						{activeBrushTool}&nbsp;
					</span>
					<br />
					Size: &nbsp;
					<input
						onMouseLeave={() => {
							console.log("Lose Input Focus");
							document.activeElement.blur();
						}}
						type="number"
						style={{
							backgroundColor: "transparent",
							width: "45px",
							fontSize: "26px",
							color: "whitesmoke",
							fontWeight: "600",
							fontFamily: "courier",
							position: "relative",

							top: "0px",
						}}
						onChange={(e) => {
							setBrushSizeControl(e.target.value);
						}}
						value={brushSizeControl}
					></input>
					+- &nbsp; Soft: &nbsp;
					<input
						onMouseLeave={() => {
							console.log("Lose Input Focus");
							document.activeElement.blur();
						}}
						type="number"
						style={{
							backgroundColor: "transparent",
							width: "45px",
							fontSize: "26px",
							color: "whitesmoke",
							fontWeight: "600",
							fontFamily: "courier",
							position: "relative",
							top: "-2px",
						}}
						onChange={(e) => {
							setBrushSoftControl(e.target.value);
						}}
						value={brushSoftControl}
					></input>
					&nbsp;
					<br />
					FrameRate: 1 /&nbsp;
					<input
						onMouseLeave={() => {
							console.log("Lose Input Focus");
							document.activeElement.blur();
						}}
						type="number"
						style={{
							backgroundColor: "transparent",
							width: "77px",
							fontSize: "26px",
							color: "whitesmoke",
							fontWeight: "600",
							fontFamily: "courier",
							position: "relative",
							top: "0px",
						}}
						onChange={(e) => {
							setFrameRateControl(e.target.value);
						}}
						value={frameRateControl}
					></input>
					&nbsp; ms <br />
					Dimensions:&nbsp;
					<input
						onMouseLeave={() => {
							console.log("Lose Input Focus");
							document.activeElement.blur();
						}}
						type="number"
						style={{
							backgroundColor: "transparent",
							width: "77px",
							fontSize: "26px",
							color: "whitesmoke",
							fontWeight: "600",
							fontFamily: "courier",
							position: "relative",
							top: "0px",
						}}
						onChange={(e) => {
							setActiveCanvasX(e.target.value);
							var ctx = document.getElementById("activeCanvas").getContext("2d");
							ctx.canvas.width = activeCanvasX;
							setActiveCanvasType("Custom");
							setActivePixelCanvasX(Math.round(e.target.value / 10));
							PixelXCount.current = activePixelCanvasX;
							setActiveCanvasX(e.target.value * 1);
						}}
						value={activeCanvasX}
					></input>
					&nbsp; x{" "}
					<input
						onMouseLeave={() => {
							console.log("Lose Input Focus");
							document.activeElement.blur();
						}}
						type="number"
						style={{
							backgroundColor: "transparent",
							width: "77px",
							fontSize: "26px",
							color: "whitesmoke",
							fontWeight: "600",
							fontFamily: "courier",
							position: "relative",
							top: "0px",
						}}
						onChange={(e) => {
							setActivePixelCanvasY(e.target.value);
							PixelYCount.current = activePixelCanvasY;
							setActiveCanvasY(e.target.value);
							setActivePixelCanvasY(Math.round(e.target.value / 10));

							setActivePixelCanvasY(Math.round(e.target.value / 10));
							PixelYCount.current = activePixelCanvasY;
							setActiveCanvasY(e.target.value * 1);
						}}
						value={activeCanvasY}
					></input>{" "}
					&nbsp; <br />
					<span hidden={activeCanvasType === "Phaser" ? false : true}>
						KeyFrame&nbsp;
						<input
							id="RootKeyFrameInput"
							onMouseLeave={() => {
								console.log("Lose Input Focus");
								document.activeElement.blur();
							}}
							style={{
								backgroundColor: "transparent",
								width: "277px",
								fontSize: "26px",
								color: "whitesmoke",
								fontWeight: "600",
								fontFamily: "courier",
								position: "relative",
								top: "0px",
							}}
							onChange={(e) => {
								activeSheetCurrentKeyframe.current = String(e.target.value);
								window.triggerUpdate();
								window.restartScene();
							}}
						></input>
						&nbsp;
					</span>
					&nbsp; <br />
					<span hidden={activeBrushTool === "Pixel" ? false : true}>
						Pixel Count:&nbsp;
						<input
							onMouseLeave={() => {
								console.log("Lose Input Focus");
								document.activeElement.blur();
							}}
							type="number"
							style={{
								backgroundColor: "transparent",
								width: "77px",
								fontSize: "26px",
								color: "whitesmoke",
								fontWeight: "600",
								fontFamily: "courier",
								position: "relative",
								top: "0px",
							}}
							onChange={(e) => {
								setActivePixelCanvasX(e.target.value);
								PixelXCount.current = activePixelCanvasX;
								setActiveCanvasX(e.target.value * 10);
							}}
							value={activePixelCanvasX}
						></input>
						&nbsp; x{" "}
						<input
							onMouseLeave={() => {
								console.log("Lose Input Focus");
								document.activeElement.blur();
							}}
							type="number"
							style={{
								backgroundColor: "transparent",
								width: "77px",
								fontSize: "26px",
								color: "whitesmoke",
								fontWeight: "600",
								fontFamily: "courier",
								position: "relative",
								top: "0px",
							}}
							onChange={(e) => {
								setActivePixelCanvasY(e.target.value);
								setActiveCanvasType("Custom");
								setActiveCanvasY(e.target.value * 10);
							}}
							value={activePixelCanvasY}
						></input>
					</span>
					&nbsp; <br />
					<span hidden={activeBrushTool === "Pixel" ? false : true}>
						Pixel Size:&nbsp;
						<input
							onMouseLeave={() => {
								console.log("Lose Input Focus");
								document.activeElement.blur();
							}}
							type="number"
							style={{
								backgroundColor: "transparent",
								width: "77px",
								fontSize: "26px",
								color: "whitesmoke",
								fontWeight: "600",
								fontFamily: "courier",
								position: "relative",
								top: "0px",
							}}
							onChange={(e) => {
								setActivePixelSize(e.target.value);
								activePixelSizeRef.current = e.target.value;
								console.log(activeCanvasX);
								console.log(activePixelSize);
								// Set Pixel Count === Dimensions / Pixel Size
								setActivePixelCanvasX(activeCanvasX / activePixelSizeRef.current);
								setActivePixelCanvasY(
									(activeCanvasX / activePixelSizeRef.current) * (4 / 3.2)
								);
								PixelXCount.current = activePixelCanvasX;
							}}
							value={activePixelSize}
						></input>
						&nbsp;
					</span>
					&nbsp;
				</span>
				<span
					style={{
						position: "absolute",
						boxShadow: "0px 2px 5px 5px #666666",
						left: "0",
						top: "105px",
						height: "100px",
						overflow: "auto",
						whiteSpace: "nowrap",
						width: "100%",
					}}
				>
					<span
						hidden
						style={{
							width: "100%",
							height: "100%",
							overflow: "auto",
							whiteSpace: "nowrap",
						}}
						id="AnimationContainer"
					>
						Awaiting Frames
					</span>
					<span
						style={{
							width: "100%",
							height: "100%",
							overflow: "auto",
							whiteSpace: "nowrap",
						}}
						id="AnimationFramesContainer"
					>
						{decideRenderAniFramesContainer()}
					</span>
				</span>
				<span
					id="PixelPreviewBox"
					style={{
						width: "100%",
						position: "absolute",
						zIndex: 2,
						left: "265px",
						top: "215px",
						textAlign: "center",
						userSelect: "none",
						maxWidth: "160px",
						float: "left",
						height: "250px",
						fontSize: "22px",
					}}
				>
					<span
						style={{
							position: "relative",
							top: "-5px",
							left: "-15px",
							display: "inline-flex",
						}}
					>
						Animation:
						<button
							onClick={() => {
								console.log(animationFrameCounter.current);

								var frameCountArray = Array.apply(
									null,
									Array(animationFrameCounter.current)
								);

								frameCountArray.forEach((ele, index) => {
									var ShowAniFrames = document.getElementById(
										"ShowAniFrames" + parseInt(index + 1)
									);

									var ctxShowAniFrames = ShowAniFrames.getContext("2d");
									var getFrame = document.querySelector(
										"#SavedCanvasID" + parseInt(index + 1)
									);
									var gotDataURL = getFrame.toDataURL("image/png", 1);

									console.log("Got Data:");
									console.log(index);
									console.log(gotDataURL);
									console.log("Got Data Dimensions:");
									console.log("X" + (index * 120 + 120));
									console.log("Y" + (index * 150 + 150));

									var hiddenCanvas = document.getElementById("hiddenCanvas");
									hiddenCanvas.width = index * 120 + 120;
									hiddenCanvas.style.width = index * 120 + 120;

									console.log(hiddenCanvas.width);

									var ctxPreviewNew = hiddenCanvas.getContext("2d");
									var img = new Image();
									img.src = gotDataURL;
									img.height = 120;
									img.width = 150;
									img.onload = function () {
										ctxPreviewNew.drawImage(img, index * 120, 0, 120, 150);
									};
								});
								console.log();
							}}
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								top: "5px",
							}}
						>
							<span
								style={{
									width: "100%",
									fontSize: "22px",
									position: "relative",
									left: "-2px",
									top: "-4px",
								}}
							>
								o
							</span>
						</button>
					</span>
					<canvas
						style={{
							boxShadow: "0px 2px 5px 5px #666666",
						}}
						id="previewCanvas"
						width="160"
						height="200"
					></canvas>
				</span>
				<span
					style={{
						position: "absolute",
						left: "485px",
						whiteSpace: "nowrap",
						boxShadow: "0px 2px 5px 5px #666666",
						top: "250px",
						textAlign: "left",
						height: activeCanvasY,
						width: activeCanvasX,
						float: "left",
					}}
				>
					<span
						onMouseDown={(e) => {
							e.preventDefault();
							return false;
						}}
						style={{
							position: "absolute",
							color: "lightGreen",
							width: "271px",
							textAlign: "left",
							userSelect: "none",
							top: "-41px",
						}}
					>
						Mode:&nbsp;{activeCanvasType}&nbsp;
						<button
							id="Popover4"
							style={{
								height: "25px",
								width: "30px",
								position: "relative",
								top: "6px",
							}}
						>
							<MdMore
								style={{
									height: "25px",
									width: "25px",
									position: "relative",
									left: "-6px",
									top: "-3px",
								}}
							/>
							<Popover
								placement="bottom"
								isOpen={popoverOpen4}
								target="Popover4"
								toggle={toggle4}
							>
								<PopoverBody
									style={{
										maxWidth: "225px",
										backgroundColor: "black",
										color: "white",
									}}
								>
									<button
										onClick={() => {
											setActiveCanvasType("CharacterBuilder");
											setActiveBrushTool("Pixel");
											setActivePixelCanvasX(32);
											setActivePixelCanvasY(40);
											setActiveCanvasX(320);
											setActiveCanvasY(400);
											PixelXCount.current = activePixelCanvasX;
											PixelYCount.current = activePixelCanvasY;
										}}
										style={{
											height: "25px",
											position: "relative",
											marginTop: "-5px",
											margin: "5px",
											top: "6px",
										}}
									>
										Character Builder
									</button>
									<br />
									<button
										onClick={() => {
											setActiveCanvasType("ItemBuilder");
											setActiveBrushTool("Pixel");
											setActivePixelCanvasX(15);
											setActivePixelCanvasY(15);
											setActiveCanvasX(150);
											setActiveCanvasY(150);
											PixelXCount.current = activePixelCanvasX;
											PixelYCount.current = activePixelCanvasY;
										}}
										style={{
											height: "25px",
											position: "relative",
											margin: "5px",
											top: "6px",
										}}
									>
										Item Builder
									</button>
									<br />
									<button
										onClick={() => {
											setActiveCanvasType("TileBuilder");
											setActiveBrushTool("Pixel");
											setActivePixelCanvasX(20);
											setActivePixelCanvasY(20);
											setActiveCanvasX(200);
											setActiveCanvasY(200);
											PixelXCount.current = activePixelCanvasX;
											PixelYCount.current = activePixelCanvasY;
										}}
										style={{
											height: "25px",
											position: "relative",
											margin: "5px",
											top: "6px",
										}}
									>
										Tile Builder
									</button>
									<br />
									<button
										onClick={() => {
											setActiveCanvasType("Phaser");
											setActivePixelCanvasX(48);
											setActivePixelCanvasY(60);
											setActiveCanvasX(480);
											setActiveCanvasY(600);
											PixelXCount.current = activePixelCanvasX;
											PixelYCount.current = activePixelCanvasY;
											setPopoverOpen4(false);
										}}
										style={{
											height: "25px",
											position: "relative",
											margin: "5px",
											top: "6px",
										}}
									>
										Phaser Editor
									</button>
								</PopoverBody>
							</Popover>
						</button>
						<span hidden={activeCanvasType !== "Phaser"}>
							&nbsp;
							<button
								onClick={() => {
									console.log("Character Parts Listing");
									window.triggerUpdate();
								}}
							>
								Run Animation
							</button>{" "}
							<button
								onClick={() => {
									console.log("Character Parts Listing");
									window.DLCharacter();
								}}
							>
								DL Character
							</button>
							<button>Y</button>
							<button>Z</button>
						</span>
					</span>
					<span
						hidden={activeCanvasType !== "Phaser"}
						id="SceneEditor"
						width="100%"
						height="100%"
						style={{
							backgroundColor: "transparent",
							position: "absolute",
							left: "0px",
							zIndex: 2,
						}}
					></span>
					<span id="PixelBox">
						<canvas
							style={{
								position: "absolute",
								left: "0px",
								zIndex: 1,
							}}
							onMouseDown={(e) => {
								if (e.detail > 1) {
									e.preventDefault();
								}
							}}
							id="activeCanvas"
							width={activeCanvasX}
							height={activeCanvasY}
						></canvas>
						<canvas
							id="gridCanvas"
							style={{
								position: "absolute",
								left: "0px",
								zIndex: 0,
							}}
							onMouseDown={(e) => {
								if (e.detail > 1) {
									e.preventDefault();
								}
							}}
							width={activeCanvasX}
							height={activeCanvasY}
						></canvas>
					</span>
				</span>
			</div>
			<div id="PixelBoxSpacer" style={{ height: "750px" }}></div>
			<div
				style={{ fontSize: "6px", maxHeight: "100px", overflow: "hidden" }}
				id="SaveData"
			></div>
			<canvas
				style={{
					position: "absolute",
					left: "0px",
					zIndex: 1,
				}}
				id="hiddenCanvas"
			></canvas>{" "}
		</div>
	);

	function runNewFrame(e, props, frameCounter) {
		if (isNaN(animationFrameCounter.current)) {
			animationFrameCounter.current = 0;
		}
		console.log(animationFrameCounter.current);
		animationFrameCounter.current++;

		console.log("||| Running New Frame");
		console.log("||| " + parseInt(animationFrameCounter.current));
		// send preview pixels to canvas
		var activeCanvas = document.querySelector("#activeCanvas");
		var previewCanvas = document.querySelector("#previewCanvas");
		var ctxPreview = previewCanvas.getContext("2d");
		var dataURL = activeCanvas.toDataURL("image/png", 1);
		var w = 160;
		var h = 200;
		var canvas = document.createElement("canvas");
		canvas.id = "SavedCanvasID" + parseInt(animationFrameCounter.current);
		canvas.width = w;
		canvas.height = h;
		canvas.style.zIndex = 8;
		document.getElementById("AnimationContainer").appendChild(canvas);

		var savedCanvas = document.getElementById(
			`SavedCanvasID${parseInt(animationFrameCounter.current)}`
		);
		var ctxPreviewNew = savedCanvas.getContext("2d");
		var img = new Image();
		img.src = dataURL;
		img.height = w;
		img.width = h;
		img.onload = function () {
			ctxPreviewNew.drawImage(img, 0, 0, w, h);
			//push new frame to State Animation Array
			let joinedArray = animationStateArray;
			joinedArray.push(img.src);
			setAnimationStateArray(joinedArray);
			console.log(animationStateArray);
		};

		console.log(
			"Loaded Animation Frame: SavedCanvasID" +
				parseInt(animationFrameCounter.current)
		);
	}
	function decideRenderAniFramesContainer() {
		var frameCountArray = Array.apply(null, Array(animationFrameCounter.current));
		let htmlArray = [];
		frameCountArray.forEach((ele, index) => {
			setTimeout(() => {
				var ShowAniFrames = document.getElementById(
					"ShowAniFrames" + parseInt(index + 1)
				);

				var ctxShowAniFrames = ShowAniFrames.getContext("2d");

				var getFrame = document.querySelector(
					"#SavedCanvasID" + parseInt(index + 1)
				);

				var gotDataURL = getFrame.toDataURL("image/png", 1);

				var w = 80;
				var h = 100;
				var img = new Image();
				img.src = gotDataURL;
				img.onload = function () {
					img.width = w;
					img.height = h;
					ctxShowAniFrames.drawImage(img, 0, 0, w, h);
				};
			}, 1000);

			htmlArray.push(
				<span>
					<button
						onClick={() => {
							alert("nyi");
						}}
						style={{
							height: "15px",
							width: "15px",
							position: "relative",
							top: "6px",
						}}
					>
						<IoIosClose
							style={{
								height: "25px",
								width: "25px",
								position: "relative",
								left: "-12px",
								top: "-7px",
							}}
						/>
					</button>
					{index + 1}
					<canvas
						width="80"
						height="100"
						style={{ width: "80", height: "100" }}
						id={`ShowAniFrames${index + 1}`}
					></canvas>
				</span>
			);
		});

		return htmlArray;
	}
}
