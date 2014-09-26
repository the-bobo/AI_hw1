/*
* Abhishek Bose-Kolanu
* CPA 570 AI
* Prof. Vince Conitzer
* 09/26/2014
*
* Takes a .txt file with a representation of a fifteens puzzle
* Solves the fifteens puzzles for knight-moves
* Ouptuts to file tilepuzajb90.txt
* 	-Number of moves 	-Sequence of states from start to finish
*/

/*
	- We need a representation of a state
		- Should include possible actions (child nodes?)
		- Actions generated by successor function
	- We need a way to evaluate if a state === the goal state
	- We need a way to evaluate failure (fringe empty?)
	- We need a representation of a path (sequence of states)
	- We need a cost function (def. cost of an action) and a heuristic
	- We need a fringe (list of nodes generated but not yet expanded)
	- We need a function to select next node from fringe

*/

/*
	-Cost Function: each move adds 1 to the cost
	
	-Heuristic Function: forall squares s on the board, assuming s is the only
	square on the board, what is the min. # of knights moves to
	get it to the target? Add all together (but not for blank sq!)

	-Successor function (generates child nodes/states): 
		-find blank square
		-what other squares are 1 knights-moves away from it?
		-foreach, swap it with blank square -- these are the child nodes

	-Fringe should be maintained in order of total cost from min to max
		-g(n) === cost incurred on path from start to node
		-h(n) === estimate of distance remaining

*/

/*
	x Node Structure
		- "cost" : g(n) associated with it
		- "h_cost" : h(n) associated with it
		- "total_cost" : g(n) + h(n)
		- contains a State
		- knows its Parent Node 

	x State Structure
		- Configuration of the board

	x Successor Function
		- Input: a State
		- Output: all possible child-nodes
			- Needs to calculate possible States, and then assign "cost",
				"h_cost" and "total_cost" to those
			- Then needs to pass them in to the Fringe

	x Fringe List
		- Ordered list from min to max of Nodes
		- Stored as an Array
		- On insertion, use binary search to identify where to insert
			new node. 
			- Insert new node and move the rest of them down by one
			- Use splice() to do this
			- Insertion solves Sorting initial fringe as well (first 
				element just gets addded to the list; second element
				is special case where array.length === 1 so just compare;
				from there on out use binary search recursively)
			- array.shift() returns first item of array and decrements
				array.length by 1

	x Path Function
		- Input: Goal Node
		- Records g(n) for the Goal Node
		- Walks backwards along the Parent Node property until Start Node
			is reached
		- Generates: A List, ordered from Start to Finish of Nodes
		- Output: Processes the List to extract relevant States, ordering
		them from Start to Finish, and displays total cost (# of moves) in
		output file tilepuz-ajb90.txt

	REMOVAL FROM FRINGE
		- Do we have a function that takes things off the fringe???
		- It needs to actually implement A*
		- We need a way to evaluate if a state === the goal state
		- We need a way to evaluate failure (fringe empty?)
		- We need to start with the start state, from input file

	FILE I/O
		- How to read input file?
		- How to write output file?

*/


/* ========================================================================
		FILE I/O
   ========================================================================
*/


var fs = require('fs'); // loads a filesystem library for node

if (process.argv.length !== 3) {
    console.error("Exactly one argument required: must specify filename.txt of input file");
    console.error("Correct usage is: node tilepuzajb90.js filename.txt");
    console.error("filename.txt must also be in the same directory as tilepuzajb90.js");
    process.exit(1);
}

var input = process.argv[2];	// CAUTION - GLOBAL OBJECT
var output = "tilepuz-ajb90.txt";	// CAUTION - GLOBAL OBJECT
var fringe = new Array(9999999); // hardwired to nowhere near max b/c javascript
aStar();

function inputSanitizer(){
	var data = fs.readFileSync(input, 'utf-8');
	var array = data.split('\n');

	var array1 = array[0].split(',');
	var array2 = array[1].split(',');
	var array3 = array[2].split(',');
	var array4 = array[3].split(',');

	for (var i = 0; i < array1.length; i++){
		array[i] = parseInt(array1[i], 10);
	}
	for (var i = 0; i < array2.length; i++){
		array[i+4] = parseInt(array2[i], 10);
	}
	for (var i = 0; i < array3.length; i++){
		array[i+8] = parseInt(array3[i], 10);
	}
	for (var i = 0; i < array4.length; i++){
		array[i+12] = parseInt(array4[i], 10);
	}

	return array; 		// this is our starting board

}


/* ========================================================================
		NODE_T STRUCTURE 
   ========================================================================
*/


