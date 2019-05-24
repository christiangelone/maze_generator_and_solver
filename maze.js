function Maze(props, builder, solver) {
  canvas = createCanvas(mazeWidth + 10, mazeHeight + 10);
  background(50);
  this._builder = builder ? new builder(props) : null;
  this._solver = solver ? new solver(props) : null;
  this.gridRepresentation = () => this._builder.gridRepresentation();

  // Muestra el laberinto (esta funcion se ejecuta permanentemente cada 25 frames/s)
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

// https://en.wikipedia.org/wiki/A*_search_algorithm
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
    return this._openSet[this._goalIndex];
  }

  this._validateGoal = () => {
    return this._openSet[this._goalIndex] === this._grid.last();
  }

  this._moveFromOpenToClose = (goal) => {
    this._openSet = this._openSet.filter(cell => cell !== goal);
    this._closeSet.push(goal);
  }

  this._isInCloseSet = (cell) => 
    this._closeSet.includes(cell);
  
  this._isInOpenSet = (cell) => 
    this._openSet.includes(cell);

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
            newPath = true;
          }
        } else {
          newPath = true;
          neighbours[i].replaceGCost(newGCost);
          this._pushToOpenSet(neighbours[i]);
        }

        if (newPath) {
          neighbours[i].replaceHCost(
            this._euclideanDistance(neighbours[i], this._grid.last())
          );
          neighbours[i].replaceFCost(
            neighbours[i].gCost() + neighbours[i].hCost()
          );
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
      tmpGoal = tmpGoal.cameFrom();
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
    abs(cellA.x() - cellB.x()) + abs(cellA.y() - cellB.y());

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