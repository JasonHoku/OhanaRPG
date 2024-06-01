export default function handleUserClick(
	props,
	worldPoint,
	time,
	tile,
	selectedItemRef
) {
	if (props.input.activePointer.isDown) {
		var pointerTileX = props.map.worldToTileX(worldPoint.x);
		var pointerTileY = props.map.worldToTileY(worldPoint.y);
		if (selectedItemRef.current.id.toLowerCase() === "brick") {
			if (time - props.lastLogPlacement >= 50) {
				if (props.userCreatedTiles === undefined) {
					props.userCreatedTiles = [];
				} else {
					if (
						JSON.stringify(
							props.userCreatedTiles[props.userCreatedTiles.length - 1]
						) !==
						JSON.stringify({
							tileId: [727],
							tileX: pointerTileX,
							tileY: pointerTileY,
						})
					)
						props.userCreatedTiles.push({
							tileId: [727],
							tileX: pointerTileX,
							tileY: pointerTileY,
						});
				}
				props.map4.putTilesAt([[727]], pointerTileX, pointerTileY);

				console.log(props.userCreatedTiles);
				tile.setCollision(true, true, true, true);
				tile.setCollisionCallback(console.log("WallTileCollision"), true);

				props.lastLogPlacement = time;
			}
		}
		if (selectedItemRef.current.id.toLowerCase() === "wall") {
			if (time - props.lastLogPlacement >= 50) {
				if (props.userCreatedTiles === undefined) {
					props.userCreatedTiles = [];
				} else {
					if (
						JSON.stringify(
							props.userCreatedTiles[props.userCreatedTiles.length - 1]
						) !==
						JSON.stringify({
							tileId: [1147],
							tileX: pointerTileX,
							tileY: pointerTileY,
						})
					)
						props.userCreatedTiles.push({
							tileId: [1147],
							tileX: pointerTileX,
							tileY: pointerTileY,
						});
				}
				props.map2.putTilesAt([[1147]], pointerTileX, pointerTileY);

				console.log(props.userCreatedTiles);
				tile.setCollision(true, true, true, true);
				tile.setCollisionCallback(console.log("WallTileCollision"), true);

				props.lastLogPlacement = time;
			}
		}

		if (selectedItemRef.current.id.toLowerCase() === "hammer") {
			if (time - props.lastLogPlacement >= 100) {
				if (props.userCreatedTiles === undefined) {
					props.userCreatedTiles = [];
				} else {
					if (window.hammerMakeTileId === undefined) {
						window.hammerMakeTileId = 0;
					} else {
						props.map4.putTilesAt(
							[[parseInt(window.hammerMakeTileId)]],
							pointerTileX,
							pointerTileY
						);

						if (
							JSON.stringify(
								props.userCreatedTiles[props.userCreatedTiles.length - 1]
							) !==
							JSON.stringify({
								tileId: [parseInt(window.hammerMakeTileId)],
								tileX: pointerTileX,
								tileY: pointerTileY,
							})
						)
							props.userCreatedTiles.push({
								tileId: [parseInt(window.hammerMakeTileId)],
								tileX: pointerTileX,
								tileY: pointerTileY,
							});
					}

					console.log(props.userCreatedTiles);

					props.lastLogPlacement = time;
				}
				// props.map2.putTilesAt([[1147]], pointerTileX, pointerTileY);
				// tile.setCollision(true, true, true, true);
				// tile.setCollisionCallback(console.log("WallTileCollision"), true);
			}
		}
		if (selectedItemRef.current.id.toLowerCase() === "checktile") {
			if (time - props.lastLogPlacement >= 100) {
				var worldPointXY = props.input.activePointer.positionToCamera(
					props.cameras.main
				);

				//
				var tile1 = props.map.getTileAtWorldXY(worldPointXY.x, worldPointXY.y);
				//
				var tile2 = props.map2.getTileAtWorldXY(worldPointXY.x, worldPointXY.y);
				//
				var tile3 = props.map3.getTileAtWorldXY(worldPointXY.x, worldPointXY.y);
				//
				var tile4 = props.map4.getTileAtWorldXY(worldPointXY.x, worldPointXY.y);
				console.log(tile1);
				console.log(tile2);
				console.log(tile3);
				console.log(tile4);
				props.lastLogPlacement = time;
			}
			// props.map2.putTilesAt([[1147]], pointerTileX, pointerTileY);
			// tile.setCollision(true, true, true, true);
			// tile.setCollisionCallback(console.log("WallTileCollision"), true);
		}
		if (selectedItemRef.current.id.toLowerCase() === "floor") {
			if (time - props.lastLogPlacement >= 100) {
				if (props.userCreatedTiles === undefined) {
					props.userCreatedTiles = [];
				} else {
					props.map4.putTilesAt(
						[
							[481, 482, 483, 484, 485],
							[481 + 32, 482 + 32, 483 + 32, 484 + 32, 485 + 32],
							[481 + 32 * 2, 482 + 32 * 2, 483 + 32 * 2, 484 + 32 * 2, 485 + 32 * 2],
							[481 + 32 * 3, 482 + 32 * 3, 483 + 32 * 3, 484 + 32 * 3, 485 + 32 * 3],
							[481 + 32 * 4, 482 + 32 * 4, 483 + 32 * 4, 484 + 32 * 4, 485 + 32 * 4],
						],
						pointerTileX,
						pointerTileY
					);

					if (
						JSON.stringify(
							props.userCreatedTiles[props.userCreatedTiles.length - 1]
						) !==
						JSON.stringify({
							tileId: [
								[481, 482, 483, 484, 485],
								[481 + 32, 482 + 32, 483 + 32, 484 + 32, 485 + 32],
								[481 + 32 * 2, 482 + 32 * 2, 483 + 32 * 2, 484 + 32 * 2, 485 + 32 * 2],
								[481 + 32 * 3, 482 + 32 * 3, 483 + 32 * 3, 484 + 32 * 3, 485 + 32 * 3],
								[481 + 32 * 4, 482 + 32 * 4, 483 + 32 * 4, 484 + 32 * 4, 485 + 32 * 4],
							],
							tileX: pointerTileX,
							tileY: pointerTileY,
						})
					)
						props.userCreatedTiles.push({
							tileId: [
								[481, 482, 483, 484, 485],
								[481 + 32, 482 + 32, 483 + 32, 484 + 32, 485 + 32],
								[481 + 32 * 2, 482 + 32 * 2, 483 + 32 * 2, 484 + 32 * 2, 485 + 32 * 2],
								[481 + 32 * 3, 482 + 32 * 3, 483 + 32 * 3, 484 + 32 * 3, 485 + 32 * 3],
								[481 + 32 * 4, 482 + 32 * 4, 483 + 32 * 4, 484 + 32 * 4, 485 + 32 * 4],
							],
							tileX: pointerTileX,
							tileY: pointerTileY,
						});

					// console.log(props.userCreatedTiles);
					props.lastLogPlacement = time;
				}
				// props.map2.putTilesAt([[1147]], pointerTileX, pointerTileY);
				// tile.setCollision(true, true, true, true);
				// tile.setCollisionCallback(console.log("WallTileCollision"), true);
			}
		}
		if (selectedItemRef.current.id.toLowerCase() === "eraseSavedTiles") {
			props.userCreatedTiles = []
		}
		if (selectedItemRef.current.id.toLowerCase() === "table") {
			if (time - props.lastLogPlacement >= 100) {
				if (props.userCreatedTiles === undefined) {
					props.userCreatedTiles = [];
				} else {
					props.map5.putTilesAt([[198]], pointerTileX, pointerTileY);

					if (
						JSON.stringify(
							props.userCreatedTiles[props.userCreatedTiles.length - 1]
						) !==
						JSON.stringify({
							tileId: [[198]],
							tileMap: 5,
							tileX: pointerTileX,
							tileY: pointerTileY,
						})
					)
						props.userCreatedTiles.push({
							tileId: [[198]],
							tileMap: 5,
							tileX: pointerTileX,
							tileY: pointerTileY,
						});

					// console.log(props.userCreatedTiles);
					props.lastLogPlacement = time;
				}
				// props.map2.putTilesAt([[1147]], pointerTileX, pointerTileY);
				// tile.setCollision(true, true, true, true);
				// tile.setCollisionCallback(console.log("WallTileCollision"), true);
			}
		}
		if (selectedItemRef.current.id.toLowerCase() === "chest") {
			if (time - props.lastLogPlacement >= 1000) {
				props.toolObjects
					.create(props.player.x, props.player.y, "sheetVar1")
					.setCollideWorldBounds(true)
					.setPipeline("Light2D")
					.setScale(1)
					.setFrame(8)
					.setInteractive()
					.setVelocity(0)
					.setDepth(20000 + props.player.y - 12).name = "utility_Chest";
				if (props.userCreatedTiles === undefined) {
					props.userCreatedTiles = [];
				} else {
					if (
						JSON.stringify(
							props.userCreatedTiles[props.userCreatedTiles.length - 1]
						) !==
						JSON.stringify({
							tileId: [1147],
							meta: "toolObject",
							tileX: pointerTileX,
							tileY: pointerTileY,
						})
					)
						props.userCreatedTiles.push({
							tileId: [1147],
							meta: "toolObject",
							tileX: pointerTileX,
							tileY: pointerTileY,
						});
				}
				// props.map2.putTilesAt([[1147]], pointerTileX, pointerTileY);
				console.log(props.userCreatedTiles);
				// tile.setCollision(true, true, true, true);
				// tile.setCollisionCallback(console.log("WallTileCollision"), true);
				props.lastLogPlacement = time;
			}
		}

		if (selectedItemRef.current.id.toLowerCase() === "tree") {
			if (time - props.lastLogPlacement >= 500) {
				if (props.userCreatedTiles === undefined) {
					props.userCreatedTiles = [];
				} else {
					if (
						JSON.stringify(
							props.userCreatedTiles[props.userCreatedTiles.length - 1]
						) !==
						JSON.stringify({
							tileId: [31, 32],
							tileX: pointerTileX,
							tileY: pointerTileY,
						})
					)
						props.userCreatedTiles.push({
							tileId: [31, 32],
							tileX: pointerTileX,
							tileY: pointerTileY,
						});

					props.userCreatedTiles.push({
						tileId: [63, 64],
						tileX: pointerTileX,
						tileY: pointerTileY + 1,
					});

					props.userCreatedTiles.push({
						tileId: [95, 96],
						tileX: pointerTileX,
						tileY: pointerTileY + 2,
					});

					props.userCreatedTiles.push({
						tileId: [127, 128],
						tileX: pointerTileX,
						tileY: pointerTileY + 3,
					});

					props.userCreatedTiles.push({
						tileId: [159, 160],
						tileX: pointerTileX,
						tileY: pointerTileY + 4,
					});
				}
				props.map3.putTilesAt(
					[
						[31, 32],
						[63, 64],
						[95, 96],
						[127, 128],
						[159, 160],
					],
					pointerTileX,
					pointerTileY
				);

				console.log(props.userCreatedTiles);
				props.map
					.getTileAt(pointerTileX, pointerTileY + 4)
					.setCollision(true, true, true, true);

				props.map
					.getTileAt(pointerTileX + 1, pointerTileY + 4)
					.setCollision(true, true, true, true);

				// tile.setCollision(true, true, true, true);
				// tile.setCollisionCallback(console.log("WallTileCollision"), true);
				props.lastLogPlacement = time;
			}
		}

		if (selectedItemRef.current.id.toLowerCase() === "torch") {
			if (time - props.lastLogPlacement >= 250) {
				if (props.userCreatedTiles === undefined) {
					props.userCreatedTiles = [];
				} else {
					if (
						JSON.stringify(
							props.userCreatedTiles[props.userCreatedTiles.length - 1]
						) !==
						JSON.stringify({
							tileId: [1360],
							tileX: pointerTileX,
							tileY: pointerTileY,
						})
					)
						props.userCreatedTiles.push({
							tileId: [1360],
							tileX: pointerTileX,
							tileY: pointerTileY,
						});
					console.log(props.userCreatedTiles);
				}

				console.log(pointerTileX, pointerTileY);
				console.log(props.map);
				console.log(props.map2);

				console.log("1000 ms RealTime Counter");

				props.lights
					.addLight(worldPoint.x + 16, worldPoint.y, 1000)
					.setIntensity(1);

				props.map2.putTilesAt([[1360]], pointerTileX, pointerTileY);
				// props.map.replaceByIndex(
				// 	tile.index,
				// 	modifyTileMapRef.current.tileId[0]
				// );
				// props.map2.putTilesAt(
				// 	[
				// 		[409, 410, 411],
				// 		[441, 442, 443],
				// 		[473, 474, 474],
				// 	],
				// 	pointerTileX,
				// 	pointerTileY
				// );
				props.lastLogPlacement = time;
			}
		}
		if (props.lastLogPlacement === undefined) {
			props.lastLogPlacement = 0;
		}
	}
}
