export default function GenerateMapData(props, preloadImage) {
	let tempDataArray = [];

	function GenerateGrassTiles() {
		//
		let gotTileId = 592 + Math.floor(Math.random() * 24);
		if (gotTileId === 593) {
			gotTileId = 592;
		}
		if (gotTileId === 595) {
			gotTileId = 594;
		}
		if (
			gotTileId === 597 ||
			gotTileId === 598 ||
			gotTileId === 598 ||
			gotTileId === 599
		) {
			gotTileId = 594;
		}
		if (gotTileId === 601) {
			gotTileId = 600;
		}
		if (gotTileId === 603) {
			gotTileId = 602;
		}
		if (gotTileId === 605) {
			gotTileId = 604;
		}
		if (gotTileId === 607) {
			gotTileId = 606;
		}
		if (gotTileId === 609) {
			gotTileId = 608;
		}
		if (gotTileId === 611) {
			gotTileId = 610;
		}
		if (gotTileId === 613) {
			gotTileId = 612;
		}
		if (gotTileId === 615) {
			gotTileId = 614;
		}
		return gotTileId;
	}
	//
	//
	// i2 > 400 === -y
	for (let i = 0; i < window.mapSize / 4 / 4; i++) {
		for (let i2 = 0; i2 < window.mapSize / 4 / 4; i2++) {
			//

			// Path

			///Path Center Squares

			if (i === window.mapSize / 4 / 4 / 2 && i2 === window.mapSize / 4 / 4 / 2) {
				tempDataArray.push(618);
			} else if (
				i === window.mapSize / 4 / 4 / 2 - 1 &&
				i2 === window.mapSize / 4 / 4 / 2 - 1
			) {
				tempDataArray.push(618);
			} else if (
				i === window.mapSize / 4 / 4 / 2 - 1 &&
				i2 === window.mapSize / 4 / 4 / 2
			) {
				tempDataArray.push(618);
			} else if (
				i === window.mapSize / 4 / 4 / 2 &&
				i2 === window.mapSize / 4 / 4 / 2 - 1
			) {
				tempDataArray.push(618);
			}

			//
			// Path Directions
			else if (i === window.mapSize / 4 / 4 / 2) {
				tempDataArray.push(630);
			} else if (i2 === window.mapSize / 4 / 4 / 2) {
				tempDataArray.push(598);
			} else if (i === window.mapSize / 4 / 4 / 2 - 1) {
				tempDataArray.push(624);
			} else if (i2 === window.mapSize / 4 / 4 / 2 - 1) {
				tempDataArray.push(632);
			} else if (
				i < window.mapSize / 4 / 4 / 2 - 1 &&
				i2 < window.mapSize / 4 / 4 / 2 - 1
			) {
				//
				//Fill with Grass
				//
				//	Top Left Quad
				tempDataArray.push(GenerateGrassTiles());
				//
			} else if (
				i < window.mapSize / 4 / 4 / 2 - 1 &&
				i2 > window.mapSize / 4 / 4 / 2
			) {
				//  Top Right Quad
				tempDataArray.push(GenerateGrassTiles());
				//
			} else if (
				i > window.mapSize / 4 / 4 / 2 &&
				i2 > window.mapSize / 4 / 4 / 2
			) {
				// Bottom Right Quad
				tempDataArray.push(GenerateGrassTiles());
				//
			} else if (
				i > window.mapSize / 4 / 4 / 2 &&
				i2 < window.mapSize / 4 / 4 / 2 - 1
			) {
				tempDataArray.push(GenerateGrassTiles());
				//
			}
		}
	}

	props.load.spritesheet("terrainSheet", "images/terrain.png", {
		frameWidth: 32,
		frameHeight: 32,
	});

	props.load.spritesheet("sheetVar1", "images/ProjectUtumno_full.png", {
		frameWidth: 32,
		frameHeight: 32,
	});

	preloadImage.image("tilemap", "images/terrain.png");
	preloadImage.image("tilemap2", "images/hyptosis1.png");
	preloadImage.image("tilemap3", "images/hyptosis2.png");
	preloadImage.image("tilemap4", "images/ProjectUtumno_full.png");

	var tilemapJSON2 = {
		layers: [
			{
				data: tempDataArray,
				height: window.mapSize / 4 / 4,
				width: window.mapSize / 4 / 4,
				name: "level1",
				opacity: 1,
				type: "tilelayer",
				visible: true,
				x: -window.mapSize,
				y: -window.mapSize,
			},
		],
		nextobjectid: 1,
		orientation: "orthogonal",
		renderorder: "right-down",
		tilesets: [
			{
				firstgid: 1,
				columns: 3,
				image: "images/ProjectUtumno_full.png",
				imagewidth: 1024,
				imageheight: 1024,
				margin: 0,
				name: "tilemap4",
				spacing: 0,
				tileheight: 32,
				tilewidth: 32,
			},
		],
		tilewidth: 32,
		tileheight: 32,
		type: "map",
		version: 1,
	};

	let blankTileArray = [];

	for (let i = 0; i < window.mapSize / 4 / 4; i++) {
		for (let i2 = 0; i2 < window.mapSize / 4 / 4; i2++) {
			blankTileArray.push([0]);
		}
	}

	var blankTileMapJSON2 = {
		layers: [
			{
				data: blankTileArray,
				height: window.mapSize / 4 / 4,
				width: window.mapSize / 4 / 4,
				name: "level1",
				opacity: 1,
				type: "tilelayer",
				visible: true,
				x: -window.mapSize,
				y: -window.mapSize,
			},
		],
		nextobjectid: 1,
		orientation: "orthogonal",
		renderorder: "right-down",
		tilesets: [
			{
				firstgid: 1,
				columns: 3,
				image: "images/hyptosis2.png",
				imagewidth: 1024,
				imageheight: 1024,
				margin: 0,
				name: "tilemap3",
				spacing: 0,
				tileheight: 32,
				tilewidth: 32,
			},
		],
		tilewidth: 32,
		tileheight: 32,
		type: "map",
		version: 1,
	};
	var blankTileMapJSON = {
		layers: [
			{
				data: blankTileArray,
				height: window.mapSize / 4 / 4,
				width: window.mapSize / 4 / 4,
				name: "level1",
				opacity: 1,
				type: "tilelayer",
				visible: true,
				x: -window.mapSize,
				y: -window.mapSize,
			},
		],
		nextobjectid: 1,
		orientation: "orthogonal",
		renderorder: "right-down",
		tilesets: [
			{
				firstgid: 1,
				columns: 3,
				image: "images/ProjectUtumno_full.png",
				imagewidth: 1024,
				imageheight: 1024,
				margin: 0,
				name: "tilemap",
				spacing: 0,
				tileheight: 32,
				tilewidth: 32,
			},
		],
		tilewidth: 32,
		tileheight: 32,
		type: "map",
		version: 1,
	};

	var tilemapJSON = {
		layers: [
			{
				data: tempDataArray,
				height: window.mapSize / 4 / 4,
				width: window.mapSize / 4 / 4,
				name: "level1",
				opacity: 1,
				type: "tilelayer",
				visible: true,
				x: -window.mapSize,
				y: -window.mapSize,
			},
		],
		nextobjectid: 1,
		orientation: "orthogonal",
		renderorder: "right-down",
		tilesets: [
			{
				firstgid: 1,
				columns: 3,
				image: "images/terrain.png",
				imagewidth: 1024,
				imageheight: 1024,
				margin: 0,
				name: "tilemap",
				spacing: 0,
				tileheight: 32,
				tilewidth: 32,
			},
		],
		tilewidth: 32,
		tileheight: 32,
		type: "map",
		version: 1,
	};

	var tilemapJSON3 = {
		layers: [
			{
				data: tempDataArray,
				height: window.mapSize / 4 / 4,
				width: window.mapSize / 4 / 4,
				name: "level1",
				opacity: 1,
				type: "tilelayer",
				visible: true,
				x: -window.mapSize,
				y: -window.mapSize,
			},
		],
		nextobjectid: 1,
		orientation: "orthogonal",
		renderorder: "right-down",
		tilesets: [
			{
				firstgid: 1,
				columns: 3,
				image: "images/terrain.png",
				imagewidth: 1024,
				imageheight: 1024,
				margin: 0,
				name: "tilemap",
				spacing: 0,
				tileheight: 32,
				tilewidth: 32,
			},
		],
		tilewidth: 32,
		tileheight: 32,
		type: "map",
		version: 1,
	};

	props.tilemapAsJSON = props.load.tilemapTiledJSON("map", tilemapJSON);

	props.tilemapAsJSON = props.load.tilemapTiledJSON("map2", tilemapJSON2);

	props.tilemapAsJSON = props.load.tilemapTiledJSON("map3", blankTileMapJSON);

	props.tilemapAsJSON = props.load.tilemapTiledJSON("map5", blankTileMapJSON2);
}
