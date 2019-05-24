/*  MazeBuilderByDFS
    * Mientra no haya terminado
      * marcar la celda actual como visitada
      * tomar un vecino no visitado al azar de la celda actual
      * si hay vecino no visitado
        * marcarlo como visitado
        * apilarlo al stack de backtrackin
        * sacar los muros correspondientes basandose en el vecino visitado
        * pintar la celda actual
        * usar como celda actual al vecino
      * sino, si el stack de backtracking no esta vacio
        * desapilar la cabeza del stack
        * usar como celda actual a la celda desapilada
        * pintar la celda actual
      * sino
        * termine
       
*/
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
        //Elige una celda vecina al azar, elimina los muros entre ambas
        //y se mueve a esa celda
        neighbourCell.visit();
        this._stack.push(this.currentCell);
        this.currentCell.removeWallBaseOnNeighbour(neighbourCell);
        this.currentCell.highlight();
        this.currentCell = neighbourCell; 
      } else if(!this._stack.empty()) {
        //Como no tiene mas vecinos sin visitar, vuelve a la celda anterior
        this.currentCell = this._stack.pop();
        this.currentCell.highlight();
      } else {
        //Volvio al inicio
        this._isBuild = true;
        alert('MAZE FINISHED!');
      }
    }
  }
}