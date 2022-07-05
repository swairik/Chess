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
        this.castle = [];
    }

    show() {
        noStroke();
        textAlign("center");
        // fill(this.color ? 0 : 255);
        imageMode(CENTER);
        if (this.movingThePiece) {
            // text(this.pieceType, mouseX, mouseY);
            image(this.pic, mouseX, mouseY, w, w);
        }
        else {
            // text(this.pieceType, this.pixelPosition.x + w / 2, this.pixelPosition.y + w / 2);
            image(this.pic, this.pixelPosition.x + w / 2, this.pixelPosition.y + w / 2, w, w);

        }
    }

    showPossibleMoves() {
        if (this.color == 0) {
            // black
            if (state.blackPieces[0].isAttacked && this.pieceType != "King") {
                return;
            }
        }
        else {
            // white
            if (state.whitePieces[0].isAttacked && this.pieceType != "King") {
                return;
            }
        }

        this.generatePossibleMoves(false);
        console.log("possible Moves : ");
        for (let i = 0; i < this.possibleMoves.length; i++) {
            console.log(this.possibleMoves[i][0], this.possibleMoves[i][1]);

        }
        return true;
    }

    withinBounds(x, y) {
        if (x < 0 || x >= 8 || y < 0 || y >= 8) {
            return false;
        }
        return true;
    }

    canMove(x, y, futureCheck) {
        if (!this.withinBounds(x, y) || turn != this.color) {
            return false;
        }
        // checking if the position to move already has piece of same color
        let elementAtPosition = state.getElement(x, y);
        if (elementAtPosition && elementAtPosition.color == this.color) {
            // console.log("same color : ", elementAtPosition.boardPosition.x, elementAtPosition.boardPosition.y);
            return false;
        }
        let present = false;
        // can only move if the position is in the possible moves list
        for (let i = 0; i < this.possibleMoves.length; i++) {
            if (this.possibleMoves[i][0] == x && this.possibleMoves[i][1] == y) {
                present = true;
                break;
            }
        }

        if (!present) return false;
        let possible = true;

        // check concept implemented here
        // trying to create a future board and then checking if it is possible to move there
        let newState = new State();

        if(futureCheck == null) {
            newState.whitePieces = [];
            newState.blackPieces = [];
            for (let i = 0; i < state.whitePieces.length; i++) {
                newState.whitePieces.push(state.whitePieces[i]);
            }
            for (let i = 0; i < state.blackPieces.length; i++) {
                newState.blackPieces.push(state.blackPieces[i]);
            }
            this.move(currX, currY, newState);
    
            // console.log(state.getElement(currX, currY));
            // console.log(newState.getElement(currX, currY));

        }

        if (futureCheck == false) {
            if (this.color == 1) {
                let tarX = 0, tarY = 0;
                for(let i = 0; i < newState.whitePieces.length; i++) {
                    let p = newState.whitePieces[i];
                    if(p.pieceType == "King") {
                        tarX = p.boardPosition.x;
                        tarY = p.boardPosition.y;
                    }
                }
                // check for black
                for (let i = 0; i < newState.blackPieces.length; i++) {
                    let piece = newState.blackPieces[i];
                    if (piece.canMove(tarX, tarY, false)) {
                        possible = false;
                    }
                }
            }
            else {
                let tarX = 0, tarY = 0;
                for(let i = 0; i < newState.blackPieces.length; i++) {
                    let p = newState.blackPieces[i];
                    if(p.pieceType == "King") {
                        tarX = p.boardPosition.x;
                        tarY = p.boardPosition.y;
                    }
                }

                for (let i = 0; i < newState.whitePieces.length; i++) {
                    let piece = newState.whitePieces[i];
                    if (piece.canMove(tarX, tarY, false)) {
                        possible = false;
                    }
                }
            }
        }

        return possible && present;
    }

    move(i, j, currState) {
        this.hasMoved = true;

        for (let x = 0; x < this.castle.length; x += 2) {
            if (x == this.castle[x][0] && j == this.castle[x][1]) {
                let xpos = this.castle[x][0];
                let ypos = this.castle[x][1];
                this.boardPosition = createVector(xpos, ypos);
                this.pixelPosition = createVector(this.boardPosition.x * w, this.boardPosition.y * w);

                xpos = this.castle[x + 1][0];
                ypos = this.castle[x + 1][1];
                let rook = currState.getElement(xpos, ypos);

                rook.boardPosition = createVector(xpos, ypos);
                rook.pixelPosition = createVector(rook.boardPosition.x * w, rook.boardPosition.y * w);

                this.castle = [];
                this.hasMoved = true;
                rook.hasMoved = true;

                turn = !turn;

                return;
            }
        }

        let elementAtPosition = currState.getElement(i, j);
        console.log("found element at pos" + elementAtPosition);
        if (elementAtPosition) {
            currState.removeElement(i, j, elementAtPosition.color)
        }
        this.boardPosition = createVector(i, j);
        this.pixelPosition = createVector(this.boardPosition.x * w, this.boardPosition.y * w);

        this.castle = [];

        turn = !turn;
    }

}

