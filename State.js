class State {
  constructor() {
    this.whitePieces = [];
    this.blackPieces = [];
    this.color;     // 0 for black and 1 for white

    this.whiteMoves = [];
    this.blackMoves = [];

    this.setupPieces();
  }

  setupPieces() {
    // white pieces
    this.whitePieces.push(new King(4, 7, 1));

    this.whitePieces.push(new Rook(7, 7, 1));
    this.whitePieces.push(new Knight(6, 7, 1));
    this.whitePieces.push(new Bishop(5, 7, 1));

    this.whitePieces.push(new Queen(3, 7, 1));
    this.whitePieces.push(new Bishop(2, 7, 1));
    this.whitePieces.push(new Knight(1, 7, 1));
    this.whitePieces.push(new Rook(0, 7, 1));

    this.whitePieces.push(new Pawn(7, 6, 1));
    this.whitePieces.push(new Pawn(6, 6, 1));
    this.whitePieces.push(new Pawn(5, 6, 1));
    this.whitePieces.push(new Pawn(4, 6, 1));
    this.whitePieces.push(new Pawn(3, 6, 1));
    this.whitePieces.push(new Pawn(2, 6, 1));
    this.whitePieces.push(new Pawn(1, 6, 1));
    this.whitePieces.push(new Pawn(0, 6, 1));

    // black pieces
    this.blackPieces.push(new King(4, 0, 0));

    this.blackPieces.push(new Rook(7, 0, 0));
    this.blackPieces.push(new Knight(6, 0, 0));
    this.blackPieces.push(new Bishop(5, 0, 0));

    this.blackPieces.push(new Queen(3, 0, 0));
    this.blackPieces.push(new Bishop(2, 0, 0));
    this.blackPieces.push(new Knight(1, 0, 0));
    this.blackPieces.push(new Rook(0, 0, 0));

    this.blackPieces.push(new Pawn(7, 1, 0));
    this.blackPieces.push(new Pawn(6, 1, 0));
    this.blackPieces.push(new Pawn(5, 1, 0));
    this.blackPieces.push(new Pawn(4, 1, 0));
    this.blackPieces.push(new Pawn(3, 1, 0));
    this.blackPieces.push(new Pawn(2, 1, 0));
    this.blackPieces.push(new Pawn(1, 1, 0));
    this.blackPieces.push(new Pawn(0, 1, 0));

  }

  show() {
    for (let i = 0; i < this.whitePieces.length; i++) {
      this.whitePieces[i].show();
    }
    for (let i = 0; i < this.blackPieces.length; i++) {
      this.blackPieces[i].show();
    }

  }

  getElement(x, y) {
    // white pieces
    for (let i = 0; i < this.whitePieces.length; i++) {
      if (this.whitePieces[i].boardPosition.x == x && this.whitePieces[i].boardPosition.y == y) {
        console.log("white piece found!!");
        return this.whitePieces[i];
      }
    }
    // black pieces
    for (let i = 0; i < this.blackPieces.length; i++) {
      if (this.blackPieces[i].boardPosition.x == x && this.blackPieces[i].boardPosition.y == y) {
        console.log("black piece found!!");
        return this.blackPieces[i];
      }
    }
    return null;
  }

  removeElement(x, y, color) {
    console.log("In the remove fn " + color);
    if (color == 0) {
      for (let i = 0; i < this.blackPieces.length; i++) {
        if (this.blackPieces[i].boardPosition.x == x && this.blackPieces[i].boardPosition.y == y) {
          this.blackPieces.splice(i, 1);
          return;
          // let elem = this.blackPieces.splice(i, 1);
          // console.log(elem + "is removed");
        }
      }
    }
    else if (color == 1) {
      // white
      for (let i = 0; i < this.blackPieces.length; i++) {
        if (this.whitePieces[i].boardPosition.x == x && this.whitePieces[i].boardPosition.y == y) {
          this.whitePieces.splice(i, 1);
          return;
          // let elem = this.whitePieces.splice(i, 1);
          // console.log(elem + "is removed");
        }
      }

    }
    return;
  }

  generateAllMoves() {
    this.whiteMoves = [];
    this.blackMoves = [];

    for(let i = 0; i < this.whitePieces.length; i++) {
      let piece = this.whitePieces[i];
      piece.generatePossibleMoves();
      for(let j = 0; j < piece.possibleMoves.length; i++) {
        this.whiteMoves.push(piece.possibleMoves[i]);
      }
    }

    for(let i = 0; i < this.blackPieces.length; i++) {
      let piece = this.blackPieces[i];
      piece.generatePossibleMoves();
      for(let j = 0; j < piece.possibleMoves.length; i++) {
        this.blackMoves.push(piece.possibleMoves[i]);
      }
    }

  }

  checkGameEnd() {
    this.generateAllMoves();
    if(this.whiteMoves.length == 0 && turn) {
      return true;
    }
    else if(this.blackMoves.length == 0 && !turn) {
      return true;
    }

    let tarX = 0, tarY = 0;
    for(let i = 0; i < this.whitePieces.length; i++) {
        let piece = this.whitePieces[i];
        if(piece.pieceType == "King") {
            tarX = piece.boardPosition.x;
            tarY = piece.boardPosition.y;
        }
    }

    let whiteEnd = true;

    for(let i = 0; i < this.blackMoves.length && whiteEnd; i++) {
      if(this.blackMoves[i][0] == tarX && this.blackMoves[i][1] == tarY) {
        for(let j = 0; j < this.whitePieces.length && whiteEnd; j++) {
          let piece = this.whitePieces[i];
          piece.generatePossibleMoves();
          for(let k = 0; k < piece.possibleMoves.length && whiteEnd; k++) {
            if(piece.canMove(piece.possibleMoves[k][0], piece.possibleMoves[k][1])) {
              whiteEnd = false;
            }
          }
        }
      }
    }

    let BlackEnd = true;

    for(let i = 0; i < this.whiteMoves.length && BlackEnd; i++) {
      if(this.whiteMoves[i][0] == tarX && this.whiteMoves[i][1] == tarY) {
        for(let j = 0; j < this.blackPieces.length && BlackEnd; j++) {
          let piece = this.blackPieces[i];
          piece.generatePossibleMoves();
          for(let k = 0; k < piece.possibleMoves.length && BlackEnd; k++) {
            if(piece.canMove(piece.possibleMoves[k][0], piece.possibleMoves[k][1])) {
              BlackEnd = false;
            }
          }
        }
      }
    }

    if(turn && whiteEnd)  return 2;
    if(!turn && BlackEnd) return 3;

    return 0;
    
  }

}
