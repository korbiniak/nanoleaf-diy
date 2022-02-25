import { Application, Container } from 'pixi.js'
import { HexagonFactory, HexagonOrientation } from './hexagon'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 480
});
app.stage.interactive = true;


const hexSideLength = 50;
const hexBorderWidth = 5;
const hexColor = 0xffffff;
const hexBorderColor = 0x999999;
const hexOrientation = HexagonOrientation.Horizontal;

const hexFactory = 
new HexagonFactory(hexSideLength, hexBorderWidth, hexOrientation, hexColor, hexBorderColor, app);

let gridContainer = new Container();
gridContainer.interactive = true;
gridContainer.interactiveChildren = true;
gridContainer.position.x = -hexSideLength;
gridContainer.position.y = -hexSideLength;

const rows = 20;
const columns = 20;
let hexagons = hexFactory.produceGrid(rows, columns);

for (let hexList of hexagons) {
	for (let hexagon of hexList) {
		gridContainer.addChild(hexagon.hex);
	}
}

app.stage.addChild(gridContainer);