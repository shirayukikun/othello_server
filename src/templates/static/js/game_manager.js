let BLACK = true;
let WHITE = false;

export class GameManager {
    constructor(othello, black_player, white_player){
	this.othello = othello;
	this.turn = BLACK;
	this.end = false;
	this.players = {
	    [BLACK]: black_player,
	    [WHITE]: white_player,
	};
	
	this.players[BLACK].color = BLACK;
	this.players[WHITE].color = WHITE;
	this.players[BLACK].manager = this;
	this.players[WHITE].manager = this;
	this.gui = null;
    }

    get turn(){
	return this._turn;
    }

    set turn(value){
	this._turn = value;
	if(this._turn == BLACK){
	    document.getElementById("turn_text").innerText = "Black Turn";
	}else{
	    document.getElementById("turn_text").innerText = "White Turn";
	}
    }

    get turn_player(){
	return this.players[this.turn];
    }

    start(){
	let piece_counts = this.othello.count();
	document.getElementById("piece_counts").innerText =
	    "Black: " + piece_counts[BLACK] + ", White: " + piece_counts[WHITE];	
	this.turn_player.move();
    }
    
    go_next_turn(pass, end){
	this.turn_player.turn_end();
	let piece_counts = this.othello.count();
	document.getElementById("piece_counts").innerText =
	    "Black: " + piece_counts[BLACK] + ", White: " + piece_counts[WHITE];
	
	if(end){
	    this.end = end;
	    this.gui.reset_legal_move();
	    if(piece_counts[BLACK] == piece_counts[WHITE]){
		document.getElementById("turn_text").innerText = "Draw!";
	    }else if(piece_counts[BLACK] > piece_counts[WHITE]){
		document.getElementById("turn_text").innerText = "Black Win!";
	    }else{
		document.getElementById("turn_text").innerText = "White Win!";
	    }
		
	    return;
	}
	
	if(!pass){
	    this.turn = !(this.turn);
	}
	// ここから下は新しいターン
	
	if(document.getElementById("show_legal_move").checked){
	    this.gui.get_legal_move();
	}else{
	    this.gui.reset_legal_move();
	}

	
	if(document.getElementById("evaluation_value_type_options").value == "None"){   
	    this.gui.reset_eval_score();
	}else{
	    this.gui.get_eval_score();
	}

	this.players[BLACK].ai_name = document.getElementById("black_ai_options").value;
	this.players[WHITE].ai_name = document.getElementById("white_ai_options").value;
	this.turn_player.move();
    }
}
	
