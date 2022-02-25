import { Graphics } from '@pixi/graphics';
import '@pixi/graphics-extras';
import { Application, RenderTexture, Sprite, Polygon } from 'pixi.js'

enum HexagonOrientation {
	Vertical,
	Horizontal
}

class Hexagon {
    private clicked : boolean;
    public hex : Sprite;   

    constructor(hex : Sprite) {
        this.hex = hex;
        this.clicked = false;

        this.hex.on('pointerdown', () => {
            if (this.clicked) {
                this.hex.tint = 0xffffff;
            } else {
                this.hex.tint = 0x30a211;
            }
            this.clicked = !this.clicked;
        });
    }

    setPosition(x : number, y : number) : void {
        this.hex.x = x;
        this.hex.y = y;
    }
}

class HexagonFactory {
    private readonly sideLength : number;
    private readonly hexBorder : number;
    private readonly hexWidth : number;
    private readonly hexHeight : number;
    private readonly hexOrientation : HexagonOrientation;
    private readonly hexRotation : number;
    private readonly color : number;
    private readonly borderColor : number;
    private readonly template : Graphics;
    private readonly app : Application;
    private texture : RenderTexture;

    constructor(sideLength: number, 
                hexBorder : number,
                orientation: HexagonOrientation, 
                color: number, 
                borderColor: number,
                app : Application) {
        this.sideLength = sideLength + hexBorder/2.0;
        this.hexBorder = hexBorder;
        this.color = color;
        this.borderColor = borderColor;
        this.hexWidth = this.sideLength * Math.sqrt(3.0);
        this.hexHeight = this.sideLength * 2.0;
        this.hexOrientation = orientation;
        this.hexRotation = 
            (this.hexOrientation == HexagonOrientation.Vertical ? 0 : Math.PI/2.0);
        this.app = app;
        this.template = new Graphics();
        this.template.beginFill(color);
        this.template.lineStyle(this.hexBorder, borderColor);
        this.template.drawRegularPolygon?.(0, 0, this.sideLength - this.hexBorder/2.0, 6, 0); 
        this.texture = this.app.renderer.generateTexture(this.template);
    }

    private produceHexagon() : Hexagon {
        let result = new Sprite(this.texture);
        result.buttonMode = true;
        result.interactive = true;
        result.hitArea = new Polygon([
            this.hexWidth * 0.5, 0,
            this.hexWidth, this.hexHeight * 0.25,
            this.hexWidth, this.hexHeight * 0.75,
            this.hexWidth * 0.5, this.hexHeight,
            0, this.hexHeight * 0.75,
            0, this.hexHeight * 0.25
        ]);
        result.rotation = this.hexRotation
        return new Hexagon(result);
    }

    public produce(x: number, y: number) : Hexagon {
        let result = this.produceHexagon();
        result.setPosition(x, y);
        return result;
    }

    private produceGridHex(row: number, column: number) : Hexagon {
        let x = 0, y = 0;
        if (this.hexOrientation == HexagonOrientation.Vertical) {
            x = column * this.hexWidth + (row % 2 == 0 ? this.hexWidth/2.0 : 0);
            y = row * this.hexHeight * 0.75;
        } else { // HexagonOrientation.Horizontal
            x = column * this.hexHeight * 1.5 + (row % 2 == 0 ? this.hexHeight*0.75 : 0);
            y = row * this.hexWidth * 0.5;
        }
        return this.produce(x, y);
    }

    public produceGrid(rows: number, columns: number) : Hexagon[][] {
        let res : Hexagon[][] = [];
        for (let row = 0; row < rows; row++) {
            res.push([]);
            for (let column = 0; column < columns; column++) {
                res[row].push(this.produceGridHex(row, column));
            }
        }
        return res;
    }
}


export { HexagonFactory, HexagonOrientation };