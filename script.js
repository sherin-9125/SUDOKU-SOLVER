const gridContainer = document.getElementById("sudoku-grid");

// create grid
function createGrid() {
    gridContainer.innerHTML = "";
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement("input");
        cell.type = "number";
        cell.classList.add("cell");
        cell.min = 1;
        cell.max = 9;
        gridContainer.appendChild(cell);
    }
}

// get board from input cells
function getBoard() {
    const cells = document.querySelectorAll(".cell");
    const board = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const value = cells[i * 9 + j].value;
            row.push(value ? parseInt(value) : 0);
        }
        board.push(row);
    }
    return board;
}

// fill solved board into grid
function fillBoard(board) {
    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cells[i * 9 + j].value = board[i][j] !== 0 ? board[i][j] : "";
        }
    }
}

// reset grid
document.getElementById("reset").addEventListener("click", createGrid);

// solve sudoku — connect to Flask backend
document.getElementById("solve").addEventListener("click", async () => {
    const board = getBoard();

    try {
        const response = await fetch("http://127.0.0.1:5000/solve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ board }),
        });

        const data = await response.json();

        if (response.ok) {
            fillBoard(data.solution);
        } else {
            alert(data.error || "No solution found!");
        }
    } catch (error) {
        alert("Server error. Make sure Flask is running!");
        console.error(error);
    }
});

createGrid();
