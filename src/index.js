import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const len = 4;
const area = len * len;
const OverlayTheme = React.createContext();

class Square extends React.Component {
  render() {
    let className = "square";
    if(this.props.selected) {
      className += " selected_square";
    }
    return (
      <button className={className} onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value = {this.props.values[i]}
      selected = {this.props.selectedValues[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
        </div>
        <div className="board-row">
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
        </div>
        <div className="board-row">
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
        </div>
        <div className="board-row">
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
          {this.renderSquare(15)}
        </div>
      </div>
    );
  }
}

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue:'',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleChange(event) {
    this.setState({
      inputValue: event.target.value,
    });
  }

  handleSubmit(event) {
    const inputValue = Number(this.state.inputValue);
    const values = this.props.values;
    const selectedIndex = values.indexOf(inputValue);
    this.props.onClick(selectedIndex);
    event.preventDefault();
  }

  render() {
    return (
      <form className="userPrompt" onSubmit={this.handleSubmit}>
        <label>
          輸入數字:
          <input
            type="number" name="inputNumber" min="1" max="16"
            value={this.state.inputValue} onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  };
}

class Overlay extends React.Component {
  static contextType = OverlayTheme;
  render() {
    let overlayClass = "game-overlay";
    console.log(this.context);
    if(this.context) {
      overlayClass = "game-overlay overlay-on";
    }
    return (
      <div className={overlayClass}>
        <div className="center-div">
          <div id="victory-text">勝利！</div>
          <button id="restart-btn" onClick={() => this.props.onClick()}>
            重新開始
          </button>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: randomNumbers(area),
      selectedValues: Array(area).fill(false),
    };
  }

  handleClick(i) {
    const selectedValues = this.state.selectedValues.slice();
    selectedValues[i] = true;
    this.setState({
      selectedValues: selectedValues,
    });
  }

  restart() {
    this.setState({
      values: randomNumbers(area),
      selectedValues: Array(area).fill(false),
    });
  }

  render() {
    return (
      <div className="game">
        <OverlayTheme.Provider value={bingo(len, this.state.selectedValues)}>
          <Overlay
            onClick = {() => this.restart()}
          />
        </OverlayTheme.Provider>
        <div className="game-main">
          <InputForm
            values = {this.state.values}
            onClick = {i => this.handleClick(i)}
          />
          <Board
            values = {this.state.values}
            selectedValues = {this.state.selectedValues}
            onClick = {i => this.handleClick(i)}
          />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function bingo(len, square) {
  let lines = 0;

  for (let i = 0; i < len; i++) {
    let hline = true;
    let vline = true;
    for (let j = 0; j < len; j++) {
      if(!square[i * len + j]) hline = false;
      if(!square[i + j * len]) vline = false;
    }
    if(hline) lines++;
    if(vline) lines++;
  }

  let ldiagonal = true;
  let rdiagonal = true;
  for (let i = 0; i < len; i++) {
    if(!square[i * len + i]) ldiagonal = false;
    if(!square[i * len + (len - i - 1)]) rdiagonal = false;
  }
  if(ldiagonal) lines++;
  if(rdiagonal) lines++;

  if(lines >= 3) return true;
  else return false;
}

function randomNumbers(n) {
  var arr = [];
  while(arr.length < n){
      var r = Math.floor(Math.random() * n) + 1;
      if(arr.indexOf(r) === -1) arr.push(r);
  }
  console.log(arr);
  return arr;
}
