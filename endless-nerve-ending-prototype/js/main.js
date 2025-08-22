
// Simple 9x9 maze as HTML table
document.addEventListener('DOMContentLoaded', () => {
  // Remove old canvas if present
  const oldCanvas = document.getElementById('game');
  if (oldCanvas && oldCanvas.parentNode) oldCanvas.parentNode.removeChild(oldCanvas);
  const MAZE_ROWS = 12, MAZE_COLS = 12;
  const container = document.getElementById('maze-container') || (() => {
    const d = document.createElement('div');
    d.id = 'maze-container';
    document.body.appendChild(d);
    return d;
  })();

  function generateMaze(rows, cols) {
    const maze = Array.from({length: rows}, () => Array(cols).fill(0));
    const stack = [[0,0]];
    const dirs = [[0,-1],[1,0],[0,1],[-1,0]];
    while(stack.length) {
      const [x,y] = stack[stack.length-1];
      maze[y][x] |= 16; // visited
      const options = dirs
        .map(([dx,dy],i)=>[x+dx,y+dy,i])
        .filter(([nx,ny])=>nx>=0&&ny>=0&&nx<cols&&ny<rows&&!(maze[ny][nx]&16));
      if(options.length) {
        const [nx,ny,dir] = options[Math.floor(Math.random()*options.length)];
        maze[y][x] |= 1<<dir;
        maze[ny][nx] |= 1<<((dir+2)%4);
        stack.push([nx,ny]);
      } else stack.pop();
    }
    return maze.map(row=>row.map(cell=>cell&15));
  }

  // Render maze as HTML table
  function renderMaze(maze, player, exit) {
    let html = '<table style="border-collapse:collapse;">';
    for(let y=0; y<maze.length; ++y) {
      html += '<tr>';
      for(let x=0; x<maze[0].length; ++x) {
        let style = 'width:32px;height:32px;text-align:center;vertical-align:middle;';
        const cell = maze[y][x];
        if(!(cell&1)) style += 'border-top:3px solid #222;';
        if(!(cell&2)) style += 'border-right:3px solid #222;';
        if(!(cell&4)) style += 'border-bottom:3px solid #222;';
        if(!(cell&8)) style += 'border-left:3px solid #222;';
  // No background or color for player cell, just show emoji
        else if(x===exit.x && y===exit.y) style += 'background:#FFD700;color:#222;font-weight:bold;';
        html += `<td style="${style}">`;
  if(x===player.x && y===player.y) html += '🧑';
        else if(x===exit.x && y===exit.y) html += 'EXIT';
        else html += '&nbsp;';
        html += '</td>';
      }
      html += '</tr>';
    }
    html += '</table>';
    container.innerHTML = html;
  }

  // Initial state
  const maze = generateMaze(MAZE_ROWS, MAZE_COLS);
  const player = {x:0, y:0};
  const exit = {x:MAZE_COLS-1, y:MAZE_ROWS-1};
  renderMaze(maze, player, exit);

  // Keyboard controls for player movement
  function tryMove(dx, dy) {
    const {x, y} = player;
    const cell = maze[y][x];
    // Check for wall in the direction
    if(dx === 1 && !(cell & 2)) return; // right wall
    if(dx === -1 && !(cell & 8)) return; // left wall
    if(dy === 1 && !(cell & 4)) return; // bottom wall
    if(dy === -1 && !(cell & 1)) return; // top wall
    const nx = x + dx, ny = y + dy;
    if(nx < 0 || ny < 0 || nx >= MAZE_COLS || ny >= MAZE_ROWS) return;
    player.x = nx;
    player.y = ny;
    renderMaze(maze, player, exit);
    if(player.x === exit.x && player.y === exit.y) {
      setTimeout(() => alert('You reached the exit!'), 10);
    }
  }

  window.addEventListener('keydown', e => {
    if(e.repeat) return;
    switch(e.key.toLowerCase()) {
      case 'arrowup': case 'w': tryMove(0, -1); break;
      case 'arrowdown': case 's': tryMove(0, 1); break;
      case 'arrowleft': case 'a': tryMove(-1, 0); break;
      case 'arrowright': case 'd': tryMove(1, 0); break;
    }
  });
});
