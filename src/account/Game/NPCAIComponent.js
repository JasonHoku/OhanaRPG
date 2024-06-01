export default function NPCAIComponent(props, time) {
	const Phaser = require("phaser");

	for (let i = 0; i < props.monsterGroup.getChildren().length; i++) {
		// Iterate Monster Group
		var dist = Phaser.Math.Distance.BetweenPoints(
			props.monsterGroup.getChildren()[i],
			props.sprite
		);

		if (
			dist < 1500 &&
			props.monsterGroup.getChildren()[i].name.includes("Snail") === true
		) {
			if (props.plantGroup.getChildren().length > 2) {
				props.physics.moveToObject(
					props.monsterGroup.getChildren()[i],
					props.plantGroup.getChildren()[
						Math.floor(Math.random() * props.plantGroup.getChildren().length)
					],
					250
				);
			}
		} else if (
			dist < 1500 &&
			props.monsterGroup.getChildren()[i].name.includes("Chicken") === false
		) {
			props.physics.moveToObject(
				props.monsterGroup.getChildren()[i],
				props.sprite,
				100
			);
		} else {
			if ((Math.random() - 0.5) * 2 >= 0) {
				props.monsterGroup
					.getChildren()
					[i].setVelocityX((Math.random() - 0.5) * 2 * 50);
			}

			if ((Math.random() - 0.5) * 2 >= 0) {
				props.monsterGroup
					.getChildren()
					[i].setVelocityY((Math.random() - 0.5) * 2 * 50);
			}
			//
		}
	}
	//
	for (let i = 0; i < props.bouncersGroup.getChildren().length; i++) {
		var closestBtoSprite = props.physics.closest(
			props.sprite,
			props.bouncersGroup.getChildren()
		);

		var dist01 = Phaser.Math.Distance.BetweenPoints(
			closestBtoSprite,
			props.sprite
		);

		var dist2 = Phaser.Math.Distance.BetweenPoints(
			props.bouncersGroup.getChildren()[i],
			props.sprite
		);

		if (dist01 < 600) {
			props.sprite.isMonsterNearby = true;
		} else {
			props.sprite.isMonsterNearby = false;
		}
		if (dist2 < 600) {
			props.physics.moveToObject(
				props.bouncersGroup.getChildren()[i],
				props.sprite,
				150
			);

			props.bouncersGroup.getChildren()[i].flipX =
				!props.bouncersGroup.getChildren()[i].flipX;
		} else {
			if ((Math.random() - 0.5) * 2 >= 0) {
				props.bouncersGroup
					.getChildren()
					[i].setVelocityX((Math.random() - 0.5) * 2 * 550);
				props.bouncersGroup.getChildren()[i].flipX = true;

				// props.bouncersGroup
				// .getChildren()
				// [i].scale(-1, 1);
			}

			if ((Math.random() - 0.5) * 2 >= 0) {
				props.bouncersGroup
					.getChildren()
					[i].setVelocityY((Math.random() - 0.5) * 2 * 550);

				props.bouncersGroup.getChildren()[i].flipX = true;

				// props.bouncersGroup
				// .getChildren()
				// [i].scale(-1, 1);
			}
		}
	}

	// Determine NPC Frame
	for (let i = 0; i < props.totalNPCCount; i++) {
		//
		props.NPCSpritesGroup[i]
			.getChildren()[0]
			.setDepth(20000 + props.NPCSpritesGroup[i].getChildren()[0].y);
		//
		if (props.NPCSpritesGroup[i].getChildren()[0].body.velocity.x > 0) {
			props.NPCSpritesGroup[i].getChildren()[0].setFrame(13 * 11);
		} else if (props.NPCSpritesGroup[i].getChildren()[0].body.velocity.x < 0) {
			props.NPCSpritesGroup[i].getChildren()[0].setFrame(13 * 9);
		} else if (
			props.NPCSpritesGroup[i].getChildren()[0].body.velocity.x === 0 &&
			props.NPCSpritesGroup[i].getChildren()[0].body.velocity.y === 0
		) {
			props.NPCSpritesGroup[i].getChildren()[0].setFrame(13 * 10);
		}

		//
		//		console.log(props.NPCSpritesGroup[i].getChildren());
		//

		var closestToNPC = props.physics.closest(
			props.NPCSpritesGroup[i].getChildren()[0],
			props.monsterGroup.getChildren()
		);

		var dist8 = Phaser.Math.Distance.BetweenPoints(
			closestToNPC,
			props.NPCSpritesGroup[i].getChildren()[0]
		);

		//		console.log(dist8);
		if (props.monsterGroup.getChildren().length > 1) {
			if (
				props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonster === true ||
				props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonsterB === true
			) {
				// console.log(props.NPCSpritesGroup[i].getChildren()[0].nearbyMonsters);
				// console.log(props.monsterGroup.getChildren()[i3].name);
			}

			if (dist8 < 500) {
				props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonster = true;
				props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonster = true;

				props.physics.moveToObject(
					props.NPCSpritesGroup[i].getChildren()[0],
					closestToNPC,
					150
				);
			}

			if (dist8 < 300) {
				props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonster = true;

				let tempVar;

				if (tempVar === undefined) {
					tempVar = 0;
				} else {
					tempVar++;
				}

				if (
					props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD === undefined ||
					props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount === undefined ||
					props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD === undefined ||
					props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount === undefined
				) {
					props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD = time;
					props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount = 0;
					props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD = time;
					props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount = 0;
				}
				if (time - props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD >= 500) {
					if (props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount === 0) {
						// console.log(time - props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD)
						props.bulletGroup
							.create(
								props.NPCSpritesGroup[i].getChildren()[0].x,
								props.NPCSpritesGroup[i].getChildren()[0].y,
								"Bullet"
							)
							.setScale(0.2)
							.setBounceX(0.1)
							.setBounceY(0.1)
							.setGravityY(200)
							.setVelocity(
								(closestToNPC.x - props.NPCSpritesGroup[i].getChildren()[0].x) * 3,
								(closestToNPC.y - props.NPCSpritesGroup[i].getChildren()[0].y) * 3
							).name = String("RockBulletAge_" + time);
						props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount++;
						props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD = time;
						setTimeout(() => {
							props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount = 0;
						}, 250);
					}
				}
			}
			if (dist8 > 500) {
				props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonster = false;
			}

			if (props.bouncersGroup.getChildren().length > 2) {
				var closestBToNPC = props.physics.closest(
					props.NPCSpritesGroup[i].getChildren()[0],
					props.bouncersGroup.getChildren()
				);

				var dist4 = Phaser.Math.Distance.BetweenPoints(
					closestBToNPC,
					props.NPCSpritesGroup[i].getChildren()[0]
				);
			}
			//
			if (dist4 < 500) {
				props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonsterB = true;
				props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonsterB = true;

				if (
					props.NPCSpritesGroup[i].getChildren()[0].isOutOfBounds === false ||
					props.NPCSpritesGroup[i].getChildren()[0].isOutOfBounds === undefined
				) {
					props.physics.moveToObject(
						props.NPCSpritesGroup[i].getChildren()[0],
						closestBToNPC,
						150
					);
				}
				if (dist4 < 300) {
					if (
						props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD === undefined ||
						props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount ===
							undefined ||
						props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD === undefined ||
						props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount === undefined
					) {
						props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD = time;
						props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount = 0;
						props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD = time;
						props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount = 0;
					}

					if (
						time - props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD >=
						500
					) {
						if (props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount === 0) {
							props.bulletGroup
								.create(
									props.NPCSpritesGroup[i].getChildren()[0].x,
									props.NPCSpritesGroup[i].getChildren()[0].y,
									"Bullet"
								)
								.setScale(0.2)
								.setBounceX(0.1)
								.setBounceY(0.1)
								.setMass(0.1)
								.setGravityY(200)
								.setVelocity(
									(closestBToNPC.x - props.NPCSpritesGroup[i].getChildren()[0].x) * 3,
									(closestBToNPC.y - props.NPCSpritesGroup[i].getChildren()[0].y) * 3
								).name = String("RockBulletAge_" + time);

							props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount++;
							props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCD = time;
							setTimeout(() => {
								props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount = 0;
								props.NPCSpritesGroup[i].getChildren()[0].NPCShootingCount = 0;
							}, 250);
						}
					}
				}
			} else {
				props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonsterB = false;
			}
			if (dist4 > 500) {
				props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonsterB = false;
			}

			var dist3 = Phaser.Math.Distance.BetweenPoints(
				{ x: 0, y: 0 },
				props.NPCSpritesGroup[i].getChildren()[0]
			);

			//					console.log(props.NPCSpritesGroup[i].getChildren()[0].nearbyMonsters);
			if (
				props.spritePartCounterVar === undefined ||
				props.spritePartMoveRandomizer === undefined ||
				props.spritePartMoveRandomizerQx === undefined ||
				props.spritePartMoveRandomizerQy === undefined
			) {
				props.spritePartCounterVar = 0;
				props.spritePartMoveRandomizer = Math.random() < 0.25;
				props.spritePartMoveRandomizerQx = (Math.random() - 0.5) * 2 * 150;
				props.spritePartMoveRandomizerQy = (Math.random() - 0.5) * 2 * 150;
			}

			if (dist3 > 600) {
				props.NPCSpritesGroup[i].getChildren()[0].isOutOfBounds = true;

				// Outside City Boundry
				//
				//
				//										for (
				props.physics.moveToObject(
					props.NPCSpritesGroup[i].getChildren()[0],
					{ x: 0, y: 0 },
					200
				);
				//
				props.runPlayNPCAnimations(i);
			} else {
				props.NPCSpritesGroup[i].getChildren()[0].isOutOfBounds = false;
				props.NPCSpritesGroup[i].getChildren()[0].isOutOfBounds = false;
				// console.log(props.NPCSpritesGroup);
				// console.log(i % 8 === 0);
				// NPC IS INSIDE 1500 : 0,0
				if (
					props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonster === false &&
					props.NPCSpritesGroup[i].getChildren()[0].isNearbyMonsterB === false
				) {
					//console.log(props.sprite.isMonsterNearby);
					if (props.sprite.isMonsterNearby === true) {
						var distSpriteAndNPC = Phaser.Math.Distance.BetweenPoints(
							props.sprite,
							props.NPCSpritesGroup[i].getChildren()[0]
						);

						if (distSpriteAndNPC > 200) {
							props.physics.moveToObject(
								props.NPCSpritesGroup[i].getChildren()[0],
								closestBtoSprite,
								150
							);
						}
					} else {
						// console.log(props.toolObjects);
						// console.log(props.toolObjects.getChildren().length);
						// console.log(props.toolObjects.getChildren().length);
						for (let ipgi = 0; ipgi < props.plantGroup.getChildren().length; ipgi++) {
							if (props.plantGroup.getChildren()[ipgi].harvestReady === true) {
								//				console.log(props.plantGroup.getChildren()[ipgi]);
								//				console.log("Is Harvest Ready");
								//	console.log(props.plantGroup.getChildren()[ipgi])
								//
								var closestPlantToNPC = props.physics.closest(
									props.NPCSpritesGroup[i].getChildren()[0],
									props.plantGroup.getChildren()
								);
								//
								var distClosestPlantToNPC = Phaser.Math.Distance.BetweenPoints(
									closestPlantToNPC,
									props.NPCSpritesGroup[i].getChildren()[0]
								);
								//
								//
								if (
									distClosestPlantToNPC < 64 &&
									closestPlantToNPC.growStageCount >= 3
								) {
									var tempItemsGroup = props.itemDropsGroup;

									tempItemsGroup
										.create(closestPlantToNPC.x - 16, closestPlantToNPC.y, "terrainSheet")
										.setCollideWorldBounds(true)
										.setPipeline("Light2D")
										.setScale(1)
										.setFrame(974)
										.setDrag(250)
										.setInteractive()
										.setVelocity(0)
										.setDepth(20000 + closestPlantToNPC.y).name =
										"seed_" + closestPlantToNPC.name.split("_")[1] + "_age_" + time;
									//
									//
									tempItemsGroup
										.create(closestPlantToNPC.x + 16, closestPlantToNPC.y, "terrainSheet")
										.setCollideWorldBounds(true)
										.setPipeline("Light2D")
										.setScale(1)
										.setFrame(974)
										.setDrag(250)
										.setInteractive()
										.setVelocity(0)
										.setDepth(20000 + closestPlantToNPC.y).name =
										"food_" + closestPlantToNPC.name.split("_")[1] + "_age_" + time;
									//
									closestPlantToNPC.destroy();
									//
									var getTileX = props.map.worldToTileX(closestPlantToNPC.x);
									var getTileY = props.map.worldToTileY(closestPlantToNPC.y);
									//
									var tileAtNPC = props.map.getTileAt(getTileX, getTileY);
									//
									tileAtNPC.properties.isOccupied = false;
									//
									//
									props.physics.moveToObject(
										props.NPCSpritesGroup[i].getChildren()[0],
										closestPlantToNPC,
										150
									);
									//		console.log(closestPlantToNPC);
								} else {
									if (closestPlantToNPC.growStageCount >= 3) {
										//
										props.physics.moveToObject(
											props.NPCSpritesGroup[i].getChildren()[0],
											closestPlantToNPC,
											150
										);
									}
								}
								//	console.log(closestPlantToNPC);
							}
						}

						if (props.NPCSpritesGroup[i].getChildren()[0].hasItems === false) {
							props.NPCSpritesGroup[i].getChildren()[0].hasItems = {
								"Corn Seed": 0,
							};
						}

						props.NPCHasItemsAction(i);
					}
				}
			}
		}
	}
	//.setRotation(props.lastMonsterGroupUpdate.rotation / 100);
	props.lastMonsterGroupUpdate.counter++;
	if (props.lastMonsterGroupUpdate.counter === 1) {
		props.cursorImage.setScale(0.5);
	} else if (props.lastMonsterGroupUpdate.counter === 10) {
		props.cursorImage.setScale(0.55);
	} else if (props.lastMonsterGroupUpdate.counter === 12) {
		props.cursorImage.setScale(0.55);
	} else if (props.lastMonsterGroupUpdate.counter === 15) {
		props.cursorImage.setScale(0.55);
		props.lastMonsterGroupUpdate.counter = 0;
	}

	props.lastMonsterGroupUpdate.lastRun = time;
}
