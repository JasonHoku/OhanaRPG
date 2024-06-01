export default function CreateSpriteSheet(
	props,
	userEXPRef,
	activeSheetKeyframeGroups
) {
	window.loadSpriteSheet = () => {
		//
		props.playerGroup = props.physics.add.group();

		props.NPCSpritesGroup = props.physics.add.group();

		props.sprite = props.playerGroup
			.create(userEXPRef.current.x, userEXPRef.current.y, "spriteSheet0")
			.setCollideWorldBounds(true)
			.setPipeline("Light2D")
			.setScale(1);
		props.sprite2 = props.playerGroup
			.create(userEXPRef.current.x, userEXPRef.current.y, "spriteSheet1")
			.setCollideWorldBounds(true)
			.setPipeline("Light2D")
			.setScale(1)
			.setAlpha(0.85)
			.setTint("0x6666BB");
		props.sprite3 = props.playerGroup
			.create(userEXPRef.current.x, userEXPRef.current.y, "spriteSheet2")
			.setCollideWorldBounds(true)
			.setPipeline("Light2D")
			.setScale(1)
			.setAlpha(0.85)
			.setTint("0x6666BB");
		props.sprite4 = props.playerGroup
			.create(userEXPRef.current.x, userEXPRef.current.y, "spriteSheet3")
			.setCollideWorldBounds(true)
			.setPipeline("Light2D")
			.setAlpha(0.85)
			.setScale(1);
		props.sprite5 = props.playerGroup
			.create(userEXPRef.current.x, userEXPRef.current.y, "spriteSheet4")
			.setCollideWorldBounds(true)
			.setPipeline("Light2D")
			.setAlpha(0.85)
			.setScale(1);
		props.sprite6 = props.playerGroup
			.create(userEXPRef.current.x, userEXPRef.current.y, "spriteSheet5")
			.setCollideWorldBounds(true)
			.setPipeline("Light2D")
			.setAlpha(0.85)
			.setScale(1)
			.setTint("0xccccff");
		props.sprite7 = props.playerGroup
			.create(userEXPRef.current.x, userEXPRef.current.y, "spriteSheet6")
			.setCollideWorldBounds(true)
			.setPipeline("Light2D")
			.setAlpha(0.85)
			.setScale(1);
		props.sprite8 = props.playerGroup
			.create(userEXPRef.current.x, userEXPRef.current.y, "spriteSheet7")
			.setCollideWorldBounds(true)
			.setPipeline("Light2D")
			.setAlpha(0.85)
			.setScale(1);
		props.sprite9 = props.playerGroup
			.create(userEXPRef.current.x, userEXPRef.current.y, "spriteSheet8")
			.setCollideWorldBounds(true)
			.setPipeline("Light2D")
			.setAlpha(0.85)
			.setScale(1);
		//

		activeSheetKeyframeGroups.current.forEach((el, index) => {
			props.anims.create({
				key: String("bodyAnimKey_" + index),
				frames: props.anims.generateFrameNumbers("spriteSheet0", {
					frames: activeSheetKeyframeGroups.current[index],
				}),
				frameRate: 10,
				repeat: -1,
			});

			props.anims.create({
				key: String("legsAnimKey_" + index),
				frames: props.anims.generateFrameNumbers("spriteSheet1", {
					frames: activeSheetKeyframeGroups.current[index],
				}),
				frameRate: 10,
				repeat: -1,
			});

			props.anims.create({
				key: String("shirtAnimKey_" + index),
				frames: props.anims.generateFrameNumbers("spriteSheet2", {
					frames: activeSheetKeyframeGroups.current[index],
				}),
				frameRate: 10,
				repeat: -1,
			});

			props.anims.create({
				key: String("hairAnimKey_" + index),
				frames: props.anims.generateFrameNumbers("spriteSheet3", {
					frames: activeSheetKeyframeGroups.current[index],
				}),
				frameRate: 10,
				repeat: -1,
			});

			props.anims.create({
				key: String("shoesAnimKey_" + index),
				frames: props.anims.generateFrameNumbers("spriteSheet4", {
					frames: activeSheetKeyframeGroups.current[index],
				}),
				frameRate: 10,
				repeat: -1,
			});

			props.anims.create({
				key: String("eyesAnimKey_" + index),
				frames: props.anims.generateFrameNumbers("spriteSheet5", {
					frames: activeSheetKeyframeGroups.current[index],
				}),
				frameRate: 10,
				repeat: -1,
			});

			props.anims.create({
				key: String("noseAnimKey_" + index),
				frames: props.anims.generateFrameNumbers("spriteSheet6", {
					frames: activeSheetKeyframeGroups.current[index],
				}),
				frameRate: 10,
				repeat: -1,
			});

			props.anims.create({
				key: String("earsAnimKey_" + index),
				frames: props.anims.generateFrameNumbers("spriteSheet7", {
					frames: activeSheetKeyframeGroups.current[index],
				}),
				frameRate: 10,
				repeat: -1,
			});
			props.anims.create({
				key: String("weaponAnimKey_" + index),
				frames: props.anims.generateFrameNumbers("spriteSheet8", {
					frames: activeSheetKeyframeGroups.current[index],
				}),
				frameRate: 10,
				repeat: -1,
			});
		});
		//
	};
}
