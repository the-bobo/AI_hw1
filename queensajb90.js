// queensajb90.js
if (process.argv.length !== 3) {
    console.error("Exactly one argument required: must specify dimension of square gameboard");
    console.error("Correct usage is: node queensajb90.js int");
    console.error("For example: node queensajb90 3 \n solves for a 3x3 gameboard");
    process.exit(1);
}

var n = process.argv[2]; //dimensions of gameboard
var fringe = new Array(99999999);
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


function Node_t(cost, someState){
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


/* ========================================================================
		HEURISTIC FUNCTION 
   ========================================================================
*/


function heuristic(board){
	var h_score = 0;	// h_score of 0 indicates goal state

	//calculate heuristic

	return h_score;
}

/* ========================================================================
		A-STAR FUNCTION 
   ========================================================================
*/


/*REMOVAL FROM FRINGE
	- initialie start node from input file
	- add start node's children to fringe via successor function
	- remove_min from fringe
	- check to see if === goal state, if yes then ???
	- if fringe is empty, declare failure
*/
function aStar(){
	var startCost = 0;
	var someState = new State_t(board);
	var startNode = new Node_t(cost, someState);

	var currentBestNode = startNode;
	var currentBest = 99999;

	successorFunction(startNode);

	while(fringe.length > 0){
		var currentNode = fringe.shift();
		if (heuristic(currentNode.nodeState.board) >= currentBest){
			//ignore this guy
			continue; // goes to top of while loop
		}

		if (heuristic(currentNode.nodeState.board) < currentBest){
			if (successorFunction(currentNode) === -1) {	// this will update fringe
				currentBestNode = currentNode;		// we've found an end state
			} 
		}
	}
	console.log("Emptied fringe, retrieving best solution \n");
	console.log("Best solution has " + currentBest + " many pairs of attacking superqueens \n");
	// ideally, output positions of queens as well

}


/* ========================================================================
		SUCCESSOR FUNCTION 
   ========================================================================
*/


function successorFunction(someNode) {
	var board = someNode.nodeState.board;
	var childNodes_t = []; // array of childNodes to return

	var queenCount = 0;

	// must return -1 if we are at an end state (no successors)

	// generate childNodes_t 
	for (var row = 0; row < n; row++){
		for (var col = 0; col < n; col++){
			if (board[col][row] === 1)
				queenCount++;
			if (queenCount > 0){
				queenCount = 0;
				continue; // goes to outer for loop, advancing us to next column
			}
		}
	}

}

/* ========================================================================
		FRINGE INSERTION FUNCTION 
   ========================================================================
*/


function insertFringe(childNodesArray){		
	//console.log("inside insertFringe");

	for (var cntr = 0; cntr < fringe.length; cntr++){
		if (typeof fringe[cntr] === 'undefined')
			break;
	}

	if(cntr === 0){
		//console.log("cntr was 0");
		fringe.unshift(childNodesArray[0]);
		childNodesArray.splice(0,1);
	}

	for (var i = 0; i < childNodesArray.length; i++){
		var insertVal = childNodesArray[i]["total_cost"];
		//console.log("just assigned insertVal");

		for (var j = 0; j < fringe.length; j++){
			if (typeof fringe[j] !== 'undefined' && fringe[j]["total_cost"] > insertVal){
				//console.log("fringe is greater than insertVal")
				fringe.splice(j, 0, childNodesArray[i]);
				break;
			}

			if(typeof fringe[j] === 'undefined'){
				//console.log("going to break");
				if (insertVal >= fringe[j-1]){
					//put it at fringe[j]
					fringe.splice(j+1, 0, childNodesArray[i]);
				}
				break;
			}
			
		}
	}
	
}
