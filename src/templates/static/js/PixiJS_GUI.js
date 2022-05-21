let BLACK = true;
let WHITE = false;


export class PixiJSGUI {
    constructor(othello, manager, app){
	//先に画像のロードを初めておく
	this.img_dir = "static/img/";
	
	this.frame_texture = PIXI.Texture.from(this.img_dir + "frame.png");
	this.white_texture = PIXI.Texture.from(this.img_dir + "oserowhite.png");
	this.black_texture = PIXI.Texture.from(this.img_dir + "oseroblack.png");
	this.pink_texture = PIXI.Texture.from(this.img_dir + "pink.png");
	this.board_base_texture = PIXI.Texture.from(this.img_dir + "oseroboard.png");
	this.disk_scale = 0.87;
	this.eval_score_scale = 0.6;
	this.font_name = "defaultBMfont";

	
	this.othello = othello;
	this.manager = manager;
	this.manager.gui = this;
	this.app = app;
	this.state = 0;

	console.assert(
	    this.app.screen.width <= this.app.screen.height,
	    "Screnn height longer than it's width."
	);
	
	this.disk_width = Math.floor(this.app.screen.width / this.othello.width);
	this.disk_height = this.disk_width;

	this.board_sprites = new Array(this.othello.height);
	this.disk_sprites = new Array(this.othello.height);
	this.pink_sprites = new Array(this.othello.height);
	this.score_texts = new Array(this.othello.height);
	this.display_postions = new Array(this.othello.height);
	
	
	for(let y = 0; y < this.othello.height; y++) {	    
	    this.board_sprites[y] = new Array(this.othello.width).fill(null);
	    this.disk_sprites[y] = new Array(this.othello.width).fill(null);
	    this.pink_sprites[y] = new Array(this.othello.width).fill(null);
	    this.display_postions[y] = new Array(this.othello.width).fill(null);
	    this.score_texts[y] = new Array(this.othello.width).fill(null);
	}
	
	
	this.load();
	
	this.pointer = new PIXI.Sprite(
	    this.frame_texture
	);
	this.pointer.width = this.disk_width;
	this.pointer.height = this.disk_height;
	this.pointer.x = 0;
	this.pointer.y = 0;
	this.pointer.interactive = true;
	this.pointer.buttonMode = true;
	this.pointer.on(
	    "pointerdown",
	    this.put,
	    this
	)
	this.app.stage.addChild(this.pointer);

	this.connection_wait_get_legal_move = false;
	this.connection_wait = false;

	
    }


    put(event){
	if(this.connection_wait || this.connection_wait_get_legal_move){
	    return;
	}

	if(!this.manager.turn_player.wait_user_input){
	    return;
	}
	
	let x = Math.round(this.pointer.x / this.disk_width);
	let y = Math.round(this.pointer.y / this.disk_height);
	
	this.connection_wait = true;
	$.ajax(
	    {
		data: JSON.stringify(
		    {
			black : this.othello.black,
			white : this.othello.white,
			pos : [x, y],
			color : this.manager.turn,
		    }
		),
		type : "POST",
		url : "/put",
		contentType: 'application/json',
		context: this
	    }
	).done(
	    function(data){
		this.put_done(data);
		this.connection_wait = false;
	    }
	);	
    }


    put_done(data){
	let json_data = JSON.parse(
	    JSON.stringify(data)
	);

	
	if(json_data["put"]){
	    this.othello.black = json_data["black"];
	    this.othello.white = json_data["white"];
	    this.manager.go_next_turn(json_data["pass"], json_data["end"]);
	}
    }
	

    get_legal_move(event=null){
	/*
	if(this.connection_wait_get_legal_move){
	    return;
	}
	*/
	this.reset_legal_move();
	this.connection_wait_get_legal_move = true;
	$.ajax(
	    {
		data: JSON.stringify(
		    {
			black : this.othello.black,
			white : this.othello.white,
			color : this.manager.turn,
		    }
		),
		type : "POST",
		url : "/legal_move",
		contentType: 'application/json',
		context: this
	    }
	).done(
	    function(data){
		let json_data = JSON.parse(
		    JSON.stringify(data)
		);
		this.othello.puttable = json_data["legal_move"];
		this.connection_wait_get_legal_move = false;
	    }
	)
    }

    reset_legal_move(event=null){
	for(let y = 0; y < this.othello.height; y++) {
	    this.othello.puttable[y].fill(false);
	}
    }






    get_eval_score(event=null){
	let eval_score_ai_name = document.getElementById("evaluation_value_type_options").value;
	
	if(eval_score_ai_name == "None"){
	    this.reset_eval_score();
	    return;
	}

	this.reset_eval_score();
	
	$.ajax(
	    {
		data: JSON.stringify(
		    {
			black : this.othello.black,
			white : this.othello.white,
			color : this.manager.turn,
			ai_name : eval_score_ai_name,
		    }
		),
		type : "POST",
		url : "/eval_score",
		contentType: 'application/json',
		context: this
	    }
	).done(
	    function(data){
		let json_data = JSON.parse(
		    JSON.stringify(data)
		);
		
		this.othello.score = json_data["score_board"];
	    }
	)
    }

    reset_eval_score(event=null){
	for(let y = 0; y < this.othello.height; y++) {
	    this.othello.score[y].fill(null);
	}
    }



