let canvas = null;
const mazeWidth = 600;
const mazeHeight = 600;

function Cell(x, y, size, walls) {
  this._x = x;
  this._y = y;
  this._size = size;
  this._visited = false;
  this._walls = walls
  this._cameFrom = null;
  this._fCost = 0;
  this._gCost = 0;
  this._hCost = 0;

  this.fCost = () => this._fCost
  this.gCost = () => this._gCost
  this.hCost = () => this._hCost

  this.cameFrom = () => this._cameFrom;

  this.setCameFrom = (cell) => {
    this._cameFrom = cell;
  }

  this.replaceFCost = (cost) => {
    this._FCost = cost;
  }

  this.replaceGCost = (cost) => {
    this._gCost = cost;
  }

  this.replaceHCost = (cost) => {
    this._hCost = cost;
  }
  
  this.visit = () => {
    this._visited = true;
  }

  this.x = () => this._x;
  this.y = () => this._y;
  this.wasVisited = () => this._visited;
  this.removeWall = (wall) => {
    this._walls[wall] = false
  };
  this.addWall = (wall) => {
    this._walls[wall] = true
  };

  this.hasWall = (wall) => this._walls[wall]

  this._displayDown = () => line(
    this._x * this._size.width,
    (this._y * this._size.height) + this._size.height,
    (this._x * this._size.width) + this._size.width,
    (this._y * this._size.height) + this._size.height
  )

  this._displayUp = () => line(
    this._x * this._size.width,
    this._y * this._size.height,
    (this._x * this._size.width) + this._size.width,
    this._y * this._size.height
  )

  this._displayLeft = () => line(
    this._x * this._size.width,
    this._y * this._size.height,
    this._x * this._size.width,
    (this._y * this._size.height) + this._size.height
  )

  this._displayRight = () => line(
    (this._x * this._size.width) + this._size.width,
    this._y * this._size.height,
    (this._x * this._size.width) + this._size.width,
    (this._y * this._size.height) + this._size.height
  )

  this.mark = (r = 150, g = 0, b = 0, alpha = 100) => {
    noStroke();
    fill(r, g, b, alpha);
    rect(this._x * this._size.width, this._y * this._size.height, this._size.width, this._size.height)
  }

  this.highlight = () => {
    noStroke();
    fill(191, 191, 191);
    rect(this._x * this._size.width, this._y * this._size.height, this._size.width, this._size.height)
  }
 
  this.getNeighbours = (grid) => {
    return [
      grid.get(this._x + ((this._y - 1) * grid.numOfCols())), // up n
      grid.get(this._x + ((this._y + 1) * grid.numOfCols())), // down n
      grid.get(this._x + 1 + (this._y * grid.numOfCols())), // right n
      grid.get(this._x - 1 + (this._y * grid.numOfCols())) // left n
    ]
    .filter(Boolean)
    .filter(cell => !cell.wasVisited() &&
      Math.abs(this.x() - cell.x()) <= 1 &&
      Math.abs(this.y() - cell.y()) <= 1
    );
  }

  this.getCategorizedNeighbours = (grid) => {
    return {
      up: grid.get(this._x + ((this._y - 1) * grid.numOfCols())), // up n
      down: grid.get(this._x + ((this._y + 1) * grid.numOfCols())), // down n
      right: grid.get(this._x + 1 + (this._y * grid.numOfCols())), // right n
      left: grid.get(this._x - 1 + (this._y * grid.numOfCols())) // left n
    }
  }

  this.getValidNeighbours = (grid) => {
    const neighbours = this.getCategorizedNeighbours(grid);
    return [
      ...(!this.hasWall('up') && !!neighbours.up && !neighbours.up.hasWall('down')
            ? [neighbours.up] 
            : []
          ),
      ...(!this.hasWall('down') && !!neighbours.down && !neighbours.down.hasWall('up')
            ? [neighbours.down] 
           : []
          ),
      ...(!this.hasWall('right') && !!neighbours.right && !neighbours.right.hasWall('left')
            ? [neighbours.right] 
            : []
          ),
      ...(!this.hasWall('left') && !!neighbours.left && !neighbours.left.hasWall('right')
            ? [neighbours.left] 
            : []
          )
    ]
  }

  this.getRandomNotVisitedNeighbourCell = (grid) => {
    const neighbours = this.getNeighbours(grid)
    return neighbours[Math.floor(random(0, neighbours.length))];
  }

  this.removeWallBaseOnNeighbour = (cell) => {
    if((this._x - cell.x()) === -1) {
      this.removeWall('right');
      cell.removeWall('left');
    }
    if((this._x - cell.x()) === 1) {
      this.removeWall('left');
      cell.removeWall('right');
    }
    if((this._y - cell.y()) === -1) {
      this.removeWall('down');
      cell.removeWall('up');
    }
    if((this._y - cell.y()) === 1) {
      this.removeWall('up');
      cell.removeWall('down');
    }  
  }

  this.display = () => {
    stroke(255);
    if(this._walls.up) this._displayUp();
    if(this._walls.down) this._displayDown();
    if(this._walls.left) this._displayLeft();
    if(this._walls.right) this._displayRight();
    if(this._visited) this.mark()
  }
}

