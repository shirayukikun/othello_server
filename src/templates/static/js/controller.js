let BLACK = true;
let WHITE = false;


export class Controller {
    constructor(game_manager, gui, othello){
	this.manager = game_manager;
	this.othello = othello;
	this.gui = gui;

	document.getElementById("evaluation_value_type_options").addEventListener(
	    "change",
	    function(){
		if(document.getElementById("evaluation_value_type_options").value != "None"){
		    document.getElementById("show_legal_move").checked = true;
		    document.getElementById("show_legal_move").disabled = true;
		    this.update_legal_move();
		}else{
		    document.getElementById("show_legal_move").disabled = false;
		}
	    }.bind(this)
	);

	document.getElementById("black_ai_options").addEventListener(
	    "change",
	    function(){
		if(this.manager.turn == BLACK && this.manager.players[BLACK].wait_user_input){
		    this.manager.turn_player.interrupt();
		}
		this.manager.players[BLACK].ai_name = document.getElementById("black_ai_options").value;
	    }.bind(this)
	);

	document.getElementById("white_ai_options").addEventListener(
	    "change",
	    function(){
		if(this.manager.turn == WHITE  && this.manager.players[WHITE].wait_user_input){
		    this.manager.turn_player.interrupt();
		}
		this.manager.players[WHITE].ai_name = document.getElementById("white_ai_options").value;
		
		if(this.manager.turn == BLACK){
		    this.manager.turn_player.move();
		}

		
		if(this.manager.turn == WHITE){
		    this.manager.turn_player.move();
		}

	    }.bind(this)
	);
	

	document.getElementById("show_legal_move").addEventListener(
	    "change",
	    this.update_legal_move.bind(this)
	);

	document.getElementById("evaluation_value_type_options").addEventListener(
	    "change",
	    this.update_eval_score.bind(this)
	);
	
    }

	
    update_legal_move(){
	if(document.getElementById("show_legal_move").checked){
	    this.gui.get_legal_move();
	}else{
	    this.gui.reset_legal_move();
	}
    }

    update_eval_score(){
	if(document.getElementById("evaluation_value_type_options").value == "None"){   
	    this.gui.reset_eval_score();
	}else{
	    this.gui.get_eval_score();
	}
    }


}
