let canvas = null;
const mazeWidth = 600;
const mazeHeight = 600;

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
