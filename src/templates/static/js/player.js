let BLACK = true;
let WHITE = false;

export class Player{
    constructor(othello, ai_name="manual", color=null){
	this.othello = othello;
	this.ai_name = ai_name;
	this.color = color;
	this.manager = null;
	this.wait_user_input = false;
    }

    move(){
	//console.log(this.manager.gui.connection_wait_get_legal_move)
	
	if(this.ai_name == "manual"){
	    this.wait_user_input = true;
	    return;
	}
	
	let selection_policy = "best";
	
	$.ajax(
	    {
		data: JSON.stringify(
		    {
			black: this.othello.black,
			white: this.othello.white,
			color: this.color,
			selection_policy: selection_policy,
			ai_name: this.ai_name
		    }
		),
		type : "POST",
		url : "/move",
		contentType: 'application/json',
		context: this
	    }
	).done(
	    function(data){
		this.move_done(data);
	    }
	);
	

    }

    move_done(data){
	let json_data = JSON.parse(
	    JSON.stringify(data)
	);
	
	this.othello.black = json_data["black"];
	this.othello.white = json_data["white"];
	this.manager.go_next_turn(json_data["pass"], json_data["end"]);
    }

    

    interrupt(){
	if(this.ai_name == "manual"){
	    this.wait_user_input = false;
	    return;
	}
    }

    turn_end(){
	this.interrupt()
    }
}

