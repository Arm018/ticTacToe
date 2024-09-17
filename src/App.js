import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
    return (
        <button
            className="square"
            onClick={onSquareClick}
            style={{ backgroundColor: highlight ? 'yellow' : 'white' }}
        >
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        onPlay(nextSquares, i);
    }

    function renderSquare(i) {
        return (
            <Square
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                highlight={winningSquares && winningSquares.includes(i)}
            />
        );
    }

    const boardRows = [];
    for (let row = 0; row < 3; row++) {
        const squaresRow = [];
        for (let col = 0; col < 3; col++) {
            squaresRow.push(renderSquare(row * 3 + col));
        }
        boardRows.push(
            <div key={row} className="board-row">
                {squaresRow}
            </div>
        );
    }

    const winner = calculateWinner(squares)?.winner;
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if (squares.every(Boolean)) {
        status = 'It\'s a draw!';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <>
            <div className="status">{status}</div>
            {boardRows}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveLocation: null }]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove].squares;

    function handlePlay(nextSquares, lastMove) {
        const nextHistory = history.slice(0, currentMove + 1).concat([
            {
                squares: nextSquares,
                moveLocation: getMoveLocation(lastMove),
            },
        ]);
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    function toggleMoveOrder() {
        setIsAscending(!isAscending);
    }

    const winnerInfo = calculateWinner(currentSquares);
    const winningSquares = winnerInfo?.winningSquares || [];

    const moves = history.map((step, move) => {
        const description =
            move > 0
                ? `Go to move #${move} (${step.moveLocation.row}, ${step.moveLocation.col})`
                : 'Go to game start';
        return (
            <li key={move}>
                {move === currentMove ? (
                    <span>You are at move #{move}</span>
                ) : (
                    <button onClick={() => jumpTo(move)}>{description}</button>
                )}
            </li>
        );
    });

    if (!isAscending) {
        moves.reverse();
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningSquares={winningSquares} />
            </div>
            <div className="game-info">
                <button onClick={toggleMoveOrder}>
                    {isAscending ? 'Sort Descending' : 'Sort Ascending'}
                </button>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], winningSquares: [a, b, c] };
        }
    }
    return null;
}

function getMoveLocation(index) {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    return { row, col };
}
