import firebase from "firebase/app";

import React, { useState, useEffect, useRef } from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Button, Popover, PopoverBody } from "reactstrap";

import SpriteBuilder from "./SpriteBuilder";
import GameComponent from "./Game";

import SceneCreator from "./SceneCreator";

import { ImCogs } from "react-icons/im";

function ModeratorPage() {
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [decideRenderTabs, setDecideRenderTabs] = useState([]);
	const [tabName, setTabName] = useState("SpriteBuilder");
	const toggle = () => setPopoverOpen(!popoverOpen);

	const isInitialMount = useRef(true);
	useEffect(() => {
		if (window.location.pathname === "/build") {
			setTabName("SpriteBuilder");
			return null;
		}
		if (window.location.pathname === "/game") {
			setTabName("GameMode");
			return null;
		}

		if (window.location.pathname === "/create") {
			setTabName("SceneCreator");
			return null;
		}
		setTabName(() => tabName);
		if (!isInitialMount.current) {
			return null;
		} else {
			//Run Once : Preload
		}

		isInitialMount.current = false;
	}, [tabName]);

	const prettyButtons = {
		backgroundColor: "#201c2c",
		height: "30px",
		alignSelf: "center",
		margin: "5px",
		zIndex: 999,
		textShadow: " 0 0 5px #DDCCFF",
		float: "center",
		color: "whiteSmoke",
		textAlign: "center",
		borderRadius: "10px",
		fontSize: "15px",
	};
	return (
		<div
			style={{
				borderRadius: "50px",
			}}
		>
			<button
				id="Popover1"
				className="zoom"
				style={{
					width: "50px",
					backgroundColor: "transparent",
					height: "50px",
					alignSelf: "right",
					float: "right",
					display: "flex",
					position: "absolute",
					textAlign: "center",
					top: "5px",
					right: "10px",
					borderRadius: "50px",

					fontSize: "15px",
				}}
				onClick={(e) => {}}
			>
				<span
					style={{
						color: "whitesmoke",
						fontWeight: "1",
						fontFamily: "courier",
						backgroundColor: "transparent",
						textShadow: "1px 1px 15px #FFFFFF,1px 1px 15px #FFFFFF",
						zIndex: 999,
						borderRadius: "50px",
						position: "absolute",
						top: "8px",
						left: "8px",
					}}
				>
					<ImCogs size="30" />
					<Popover
						style={{
							zIndex: 999,
							borderRadius: "50px",
						}}
						placement="bottom"
						isOpen={popoverOpen}
						target="Popover1"
						toggle={toggle}
					>
						<PopoverBody
							style={{
								backgroundColor: "black",
								zIndex: 999,
								color: "white",
								textAlign: "center",
							}}
						>
							<Link href="" to="/build">
								<Button
									style={prettyButtons}
									onClick={() => {
										setTabName("SpriteBuilder");
										toggle();
										setPopoverOpen(false);
									}}
								>
									Sprite Builder
								</Button>
							</Link>
							<br />
							<Link to="/create">
								<Button
									style={prettyButtons}
									onClick={() => {
										setTabName("SceneCreator");
										window.handleDBGameObjects = undefined;
										toggle();
										setPopoverOpen(false);
									}}
								>
									Scene Creator
								</Button>
							</Link>
							<br />
							<Button
								onClick={() => {
									document.getElementById("HideNoteSpan").hidden = false;
									toggle();
									setPopoverOpen(false);
								}}
								style={prettyButtons}
							>
								Todo Notes
							</Button>
							<br />
							<a href="/game">
								<button
									style={prettyButtons}
									onClick={() => {
										setTabName("GameMode");
									}}
								>
									Play Ohana
								</button>
							</a>
							<br />
							<button
								className="zoom"
								style={{
									width: "90px",
									backgroundColor: "#AA3322",
									height: "30px",
									textAlign: "center",
									right: "15px",
									borderRadius: "10px",
									fontSize: "15px",
								}}
								onClick={() => {
									firebase.auth().signOut() && window.location.reload();
								}}
							>
								<span
									style={{
										color: "whitesmoke",
										fontWeight: "1",
										fontFamily: "courier",
										textShadow: "1px 1px 15px #FFFFFF,1px 1px 15px #FFFFFF",
										fontSize: "18px",
										zIndex: 999,
										position: "relative",
										top: "-1px",
										left: "-2px",
									}}
								>
									SignOut
								</span>
							</button>
						</PopoverBody>
					</Popover>
				</span>
			</button>
			<span
				onClick={() => {
					document.getElementById("HideNoteSpan").hidden = true;
				}}
				id="HideNoteSpan"
				style={{
					textAlign: "left",
					zIndex: 1998,
					backgroundColor: "#201c2c",
					position: "absolute",
					color: "whitesmoke",
					top: "0",
					left: "0",
				}}
				hidden
			>
				<div
					onClick={() => {
						document.getElementById("HideNoteSpan").hidden = true;
					}}
					style={{ margin: "150px", zIndex: 1998 }}
				>
					{
						// Begin Todo Notes
					}
					Ohana Notes: <br />
					<br />
					HomePage: <br />
					Loader <br />
					Welcome Page <br />
					Game Intro Scene <br />
					<br />
					<br />
					SceneCreator : <br />
					Move Coordinates Of Active Object, <br />
					Z Indexing Of Objects: Based on Coordinates
					<br />
					Animation Importer <br />
					Define Hit Boxes: HitBox Defining Tool, For Each Map, Also the dimensions
					of the object if specific type. Also Hitbox Override Tool.
					<br />
					<br />
					SpriteBuilder : <br />
					Phaser gradients:
					https://phaser.io/examples/v3/view/game-objects/render-texture/draw-on-texture
					Gradient Tools: Brush, Fill <br />
					Are You Sure You Want To Close This <br />
					Animation Frame Placeholder <br />
					Frame Controls: Remove, Duplicate, Move Frame: &#91; &#93; <br />
					Implement Zoom Feature: (Mousewheel Copy --&gt; Enlarge / Shrink) (test
					with ctx.imageSmoothingEnabled = true; ) <br />
					Move Image: On AltClick <br />
					Select through Layers <br />
					Bulk Add Frames Tool <br />
					Save Undo Array On Load/Render
					<br />
					Create Sprite Animation Library Builder: Movements, Actions <br />
					Loop Animation Button: Array + Reversed Array <br />
					On Upload/Paste Resize appropriately/ Do not stretch. <br />
					SmallScreenOrientation <br />
					<br />
					Game Mode : <br />
					Monster Movement: Start Movements (True, Local) When Stopped, Update <br />
					Login Screen & Select Character <br />
					<br />
					<br />
					General Notes : <br />
					Ghost Character With Blinking Frames Effect <br />
					<br />
					<br />
					Load Scene 1 <br />
					<br />
					Hotkeys List: <br />
					BrushSize: + - <br />
					CreateFrame: * <br />
					Pen Tool: P <br />
					Circle Tool: C <br />
					Eraser Tool: E <br />
				</div>
			</span>
			{decideRenderTabsFunction()}
		</div>
	);

	function decideRenderTabsFunction() {
		if (tabName === "GameMode") {
			return (
				<Route path="/game">
					<GameComponent />
				</Route>
			);
		}
		if (tabName === "SpriteBuilder") {
			return (
				<Route path="/build">
					<SpriteBuilder />
				</Route>
			);
		}
		if (tabName === "SceneCreator") {
			return (
				<Route path="/create">
					<SceneCreator />
				</Route>
			);
		}
	}
}

export default ModeratorPage;
