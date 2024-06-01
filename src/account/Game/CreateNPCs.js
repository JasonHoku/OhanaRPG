export default function CreateNPCs(props) {
	for (let i = 0; i < props.totalNPCCount; i++) {
		props.NPCSpritesGroup[i] = props.physics.add.group();

		let tempNegBool = (Math.random() - 0.5) * 2 * -64;
		let tempNegBool2 = (Math.random() - 0.5) * 2 * -64;
		console.log(tempNegBool);
		console.log(tempNegBool2);
		props.NPCSpritesGroup[i]
			.create(
				tempNegBool * 5,
				tempNegBool2 * 5,
				String("LightNPCSheet_" + String(i))
			)
			.setCollideWorldBounds(true)
			.setPipeline("Light2D")
			.setScale(1)
			.setInteractive()
			.setFrame(13 * 10)
			.setDrag(250)
			.setBounceX(1.1)
			.setBounceY(1.1)
			.setVelocity(0)
			.setDepth(20000 + tempNegBool2 * i).name = String("NPC_" + i);

		// for (let i2Y = 0; i2Y < 9; i2Y++) {
		// 	if (i2Y === 1) {
		// 		props.NPCSpritesGroup[i]
		// 			.create(
		// 				tempNegBool * 30,
		// 				tempNegBool2 * 30,
		// 				String("SpriteSheetPart_" + String(i2Y)) +
		// 					String(
		// 						"ID#" +
		// 							Math.floor(
		// 								Math.random() *
		// 									spritePartsPaths.current[spritePartsSockets.current[i2Y]]
		// 										.length
		// 							)
		// 					)
		// 			)
		// 			.setCollideWorldBounds(true)
		// 			.setPipeline("Light2D")
		// 			.setScale(1)
		// 			.setTint("0x" + String(getRandomColor()))
		// 			.setFrame(13 * 10)
		// 			.setDrag(250)
		// 			.setVelocity(0)
		// 			.setDepth(20000 + tempNegBool2 * i).name = String("NPC_" + i);
		// 	} else if (i2Y === 2 || i2Y === 3 || i2Y === 4) {
		// 		props.NPCSpritesGroup[i]
		// 			.create(
		// 				tempNegBool * 30,
		// 				tempNegBool2 * 30,
		// 				String("SpriteSheetPart_" + String(i2Y)) +
		// 					String(
		// 						"ID#" +
		// 							Math.floor(
		// 								Math.random() *
		// 									spritePartsPaths.current[spritePartsSockets.current[i2Y]]
		// 										.length
		// 							)
		// 					)
		// 			)
		// 			.setCollideWorldBounds(true)
		// 			.setPipeline("Light2D")
		// 			.setScale(1)
		// 			.setTint("0x" + String(getRandomColor()))
		// 			.setFrame(13 * 10)
		// 			.setDrag(250)
		// 			.setVelocity(0)
		// 			.setDepth(20000 + tempNegBool2 * i).name = String("NPC_" + i);
		// 	} else {
		// 		props.NPCSpritesGroup[i]
		// 			.create(
		// 				tempNegBool * 30,
		// 				tempNegBool2 * 30,
		// 				String("SpriteSheetPart_" + String(i2Y)) +
		// 					String(
		// 						"ID#" +
		// 							Math.floor(
		// 								Math.random() *
		// 									spritePartsPaths.current[spritePartsSockets.current[i2Y]]
		// 										.length
		// 							)
		// 					)
		// 			)
		// 			.setCollideWorldBounds(true)
		// 			.setPipeline("Light2D")
		// 			.setScale(1)
		// 			.setFrame(13 * 10)
		// 			.setDrag(250)
		// 			.setInteractive()
		// 			.setVelocity(0)
		// 			.setDepth(20000 + tempNegBool2 * i).name = String("NPC_" + i);
		//		}
		//				console.log(tempVar);
		// activeSheetKeyframeGroups.current.forEach((el, index) => {
		// 	props.anims.create({
		// 		key: String("NPC_" + i + "bodyAnimKey_" + index),
		// 		frames: props.anims.generateFrameNumbers(
		// 			String("SpriteSheetPart_" + String(i2Y)) + String("ID#" + 0),
		// 			{
		// 				frames: activeSheetKeyframeGroups.current[index],
		// 			}
		// 		),
		// 		frameRate: 10,
		// 		repeat: -1,
		// 	});
		// 	props.anims.create({
		// 		key: String("NPC_" + i + "LegsAnimKey_" + index),
		// 		frames: props.anims.generateFrameNumbers(
		// 			String("SpriteSheetPart_" + String(i2Y)) + String("ID#" + 0),
		// 			{
		// 				frames: activeSheetKeyframeGroups.current[index],
		// 			}
		// 		),
		// 		frameRate: 10,
		// 		repeat: -1,
		// 	});
		// 	props.anims.create({
		// 		key: String("NPC_" + i + "ShirtAnimKey_" + index),
		// 		frames: props.anims.generateFrameNumbers(
		// 			String("SpriteSheetPart_" + String(i2Y)) + String("ID#" + 0),
		// 			{
		// 				frames: activeSheetKeyframeGroups.current[index],
		// 			}
		// 		),
		// 		frameRate: 10,
		// 		repeat: -1,
		// 	});
		// 	props.anims.create({
		// 		key: String("NPC_" + i + "HairAnimKey_" + index),
		// 		frames: props.anims.generateFrameNumbers(
		// 			String("SpriteSheetPart_" + String(i2Y)) + String("ID#" + 0),
		// 			{
		// 				frames: activeSheetKeyframeGroups.current[index],
		// 			}
		// 		),
		// 		frameRate: 10,
		// 		repeat: -1,
		// 	});
		// 	props.anims.create({
		// 		key: String("NPC_" + i + "NoseAnimKey_" + index),
		// 		frames: props.anims.generateFrameNumbers(
		// 			String("SpriteSheetPart_" + String(i2Y)) + String("ID#" + 0),
		// 			{
		// 				frames: activeSheetKeyframeGroups.current[index],
		// 			}
		// 		),
		// 		frameRate: 10,
		// 		repeat: -1,
		// 	});
		// 	props.anims.create({
		// 		key: String("NPC_" + i + "ShoesAnimKey_" + index),
		// 		frames: props.anims.generateFrameNumbers(
		// 			String("SpriteSheetPart_" + String(i2Y)) + String("ID#" + 0),
		// 			{
		// 				frames: activeSheetKeyframeGroups.current[index],
		// 			}
		// 		),
		// 		frameRate: 10,
		// 		repeat: -1,
		// 	});
		// 	props.anims.create({
		// 		key: String("NPC_" + i + "EyesAnimKey_" + index),
		// 		frames: props.anims.generateFrameNumbers(
		// 			String("SpriteSheetPart_" + String(i2Y)) + String("ID#" + 0),
		// 			{
		// 				frames: activeSheetKeyframeGroups.current[index],
		// 			}
		// 		),
		// 		frameRate: 10,
		// 		repeat: -1,
		// 	});
		// 	props.anims.create({
		// 		key: String("NPC_" + i + "EarsAnimKey_" + index),
		// 		frames: props.anims.generateFrameNumbers(
		// 			String("SpriteSheetPart_" + String(i2Y)) + String("ID#" + 0),
		// 			{
		// 				frames: activeSheetKeyframeGroups.current[index],
		// 			}
		// 		),
		// 		frameRate: 10,
		// 		repeat: -1,
		// 	});
		// 	props.anims.create({
		// 		key: String("NPC_" + i + "WeaponAnimKey_" + index),
		// 		frames: props.anims.generateFrameNumbers(
		// 			String("SpriteSheetPart_" + String(i2Y)) + String("ID#" + 0),
		// 			{
		// 				frames: activeSheetKeyframeGroups.current[index],
		// 			}
		// 		),
		// 		frameRate: 10,
		// 		repeat: -1,
		// 	});
		// });
		// //
		// //		console.log(props.NPCSpritesGroup);
		// //
		//				}
		//
		//			}
		//a
		//
	}
}
