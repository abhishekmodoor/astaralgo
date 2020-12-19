import React from "react";
import "./App.css";
import * as d3 from "d3";
import boards from "./boards.json";
// import BinaryHeap from './BinaryHeap';

type Acell = {
  status: "free" | "blocked",
  f_cost: number,
  g_cost: number,
}
type AppState = {
  cells: Acell[][]
}

type AppProps = {
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    // ️⚡️ does not compile in strict mode
    super(props);
    this.state = {
      cells: Array(101)
          .fill(0)
          .map(() => {
            return new Array(101).fill(0);
          })
    };
    this.updateBoard = this.updateBoard.bind(this);
    this.createMazeFromDFS = this.createMazeFromDFS.bind(this);
    this.newBoard = this.newBoard.bind(this);
  }

  /** This method gets the manhattan distance between two points */
  getManhattanDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  /** This method creates a random board */
  createRandomBoard() {
    const cells = Array(101)
        .fill(0)
        .map(() => {
          return new Array(101).fill(Math.round(Math.random() + 0.2));
        });
    this.setState({
      cells
    });
  }
  
  /** This method creates a maze */
  createMazeFromDFS() {
    let visited = Array(10).fill(0).map(() => {return new Array(10).fill(0)})
    let parents = []
    // pick a random starting cell 
    let i = Math.round(Math.random() * 10) - 1;
    let j = Math.round(Math.random() * 10) - 1;
    visited[i][j] = 1
    parents.push([i,j])
    while(parents.length > 0) {
      // find all neighbors 
      let unvisited_neighbors = []
      if (i - 1 > -1 && visited[i-1][j] === 0) {unvisited_neighbors.push([i-1,j])} // left neighbor
      if (j - 1 > -1 && visited[i][j-1] === 0) {unvisited_neighbors.push([i,j-1])} // top neighbor
      if (i + 1 < 10 && visited[i+1][j] === 0) {unvisited_neighbors.push([i+1,j])} // right neighbor
      if (i + 1 < 10 && visited[i][j+1] === 0) {unvisited_neighbors.push([i,j+1])} // botom neighbor
      // if length of unvisited is 0, pop to next parents
      if (unvisited_neighbors.length === 0) {
        const coord = parents.pop();
        i = coord ? coord[0] : 0;
        j = coord ? coord[1] : 0;
      } else {
        while (unvisited_neighbors.length > 0) {
          const random_neighbor_index = Math.floor(
              Math.random() * unvisited_neighbors.length
          );
          const random_neighbor = unvisited_neighbors[random_neighbor_index];
          if (Math.floor(Math.random() * 10) > 3) {
            // set cell to visited
            visited[random_neighbor[0]][random_neighbor[1]] = 1;
            // add current cell to parents
            parents.push([i, j]);
            // set to new cell
            i = random_neighbor[0];
            j = random_neighbor[1];
            // remove from neighbors
            unvisited_neighbors.splice(random_neighbor_index, 1);
            break;
          } else {
            // set cell to blocked
            visited[random_neighbor[0]][random_neighbor[1]] = 2;
            // remove from neighbors
            unvisited_neighbors.splice(random_neighbor_index, 1);
          }
        }
      }
    }
    const free: Acell = {
      status: "free",
      f_cost: 0,
      g_cost: 0,
    }
    const blocked: Acell = {
      status: "blocked",
      f_cost: 0,
      g_cost: 0,
    }
    for(let x = 0; x < 10; x++) {
      for(let y = 0; y < 10; y++){
        visited[x][y] = visited[x][y] === 0 ? blocked : 
        visited[x][y] === 2 ? blocked : free;
      }
    }
    this.setState({
      cells: visited
    });
  }

  // saveBoard(jsonData: any) {
  //   var boards = this.state.boards
  //   boards[this.state.count] = jsonData
  //   this.setState({
  //     boards: boards
  //   })
  //   if(this.state.count === 50) {
  //     const fileData = JSON.stringify(this.state.boards);
  //     const blob = new Blob([fileData], {type: "text/plain"});
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.download = 'boards.json';
  //     link.href = url;
  //     link.click();
  //   }
  //   this.setState( {
  //     count: this.state.count + 1
  //   })
  // }

  async newBoard() {
    await this.createMazeFromDFS();
    this.updateBoard();
  }

  // exportBoard() {
  //   this.saveBoard(this.state.cells)
  // }

  async loadBoard(boardNumber: number) {
    await this.setState({
      cells: Object.values(boards)[boardNumber]
    });
    this.updateBoard();
  }

  /** This method will update the board colors */
  updateBoard() {
    let modifiedCells: Acell[] = []
    this.state.cells.forEach( row => {
      modifiedCells = modifiedCells.concat(row)
    })
    console.log(modifiedCells)
    d3.selectAll(".Cell")
    .data(modifiedCells)
    .style("background-color",cell => {return cell.status === "free" ? "#FFF" : "#000"})
  }

  /**  This method takes in a number and flips that cell color*/
  flipCell(val: number) {
    // const cells = this.state.cells.map( (val,i) => {
    //   if(i===val) {
    //     return val ? 0 : 1
    //   } else {
    //     return val
    //   }
    // })
    // this.setState({
    //   cells: cells
    // });
    // this.updateBoard()
  }

  render() {
    return (
        <div className="Container">
          <div className="Grid">
            {this.state.cells.map(row => {
              return row.map((val, i) => {
                return <div className="Cell" key={i}></div>;
              });
            })}
          </div>
          <div className="Information">
            <h1>A* Regression</h1>
            <button
                onClick={() => {
                  this.newBoard();
                }}
            >
              New Random Board
            </button>
            <h3>Select a grid:</h3>
            <select
                defaultValue={"none"}
                onChange={e =>
                    e.target.value != "none" &&
                    this.loadBoard(parseInt(e.target.value))
                }
            >
              <option value="none">none</option>
              {Object.values(boards).map((val, index, array) => (
                  <option value={index}>{index + 1}</option>
              ))}
            </select>
          </div>
        </div>
    );
  }
}

export default App;