    draw_board(){
	
	for(let y = 0; y < this.othello.height; y++) {
	    for(let x = 0; x < this.othello.width; x++) {
		
		//Draw disks!
		if(this.othello.black[y][x]){
		    this.display_disk(y, x, BLACK);
		}else if(this.othello.white[y][x]){
		    this.display_disk(y, x, WHITE);
		}else{
		    this.disk_sprites[y][x].visible = false;
		}

		//Draw puttable positions!
		if(this.othello.puttable[y][x]){
		    this.pink_sprites[y][x].visible = true;
		}else{
		    this.pink_sprites[y][x].visible = false;
		}

		
		if(this.othello.score[y][x] === null){
		    this.update_eval_score_text(x, y, "");
		}else{		    
		    this.update_eval_score_text(
			x,
			y,
			this.othello.score[y][x].toString().substr(0, 3)
		    );
		}
	
	    }
	}
	
    }

    update_eval_score_text(x, y , text){
	if(this.score_texts[y][x].text == text){
	    return;
	}
	
	this.app.stage.removeChild(this.score_texts[y][x]);
	this.score_texts[y][x] = new PIXI.BitmapText(
	    text,
	    {
		fontName: this.font_name,
	    }
	);
	this.score_texts[y][x].height = this.disk_height * this.eval_score_scale;
	this.score_texts[y][x].width = this.disk_width * this.eval_score_scale;
	this.score_texts[y][x].x = x * this.disk_width + ((1 - this.eval_score_scale) / 2) * this.disk_width;
	this.score_texts[y][x].y = y * this.disk_height + ((1 - this.eval_score_scale) / 2) * this.disk_height;
	this.app.stage.addChild(this.score_texts[y][x]);

    }
    

    draw(){
	this.draw_board();
    }


    display_disk(y, x, color){
	if(color){
	    
	    if(this.board_sprites[y][x] === null){
		this.disk_sprites[y][x] = new PIXI.Sprite(
		    this.black_texture
		);
	    }else{
		this.disk_sprites[y][x].texture = this.black_texture;
	    }
	    
	}else{
	    
	    if(this.board_sprites[y][x] === null){
		this.disk_sprites[y][x] = new PIXI.Sprite(
		    this.white_texture
		);
	    }else{
		this.disk_sprites[y][x].texture = this.white_texture;
	    }
	}

	this.disk_sprites[y][x].visible = true;
    }
    

    load(){
	// 参考 : https://qiita.com/pentamania/items/06a2fe4062bff917c4fd#BitmapFont.from%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9F%E6%96%B9%E6%B3%95%EF%BC%88v5.3%E4%BB%A5%E9%99%8D%EF%BC%89
	
	PIXI.BitmapFont.from(
	    this.font_name,
	    {
		fontFamily: "Arial",
		fontSize: this.disk_height * this.disk_scale,
		fill: "white",
		align: "left",

	    },
	    {
		chars: "0123456789.- "
	    }
	);
	

	for(let y = 0; y < this.othello.height; y++) {
	    for(let x = 0; x < this.othello.width; x++) {

		
		this.board_sprites[y][x] = new PIXI.Sprite(
		    this.board_base_texture
		);
		
		this.board_sprites[y][x].height = this.disk_height;
		this.board_sprites[y][x].width = this.disk_width;
		this.board_sprites[y][x].x = x * this.disk_width;
		this.board_sprites[y][x].y = y * this.disk_height;
		this.board_sprites[y][x].interactive = true;
		this.board_sprites[y][x].buttonMode = true;
		// ポインターの移動
		this.board_sprites[y][x].on(
		    'pointerover',
		    (event) => {
			this.pointer.x = this.board_sprites[y][x].x;
			this.pointer.y = this.board_sprites[y][x].y;
		    }
		)
			

		
		this.app.stage.addChild(this.board_sprites[y][x]);
		
		this.pink_sprites[y][x] = new PIXI.Sprite(
		    this.pink_texture
		);
		this.pink_sprites[y][x].visible = false;

		this.pink_sprites[y][x].height = this.disk_height;
		this.pink_sprites[y][x].width = this.disk_width;
		this.pink_sprites[y][x].x = x * this.disk_width;
		this.pink_sprites[y][x].y = y * this.disk_height;
		this.app.stage.addChild(this.pink_sprites[y][x]);


		
		this.disk_sprites[y][x] = new PIXI.Sprite(
		    this.black_texture
		);
		this.disk_sprites[y][x].visible = false;

		this.disk_sprites[y][x].height = this.disk_height * this.disk_scale;
		this.disk_sprites[y][x].width = this.disk_width * this.disk_scale;
		this.disk_sprites[y][x].x = x * this.disk_width + ((1 - this.disk_scale) / 2) * this.disk_width;
		this.disk_sprites[y][x].y = y * this.disk_height + ((1 - this.disk_scale) / 2) * this.disk_height;
		this.app.stage.addChild(this.disk_sprites[y][x]);


		
		this.score_texts[y][x] = new PIXI.BitmapText(
		    "",
		    {
			fontName: this.font_name,
		    }
		);

		this.score_texts[y][x].height = this.disk_height * this.eval_score_scale;
		// 半分のサイズにしたら上手くいった．原因不明
		this.score_texts[y][x].width = Math.floor(this.disk_width * this.eval_score_scale / 2);
		this.score_texts[y][x].x = x * this.disk_width + ((1 - this.eval_score_scale) / 2) * this.disk_width;
		this.score_texts[y][x].y = y * this.disk_height + ((1 - this.eval_score_scale) / 2) * this.disk_height;
		
		this.app.stage.addChild(this.score_texts[y][x]);

	    }
	}
    }
}
