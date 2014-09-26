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
	for (var i = 0; i < n; i++){
		for (var j = 0; j < n; j++){
			if (board[i][j] === 1){
				h_score = Add Up All Attacks;
			}
		}
	}

	h_score = h_score / 2; // because pairs

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
	console.log("We had a " + n + " by " + n + " dimension gameboard");
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
	var occupiedRows = [];

	// must return - 1 if we are at an end state (no successors)

	// generate childNodes_t 
	var newBoard = board;

	for (var row = 0; row < n; row++){
		for (var col = 0; col < n; col++){
			if (board[col][row] === 1)
				queenCount++;
				occupiedRows.push(col);
			if (queenCount > 0){
				queenCount = 0;
				continue; // goes to outer for loop, advancing us to next column
			}
			else if (queenCount === 0){ // this is the first free column, let's add a queen
				// we can add to any row in this column that is not in occupiedRows
				for (var adder = 0; adder < n; adder++){
					for(var i = 0; i < occupiedRows.length; i++){
						if (adder === occupiedRows[i])
							continue; // takes us to for (var adder) loop
						else{
							newBoard[adder][row] = 1;
							//make a child node, add to child list
							var nodeToAdd = new Node_t(heuristic(newBoard), newBoard);
							childNodes_t.push(nodeToAdd);
							newBoard = board; 	// reset newBoard
						}
					}
				}

			}
		}
	}

	if (childNodes_t.length === 0)
		return -1;	// lets aStar() know we're at an end state
	else
		insertFringe(childNodes_t);
}


/* ========================================================================
		FRINGE INSERTION FUNCTION 
   ========================================================================
*/


function insertFringe(childNodesArray){		// edits global object fringe, so does not return
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
		var insertVal = childNodesArray[i]["cost"];
		//console.log("just assigned insertVal");

		for (var j = 0; j < fringe.length; j++){
			if (typeof fringe[j] !== 'undefined' && fringe[j]["cost"] > insertVal){
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
