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

  //Crea un los bordes del laberito para el Divide y Conquista
  this.buildEdge = () => {
    for (let j = 1; j < this._numOfCols; j++) {
      this._representation[j].addWall('up');
    }

    for (let j = 0; j < this._numOfCols - 1; j++) {
      this._representation[j + (this._numOfRows - 1) * (this._numOfCols)].addWall('down');
    }

    for (let i = 0; i < this._numOfRows; i++) {
      this._representation[i * this._numOfCols].addWall('left');
    }

    for (let i = 0; i < this._numOfRows; i++) {
      this._representation[(this._numOfCols - 1 )+ i * (this._numOfCols)].addWall('right');
    }
  }


  // Muestra los muros 'vivos' de todas las celdas
  this.display = () => {
    for (let i = 0; i < this._representation.length; i++)
      this._representation[i].display()
  }
}