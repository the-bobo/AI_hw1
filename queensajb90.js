// queensajb90.js
if (process.argv.length !== 3) {
    console.error("Exactly one argument required: must specify dimension of square gameboard");
    console.error("Correct usage is: node queensajb90.js int");
    console.error("For example: node queensajb90 3 \n solves for a 3x3 gameboard");
    process.exit(1);
}

var n = process.argv[2]; 
var board = [];
var boardRow = [];

for (var bcntr = 0; bcntr < n; bcntr++){
	boardRow[bcntr] = 0;
}

for (var bcntr = 0; bcntr < n; bcntr++){
	board[bcntr] = boardRow;
}


/* ========================================================================
		NODE_T STRUCTURE 
   ========================================================================
*/


function Node_t(cost, h_cost, total_cost, someState, pNode_t){
	this.cost = cost; //# of attacks
	this.nodeState = someState;
}


/* ========================================================================
		STATE_T STRUCTURE 
   ========================================================================
*/


function State_t(board){
	this.board = board; //a 2-d, n-by-n array, where user specifies n
}