function Stack() {
  this._representation = [];
  this.push = (element) => this._representation.push(element);
  this.pop = () => this._representation.pop();
  this.empty = () => this._representation.length === 0;
}

function Grid(numOfCols, numOfRows, cellDimensions, walls, representation) {
  this._representation = representation || [];
  this._numOfCols = numOfCols;
  this._numOfRows = numOfRows;
  this._cellDimensions = cellDimensions;

  if(this._representation.length > 0) {
    for (let i = 0; i < this._representation.length; i++) {
      this._representation[i] = new Cell(
        this._representation[i]._x,
        this._representation[i]._y,
        this._representation[i]._size,
        walls ? { ...walls } : this._representation[i]._walls
      );
    }
  }

  if(this._representation.length === 0) {
    for (let y = 0; y < this._numOfRows; y++) {
      for (let x = 0; x < this._numOfCols; x++) {
        this._representation.push(new Cell(x, y, this._cellDimensions, { ...walls }));
      }
    }

    const firstCell = this._representation[0];
    firstCell.removeWall('up');
    const lastCell = this._representation[this._representation.length - 1];
    lastCell.removeWall('down');
  }

  this.get = (index) => this._representation[index];
  this.first = () => this._representation[0];
  this.last = () => this._representation[this._representation.length - 1];
  this.numOfCols = () => this._numOfCols;
  this.numOfRows = () => this._numOfRows;
  this.cellDimensions = () => this._cellDimensions;
  this.representation = () => ({
    width: this._numOfCols,
    height: this._numOfRows,
    cell_size: this._cellDimensions,
    grid: this._representation
  });

  this.display = () => {
    for (let i = 0; i < this._representation.length; i++)
      this._representation[i].display()
  }
}

function Maze(props, builder, solver) {
  canvas = createCanvas(mazeWidth + 10, mazeHeight + 10);
  background(51);
  this._builder = builder ? new builder(props) : null;
  this._solver = solver ? new solver(props) : null;
  this.gridRepresentation = () => this._builder.gridRepresentation();

  this.display = () => {
    if (this._builder) {
      this._builder.build();
      this._builder.display();
    }
    if (this._solver) {
      this._solver.solve();
      this._solver.display();
    }
  }
}