function Node_t(cost, h_cost, total_cost, someState, pNode_t){
	this.cost = cost;
	this.h_cost = h_cost;
	this.total_cost = total_cost;
	this.nodeState = someState;
	this.pNode_t = pNode_t; //pNode_t is another Node_t object 
	//to make new nodes: var newNode_t = new Node_t(paramters)
}

Node_t.prototype = {	// methods for Node_t objects - not used
	constructor: Node_t,
	giveParent: function() { return this.pNode_t; }
};


/* ========================================================================
		STATE_T STRUCTURE 
   ========================================================================
*/


function State_t(board){
	this.board = board; //a 1-d array
}

State_t.prototype = {	// methods for State_t objects - not used
	constructor: State_t,
	giveBoard: function() { return this.board; }
};


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
	var goalNodeState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

	var startingBoard = inputSanitizer();
	
	var startCost = 0;
	var start_h_cost = 999999;	// hard coded for heuristic consistency
	var start_total_cost = start_h_cost;
	var start_state = new State_t(startingBoard);
	nullParent = null;
	var startNode = new Node_t(startCost, start_h_cost, start_total_cost, start_state, nullParent);
	var currentNode;
	var nodesExpanded = 0; // counts # nodes expanded

	successorFunction(startNode);	// adds startNode's children to the fringe
	console.log("outside the while loop in aStar()");

	for (var i = 0; i < fringe.length; i++){
		if (typeof fringe[i] === 'undefined')
			break;
	}

	while(i >= 0){
		currentNode = fringe.shift();
		nodesExpanded++;
		if (nodesExpanded % 1000 === 0)
			console.log(nodesExpanded/1000 + " Thousand many nodes expanded");
		i--;	// i will get re-computed if successors are generated
		if(currentNode.nodeState === goalNodeState){
			pathWalker(currentNode);
			console.log("Optimal solution stored in tilepuz-ajb90.txt, exiting now!")
			process.exit(0);
		}
		else{
			successorFunction(currentNode);
			for (var i = 0; i < fringe.length; i++){
				if (typeof fringe[i] === 'undefined')
				break;
			}
		}
	}
	console.log("Fringe empty. No solution found, quitting...");
	process.exit(0);
}


/* ========================================================================
		PATH-WALKER FUNCTION 
   ========================================================================
*/


function pathWalker(lastNode){
	var finalCost = lastNode["total_cost"];
	var finalPath = [];
	finalPath.push(lastNode.nodeState);
	while (lastNode.pNode_t){
		finalPath.unshift(lastNode.pNode_t.nodeState);	// adds parentNode to head of path
		lastNode = lastNode.pNode_t;
	}
	fs.appendFileSync(output, "The total cost for this path was: " + finalCost + "\n");
	for(var i = 0; i < finalPath.length; i ++){
		var currentBoard = finalPath[i].board;
		var lineToWrite1 = "";
		var lineToWrite2 = "";
		var lineToWrite3 = "";
		var lineToWrite4 = "";
		for (var j = 0; j < 4; j++){
			if (j === 0){
				lineToWrite1 = currentBoard[j];
				continue;
			}
			lineToWrite1 += "," + currentBoard[j];
		}
		for (var k = 4; k < 8; k++){
			if (k === 4){
				lineToWrite2 = currentBoard[k];
				continue;
			}
			lineToWrite2 += "," + currentBoard[k];
		}
		for (var l = 8; l < 12; l++){
			if (l === 8){
				lineToWrite3 = currentBoard[l];
				continue;
			}
			lineToWrite3 += "," + currentBoard[l];
		}
		for (var m = 12; m < 16; m++){
			if (m === 12){
				lineToWrite4 = currentBoard[m];
				continue;
			}
			lineToWrite4 += "," + currentBoard[m];
		}

		fs.appendFileSync(output, "" + lineToWrite1 + "\n" + lineToWrite2 + "\n" + lineToWrite3 + "\n" + lineToWrite4);
	}
	
	
}


/* ========================================================================
		HEURISTIC FUNCTION 
   ========================================================================
*/


function heuristic(board){
	var h_score = 0;	// h_score of 0 indicates goal state
	for (var i = 0; i < board.length; i ++){
		if (board[i] !== (i+1) && board[i] !== 0){	// no heuristic for blank square
			h_score += Math.abs(board[i] - (i+1));
		}
	}
	return h_score;
}


/* ========================================================================
		FRINGE INSERTION FUNCTION 
   ========================================================================
*/


function insertFringe(childNodesArray){		
	//var searchFringe = fringe;		// grab a copy of fringe for searching

/*
	for (var i = 0; i < childNodesArray.length; i++){
		var insertVal = childNodesArray[i]["total_cost"];
		var currentKey = Math.ceil((fringe.length-1) / 2);
		var target_index = binFringeSearch(insertVal, currentKey, searchFringe);
		fringe.splice(target_index, 0, childNodesArray[i]);	// inserts to fringe
	}

	*/
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
			
			
			/* does not work when we hardwire the array length of fringe
			else{
				console.log("shouldn't be in here");
				fringe.push(childNodesArray[i]);
			} */
		}
	}
	
}


