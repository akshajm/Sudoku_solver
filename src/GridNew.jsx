import React, { Component } from "react";
import Row from "./Row";
import { matrices } from "./data";

window.$flag = false;

const GREEN_COLOR = "#00FF7F";
const WHITE_COLOR = "#FFFFFF";

class GridNew extends Component {
  state = {
    matrix: [[]],
    backgroundColor: "",
    staticValues: {},
    level: "",
  };

  gridChecker(row, column, number) {
    let { matrix } = this.state;
    row = Math.floor(row / 3) * 3;
    column = Math.floor(column / 3) * 3;
    for (let a = row; a < row + 3; a++) {
      for (let b = column; b < column + 3; b++) {
        if (number === matrix[a][b]) return false;
      }
    }
    return true;
  }

  columnChecker(column, number) {
    let { matrix } = this.state;
    for (let a = 0; a < 9; a++) {
      if (number === matrix[a][column]) return false;
    }
    return true;
  }

  rowChecker(row, number) {
    let { matrix } = this.state;
    for (let a = 0; a < 9; a++) {
      if (number === matrix[row][a]) return false;
    }
    return true;
  }

  recursion = (row, column) => {
    var rowColIndex = String(row) + String(column);
    if (rowColIndex in this.state.staticValues) {
      this.recursion(row, column + 1);
    } else {
      if (row < 9 && column < 9) {
        for (let x = 1; x < 10; x++) {
          if (
            this.gridChecker(row, column, x) &&
            this.rowChecker(row, x) &&
            this.columnChecker(column, x)
          ) {
            let newMatrix = [...this.state.matrix];
            newMatrix[row][column] = x;
            this.setState({ matrix: newMatrix });
            this.recursion(row, column + 1);
          }
        }
        if (!window.$flag) {
          let abMatrix = [...this.state.matrix];
          abMatrix[row][column] = 0;
          this.setState({ matrix: abMatrix });
        }
      } else if (column >= 9) {
        this.recursion(row + 1, 0);
      } else {
        window.$flag = true;
        return;
      }
    }
  };

  startSolving = () => {
    this.setState({ backgroundColor: GREEN_COLOR });
    this.recursion(0, 0);
    window.$flag = false;
  };

  componentDidUpdate(prevProps) {
    if (prevProps.level !== this.props.level) {
      let newMatrix = [];
      newMatrix = JSON.parse(JSON.stringify(matrices[this.props.level][0]));
      this.setState({ matrix: newMatrix }, () => {
        this.setStaticValues();
      });
      this.setState({ level: this.props.level }, () => {});
      this.setState({ backgroundColor: WHITE_COLOR }, () => {});
    }
  }

  setStaticValues() {
    let stativValues = {};
    for (let r = 0; r < this.state.matrix.length; r++) {
      for (let c = 0; c < this.state.matrix[r].length; c++) {
        if (this.state.matrix[r][c] !== 0) {
          let newString = "";
          newString += String(r) + String(c);
          stativValues[newString] = 1;
        }
      }
    }
    this.setState({ staticValues: stativValues }, () => {});
  }

  componentWillMount() {
    this.setState({ level: "easy" });
    let startmatrix = JSON.parse(JSON.stringify(matrices[this.props.level][0]));
    this.setState({ matrix: startmatrix }, () => {
      this.setStaticValues();
    });
    this.setState({ backgroundColor: WHITE_COLOR }, () => {});
  }

  render() {
    let gridStyles = {
      paddingLeft: 140,
      marginTop: 140,
    };

    let buttonStyle = {
      padding: 10,
      marginTop: 455,
      borderRadius: 15,
      fontSize: 20,
    };
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-10 " style={gridStyles}>
            {this.state.matrix.map((rows, r) => (
              <Row
                row={rows}
                backgroundColor={this.state.backgroundColor}
                rIndex={r}
                staticValues={this.state.staticValues}
              />
            ))}
          </div>
          <div className="col-2 h1">
            <input
              style={buttonStyle}
              className="btn btn-outline-success font-weight-bold"
              type="button"
              onClick={() => this.startSolving()}
              value="Solve"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default GridNew;