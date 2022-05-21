let BLACK = true;
let WHITE = false;

function sum(array){
    return array.reduce((a , b) => a + b , 0);
};

export class Othello {
    constructor(height, width){
	this.height = height;
	this.width = width;

	this.black = new Array(this.height);
	this.white = new Array(this.height);
	this.puttable = new Array(this.height);
	this.score = new Array(this.height);
	this.black_count = null;
	this.white_count = null;
	
	    
	for(let y = 0; y < this.height; y++) {
	    this.black[y] = new Array(this.width).fill(false);
	    this.white[y] = new Array(this.width).fill(false);
	    this.puttable[y] = new Array(this.width).fill(false);
	    this.score[y] = new Array(this.width).fill(null);
	}
    }

    count(){
	let black_count = 0;
	let white_count = 0;
	for(let y = 0; y < this.height; y++) {
	    black_count += sum(this.black[y]);
	    white_count += sum(this.white[y]);
	}
	
	return {
	    [BLACK]: black_count,
	    [WHITE]: white_count,
	};
    }
}
