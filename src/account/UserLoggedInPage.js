import firebase from "firebase/app";

import React, { useState, useEffect, useRef } from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Button, Popover, PopoverBody } from "reactstrap";

import PayPalButton from "./PayPalExpress";
import SpriteBuilder from "./SpriteBuilder";
import GameComponent from "./Game";

import { GiPieSlice } from "react-icons/gi";

import { ImCogs } from "react-icons/im";

function UserLoggedInPage() {
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [decideRenderTabs, setDecideRenderTabs] = useState([]);
	const [chooseUserDisplayNameInputState, setChooseUserDisplayNameInputState] =
		useState("");
	const [isUserDBLoaded, setIsUserDBLoaded] = useState(false);
	const [doesUserHaveUsername, setDoesUserHaveUsername] = useState(false);
	const [doesUserHaveAccess, setDoesUserHaveAccess] = useState(false);
	const [tabName, setTabName] = useState("Home");
	const toggle = () => setPopoverOpen(!popoverOpen);

	const [readyPaymentCost, setreadyPaymentCost] = useState("1");
	const [readyPaymentItems, setreadyPaymentItems] =
		useState("Tier 1: $1 / Month");

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
		setTabName(() => tabName);
		if (!isInitialMount.current) {
			return null;
		} else {
			let dbData = {};
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

					let dbDataArray = Object.values(dbData);

					console.log(dbDataArray[0]);
					if (dbDataArray[0].length > 2) {
						setIsUserDBLoaded(true);
					}
					if (
						dbDataArray[0].userDisplayName &&
						dbDataArray[0].userDisplayName.length > 2
					) {
						setDoesUserHaveUsername(true);
					} else {
						setDoesUserHaveUsername(false);
					}
					if (dbDataArray[0].userHasAccess && dbDataArray[0].userHasAccess) {
						setDoesUserHaveAccess(true);
					} else {
						setDoesUserHaveAccess(false);
					}
				});
			//Run Once : Preload
		}

		isInitialMount.current = false;
	}, [tabName]);

	function loadPayPalButton() {
		localStorage.setItem(
			"ProductInfo",
			readyPaymentItems + "X" + localStorage.getItem("username")
		);
		function valueCheck() {
			if (!localStorage.getItem("localData3")) {
				localStorage.setItem("localData3", 0);
			}
		}
		function handleRemoveProduct(id, e) {
			let cart = this.state.cart;
			let index = cart.findIndex((x) => x.id == id);
			cart.splice(index, 1);
			this.setState({
				cart: cart,
			});
			this.sumTotalItems(this.state.cart);
			this.sumTotalAmount(this.state.cart);
			e.preventDefault();
		}
		return (
			<span>
				<center> ${readyPaymentCost}</center>
				<PayPalButton
					valueCheck={valueCheck()}
					cart={readyPaymentCost
						.toString()
						.split("\n")
						.map((str) => (
							<p key={str}>{str}</p>
						))}
					total={parseInt(readyPaymentCost)}
					cartItems={readyPaymentItems
						.toString()
						.split("\n")
						.map((str) => (
							<p key={str}>{str}</p>
						))}
					removeProduct={handleRemoveProduct}
					style={{ width: "15rem" }}
				/>
				{readyPaymentItems
					.toString()
					.split("\n")
					.map((str) => (
						<p key={str}>{str}</p>
					))}
			</span>
		);
	}

	const prettyButtons = {
		backgroundColor: "#3322AA",
		height: "30px",
		alignSelf: "center",
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
		const auth = firebase.auth();
		if (tabName === "Home") {
			return (
				<Route exact path="/">
					<div
						style={{
							color: "whiteSmoke",
							textAlign: "center",
							justifyContent: "center",
							fontSize: "20px",
							alignItems: "center",
							alignContent: "center",
						}}
					>
						Welcome {auth.currentUser.displayName}!
						<div style={{ height: "50px" }}></div>
						<div
							style={{
								maxWidth: "600px",
								position: "absolute",
								left: "50%",
								fontSize: "27px",
								transform: "translate(-50%, 0)",
							}}
						>
							<h3>
								Ohana runs through a combination of{" "}
								<span style={{ color: "black" }}>neurally networked</span> data
								exchanges and proprietary servers to ensure the{" "}
								<span style={{ color: "black" }}>
									highest quality unthinkable experience
								</span>
								.
							</h3>
							<span hidden={doesUserHaveAccess}>
								The cost of these experimental high-load operations requires the
								experience to only be available to patrons, currently.
								<br />
								<br />
								Due to expert data structuring $1 can ensure 100hours of connectivity
								and is a minimum requirement to access the experience.
							</span>{" "}
							<span hidden={!isUserDBLoaded}>
								<span hidden={doesUserHaveUsername}>
									Before you can enter the world, we'll need a name. What Should Everyone
									Call You?
									<br />
									<br />
									<input
										onChange={(e) => {
											setChooseUserDisplayNameInputState(e.target.value);
										}}
										style={{
											width: "400px",
											height: "55px",
											backgroundColor: "#55555566",

											color: "whiteSmoke",
											fontSize: "22px",
										}}
									></input>
									<button
										style={{
											width: "55px",
											height: "55px",
											position: "relative",
											top: "10px",
										}}
										onClick={(e) => {
											let dbData = {};
											e.preventDefault();
											console.log("Set User Display Name");
											const auth = firebase.auth();
											var db = firebase.firestore();
											db.collection("Users").doc(auth.currentUser.uid).set(
												{
													userDisplayName: chooseUserDisplayNameInputState,
												},
												{ merge: true }
											);
											db
												.collection("Users")
												.doc(auth.currentUser.uid)
												.get()
												.then((ele6) => {
													var key = ele6.id;
													var data = ele6.data();
													data["key"] = key;
													dbData[key] = data;

													let dbDataArray = Object.values(dbData);

													console.log(dbDataArray[0]);
													if (dbDataArray[0].length > 2) {
														setIsUserDBLoaded(true);
													}
													if (
														dbDataArray[0].userDisplayName &&
														dbDataArray[0].userDisplayName.length > 2
													) {
														setDoesUserHaveUsername(true);
													} else {
														setDoesUserHaveUsername(false);
													}
												});
										}}
									>
										<GiPieSlice
											color="green"
											size="35px"
											style={{
												position: "relative",
											}}
										/>
									</button>
								</span>
							</span>
							<br />
							<span hidden={doesUserHaveAccess}>
								<br />
								{loadPayPalButton()}
								<br />
							</span>
							<span hidden={!doesUserHaveAccess}>
								<span key={"x" + doesUserHaveUsername} hidden={!doesUserHaveUsername}>
									<Link to="/build">
										<button
											style={prettyButtons}
											onClick={() => {
												setTabName("SpriteBuilder");
											}}
										>
											Build Content
										</button>
									</Link>
									&nbsp;
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
								</span>
							</span>
						</div>
					</div>
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
		if (tabName === "GameMode") {
			return (
				<Route path="/game">
					<GameComponent />
				</Route>
			);
		}
	}
}

export default UserLoggedInPage;
