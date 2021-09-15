const allCells = document.querySelectorAll(".cell:not(.row-top)");
const topCells = document.querySelectorAll(".cell.row-top");
const resetButton = document.querySelector(".reset");
const pvaiButton = document.querySelector(".PvsAI");
const pvpButton = document.querySelector(".PvP");
const statusSpan = document.querySelector(".status");

// columns
const column0 = [
  allCells[35],
  allCells[28],
  allCells[21],
  allCells[14],
  allCells[7],
  allCells[0],
  topCells[0],
];
const column1 = [
  allCells[36],
  allCells[29],
  allCells[22],
  allCells[15],
  allCells[8],
  allCells[1],
  topCells[1],
];
const column2 = [
  allCells[37],
  allCells[30],
  allCells[23],
  allCells[16],
  allCells[9],
  allCells[2],
  topCells[2],
];
const column3 = [
  allCells[38],
  allCells[31],
  allCells[24],
  allCells[17],
  allCells[10],
  allCells[3],
  topCells[3],
];
const column4 = [
  allCells[39],
  allCells[32],
  allCells[25],
  allCells[18],
  allCells[11],
  allCells[4],
  topCells[4],
];
const column5 = [
  allCells[40],
  allCells[33],
  allCells[26],
  allCells[19],
  allCells[12],
  allCells[5],
  topCells[5],
];
const column6 = [
  allCells[41],
  allCells[34],
  allCells[27],
  allCells[20],
  allCells[13],
  allCells[6],
  topCells[6],
];
const columns = [column0, column1, column2, column3, column4, column5, column6];

// rows
const topRow = [
  topCells[0],
  topCells[1],
  topCells[2],
  topCells[3],
  topCells[4],
  topCells[5],
  topCells[6],
];
const row0 = [
  allCells[0],
  allCells[1],
  allCells[2],
  allCells[3],
  allCells[4],
  allCells[5],
  allCells[6],
];
const row1 = [
  allCells[7],
  allCells[8],
  allCells[9],
  allCells[10],
  allCells[11],
  allCells[12],
  allCells[13],
];
const row2 = [
  allCells[14],
  allCells[15],
  allCells[16],
  allCells[17],
  allCells[18],
  allCells[19],
  allCells[20],
];
const row3 = [
  allCells[21],
  allCells[22],
  allCells[23],
  allCells[24],
  allCells[25],
  allCells[26],
  allCells[27],
];
const row4 = [
  allCells[28],
  allCells[29],
  allCells[30],
  allCells[31],
  allCells[32],
  allCells[33],
  allCells[34],
];
const row5 = [
  allCells[35],
  allCells[36],
  allCells[37],
  allCells[38],
  allCells[39],
  allCells[40],
  allCells[41],
];
const rows = [row0, row1, row2, row3, row4, row5, topRow];

const ROW_COUNT = 6;
const COLUMN_COUNT = 7;

// !Functions

function matrix(m, n) {
  var result = [];
  for (var i = 0; i < m; i++) {
    result.push(new Array(n).fill(0));
  }
  return result;
}

function create_board() {
  return matrix(ROW_COUNT, COLUMN_COUNT);
}

function update_board() {}

function drop_piece(board, row, col, piece) {
  board[row][col] = piece;
}

function is_valid_location(board, col) {
  return board[5][col] == 0;
}

function get_next_open_row(board, col) {
  for (r = 0; r < ROW_COUNT; r++) {
    if (board[r][col] == 0) {
      return r;
    }
  }
}

function print_board(board) {
  for (r = 1; r <= ROW_COUNT; r++) {
    console.log(JSON.stringify(board[ROW_COUNT - r]));
  }
}

function getClassListArray(cell) {
  const classList = cell.classList;
  return [...classList];
}

function getCellLocation(cell) {
  const classList = getClassListArray(cell);
  const rowClass = classList.find((className) => className.includes("row"));
  const colClass = classList.find((className) => className.includes("col"));
  const rowIndex = rowClass[4];
  const colIndex = colClass[4];

  return [parseInt(rowIndex, 10), parseInt(colIndex, 10)];
}

function getFirstOpenCellForColumn(colIndex) {
  const column = columns[colIndex];
  const columnWithoutTop = column.slice(0, 6);

  for (const cell of columnWithoutTop) {
    const classList = getClassListArray(cell);
    if (!classList.includes("yellow") && !classList.includes("red")) {
      return cell;
    }
  }

  return null;
}

function clearTop(colIndex) {
  const topCell = topCells[colIndex];
  topCell.classList.remove("yellow");
  topCell.classList.remove("red");
}

