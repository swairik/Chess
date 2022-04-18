// TODO : check concept.........getAttacking() has to be implemented















let dimensions = 600;

let w = dimensions / 8;         // size of each cell..keep it divisible by canvas height and width => height / 8 and width / 8

let state;          // board state

let moving;         // holds the state when we are dragging the clicked mouse...keeping the mouse moving
let pieceToMove;    // the piece that has to be moved when mouse is clicked

let images = [];        // stores the images of the sprites from the assets folder

let turn = 1;   // white's turn at the beginning

function setup() {
  createCanvas(dimensions, dimensions);

  // load images

  // for(let i = 1; i < 10; i++) {
  //   images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_0" + i + ".png"));
  // }
  // for(let i = 10; i < 13; i++) {
  //   images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_" + i + ".png"));
  // }

  for(let i = 1; i < 13; i++) {
    images.push(loadImage("assets/output-onlinepngtools (" + i + ").png"));
  }

  // create new board state 
  state = new State();

  // initialsing everything as not moving at the beginning
  moving = false;

  
}

function draw() {
  background(220);

  createBoard();
  
  state.show();

}

function createBoard() {
  for(let i = 0; i < 8; i++) {
    for(let j = 0; j < 8; j++) {
      if((i + j) & 1) {
        // black squares
        fill("#779952");
        // fill("darkred");
        // fill(0);
      }
      else {
        // white squares
        fill("#edeed1");    
        // fill("blue");    
        // fill(255);
      }
      rect(i * w, j * w, w, w);
    }
  }
}

function mousePressed() { 
  let i = floor(mouseX / w);
  let j = floor(mouseY / w);
  if(!moving) {
    moving = true;
    pieceToMove = state.getElement(i, j);
    if(pieceToMove){
      pieceToMove.movingThePiece = true;
      pieceToMove.showPossibleMoves();
    }
    else {
      return;
    }
  }
  // else {
    //   pieceToMove.movingThePiece = false;
    //   pieceToMove.move(i, j);
    // }
    // moving = !moving;
  }
  
  function mouseReleased() {
    let i = floor(mouseX / w);
    let j = floor(mouseY / w);
    moving = false;
    if(pieceToMove) {
      pieceToMove.movingThePiece = false;
      if(pieceToMove.canMove(i, j)){
        pieceToMove.move(i, j);
      }
  }
}