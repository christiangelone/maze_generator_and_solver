# Maze generator & solver

## How to run ?
 * In the root folder run: ``` ~$ ./start.sh 5555 ```
 * Open your browser and go to `http://localhost:5555`
 * There you will find the maze ggenerator and solver

## How to build maze ?
 * type the number of columns and rows you want (default 10)
 * Select the algorithm you want to use
 * Click `start`
 * Download Maze Representation to posterior solving

 ## How to solve maze ?
 * Open browser console to see results.
 * Click on `choose file`
 * Select the maze representation file (make sure its extension is .txt)
 * Done!

 # Algorithms used for genearation
  * Random DFS ~ O(E + V)
  * Recursive Division ~ (DAC) O(E + V)

  # Algorithms used for solving
  * A* ~ O(E LOG(V)) 