function isWinningMove(board, piece) {
  // ? horizontal
  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 0; r < ROW_COUNT; r++) {
      if (
        board[r][c] == piece &&
        board[r][c + 1] == piece &&
        board[r][c + 2] == piece &&
        board[r][c + 3] == piece
      ) {
        return true;
      }
    }
  }

  // ? vertical
  for (let c = 0; c < COLUMN_COUNT; c++) {
    for (let r = 0; r < ROW_COUNT - 3; r++) {
      if (
        board[r][c] == piece &&
        board[r + 1][c] == piece &&
        board[r + 2][c] == piece &&
        board[r + 3][c] == piece
      ) {
        return true;
      }
    }
  }

  // ? Positively sloped diagonal
  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 0; r < ROW_COUNT - 3; r++) {
      if (
        board[r][c] == piece &&
        board[r + 1][c + 1] == piece &&
        board[r + 2][c + 2] == piece &&
        board[r + 3][c + 3] == piece
      ) {
        return true;
      }
    }
  }

  // ? Negatively sloped diagonal
  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 3; r < ROW_COUNT; r++) {
      if (
        board[r][c] == piece &&
        board[r - 1][c + 1] == piece &&
        board[r - 2][c + 2] == piece &&
        board[r - 3][c + 3] == piece
      ) {
        return true;
      }
    }
  }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getOccurrence(array, value) {
  return array.filter((v) => v === value).length;
}

function getCol(matrix, col) {
  var column = [];
  for (var i = 0; i < matrix.length; i++) {
    column.push(matrix[i][col]);
  }
  return column;
}

function evaluate_window(window, piece) {
  let score = 0;
  if (getOccurrence(window, piece) == 4) {
    score += 100;
  } else if (
    getOccurrence(window, piece) == 3 &&
    getOccurrence(window, 0) == 1
  ) {
    score += 5;
  } else if (
    getOccurrence(window, piece) == 2 &&
    getOccurrence(window, 0) == 2
  ) {
    score += 2;
  }

  if (getOccurrence(window, 1) == 3 && getOccurrence(window, 0) == 1) {
    score -= 80;
  }

  return score;
}

function score_position(board, piece) {
  let score = 0;

  //Center column (more oportunities por AI)
  let center_array = getCol(board, COLUMN_COUNT / 2);
  let center_count = getOccurrence(center_array, piece);
  score += center_count * 3;
  //Horizontal
  for (let r = 0; r < ROW_COUNT; r++) {
    row_array = board[r];
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      let window = row_array.slice(c, c + 4);
      score += evaluate_window(window, piece);
    }
  }

  //Vertical
  for (let c = 0; c < COLUMN_COUNT; c++) {
    col_array = getCol(board, c);
    //print_board(board);
    for (let r = 0; r < ROW_COUNT - 3; r++) {
      let window = col_array.slice(r, r + 4);
      score += evaluate_window(window, piece);
    }
  }

  //Positive slope
  for (let r = 0; r < ROW_COUNT - 3; r++) {
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      let window = [
        board[r][c],
        board[r + 1][c + 1],
        board[r + 2][c + 2],
        board[r + 3][c + 3],
      ];
      score += evaluate_window(window, piece);
    }
  }

  //Negative slope
  for (let r = 0; r < ROW_COUNT - 3; r++) {
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      let window = [
        board[r + 3][c],
        board[r + 2][c + 1],
        board[r + 1][c + 2],
        board[r][c + 3],
      ];
      score += evaluate_window(window, piece);
    }
  }

  return score;
}

function get_valid_locations(board) {
  let valid_locations = [];
  for (let c = 0; c < COLUMN_COUNT; c++) {
    if (is_valid_location(board, c)) {
      valid_locations.push(c);
    }
  }
  return valid_locations;
}

function pick_best_move(board, piece) {
  valid_locations = get_valid_locations(board);
  let best_score = 0;
  best_col =
    valid_locations[Math.floor(Math.random() * valid_locations.length)];
  for (let c = 0; c < valid_locations.length; c++) {
    let c_col = valid_locations[c];
    let temp_board = JSON.parse(JSON.stringify(board));
    row = get_next_open_row(temp_board, c_col);
    drop_piece(temp_board, row, c_col, piece);
    //print_board(temp_board);
    score = score_position(temp_board, piece);
    if (score > best_score) {
      best_score = score;
      best_col = c_col;
    }
  }
  return best_col;
}

function is_terminal_node(board) {
  return (
    isWinningMove(board, PLAYER_PIECE) ||
    isWinningMove(board, AI_PIECE) ||
    get_valid_locations(board).length == 0
  );
}

