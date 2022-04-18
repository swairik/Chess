class Piece {
    // color : 0 -> black,      1 - > white
    
    constructor(i, j, pieceType, color, pic) {
        this.boardPosition = createVector(i, j);
        this.pixelPosition = createVector(this.boardPosition.x * w, this.boardPosition.y * w);
        this.pieceType = pieceType;
        this.color = color;
        this.movingThePiece = false;
        this.pic = pic;
        this.hasMoved = false;
        this.isAttacked = false;
        this.possibleMoves = [];             // stores the possible moves of the piece
    }
    
    show() {
        noStroke();
        textAlign("center");
        // fill(this.color ? 0 : 255);
        imageMode(CENTER);
        if(this.movingThePiece) {
            // text(this.pieceType, mouseX, mouseY);
            image(this.pic, mouseX, mouseY, w, w);
        }   
        else {
            // text(this.pieceType, this.pixelPosition.x + w / 2, this.pixelPosition.y + w / 2);
            image(this.pic, this.pixelPosition.x + w / 2, this.pixelPosition.y + w / 2, w, w);
            
        }
    }

    showPossibleMoves() {
        if(this.color == 0) {
            // black
            if(state.blackPieces[0].isAttacked && this.pieceType != "King") {
                return;
            }
        }
        else {
            // white
            if(state.whitePieces[0].isAttacked && this.pieceType != "King") {
                return;
            }
        }

        this.generatePossibleMoves();
        console.log("possible Moves : ");
        for(let i = 0; i < this.possibleMoves.length; i++) {
            console.log(this.possibleMoves[i][0], this.possibleMoves[i][1]);


            // NOT WORKING HERE  -- WHY ????
            fill(255, 0, 0);
            rect(this.possibleMoves[i][0] * w, this.possibleMoves[i][1] * w, w, w);


        }
        return true;
    }

    withinBounds(x, y) {
        if(x < 0 || x >= 8 || y < 0 || y >= 8) {
            return false;
        }
        return true;
    }

    canMove(x, y) {
        if(!this.withinBounds(x,y) || turn != this.color) {
            return false;
        }
        // checking if the position to move already has piece of same color
        let elementAtPosition = state.getElement(x, y);
        if(elementAtPosition && elementAtPosition.color == this.color) {
            // console.log("same color : ", elementAtPosition.boardPosition.x, elementAtPosition.boardPosition.y);
            return false;
        }

        // can only move if the position is in the possible moves list
        for(let i = 0; i < this.possibleMoves.length; i++) {
            if(this.possibleMoves[i][0] == x && this.possibleMoves[i][1] == y) {
                return true;
            }
        }
        return false;
    }

    move(i, j) {
        this.hasMoved = true;
        let elementAtPosition = state.getElement(i, j);
        console.log("found element at pos" + elementAtPosition);
        if(elementAtPosition) {
            state.removeElement(i, j, elementAtPosition.color)
        }
        this.boardPosition = createVector(i, j);
        this.pixelPosition = createVector(this.boardPosition.x * w, this.boardPosition.y * w);

        turn = !turn;

        this.getAttacking();
    }

}

class King extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.pieceType = "King";
        this.color = color;
        if(color) {
            this.pic = images[0];
        }
        else {
            this.pic = images[6];
        }
    }
    generatePossibleMoves() {
        this.possibleMoves = [];
        for(let j = -1; j <= 1; j++) {
            for(let i = -1; i <= 1; i++) {
                // console.log("i = ", this.boardPosition.x + i, " j = ", this.boardPosition.y + j);
                if(!this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                    continue;
                }
                if(!i && !j)    continue;
                else{
                    let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                    if(elementHere && elementHere.color == this.color) continue;
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                }
            }
        }
    }

    getAttacking() {

    }
}

