function Cell(x, y, size, walls) {
  this._x = x;
  this._y = y;
  this._size = size;
  this._visited = false;
  this._walls = walls;
  this._cameFrom = null;
  this._fCost = 0;
  this._gCost = 0;
  this._hCost = 0;

  this.fCost = () => this._fCost;
  this.gCost = () => this._gCost;
  this.hCost = () => this._hCost;

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

  this.hasWall = (wall) => this._walls[wall];

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
 
  // Devuelve las celdas vecinas a la celda actual, a las que se puede ir
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

  // Devuelve las celdas vecinas a la celda actual tagueadas ('left' 'right' 'up' 'down')
  this.getCategorizedNeighbours = (grid) => {
    return {
      up: grid.get(this._x + ((this._y - 1) * grid.numOfCols())), // up n
      down: grid.get(this._x + ((this._y + 1) * grid.numOfCols())), // down n
      right: grid.get(this._x + 1 + (this._y * grid.numOfCols())), // right n
      left: grid.get(this._x - 1 + (this._y * grid.numOfCols())) // left n
    }
  }

  // Devuelve las celdas vecinas a la celda actual a las que se puede ir teniendo en cuenta el tag de sus vecinos
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

  // Devuelve un vecino al azar
  this.getRandomNotVisitedNeighbourCell = (grid) => {
    const neighbours = this.getNeighbours(grid)
    return neighbours[Math.floor(random(0, neighbours.length))];
  }

  // Remueve el muro de la celda basado en el vecino pasado
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

  // Muestra los muros 'vivos' de la celda
  this.display = () => {
    stroke(255);
    if(this._walls.up) this._displayUp();
    if(this._walls.down) this._displayDown();
    if(this._walls.left) this._displayLeft();
    if(this._walls.right) this._displayRight();
    if(this._visited) this.mark();
  }
}