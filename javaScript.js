let gameGrid = [];
let selectedCellId = '';

function createGame() {
    createGrid();
    createKeyBoard();
}

function createGrid() {
    let startBoard = document.getElementById('gameBoard');
    for (let i = 0; i < 9; ++i) {
        gameGrid[i] = [];
        for (let j = 0; j < 9; ++j) {
            gameGrid[i][j] = 0;
        }
    }

    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            let cellId = i * 9 + j;
            createCells(cellId, startBoard);
        }

        let br = document.createElement('br');
        startBoard.appendChild(br);
    }

    for (let i = 2; i < 81; i += 3) {
        document.getElementById(i).classList.add('rightBorder');
    }

    for (let i = 8; i < 81; i += 9) {
        document.getElementById(i).classList.remove('rightBorder');
    }

    for (let i = 18; i < 46; i += 27) {
        for (let j = 0; j < 9; ++j) {
            document.getElementById(i + j).classList.add('bottomBorder');
        }
    }
    randomFirstLine();

    for (let i = 1; i < 9; ++i) {
        if (i !== 3 && i !== 6) {
            switch3Left(i);
        } else {
            switch1Left(i);
        }
    }

    for (let i = 0; i < 47; ++i) {
        let randomLine = Math.floor(Math.random() * 9);
        let randomCol = Math.floor(Math.random() * 9);
        while (gameGrid[randomLine][randomCol] === 0) {
            randomLine = Math.floor(Math.random() * 9);
            randomCol = Math.floor(Math.random() * 9);
        }
        gameGrid[randomLine][randomCol] = 0;
    }

    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            if (gameGrid[i][j] !== 0) {
                document.getElementById(i * 9 + j).innerHTML = gameGrid[i][j];
                document.getElementById(i * 9 + j).classList.add('initialCell');
            }
        }
    }

}

function createKeyBoard() {
    for (let i = 1; i <= 9; ++i) {
        let startBoard = document.getElementById('keyboard');
        let keyboardButton = document.createElement('BUTTON');
        let id = 100 + i;

        startBoard.appendChild(keyboardButton);
        keyboardButton.setAttribute('id', id);
        keyboardButton.setAttribute('class', 'keyboardButton');
        if (i <= 9) {
            keyboardButton.setAttribute('onclick', 'placeNumber(this.id)');

            document.getElementById(id).innerHTML = i;
        }

        if (i === 10) {
            keyboardButton.setAttribute('onclick', 'eraseNumber(this.id)');
            document.getElementById(id).innerHTML = '<i class="fas fa-eraser"></i>';
        }
    }
}

function randomFirstLine() {
    for (let i = 0; i < 9; ++i) {
        gameGrid[0][i] = i + 1;
    }

    for (let i = 8; i > 0; --i) {
        let j = Math.floor(Math.random() * (i + 1));
        let auxiliar = gameGrid[0][i];
        gameGrid[0][i] = gameGrid[0][j];
        gameGrid[0][j] = auxiliar;
    }
}

function switch1Left(line) {
    for (let i = 0; i < 8; ++i) {
        gameGrid[line][i] = gameGrid[line - 1][i + 1];
    }

    gameGrid[line][8] = gameGrid[line - 1][0];
}

function switch3Left(line) {
    for (let i = 0; i < 6; ++i) {
        gameGrid[line][i] = gameGrid[line - 1][i + 3];
    }

    for (let i = 0; i < 3; ++i) {
        gameGrid[line][i + 6] = gameGrid[line - 1][i];
    }
}

function createCells(cellId, startBoard) {
    let cell = document.createElement('BUTTON');
    startBoard.appendChild(cell);
    cell.setAttribute('class', 'puzzleCell');
    cell.setAttribute('id', cellId);
    cell.setAttribute('onclick', 'selectCell(this.id)');
}