/* ========================================================================
		BINARY SEARCH FUNCTION (assists insertFringe)
   ========================================================================
*/


function binFringeSearch(insertVal, currentKey, searchFringe){
	if (currentKey === 0){	// fringe was empty
		//console.log("in block 1");
		return 0;
	}

	if (searchFringe.length === 2){
		if (insertVal > searchFringe[0]["total_cost"] && insertVal < searchFringe[1]["total_cost"])
			return 1;
		if (insertVal < searchFringe[0]["total_cost"])
			return 0;
		if (insertVal > searchFringe[1]["total_cost"])
			return 2;
	}

	if (insertVal < fringe[currentKey]["total_cost"]){
		//console.log("in block 2");
			currentKey = Math.floor(currentKey / 2);
			searchFringe = searchFringe.splice(currentKey);
		//	console.log("current key is: " + currentKey);
			return binFringeSearch(insertVal, currentKey);
	}

	if (insertVal > fringe[currentKey]["total_cost"]){
		//console.log("in block 3");
			currentKey += Math.ceil((fringe.length-1 - currentKey) / 2);
			if (currentKey < fringe.length-1)
				return binFringeSearch(insertVal, currentKey);
			if (currentKey === fringe.length-1){
				if (insertVal < fringe[currentKey]["total_cost"])
					return fringe.length-1;
				if (insertVal > fringe[currentKey]["total_cost"])
					return fringe.length;
				else if (insertVal === fringe[currentKey]["total_cost"])
					return fringe.length;
			}
	}
	if (insertVal === fringe[currentKey]["total_cost"]){
		console.log("in block 4");
			return currentKey;
	}
}


/* ========================================================================
		COST FUNCTION  (assists sub-routines for successor function)
   ========================================================================
*/


// returns a childNode with "cost", "h_cost" and "total_cost"
function nodeComputer(target, zero_index, board, pNode, myName){
	if (target > (board.length-1) || target < 0){
		console.error('Successor subroutine' + myName + 'generated illegal state');
		process.exit(1);
	}
	var newBoard = board;
	newBoard[zero_index] = board[target];
	newBoard[target] = 0;

	var newState_t = new State_t(newBoard);
	var new_h_cost = heuristic(board); 
	var newCost = pNode.cost + 1;
	var newTotalCost = newCost + new_h_cost;
	var newNode_t = new Node_t(newCost, new_h_cost, newTotalCost, newState_t, pNode);

	return newNode_t;
}


/* ========================================================================
		SUCCESSOR FUNCTION 
   ========================================================================
*/


