
export class Othello {
    constructor(height, width, app){
	//先に画像のロードを初めておく
	this.img_dir = "static/img/";
	this.loader = new PIXI.Loader();

	this.loader.add("frame", this.img_dir + "frame.png");
	this.loader.add("white", this.img_dir + "oserowhite.png");
	this.loader.add("black", this.img_dir + "oseroblack.png");
	this.loader.add("pink", this.img_dir + "pink.png");
	this.loader.add("board_base", this.img_dir + "oseroboard.png");
	this.loader.load();


	this.height = height;
	this.width = width;	
	this.app = app;

	console.assert(
	    this.app.screen.height <= this.app.screen.width,
	    "Screnn height longer than it's width."
	);
	
	this.disk_width = Math.floor(this.app.screen.width / this.width);
	this.disk_height = this.disk_width;

	

	this.black = new Array(this.height);
	this.white = new Array(this.height);
	this.puttable = new Array(this.height);
	this.board_sprites = new Array(this.height);
	this.disk_sprites = new Array(this.height);
	this.pink_sprites = new Array(this.height);
	this.display_postions = new Array(this.height);
	
	for(let y = 0; y < this.height; y++) {
	    this.black[y] = new Array(this.width).fill(false);
	    this.white[y] = new Array(this.width).fill(false);
	    this.puttable[y] = new Array(this.width).fill(false); 
	    
	    this.board_sprites[y] = new Array(this.width).fill(null);
	    this.disk_sprites[y] = new Array(this.width).fill(null);
	    this.pink_sprites[y] = new Array(this.width).fill(null);
	    this.display_postions[y] = new Array(this.width).fill(null);
	}
	
	

	console.log("Here!")
	while(true){
	    console.log(this.loader.progress)
	    if(!this.loader.loading){
		break
	    }
	}
	this.black_texture = this.loader.resources.black.texture;
	this.white_texture = this.loader.resources.white.texture;
	this.pink_texture = this.loader.resources.pink.texture;

	this.load();

	this.pointer = new PIXI.Sprite(
	    this.loader.resources.frame.texture
	);
	this.pointer.width = this.disk_width;
	this.pointer.height = this.disk_height;
	this.pointer.x = 0;
	this.pointer.y = 0;
	
	//this.pointer.visible = false
	this.app.stage.addChild(this.pointer);
	
	
    }

    draw(){
	
	for(let y = 0; y < this.height; y++) {
	    for(let x = 0; x < this.width; x++) {
		
		//Draw disks!
		if(this.black[y][x]){
		    this.display_disk(y, x, "black");
		}else if(this.white[y][x]){
		    this.display_disk(y, x, "white");
		}else{
		    this.disk_sprites[y][x].visible = false;
		}

		//Draw puttable positions!
		if(this.puttable[y][x]){
		    console.assert(
			!(this.black[y][x] || this.white[y][x]),
			"Disk already exists..."
		    );
		    this.pink_sprites[y][x].visible = true;
		}else{
		    this.pink_sprites[y][x].visible = false;
		}
	
	    }
	}
	
    }


    display_disk(y, x, color){
	if(color === "black"){
	    
	    if(this.board_sprites[y][x] === null){
		this.disk_sprites[y][x] = new PIXI.Sprite(
		    this.black_texture
		);
	    }else{
		this.disk_sprites[y][x].texture = this.black_texture;
	    }
	    
	}else if(color === "white"){
	    
	    if(this.board_sprites[y][x] === null){
		this.disk_sprites[y][x] = new PIXI.Sprite(
		    this.white_texture
		);
	    }else{
		this.disk_sprites[y][x].texture = this.white_texture;
	    }

	}else{
	    throw new Error(`${color} is not defined`)
	}

	this.disk_sprites[y][x].visible = true;
    }
    

    load(){
	for(let y = 0; y < this.height; y++) {
	    for(let x = 0; x < this.width; x++) {
		this.board_sprites[y][x] = new PIXI.Sprite(
		    this.loader.resources.board_base.texture
		);
		
		this.board_sprites[y][x].height = this.disk_height;
		this.board_sprites[y][x].width = this.disk_width;
		this.board_sprites[y][x].x = x * this.disk_width;
		this.board_sprites[y][x].y = y * this.disk_height;
		this.app.stage.addChild(this.board_sprites[y][x]);
		
		this.pink_sprites[y][x] = new PIXI.Sprite(
		    this.loader.resources.pink.texture
		);
		this.pink_sprites[y][x].visible = false;

		this.pink_sprites[y][x].height = this.disk_height;
		this.pink_sprites[y][x].width = this.disk_width;
		this.pink_sprites[y][x].x = x * this.disk_width;
		this.pink_sprites[y][x].y = y * this.disk_height;
		this.app.stage.addChild(this.pink_sprites[y][x]);

		this.disk_sprites[y][x] = new PIXI.Sprite(
		    this.loader.resources.black.texture
		);
		this.disk_sprites[y][x].visible = false;

		this.disk_sprites[y][x].height = this.disk_height;
		this.disk_sprites[y][x].width = this.disk_width;
		this.disk_sprites[y][x].x = x * this.disk_width;
		this.disk_sprites[y][x].y = y * this.disk_height;
		this.app.stage.addChild(this.disk_sprites[y][x]);
	    }
	}
    }
}