class King extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.pieceType = "King";
        this.color = color;
        if (color) {
            this.pic = images[0];
        }
        else {
            this.pic = images[6];
        }
    }
    generatePossibleMoves() {
        this.possibleMoves = [];
        for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
                console.log("i = ", this.boardPosition.x + i, " j = ", this.boardPosition.y + j);
                if (!this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                    continue;
                }
                if (!i && !j) continue;

                else {
                    let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                    if (elementHere && elementHere.color == this.color) continue;
                    let currX = this.boardPosition.x + i;
                    let currY = this.boardPosition.y + j;


                    this.possibleMoves.push([currX, currY]);
                }
            }
        }

        if (color == 1) {
            // white
            if (!this.hasMoved && state.getElement(6, 7) == null && state.getElement(5, 7) == null && state.getElement(7, 7) != null && !state.getElement(7, 7).hasMoved) {
                this.castle.push([6, 7]);
                this.castle.push([5, 7]);
                this.possibleMoves.push([6, 7]);
            }

            if (!this.hasMoved && state.getElement(2, 7) == null && state.getElement(1, 7) == null && state.getElement(3, 7) == null && state.getElement(0, 7) != null && !state.getElement(0, 7).hasMoved) {
                this.castle.push([2, 7]);
                this.castle.push([3, 7]);
                this.possibleMoves.push([2, 7]);
            }

        }

        else {
            // black
            if (!this.hasMoved && state.getElement(6, 0) == null && state.getElement(5, 0) == null && state.getElement(7, 0) != null && !state.getElement(7, 0).hasMoved) {
                this.castle.push([6, 0]);
                this.castle.push([5, 0]);
                this.possibleMoves.push([6, 0]);
            }

            if (!this.hasMoved && state.getElement(2, 0) == null && state.getElement(1, 0) == null && state.getElement(3, 0) == null && state.getElement(0, 0) != null && !state.getElement(0, 0).hasMoved) {
                this.castle.push([2, 0]);
                this.castle.push([3, 0]);
                this.possibleMoves.push([2, 0]);
            }

        }

    }

}

class Queen extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.color = color;
        this.pieceType = "Queen";
        if (color) {
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

        for (let pos = 0; pos < 4; pos++) {
            let i = xdirs[pos], j = ydirs[pos];
            let idir = i;
            let jdir = j;

            while (this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                if (!elementHere) {
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                }
                else if (elementHere.color != this.color) {
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
        for (let pos = 0; pos < 4; pos++) {
            let i = xdirs[pos], j = ydirs[pos];
            let idir = i > 0 ? 1 : -1;
            let jdir = j > 0 ? 1 : -1;
            while (this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                if (!elementHere) {
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                }
                else if (elementHere.color != this.color) {
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
        return this.possibleMoves;
    }

}

class Rook extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.color = color;
        this.pieceType = "Rook";
        if (color) {
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

        for (let pos = 0; pos < 4; pos++) {
            let i = xdirs[pos], j = ydirs[pos];
            let idir = i;
            let jdir = j;

            while (this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                if (!elementHere) {
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                }
                else if (elementHere.color != this.color) {
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
        return this.possibleMoves;
    }

}

class Bishop extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.color = color;
        this.pieceType = "Bishop";
        if (color) {
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
        for (let pos = 0; pos < 4; pos++) {
            let i = xdirs[pos], j = ydirs[pos];
            let idir = i > 0 ? 1 : -1;
            let jdir = j > 0 ? 1 : -1;
            while (this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                if (!elementHere) {
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                }
                else if (elementHere.color != this.color) {
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
        return this.possibleMoves;
    }

}

class Knight extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.color = color;
        this.pieceType = "Knight";
        if (color) {
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

        for (let pos = 0; pos < 8; pos++) {
            let i = xdirs[pos], j = ydirs[pos];
            if (this.withinBounds(this.boardPosition.x + i, this.boardPosition.y + j)) {
                let elementHere = state.getElement(this.boardPosition.x + i, this.boardPosition.y + j);
                if (!elementHere || elementHere.color != this.color) {
                    this.possibleMoves.push([this.boardPosition.x + i, this.boardPosition.y + j]);
                }
            }
        }
        return this.possibleMoves;
    }
}

class Pawn extends Piece {
    constructor(x, y, color) {
        super(x, y, color);
        this.color = color;
        this.pieceType = "Pawn";
        if (color) {
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
        if (!elementHere) {
            this.possibleMoves.push([this.boardPosition.x, this.boardPosition.y - (1 * dir)]);
        }
        if (!this.hasMoved) {
            elementHere = state.getElement(this.boardPosition.x, this.boardPosition.y - (2 * dir));
            if (!elementHere) {
                this.possibleMoves.push([this.boardPosition.x, this.boardPosition.y - (2 * dir)]);
            }
        }
        // for capturing
        // if(this.hasMoved) {
        elementHere = state.getElement(this.boardPosition.x - (1 * dir), this.boardPosition.y - (1 * dir));
        if (elementHere && elementHere.color != this.color) {
            this.possibleMoves.push([this.boardPosition.x - (1 * dir), this.boardPosition.y - (1 * dir)]);
        }
        elementHere = state.getElement(this.boardPosition.x + (1 * dir), this.boardPosition.y - (1 * dir));
        if (elementHere && elementHere.color != this.color) {
            this.possibleMoves.push([this.boardPosition.x + (1 * dir), this.boardPosition.y - (1 * dir)]);
        }

        // }
        return this.possibleMoves;
    }

}