class Queen extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.color = color;
        this.pieceType = "Queen";
        if(color) {
            this.pic = images[1];
        }
        else {
            this.pic = images[7];
        }
    }
    generatePossibleMoves() {
        this.possibleMoves = [];
        // rook moves
        let xdirs = [1, -1, 0, 0];
        let ydirs = [0, 0, -1, 1];

        for(let pos = 0; pos < 4; pos++) {
            let i = xdirs[pos], j = ydirs[pos];
            let idir = i;
            let jdir = j;

            while(this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                if(!elementHere) {
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                }
                else if(elementHere.color != this.color){
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                    break;
                }
                else {
                    break;
                }
                i += idir;
                j += jdir;
            }
        }

        // bishop moves
        xdirs = [1, 1, -1, -1];
        ydirs = [-1, 1, 1, -1];
        for(let pos = 0; pos < 4; pos++) {
            let i = xdirs[pos], j = ydirs[pos];
            let idir = i > 0 ? 1 : -1;
            let jdir = j > 0 ? 1 : -1;
            while(this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                if(!elementHere) {
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                }
                else if(elementHere.color != this.color){
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                    break;
                }
                else {
                    break;
                }
                i += idir;
                j += jdir;
            }
            
        }
    }

    getAttacking() {

    }
}

class Rook extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.color = color;
        this.pieceType = "Rook";
        if(color) {
            this.pic = images[4];
        }
        else {
            this.pic = images[10];
        }
    }
    generatePossibleMoves() {
        this.possibleMoves = [];

        let xdirs = [1, -1, 0, 0];
        let ydirs = [0, 0, -1, 1];

        for(let pos = 0; pos < 4; pos++) {
            let i = xdirs[pos], j = ydirs[pos];
            let idir = i;
            let jdir = j;

            while(this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                if(!elementHere) {
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                }
                else if(elementHere.color != this.color){
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                    break;
                }
                else {
                    break;
                }
                i += idir;
                j += jdir;
            }
        }
    }

    getAttacking() {
        // find which pices are attacking to implement concept of check
    }
}

class Bishop extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.color = color;
        this.pieceType = "Bishop";
        if(color) {
            this.pic = images[2];
        }
        else {
            this.pic = images[8];
        }
    }
    generatePossibleMoves() {
        this.possibleMoves = [];

        let xdirs = [1, 1, -1, -1];
        let ydirs = [-1, 1, 1, -1];
        for(let pos = 0; pos < 4; pos++) {
            let i = xdirs[pos], j = ydirs[pos];
            let idir = i > 0 ? 1 : -1;
            let jdir = j > 0 ? 1 : -1;
            while(this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                if(!elementHere) {
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                }
                else if(elementHere.color != this.color){
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                    break;
                }
                else {
                    break;
                }
                i += idir;
                j += jdir;
            }
            
        }
    }

    getAttacking() {

    }
}

class Knight extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.color = color;
        this.pieceType = "Knight";
        if(color) {
            this.pic = images[3];
        }
        else {
            this.pic = images[9];
        }
    }

    generatePossibleMoves() {
        this.possibleMoves = [];

        let xdirs = [-2, -2, -1, -1, 1, 1, 2, 2];
        let ydirs = [1, -1, 2, -2, 2, -2, 1, -1];

        for(let pos = 0; pos < 8; pos++) {
            let i = xdirs[pos], j = ydirs[pos];
            if(this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                if(!elementHere || elementHere.color != this.color){
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                }
            }
        }

    }
}

class Pawn extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.color = color;
        this.pieceType = "Pawn";
        if(color) {
            this.pic = images[5];
        }
        else {
            this.pic = images[11];
        }
    }
    generatePossibleMoves() {
        this.possibleMoves = [];

        let dir = this.color == 1 ? 1 : -1;

        let elementHere = state.getElement(this.boardPosition.x, this.boardPosition.y - (1 * dir));
        if(!elementHere) {
            this.possibleMoves.push([this.boardPosition.x, this.boardPosition.y - (1 * dir)]);
        }
        if(!this.hasMoved) {
            elementHere = state.getElement(this.boardPosition.x, this.boardPosition.y - (2 * dir));
            if(!elementHere) {
                this.possibleMoves.push([this.boardPosition.x, this.boardPosition.y - (2 * dir)]);
            }
        }
        // for capturing
        // if(this.hasMoved) {
            elementHere = state.getElement(this.boardPosition.x - (1 * dir), this.boardPosition.y - (1 * dir));
            if(elementHere && elementHere.color != this.color) {
                this.possibleMoves.push([this.boardPosition.x - (1 * dir), this.boardPosition.y - (1 * dir)]);
            }
            elementHere = state.getElement(this.boardPosition.x + (1 * dir), this.boardPosition.y - (1 * dir));
            if(elementHere && elementHere.color != this.color) {
                this.possibleMoves.push([this.boardPosition.x + (1 * dir), this.boardPosition.y - (1 * dir)]);
            }
            
        // }
    }

    getAttacking() {
        
    }
}


