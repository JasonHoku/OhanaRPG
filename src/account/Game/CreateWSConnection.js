export default function CreateWSConnection(
	props,
	peer,
	connectedPlayersGroup,
	connectedPlayersPointerGroup,
	confirmedRTCLinks
) {
	const Phaser = require("phaser");

	peer.on("connection", (conn) => {
		conn.on("data", (data) => {
			// Receive RTC Data
			//		console.log(data);
			props.mouseDown = false;

			if (data.meta.includes("Click")) {
				//	console.log("ClickReceived");
				props.mouseDown = true;
				//		console.log(props.mouseDown);

				var objArr2 = connectedPlayersGroup.getChildren();
				for (let i = 0; i < objArr2.length; i++) {
					if (
						connectedPlayersGroup.getChildren()[i].name ===
						String("ConnPlayer" + data.id.id)
					) {
						connectedPlayersGroup.getChildren()[i].x = data.MidX;
						connectedPlayersGroup.getChildren()[i].y = data.MidY;
						//	console.log("Found ID");
					}
				}

				//
				for (
					let i = 0;
					i < connectedPlayersPointerGroup.getChildren().length;
					i++
				) {
					if (
						connectedPlayersPointerGroup.getChildren()[i].name ===
						String("ConnPlayerPointer" + data.id.id)
					) {
						// console.log("Found ID");
						connectedPlayersPointerGroup.getChildren()[i].x = data.mouseX;
						connectedPlayersPointerGroup.getChildren()[i].y = data.mouseY;
						// console.log(connectedPlayersPointerGroup.getChildren()[i].name);
						// console.log(i);
						// console.log("Found ID");
					}
				}

				//					let totalBullets = props.bulletGroup.children.entries.length;
				// if (props.mouseDown) {
				// 	props.bulletGroup
				// 		.create(data.MidX, data.MidY, "Bullet")
				// 		.setScale(0.2)
				// 		.setBounceX(0.1)
				// 		.setBounceY(0.1)
				// 		.setGravityY(200)
				// 		.setVelocity(
				// 			(data.mouseX - data.MidX) * 3,
				// 			(data.mouseY - data.MidY) * 3
				// 		).name = String("RockBulletAge_" + window.gameTime);
				// }
			}
			if (data.meta.includes("ClickUP")) {
				console.log("ClickReceived");
				props.mouseDown = false;
				clearInterval(props.mouseDownInterval);
			}
			if (data.meta.includes("MouseMoveData")) {
				//		console.log(data);
				// console.log("MouseMove");
				//		console.log(data.id);
				//
				for (
					let i = 0;
					i < connectedPlayersPointerGroup.getChildren().length;
					i++
				) {
					if (
						connectedPlayersPointerGroup.getChildren()[i].name ===
						String("ConnPlayerPointer" + data.id.id)
					) {
						// console.log("Found ID");
						connectedPlayersPointerGroup.getChildren()[i].x = data.mouseX;
						connectedPlayersPointerGroup.getChildren()[i].y = data.mouseY;
						// console.log(connectedPlayersPointerGroup.getChildren()[i].name);
						// console.log(i);
						// console.log("Found ID");
					}
				}

				//		console.log(connectedPlayersPointerGroup.getChildren());
			}

			if (data.meta.includes("ConnStart")) {
				console.log("ConnStart Received");
				console.log(JSON.parse(data.RTCdata));
				console.log(confirmedRTCLinks);

				JSON.parse(data.RTCdata).forEach((el) => {
					///			console.log(el.id);
					//
					if (
						JSON.stringify(confirmedRTCLinks).includes(JSON.stringify(el.id)) ===
						false
					) {
						if (
							JSON.stringify(window.thisUserRTCId).includes(JSON.stringify(el.id)) ===
							false
						) {
							console.log("New RTC Detected");
							console.log(el);
							//		console.log(el);
							//		console.log(window.localRTCDataArray);
							window.localRTCDataArray.push({ id: el.id, timeStamp: Date.now() });
						}
					}
				});
			}
			if (data.meta.includes("Login")) {
				console.log("Login Received");
				console.log(data.id);
				//
				var playerIdVar = connectedPlayersGroup
					.create(data.MidX, data.MidY, String("Bullet"))
					.setTint("0xFF0000");
				playerIdVar.name = String("ConnPlayer" + data.id.id);
				//
				Phaser.Actions.SetXY(playerIdVar, data.MidX, data.MidY);
				//
				//
				//
				var playerCursorIdVar = connectedPlayersPointerGroup
					.create(data.MidX, data.MidY, String("Bullet"))
					.setScale(0.3);

				playerCursorIdVar.name = String("ConnPlayerPointer" + data.id.id);
				//
				Phaser.Actions.SetXY(playerCursorIdVar, data.MidX, data.MidY);
				//
				//
				console.log("%c Creating Login", "color: green;");
				console.log(window.localRTCDataArray);
				window.localRTCDataArray.push({
					id: data.id.id,
					timeStamp: data.id.timeStamp,
				});
				//
				//
			}

			if (data.meta.includes("Send")) {
				//	console.log(data);
				// connectedPlayersGroup
				// 	.create(data.MidX, data.MidY, data.userID)
				// 	.setVelocity(0);
				var objArr2 = connectedPlayersGroup.getChildren();

				for (let i = 0; i < objArr2.length; i++) {
					if (
						connectedPlayersGroup.getChildren()[i].name ===
						String("ConnPlayer" + data.id.id)
					) {
						connectedPlayersGroup.getChildren()[i].x = data.MidX;
						connectedPlayersGroup.getChildren()[i].y = data.MidY;
						//	console.log("Found ID");
					}
				}
			}
		});
	});
}
