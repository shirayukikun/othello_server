import {Othello} from "./othello.js";
import {PixiJSGUI} from "./PixiJS_GUI.js"
import {GameManager} from "./game_manager.js"
import {Controller} from "./controller.js"
import {Player} from "./player.js"

// Create the application helper and add its render target to the page
let app = new PIXI.Application(
    {
	width: 640,
	height: 640,
	backgroundColor: 0x1099bb,
    }
);
// document.body.appendChild(app.view);
document.getElementById("othello_board").appendChild(app.view);

let othello = new Othello(8, 8);

let black_player = new Player(othello);
let white_player = new Player(othello);

let manager = new GameManager(othello, black_player, white_player);
let GUI = new PixiJSGUI(othello, manager, app);
let controller = new Controller(manager, GUI, othello);

othello.white[4][4] = true;
othello.black[3][4] = true;
othello.white[3][3] = true;
othello.black[4][3] = true;
// Create the sprite and add it to the stage
//let sprite = PIXI.Sprite.from('static/img/pink.png');
//app.stage.addChild(sprite);

// Add a ticker callback to move the sprite back and forth
manager.start()
app.ticker.add(
    () => {
	GUI.draw()
    }
);
