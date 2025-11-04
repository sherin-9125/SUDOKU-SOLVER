from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def is_valid(board, row, col, num):
    for i in range(9):
        if board[row][i] == num or board[i][col] == num:
            return False

    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(start_row, start_row + 3):
        for j in range(start_col, start_col + 3):
            if board[i][j] == num:
                return False
    return True

def solve(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                for num in range(1, 10):
                    if is_valid(board, row, col, num):
                        board[row][col] = num
                        if solve(board):
                            return True
                        board[row][col] = 0
                return False
    return True

@app.route("/solve", methods=["POST"])
def solve_sudoku():
    data = request.get_json()
    board = data.get("board")
    if not board:
        return jsonify({"error": "No board provided"}), 400

    if solve(board):
        return jsonify({"solution": board})
    else:
        return jsonify({"error": "No solution found"}), 400

if __name__ == "__main__":
    app.run(debug=True)