function AStarMazeSolver(mazeProps) {
  this._grid = new Grid(
    mazeProps.width,
    mazeProps.height,
    mazeProps.cell_size,
    null,
    mazeProps.grid
  );
  this._openSet = [this._grid.first()];
  this._closeSet = [];
  this._pathSolution = [];
  this._goalIndex = 0;
  this._finished = false;

  this._findGoal = () => {
    for (let i = 0; i < this._openSet.length; i++) {
      if (this._openSet[i].fCost() < this._openSet[this._goalIndex].fCost())
        this._goalIndex = i;
    }
    return this._openSet[this._goalIndex]
  }

  this._validateGoal = () => {
    return this._openSet[this._goalIndex] === this._grid.last()
  }

  this._moveFromOpenToClose = (goal) => {
    this._openSet = this._openSet.filter(cell => cell !== goal);
    this._closeSet.push(goal);
  }

  this._isInCloseSet = (cell) => 
    this._closeSet.includes(cell)
  
  this._isInOpenSet = (cell) => 
    this._openSet.includes(cell)

  this._isInOpenSetEmpty = () => this._openSet.length === 0;

  this._pushToOpenSet = (element) => this._openSet.push(element);

  this._checkGoalNeighbours = (goal) => {
    const neighbours = goal.getValidNeighbours(this._grid)
    for (let i = 0; i < neighbours.length; i++) {
      if (!this._isInCloseSet(neighbours[i])) {
        const newGCost = goal.gCost() + 1;
        let newPath = false;
        if (this._isInOpenSet(neighbours[i])) {
          if (newGCost < neighbours[i].gCost()) {
            neighbours[i].replaceGCost(newGCost);
            newPath = true
          }
        } else {
          newPath = true;
          neighbours[i].replaceGCost(newGCost);
          this._pushToOpenSet(neighbours[i]);
        }

        if (newPath) {
          neighbours[i].replaceHCost(
            this._euclideanDistance(neighbours[i], this._grid.last())
          )
          neighbours[i].replaceFCost(
            neighbours[i].gCost() + neighbours[i].hCost()
          )
          neighbours[i].setCameFrom(goal);
        }
      }
    }
  }

  this._buildPathSolution = (goal) => {
    this._pathSolution = [];
    let tmpGoal = goal;
    this._pathSolution.push(tmpGoal);
    while(tmpGoal.cameFrom()) {
      this._pathSolution.push(tmpGoal.cameFrom());
      tmpGoal = tmpGoal.cameFrom()
    }
  }

  this._showPathSolution = () => {
    for (let i = 0; i < this._pathSolution.length; i++) {
      this._pathSolution[i].mark(0, 255, 0, undefined);
    }
  }

  this._showCloseSet = () => {
    for (let i = 0; i < this._closeSet.length; i++) {
      this._closeSet[i].mark(255, 0, 0, undefined);
    }
  }

  this._showOpenSet = () => {
    for (let i = 0; i < this._openSet.length; i++) {
      this._openSet[i].mark(0, 0, 255, undefined);
    }
  }

  this._solutionFound = () => {
    this._finished = true;
    console.log(`Solved! (path length: ${this._pathSolution.length} )`);
  }

  this._noSolutionFound = () => {
    this._finished = true;
    console.log('Solved!');
  }

  this._isSolved = () => this._finished;

  this._euclideanDistance = (cellA, cellB) =>
    dist(cellA.x(),cellA.y(),cellB.x(),cellB.y());

  this._manhanttanDistance = (cellA, cellB) =>
    abs(cellA.x() - cellB.x()) + abs(cellA.y() - cellB.y())

  this.solve = () => {
    if (!this._isSolved()) {
      if (!this._isInOpenSetEmpty()) {
        const goal = this._findGoal();
        const isEnd = this._validateGoal(goal);

        if (isEnd) this._solutionFound();
        
        this._moveFromOpenToClose(goal);
        this._checkGoalNeighbours(goal);

        this._showCloseSet()
        this._showOpenSet()
        this._buildPathSolution(goal);
        this._showPathSolution();
      } else {
        this._noSolutionFound();
      }
    }
  }

  this.display = () => this._grid.display();
}

function MazeBuilderByDivideAndConquer(mazeProps){
  this._grid = new Grid(
    mazeProps.width,
    mazeProps.height,
    { width: Math.floor(mazeWidth / mazeProps.width), height: Math.floor(mazeHeight / mazeProps.height) },
    { up: false, down: false, left: false, right: false }
  );
  this._width = mazeProps.width;
  this._height = mazeProps.height;
  this._isBuild = false;

  this.display = () => this._grid.display();
  this.gridRepresentation = () => this._grid.representation();

  this._buildMiddleHorizontalWall = (x, x2, y, y2) => {
    for(let xi = x; xi < x2; xi++) {
      const currentCell = this._grid.get(xi + (y * y2))
      currentCell.addWall('up');
    }
    const cell = this._grid.get(
      (floor(random(x, x2))) + (y * x2)
    );
    cell.removeWall('up');
  }

  this._buildMiddleVerticalWall = (x, x2, y, y2) => {
    for(let yi = y; yi < y2; yi++) {
      const currentCell = this._grid.get(x + (yi * x2))
      currentCell.addWall('right');
    }
    const cell = this._grid.get(
      (x + (floor(random(y, y2))) * x2)
    );
    cell.removeWall('right');
  }

  this._divideVertical = (x, x2, y, y2) => {
    this._buildMiddleVerticalWall(x, x2, y, y2);
    const half = floor((x2 + x) / 2);
    this._divide(x, half, y, y2);
    this._divide(half, x2, y, y2);
  }

  this._divideHorizontal = (x, x2, y, y2) => {
    this._buildMiddleHorizontalWall(x, x2, y, y2);
    const half = floor((y2 + y) / 2)
    this._divide(x, x2, y, half);
    this._divide(x, x2, half, y2);
  }

  this._clearCellWalls = (x, y, walls) => {
    const cell = this._grid.get(x + (y * this._width));
    walls.forEach(wall => cell.removeWall(wall));
  }
  
  this._divide = (x, x2, y, y2) => {
    this._calls += 1
    const width = Math.abs(x2 - x)
    const height = Math.abs(y2 - y)

    //console.log(`calls:${this._calls} width:${width} height:${height}`)

    if(width < 2 || height < 2) return;

    if(width < height) {
      this._divideHorizontal(x, x2, y, y2);
    } else if(width > height) {
      this._divideVertical(x, x2, y, y2);
    } else {
      random(0, 1) > 0.5
        ? this._divideHorizontal(x, x2, y, y2)
        : this._divideVertical(x, x2, y, y2);
    } 
  }

  this.build = () => {
    if(!this._isBuild) {
      this._divide(0, this._width, 0, this._height);
      this._clearCellWalls(0, 0, ['up', 'right', 'down']);
      this._clearCellWalls(this._width - 1, this._height - 1, ['up', 'left', 'down']);
      this._isBuild = true;
      alert('MAZE FINISHED!');
    }
  }
}