//!Arreglar algoritmo
function minimax(board, depth, maximizingPlayer) {
  var valid_locations = get_valid_locations(board);
  var is_terminal = is_terminal_node(board);
  if (depth == 0 || is_terminal) {
    if (is_terminal) {
      if (isWinningMove(board, AI_PIECE)) {
        return [null, 1000000000];
      } else if (isWinningMove(board, PLAYER_PIECE)) {
        return [null, -1000000000];
      } else {
        return [null, 0];
      }
    } else {
      return [null, score_position(board, AI_PIECE)];
    }
  }
  if (maximizingPlayer) {
    var value = -Infinity;
    var columnNow =
      valid_locations[Math.floor(Math.random() * valid_locations.length)];
    for (let c = 0; c < valid_locations.length; c++) {
      var c_col = valid_locations[c];
      row = get_next_open_row(board, c_col);
      var b_copy = JSON.parse(JSON.stringify(board));
      drop_piece(b_copy, row, c_col, AI_PIECE);
      var new_score = minimax(b_copy, depth - 1, false)[1];
      if (new_score > value) {
        value = new_score;
        columnNow = c_col;
      }
    }
    return [columnNow, value];
  } else {
    value = Infinity;
    var columnNow =
      valid_locations[Math.floor(Math.random() * valid_locations.length)];
    for (let c = 0; c < valid_locations.length; c++) {
      var c_col = valid_locations[c];
      row = get_next_open_row(board, c_col);
      var b_copy = JSON.parse(JSON.stringify(board));
      drop_piece(b_copy, row, c_col, PLAYER_PIECE);
      var new_score = minimax(b_copy, depth - 1, true)[1];
      if (new_score > value) {
        value = new_score;
        column = c_col;
      }
    }
    return [columnNow, value];
  }
}

//!-------------------------------handlers-------------------------------------
function handleCellMouseOver(e) {
  const cell = e.target;
  const [rowIndex, colIndex] = getCellLocation(cell);

  const topCell = topCells[colIndex];

  topCell.classList.add(yellowIsNext ? "yellow" : "red");
}

function handleCellMouseOut(e) {
  const cell = e.target;
  const [rowIndex, colIndex] = getCellLocation(cell);

  clearTop(colIndex);
}

function handleCellMouseClick(e) {
  if (game_over) return;
  const cell = e.target;
  const [rowIndex, colIndex] = getCellLocation(cell);

  const openCell = getFirstOpenCellForColumn(colIndex);

  if (!openCell) return;

  openCell.classList.add(yellowIsNext ? "yellow" : "red");

  let rowMatrix = get_next_open_row(connect_board, colIndex);
  drop_piece(connect_board, rowMatrix, colIndex, yellowIsNext ? 2 : 1);

  if (isWinningMove(connect_board, yellowIsNext ? 2 : 1)) {
    game_over = true;
    statusSpan.textContent = yellowIsNext ? "Yellow has won!" : "Red has won!";
  }

  yellowIsNext = !yellowIsNext;

  if (againstAI && !game_over) {
    let colIndex;
    let openCell;
    do {
      //colIndex = getRndInteger(0, COLUMN_COUNT - 1);
      //colIndex = pick_best_move(connect_board, 2);
      [colIndex, score] = minimax(connect_board, 4, true);
      console.log(colIndex);
      openCell = getFirstOpenCellForColumn(colIndex);
    } while (!openCell);

    openCell.classList.add(yellowIsNext ? "yellow" : "red");

    let rowMatrix = get_next_open_row(connect_board, colIndex);
    drop_piece(connect_board, rowMatrix, colIndex, yellowIsNext ? 2 : 1);

    if (isWinningMove(connect_board, yellowIsNext ? 2 : 1)) {
      game_over = true;
      statusSpan.textContent = yellowIsNext
        ? "Yellow has won!"
        : "Red has won!";
    }

    yellowIsNext = !yellowIsNext;
  }

  clearTop(colIndex);

  const topCell = topCells[colIndex];
  topCell.classList.add(yellowIsNext ? "yellow" : "red");
}

function handleResetClick(e) {
  for (const row of rows) {
    for (const cell of row) {
      cell.classList.remove("red");
      cell.classList.remove("yellow");
      cell.classList.remove("win");
    }
  }
  game_over = false;
  connect_board = create_board();
  statusSpan.textContent = "";
  yellowIsNext = 0;
}

function handleAiClick(e) {
  handleResetClick(e);
  againstAI = 1;
  pvpButton.disabled = false;
  pvaiButton.disabled = true;
}

function handlePvpClick(e) {
  handleResetClick(e);
  againstAI = 0;
  pvaiButton.disabled = false;
  pvpButton.disabled = true;
}

// !-------------------------Program---------------------------------------------

let game_over = false;
let yellowIsNext = 0;
let connect_board = create_board();
let againstAI = 1;
let PLAYER_PIECE = 1;
let AI_PIECE = 2;

for (const row of rows) {
  for (const cell of row) {
    cell.addEventListener("mouseover", handleCellMouseOver);
    cell.addEventListener("mouseout", handleCellMouseOut);
    cell.addEventListener("click", handleCellMouseClick);
  }
}

resetButton.addEventListener("click", handleResetClick);
pvaiButton.addEventListener("click", handleAiClick);
pvpButton.addEventListener("click", handlePvpClick);