function successorFunction(someNode) {
	var board = someNode.nodeState.board;
	var childNodes_t = []; // array of childNodes to return

	// find the zero
	var zero_index = -1;
	for (var i = 0; i < board.length; i++){
		if (board[i] === 0)
			zero_index = i;
	}

	if (zero_index < 0) {
		console.error("Error: no zero found in this board");
		process.exit(1);
	}

	// identify what moves can be made
	if (zero_index === 0 || zero_index === 1 || zero_index === 4 || zero_index === 5){
		if (zero_index === 1){
			childNodes_t.push(R2D1(zero_index, board, someNode));
			childNodes_t.push(D2L1(zero_index, board, someNode));
			childNodes_t.push(D2R1(zero_index, board, someNode));
		}
		if (zero_index === 0){ // a corner case
			childNodes_t.push(R2D1(zero_index, board, someNode));
			childNodes_t.push(D2R1(zero_index, board, someNode));

		}
		if (zero_index === 4){
			childNodes_t.push(D2R1(zero_index, board, someNode));
			childNodes_t.push(R2D1(zero_index, board, someNode));
			childNodes_t.push(R2U1(zero_index, board, someNode));
		}
		if (zero_index === 5){
			childNodes_t.push(R2U1(zero_index, board, someNode));
			childNodes_t.push(R2D1(zero_index, board, someNode));
			childNodes_t.push(D2L1(zero_index, board, someNode));
			childNodes_t.push(D2R1(zero_index, board, someNode));
		}
	}
	if (zero_index === 2 || zero_index === 3 || zero_index === 6 || zero_index === 7){
		if (zero_index === 2){
			childNodes_t.push(L2D1(zero_index, board, someNode));
			childNodes_t.push(D2L1(zero_index, board, someNode));
			childNodes_t.push(D2R1(zero_index, board, someNode));
		}
		if (zero_index === 3){ // a corner case
			childNodes_t.push(L2D1(zero_index, board, someNode));
			childNodes_t.push(D2L1(zero_index, board, someNode));

		}		
		if (zero_index === 7){
			childNodes_t.push(D2L1(zero_index, board, someNode));
			childNodes_t.push(L2U1(zero_index, board, someNode));
			childNodes_t.push(L2D1(zero_index, board, someNode));
		}
		if (zero_index === 6){
			childNodes_t.push(L2D1(zero_index, board, someNode));
			childNodes_t.push(L2U1(zero_index, board, someNode));
			childNodes_t.push(D2L1(zero_index, board, someNode));
			childNodes_t.push(D2R1(zero_index, board, someNode));
		}
	}
	if (zero_index === 8 || zero_index === 9 || zero_index === 12 || zero_index === 13){
		if (zero_index === 13){
			childNodes_t.push(R2U1(zero_index, board, someNode));
			childNodes_t.push(U2L1(zero_index, board, someNode));
			childNodes_t.push(U2R1(zero_index, board, someNode));
		}
		if (zero_index === 12){	 // a corner case
			childNodes_t.push(R2U1(zero_index, board, someNode));
			childNodes_t.push(U2R1(zero_index, board, someNode));
		}
		if (zero_index === 8){
			childNodes_t.push(U2R1(zero_index, board, someNode));
			childNodes_t.push(R2D1(zero_index, board, someNode));
			childNodes_t.push(R2U1(zero_index, board, someNode));
		}
		if (zero_index === 9){
			childNodes_t.push(R2U1(zero_index, board, someNode));
			childNodes_t.push(R2D1(zero_index, board, someNode));
			childNodes_t.push(U2L1(zero_index, board, someNode));
			childNodes_t.push(U2R1(zero_index, board, someNode));
		}
	}
	if (zero_index === 10 || zero_index === 11 || zero_index === 14 || zero_index === 15){
		if (zero_index === 14){
			childNodes_t.push(L2U1(zero_index, board, someNode));
			childNodes_t.push(U2L1(zero_index, board, someNode));
			childNodes_t.push(U2R1(zero_index, board, someNode));
		}
		if (zero_index === 15){ // a corner case
			childNodes_t.push(U2L1(zero_index, board, someNode));
			childNodes_t.push(L2U1(zero_index, board, someNode));
		}
		if (zero_index === 10){
			childNodes_t.push(U2L1(zero_index, board, someNode));
			childNodes_t.push(U2R1(zero_index, board, someNode));
			childNodes_t.push(L2D1(zero_index, board, someNode));
			childNodes_t.push(L2U1(zero_index, board, someNode));
		}
		if (zero_index === 11){
			childNodes_t.push(U2L1(zero_index, board, someNode));
			childNodes_t.push(L2D1(zero_index, board, someNode));
			childNodes_t.push(L2U1(zero_index, board, someNode));
		}
	}
	// need to pass them in to the fringe
	insertFringe(childNodes_t);
}


/* ========================================================================
		SUB-ROUTINES FOR SUCCESSOR FUNCTION 
   ========================================================================
*/


function R2D1(zero_index, board, pNode){	// pNode is parentNode
	var target = zero_index + 2 + 4;
	var myName = "R2D1";
	return nodeComputer(target, zero_index, board, pNode, myName);
}


function R2U1(zero_index, board, pNode){
	var target = zero_index + 2 - 4;
	var myName = "R2U1";
	return nodeComputer(target, zero_index, board, pNode, myName);
}

function L2D1 (zero_index, board, pNode) {
	var target = zero_index - 2 + 4;
	var myName = "L2D1";
	return nodeComputer(target, zero_index, board, pNode, myName);
}

function L2U1 (zero_index, board, pNode) {
	var target = zero_index - 2 - 4;
	var myName = "L2U1";
	return nodeComputer(target, zero_index, board, pNode, myName);
}

function U2R1 (zero_index, board, pNode) {
	var target = zero_index - 8 + 1;
	var myName = "U2R1";
	return nodeComputer(target, zero_index, board, pNode, myName);
}

function U2L1 (zero_index, board, pNode) {
	var target = zero_index - 8 - 1;
	var myName = "U2L1";
	return nodeComputer(target, zero_index, board, pNode, myName);
}

function D2R1 (zero_index, board, pNode) {
	var target = zero_index + 8 + 1;
	var myName = "D2R1";
	return nodeComputer(target, zero_index, board, pNode, myName);
}

function D2L1 (zero_index, board, pNode) {
	var target = zero_index + 8 - 1;
	var myName = "D2L1";
	return nodeComputer(target, zero_index, board, pNode, myName);
}