function selectCell(clickedCellId) {
    if (!(document.getElementById(clickedCellId).classList.contains('initialCell'))) {
        if (selectedCellId === '') {
            document.getElementById(clickedCellId).classList.add('selectedCell');
            selectedCellId = clickedCellId;
        } else if (selectedCellId === clickedCellId) {
            document.getElementById(clickedCellId).classList.remove('selectedCell');
            selectedCellId = '';
        } else if (selectedCellId !== clickedCellId) {
            document.getElementById(selectedCellId).classList.remove('selectedCell');
            document.getElementById(clickedCellId).classList.add('selectedCell');
            selectedCellId = clickedCellId;
        }
    }
}

function placeNumber(keyboardButtonId) {

    let selectedCell = document.getElementsByClassName('selectedCell');
    let line = parseInt(selectedCell[0].id / 9);
    let column = selectedCell[0].id - line * 9;
    console.log(line + column);
    if (selectedCell.length !== 0) {
        selectedCell[0].innerHTML = keyboardButtonId % 10;
        gameGrid[line][column] = parseInt(selectedCell[0].innerHTML);
    }

    notInLine(gameGrid, line, column);
    notInCol(gameGrid, line, column);
    notInBox(gameGrid, line, column, line - line % 3, column - column % 3);
}

function eraseNumber(keyboardButtonId) {
    let selectedCell = document.getElementsByClassName('selectedCell');

    let line = parseInt(selectedCell[0].id / 9);
    let column = selectedCell[0].id - line * 9;

    if (selectedCell.length !== 0) {
        selectedCell[0].innerHTML = '';
        gameGrid[line][column] = 0;
    }

    notInLine(gameGrid, line, column);
    notInCol(gameGrid, line, column);
    notInBox(gameGrid, line, column, line - line % 3, column - column % 3);
}

function notInLine(gameGrid, line, column) {
    let st = new Set();
    if (gameGrid[line][column] !== 0) {
        st.add(gameGrid[line][column]);
    }

    for (let i = 0; i < 9; ++i) {
        if (i !== column) {
            if (st.has(gameGrid[line][i])) {
                document.getElementById(line * 9 + i).style.color = 'red';
                document.getElementById(line * 9 + i).style.fontWeight = 'bold';
                return false;
            }
        }
        if (gameGrid[line][i] !== 0) {
            st.add(gameGrid[line][i]);
        }
    }

    for (let i = 0; i < 9; ++i) {
        document.getElementById(line * 9 + i).style.color = 'black';
    }
    return true;
}

function notInCol(gameGrid, line, column) {
    let st = new Set();
    if (gameGrid[line][column] !== 0) {
        st.add(gameGrid[line][column]);
    }

    for (let i = 0; i < 9; ++i) {
        if (i !== line) {
            if (st.has(gameGrid[i][column])) {
                document.getElementById(i * 9 + column).style.color = 'red';
                document.getElementById(i * 9 + column).style.fontWeight = 'bold';
                return false;
            }
        }

        if (gameGrid[i][column] !== 0) {
            st.add(gameGrid[i][column]);
        }
    }

    for (let i = 0; i < 9; ++i) {
        document.getElementById(i * 9 + column).style.color = 'black';
    }

    return true;
}

function notInBox(gameGrid, line, column, startLine, startColumn) {
    let st = new Set();
    if (gameGrid[line][column] !== 0) {
        st.add(gameGrid[line][column]);
    }

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            let currentElement = gameGrid[i + startLine][j + startColumn];
            if (i + startLine !== line || j + startColumn !== column) {
                if (st.has(currentElement)) {
                    document.getElementById((i + startLine) * 9 + (j + startColumn)).style.color = 'red';
                    document.getElementById((i + startLine) * 9 + (j + startColumn)).style.fontWeight = 'bold';
                    console.log(st);
                    return false;
                }
            }

            if (currentElement !== 0) {
                st.add(currentElement);
            }
        }
    }

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            document.getElementById((i + startLine) * 9 + (j + startColumn)).style.color = 'black';
        }
    }

    return true;
}
