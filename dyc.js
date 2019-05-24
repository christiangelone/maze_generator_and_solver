/*  MazeBuilderByDivideAndConquer
    * Toma el laberinto, lo divide a la mitad y construye un muro con 2 agujeros aleatorios
      * de forma horizontal si el ancho del laberinto es menor que su alto
      * luego llama recurisivamente con la mitad superior del laberinto
      *luego otro llamdo recursivo con la mitad inferior del laberinto
        
      * de forma vertical si el ancho del laberinto es mayor que su alto
      * luego llama recurisivamente con la mitad izquierda del laberinto
      * luego otro llamdo recursivo con la mitad derecha del laberinto
      
    * La condicion de corte es que el tamanio del sub laberinto sea de alto o ancho menor a 1
*/
function MazeBuilderByDivideAndConquer(mazeProps){
  this._walls = new Queue();
  this._grid = new Grid(
    mazeProps.width,
    mazeProps.height,
    { width: Math.floor(mazeWidth / mazeProps.width), height: Math.floor(mazeHeight / mazeProps.height) },
    { up: false, down: false, left: false, right: false }
  );

  this._grid.buildEdge();

  this._width = mazeProps.width;
  this._height = mazeProps.height;
  this._isBuild = false;
  this._isCharge = false;
  this._calls = 0;


  this.display = () => this._grid.display();
  this.gridRepresentation = () => this._grid.representation();
  

/*************Creacion de muros horizontales*************/

  this._buildMiddleHorizontalWall = (x, x2, y, y2) => {

    var medy = floor((y + y2)/2);
    for (let xi = x; xi <= x2; xi++) {
      const currentCell = this._grid.get(xi + (medy * this._grid.numOfCols()));
      currentCell.addWall('down');
    }
    const cell = this._grid.get(
      ((floor(random(x, x2))) + medy * this._grid.numOfCols())
    );
    cell.removeWall('down');
  }

/*************Creacion de muros verticales*************/
  this._buildMiddleVerticalWall = (x, x2, y, y2) => {

    var medx = floor((x + x2)/2);
    for (let yi = y; yi <= y2; yi++) {
      const currentCell = this._grid.get(medx + (yi * this._grid.numOfCols()));
      currentCell.addWall('right');
    }
    const cell = this._grid.get(
      (medx + (floor(random(y, y2))) * this._grid.numOfCols())
    );
    cell.removeWall('right');
  }


  /***********Parte principial del Divide y Conquista***********/

  this._divideVertical = (x, x2, y, y2) => {
    this._walls.enqueue(new Wall('vertical', x, x2, y, y2));
    const half = floor((x2 + x) / 2);
    this._chargeWalls(x, half, y, y2);
    this._chargeWalls(half + 1, x2, y, y2);
  }

  this._divideHorizontal = (x, x2, y, y2) => {
    this._walls.enqueue(new Wall('horizontal', x, x2, y, y2));
    const half = floor((y2 + y) / 2);
    this._chargeWalls(x, x2, y, half);
    this._chargeWalls(x, x2, half + 1, y2);
  }

  this._chargeWalls = (x, x2, y, y2) => {

    const width = Math.abs(x2 - x);
    const height = Math.abs(y2 - y);

    //Condicion de corte
    if (width <= 0 || height <= 0) { return }

    if (width < height) {
      this._divideHorizontal(x, x2, y, y2);
    } else if (width > height) {
      this._divideVertical(x, x2, y, y2);
    } else {
      random() > 0.5
        ? this._divideHorizontal(x, x2, y, y2)
        : this._divideVertical(x, x2, y, y2);
    } 
  }

  /*El programa carga los muros en una lista, luego van desacolandolos y construyendolos
  hasta que se va vacie la lista, que es cuando termina el laberito se termino de construir
  */
  this.build = () => {
    if (!this._isBuild) {
      if (!this._isCharge) { 
        this._chargeWalls(0, this._width - 1, 0, this._height - 1);
        this._isCharge = true;
      }
      
      var wall = this._walls.dequeue();
      if (wall) {
      if (wall.vertical()) {
          this._buildMiddleVerticalWall(wall.firstValueX(),
                                        wall.lastValueX(),
                                        wall.firstValueY(),
                                        wall.lastValueY());
        } else if (wall.horizontal()) {
          this._buildMiddleHorizontalWall(wall.firstValueX(),
                                          wall.lastValueX(),
                                          wall.firstValueY(),
                                          wall.lastValueY());
        } else {
          alert('FALLO FATAL');
        }
      } else {
        alert('MAZE FINISHED!');
        this._isBuild = true;
      }
    }
  }
}