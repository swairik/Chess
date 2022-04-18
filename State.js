class State {
    constructor() {
      this.whitePieces = [];
      this.blackPieces = [];
      this.color;     // 0 for black and 1 for white
  
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
      for(let i = 0; i < this.whitePieces.length; i++) {
        this.whitePieces[i].show();
      }
      for(let i = 0; i < this.blackPieces.length; i++) {
        this.blackPieces[i].show();
      }
      
    }

    getElement(x, y) {
      // white pieces
      for(let i = 0; i < this.whitePieces.length; i++) {
        if(this.whitePieces[i].boardPosition.x == x && this.whitePieces[i].boardPosition.y == y) {
          console.log("white piece found!!");
          return this.whitePieces[i];
        }
      }
      // black pieces
      for(let i = 0; i < this.blackPieces.length; i++) {
        if(this.blackPieces[i].boardPosition.x == x && this.blackPieces[i].boardPosition.y == y) {
          console.log("black piece found!!");
          return this.blackPieces[i];
        }
      }
      return null;
    }

    removeElement(x, y, color) {
      console.log("In the remove fn " + color);
      if(color == 0) {
        for(let i = 0; i < this.blackPieces.length; i++) {
          if(this.blackPieces[i].boardPosition.x == x && this.blackPieces[i].boardPosition.y == y) {
            this.blackPieces.splice(i, 1);
            return;
            // let elem = this.blackPieces.splice(i, 1);
            // console.log(elem + "is removed");
          }
        }
      }
      else if(color == 1) {
        // white
        for(let i = 0; i < this.blackPieces.length; i++) {
          if(this.whitePieces[i].boardPosition.x == x && this.whitePieces[i].boardPosition.y == y) {
            this.whitePieces.splice(i, 1);
            return;
            // let elem = this.whitePieces.splice(i, 1);
            // console.log(elem + "is removed");
          }
        }

      }
      return;
    }
  
  }
  