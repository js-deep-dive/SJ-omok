import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board rows={10} columns={10} />
      </div>
    );
  }
}

const cellStyle = {
  display: 'inline-block',
  border: '1px solid #000',
  boxSizing: 'border-box',
  width: '50px',
  height: '50px',
  fontSize: '12px',
  float: 'left'
}

const boardStyle = {
  overflow: 'hidden',
  margin: '0 auto',
  width: '500px'
}

const WIN_CONDITION_COUNT = 5;

const CellVO = class {
  constructor(rowNumber, columnNumber) {
    this.isFill = false;
    this.color = '';
    this.id = `${rowNumber}:${columnNumber}`

    this.fillColor = this.fillColor.bind(this);
    this.getState = this.getState.bind(this);
  }

  fillColor(color) {
    if (this.isFill) {
      alert('이미 선택된 값입니다!');

      return;
    }

    this.color = color;
    this.isFill = true;
  }

  getState() {
    return this.isFill;
  }
}



const Cell = class extends Component {
  constructor(props) {
    super(props);
  }

  onClickCell() {
    const color = this.props.getCurrentColor();

    this.props.toggleColor();

    this.props.fillColor(color);
  }

  render() {
    return (
    <div onClick={this.onClickCell.bind(this)} style={cellStyle}>
      {this.props.color}
    </div>
    );
  }
}



const Board = class extends Component {
  constructor(props) {
    super(props);

    const boardData = this.generateBoradData(this.props.rows, this.props.columns);

    this.state = {
      boardData,
      boardHistory: [],
      currentColor: 'black'
    }
  }

  generateBoradData(rows, columns) {
    return Array(rows).fill('')
                      .map((row, rowNumber) => new Array(columns).fill('').map((_, columnNumber) => new CellVO(rowNumber, columnNumber)));
  }

  getCurrentColor() {
    return this.state.currentColor;
  }

  checkHorizontal(fillCells) {
    const fillCellsRow = fillCells.reduce((set, cell) => {
      const [cellRow, cellColumn] = cell.id.split(':');

      const { rows: MAX_ROWS, columns: MAX_COLUMN } = this.props;

      const MIN_CELL_ROW = Number(cellRow) - WIN_CONDITION_COUNT >= 0 ?
                           Number(cellRow) - WIN_CONDITION_COUNT : 0;
      const MAX_CELL_ROW = Number(cellRow) + WIN_CONDITION_COUNT <= MAX_ROWS ? 
                           Number(cellRow) + WIN_CONDITION_COUNT : MAX_ROWS;

                           console.log(MIN_CELL_ROW, MAX_CELL_ROW);

      return set;
    }, new Set());

    console.log(fillCellsRow);
  }

  checkVertical(fillCells, color) {
    fillCells = fillCells.filter(cell => color === cell.color);
    
    console.log(fillCells);
  }

  getSnapshotBeforeUpdate() {
    const fillCells = this.state.boardData.flatMap(row => row.filter(cell => cell.isFill));

    const newBoardHistory = this.state.boardHistory;

    newBoardHistory.push(this.state.boardData);

    this.checkHorizontal(fillCells);
    
    this.setState({
      boardHistory: [...newBoardHistory]
    });
  }

  toggleColor() {
    const { currentColor } = this.state;
    const nextColor = currentColor === 'black' ? 'white' : 'black';

    this.setState({ currentColor: nextColor });

    return nextColor;
  }

  render() {
    return (
      <div style={boardStyle}>
        <div className="board">
          {this.state.boardData.map(row => row.map(cellData => <Cell key={cellData.id} toggleColor={this.toggleColor.bind(this)} getCurrentColor={this.getCurrentColor.bind(this)} {...cellData}/>))}
        </div>
        <ul>
          {this.state.boardHistory.map((_, index) => {
            <li>
              <button type="button" onClick=""></button>
            </li>
          })}
        </ul>
      </div>
      )
  }

  onClickHistory(index) {
    this.setState({
      boardData: [...this.state.boardHistory[index]],
      newBoardHistory: [...this.state.boardHistory.slice(0, index)
    })
  }
}

export default App;
