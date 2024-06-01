export default function createEmitters(props, time) {
	const Phaser = require("phaser");

	var circle = new Phaser.Geom.Circle(0, 0, 64);
	var circle2 = new Phaser.Geom.Circle(0, 0, 50);

	var weightedCircle = {
		getRandomPoint: function (vec) {
			var t = Phaser.Math.PI2 * Math.random();
			var r = Math.pow(Math.random(), -0.1);

			vec.x = circle.x + r * Math.cos(t) * circle.radius;
			vec.y = circle.y + r * Math.sin(t) * circle.radius;

			return vec;
		},
	};

	var weightedCircle2 = {
		getRandomPoint: function (vec) {
			var t = Phaser.Math.PI2 * Math.random();
			var r = Math.pow(Math.random(), -0.1);

			vec.x = circle2.x + r * Math.cos(t) * circle2.radius;
			vec.y = circle2.y + r * Math.sin(t) * circle2.radius;

			return vec;
		},
	};

	props.emitter = props.add
		.particles("yellowParticle")
		.setDepth(30000)
		.createEmitter({
			name: "sparks",
			x: props.player.x + Math.random() * 2 - 1,
			y: props.player.y + Math.random() * 2 - 1,
			lifespan: 1,
			visible: false,
			gravityY: 0,
			quantity: 50,
			follow: props.player,
			speed: 60,
			angle: { min: 1, max: 360 },
			scale: { start: 0.1, end: 0.1 },
			alpha: { start: 1, end: 0 },
			emitZone: { type: "random", source: weightedCircle },
			blendMode: "SCREEN",
		});

	var curve = new Phaser.Curves.Spline([
		props.player.x,
		props.player.y,
		props.player.x + 25,
		props.player.y + 25,
		props.player.x,
		props.player.y,
		props.player.x - 25,
		props.player.y - 25,
		props.player.x,
		props.player.y,
	]);

	var path = new Phaser.Curves.Path(
		props.player.x + 100,
		props.player.y - 200
	).circleTo(300, true, 300);

	let relMouseX = props.input.mousePointer.worldX;
	let relMouseY = props.input.mousePointer.worldY;
	props.emitter2 = props.add
		.particles("blueParticle")
		.setDepth(30000)
		.createEmitter({
			name: "sparks2",
			x: props.player.x,
			y: props.player.y,
			lifespan: 1,
			visible: false,
			gravityY: 0,
			quantity: 1,
			moveToX: 1,
			moveToY: 1,
			tint: [0xffff00, 0xff0000, 0x00ff00, 0x0000ff],
			speed: 10,
			angle: { min: 1, max: 360, steps: 360 },
			scale: { start: 0.3, end: 0.2, steps: 360 },
			alpha: { start: 1, end: 0 },
			follow: props.player,
			emitZone: { type: "edge", source: path, quantity: 600, steps: 360 },
			blendMode: "ADD",
		});

	props.emitter3 = props.add.particles("whiteParticle").createEmitter({
		name: "sparks",
		x: props.player.x + Math.random() * 2 - 1,
		y: props.player.y + Math.random() * 2 - 1,
		lifespan: 1,
		visible: false,
		gravityY: 0,
		quantity: 12,
		moveToX: 1,
		moveToY: 1,
		follow: props.player,
		tint: [0xff0000, 0x00ff00, 0x0000ff],
		speed: 6,
		angle: { min: 1, max: 360 },
		scale: { start: 1, end: 0.1 },
		alpha: { start: 1, end: 0.1 },
		emitZone: { type: "random", source: weightedCircle2 },
		blendMode: "SCREEN",
	});

	var circle6 = new Phaser.Geom.Circle(0, 0, 128);
	var weightedCircle6 = {
		getRandomPoint: function (vec) {
			var t = Phaser.Math.PI2 * Math.random();
			var r = Math.pow(Math.random(), -0.1);

			vec.x = circle6.x + r * Math.cos(t) * circle6.radius;
			vec.y = circle6.y + r * Math.sin(t) * circle6.radius;

			return vec;
		},
	};

	props.emitter6 = props.add
		.particles("whiteHarderParticle")
		.setDepth(30000)
		.createEmitter({
			name: "sparks",
			x: props.player.x + Math.random() * 2 - 1,
			y: props.player.y + Math.random() * 2 - 1,
			lifespan: 1,
			visible: false,
			gravityY: 0,
			quantity: 3,
			moveToX: 1,
			moveToY: 1,
			follow: props.player,
			speed: { start: 6, end: 100 },
			angle: { min: 1, max: 360 },
			scale: { start: 0.5, end: 0 },
			alpha: { start: 0.8, end: 0 },
			emitZone: { type: "random", source: weightedCircle6 },
			blendMode: "SCREEN",
		});

	var curve4 = new Phaser.Curves.Spline([
		props.player.x,
		props.player.y,
		260,
		450,
		300,
		250,
	]);

	props.emitter4 = props.add
		.particles("yellowParticle")
		.setDepth(30000)
		.createEmitter({
			name: "sparks",
			x: props.player.x + Math.random() * 2 - 1,
			y: props.player.y + Math.random() * 2 - 1,
			lifespan: 1,
			visible: false,
			gravityY: 0,
			quantity: 6,
			moveToX: 1,
			moveToY: 1,
			follow: props.player,
			tint: [0xffff00, 0xff0000, 0x00ff00, 0x0000ff],
			speed: 1200,
			angle: { min: 1, max: 360 },
			scale: { start: 0.1, end: 2 },
			alpha: { start: 1, end: 0 },
			emitZone: { type: "edge", source: curve4 },
			blendMode: "SCREEN",
		});

	props.emitter7 = props.add
		.particles("whiteHarderParticle")
		.setDepth(30000)
		.createEmitter({
			name: "sparks",
			x: props.player.x + Math.random() * 2 - 1,
			y: props.player.y + Math.random() * 2 - 1,
			lifespan: 1,
			visible: false,
			gravityY: 500,
			quantity: 6,
			moveToX: 1,
			moveToY: 1,
			follow: props.player,
			tint: [0x0000ff],
			speed: 1200,
			angle: { min: 1, max: 360 },
			scale: { start: 0.1, end: 2, step: 24 },
			alpha: { start: 1, end: 0 },
			emitZone: { type: "edge", source: curve4 },
			blendMode: "MASK",
		});
	//
	var mouseCircle = new Phaser.Geom.Circle(0, 0, 16);
	var weightedMouseCircle = {
		getRandomPoint: function (vec) {
			var t = Phaser.Math.PI2 * Math.random();
			var r = Math.pow(Math.random(), -0.1);
			vec.x = mouseCircle.x + r * Math.cos(t) * mouseCircle.radius;
			vec.y = mouseCircle.y + r * Math.sin(t) * mouseCircle.radius;
			return vec;
		},
	};
	props.mouseEmitter = props.add
		.particles("whiteHarderParticle")
		.setDepth(40100)
		.createEmitter({
			name: "mouseSparks",
			x: props.input.activePointer.worldX + Math.random() * 2 - 1,
			y: props.input.activePointer.worldY + Math.random() * 2 - 1,
			lifespan: 1500,
			visible: true,
			gravityY: 5,
			quantity: 0.1,
			speed: { start: 1, end: 1 },
			angle: { min: 1, max: 360 },
			scale: { start: 0.03, end: 0 },
			alpha: { start: 1, end: 0 },
			emitZone: { type: "random", source: weightedMouseCircle },
			blendMode: "SCREEN",
		});
}