function MazeBuilderByDFS(mazeProps){
  this._stack = new Stack();
  this._grid = new Grid(
    mazeProps.width,
    mazeProps.height,
    { width: Math.floor(mazeWidth / mazeProps.width), height: Math.floor(mazeHeight / mazeProps.height) },
    { up: true, down: true, left: true, right: true }
  );
  this.currentCell = this._grid.get(0);
  this._isBuild = false;

  this.display = () => this._grid.display();
  this.gridRepresentation = () => this._grid.representation();

  this.build = () => {
    if (!this._isBuild) {
      this.currentCell.visit();
      const neighbourCell = this.currentCell.getRandomNotVisitedNeighbourCell(this._grid);
      if (neighbourCell) {
        neighbourCell.visit();
        this._stack.push(this.currentCell);
        this.currentCell.removeWallBaseOnNeighbour(neighbourCell);
        this.currentCell.highlight();
        this.currentCell = neighbourCell; 
      } else if(!this._stack.empty()) {
        this.currentCell = this._stack.pop();
        this.currentCell.highlight();
      } else {
        this._isBuild = true;
        alert('MAZE FINISHED!');
      }
    }
  }
}

let maze = null;
let builderTag = 'DFS';

const builders = {
  DYC: MazeBuilderByDivideAndConquer,
  DFS: MazeBuilderByDFS
};

let title = null;
let heightLabel = null; 
let heightInput = null;
let widthLabel = null;
let widthInput = null;
let builderLabel = null;
let builderSelect = null;

let uploadLabel = null
let uploadInput = null;

function chooseBuilder() {
  builderTag = builderSelect.value();
}

function buildMaze() {
  const [width, height] = [
    parseInt(widthInput.value() || '10'),
    parseInt(heightInput.value() || '10')
  ];
  const selectedBuilder = builders[builderTag];
  if(selectedBuilder) {
    console.log('Building...')
    maze = new Maze({ width, height }, selectedBuilder);
  } else {
    alert('Builder not implemented');
  }
}

function solveMaze(mazeGridRepr) {
  console.log('Solving...')
  maze = new Maze(mazeGridRepr, null, AStarMazeSolver);
}

function downloadMaze() {
  if(canvas) save(canvas, 'laberinto.png');
}

function downloadRepresentation() {
  if(maze)
    saveJSON(maze.gridRepresentation(), 'mapa-laberinto.txt');
}

function processFile(file) {
  const mazeGridJson = file.data;
  solveMaze(JSON.parse(mazeGridJson));
}

function setup() {
  frameRate(25);

  title = createElement('h2', 'Maze Generator');
  heightLabel = createElement('label', 'Height (default = 10)');
  heightInput = createInput();
  widthLabel = createElement('label', 'Width (default = 10)');
  widthInput = createInput();
  builderLabel = createElement('label', 'builderorithm (default = DFS)');
  builderSelect = createSelect();

  title.position(mazeWidth + 50, 20);

  heightLabel.position(mazeWidth + 50, 80);
  heightInput.position(mazeWidth + 50, 100);

  widthLabel.position(mazeWidth + 50, 130);
  widthInput.position(mazeWidth + 50, 150);
  
  builderLabel.position(mazeWidth + 50, 180);
  builderSelect.position(mazeWidth + 50, 200);
  builderSelect.option('DFS');
  builderSelect.option('DYC');
  builderSelect.changed(chooseBuilder);

  const start = createButton('Start');
  start.position(mazeWidth + 50, 230);
  start.mousePressed(buildMaze);

  const downloadImage = createButton('Download Maze Image');
  downloadImage.position(mazeWidth + 50, 290);
  downloadImage.mousePressed(downloadMaze);

  const downloadRep = createButton('Download Maze Representation');
  downloadRep.position(mazeWidth + 50, 320);
  downloadRep.mousePressed(downloadRepresentation);

  uploadLabel = createElement('label', 'Upload maze to Solve');
  uploadLabel.position(mazeWidth + 50, 370);
  uploadInput = createFileInput(processFile);
  uploadInput.position(mazeWidth + 50, 400);
}

function draw() {
  if(maze) maze.display();
}