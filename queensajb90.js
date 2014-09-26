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

