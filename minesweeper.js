const board = document.querySelector('.board');
const title = document.querySelector('.title');
const cells = [];

const ROWS = 16;
const COLS = 16;
const BOMB_COUNT = 40;

let bombs = 0;

for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLS; j++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-row', i);
    cell.setAttribute('data-col', j);
    cells.push(cell);
    board.appendChild(cell);
  }
}


while (bombs < BOMB_COUNT) {
  const randomIndex = Math.floor(Math.random() * (ROWS * COLS));
  const cell = cells[randomIndex];
  if (!cell.classList.contains('bomb__planted')) {
    cell.classList.add('bomb__planted');
    bombs++;
  }
}


cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});

cells.forEach(cell => {
  cell.addEventListener('contextmenu', (e) => {
    handleRightButtonClick(e);
    cell.removeEventListener('contextmenu', handleDoubleRightButtonClick);
  }) 
});

function handleClick(e) {
  const cell = e.target;
  const isBomb = cell.classList.contains('bomb__planted');
  if (isBomb) {
    cell.classList.add('clicked', 'bomb')
    cell.textContent = '💣'
    cells.forEach(cell => {
      if (cell.classList.contains('bomb__planted') && !cell.classList.contains('clicked')) {
        cell.classList.add('clicked');
        cell.textContent = '💣'
      }
    });
    alert('Game over! Вы сможете начать игру заново через 3 секунды. Нажмите OK.');
    setTimeout(function(){
      location.reload();
    }, 3000);
  } else {
    cell.classList.add('clicked');
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));
    const neighborBombs = countNeighborBombs(row, col);
    if (neighborBombs === 0) {
      revealNeighborCells(row, col);
    } else {
      cell.textContent = neighborBombs;
    }
  }
}

function handleRightButtonClick (e) {
  const cell = e.target;
  if (cell.classList.contains('clicked', 'flagged')) {
    cell.classList.remove('clicked');
    cell.textContent = '';
  } 
  else {
    cell.textContent = '🚩';
    cell.classList.add('clicked', 'flagged');
  }
};

function countNeighborBombs(row, col) {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < ROWS && j >= 0 && j < COLS) {
        const index = i * COLS + j;
        const neighborCell = cells[index];
        if (neighborCell.classList.contains('bomb__planted')) {
          count++;
        }
      }
    }
  }
  return count;
}

function revealNeighborCells(row, col) {
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < ROWS && j >= 0 && j < COLS) {
        const index = i * COLS + j;
        const neighborCell = cells[index];
        if (!neighborCell.classList.contains('clicked')) {
          neighborCell.classList.add('clicked');
          const neighborBombs = countNeighborBombs(i, j);
          if (neighborBombs === 0) {
            revealNeighborCells(i, j);
          } 
          else {
            neighborCell.textContent = neighborBombs;
          }
        }
      }
    }
  }
}
