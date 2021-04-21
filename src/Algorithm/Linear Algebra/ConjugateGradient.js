import React from "react";
import { useState } from "react";
import { Select, Card, Input, Button, Table } from "antd";
import { add, subtract, multiply, transpose } from "mathjs";
import axios from "axios";

const { Option } = Select;

let matrixA = [];
let matrixB = [];
let matrixX = [];
let A = [];
let B = [];
let x = [];
// let output;
let epsilon;
let count = 1;

let dataInTable = [];

var columns = [
  {
    title: "Iteration",
    dataIndex: "iteration",
    key: "iteration",
  },
  {
    title: "λ",
    dataIndex: "lambda",
    key: "lambda",
  },
  {
    title: "{X}",
    dataIndex: "X",
    key: "X",
  },
  {
    title: "Error",
    dataIndex: "error",
    key: "error",
  },
];

export default function ConjugateGradient() {
  const [matrix, setmatrix] = useState("0");
  const [answercount, setanswercount] = useState(0);

  async function getdata() {
    let fetchdata = await axios({
      method: "get",
      url: "http://localhost:8080/Conjugate",
    })
      .then((response) => {
        // console.log("response: ", response.data);
        // console.log("refresh");
        return response.data;
      })
      .catch((err) => {
        // console.error(err);
        return undefined;
      });

    // console.log(fetchdata);
    createMatrix(parseInt(fetchdata.col), parseInt(fetchdata.col));
    setmatrix(parseInt(fetchdata.col));

    for (var i = 0; i < fetchdata.col; i++) {
      for (var j = 0; j < fetchdata.col; j++) {
        document.getElementById("a" + (i + 1) + "" + (j + 1)).value =
          fetchdata.A[i][j];
      }
      document.getElementById("b" + (i + 1)).value = fetchdata.B[i][0];
      document.getElementById("x" + (i + 1)).value = fetchdata.X[i][0];
    }
    // console.log(fetchdata);
  }

  function initMatrix() {
    A = [];
    B = [];
    x = [];
    for (var i = 0; i < matrix; i++) {
      A[i] = [];
      for (var j = 0; j < matrix; j++) {
        if (
          document.getElementById("a" + (i + 1) + "" + (j + 1)).value ===
          (null || "")
        ) {
          A[i][j] = 0;
        } else {
          A[i][j] = parseFloat(
            document.getElementById("a" + (i + 1) + "" + (j + 1)).value
          );
        }
      }
      if (document.getElementById("b" + (i + 1)).value === (null || "")) {
        B.push(0);
      } else {
        B.push(parseFloat(document.getElementById("b" + (i + 1)).value));
      }
      if (document.getElementById("x" + (i + 1)).value === (null || "")) {
        x.push(0);
      } else {
        x.push(parseFloat(document.getElementById("x" + (i + 1)).value));
      }
    }
  }

  function handleChange(value) {
    setmatrix(value);
    createMatrix(parseInt(value), parseInt(value));
  }

  function conjugate_gradient() {
    count = 1;
    dataInTable = [];
    initMatrix();
    // console.log(A, B, x);
    // if (positive_definite(1)) {
    //   output = "This matrix doesn't positive definite";
    //   console.log(output);
    //   return false;
    // }
    //find {R0}
    var R = subtract(multiply(A, x), B);
    // console.log(R);
    //find D0
    var D = multiply(R, -1);
    // console.log(D);
    do {
      //find λ
      var λ =
        multiply(multiply(transpose(D), R), -1) /
        multiply(multiply(transpose(D), A), D);
      // console.log(λ);
      /*------------------------------------------------------------------*/

      //find new {X}
      x = add(x, multiply(λ, D));
      // console.log(x);
      //find new {R}
      R = subtract(multiply(A, x), B);
      // console.log(R);
      //find epsilon
      epsilon = Math.sqrt(multiply(transpose(R), R)).toFixed(8);
      appendTable(λ, JSON.stringify(x).split(",").join(", "), epsilon);
      // console.log(epsilon);
      var α =
        multiply(multiply(transpose(R), A), D) /
        multiply(transpose(D), multiply(A, D)).toFixed(8);
      // console.log(α);
      D = add(multiply(R, -1), multiply(α, D));
      // console.log(D);
    } while (epsilon > 0.000001);
    // output = x;

    setanswercount(answercount + 1);
    // this.setState({
    //   showOutputCard: true,
    // });
  }

  function appendTable(lambda, x, error) {
    dataInTable.push({
      iteration: count++,
      lambda: lambda,
      X: x,
      error: error,
    });
    console.log(dataInTable);
  }

  function createMatrix(row, column) {
    matrixA = [];
    matrixB = [];
    matrixX = [];
    for (var i = 1; i <= row; i++) {
      for (var j = 1; j <= column; j++) {
        matrixA.push(
          <Input
            style={{
              width: "10%",
              marginInlineEnd: "3%",
              marginBlockEnd: "3%",
            }}
            id={"a" + i + "" + j}
            key={"a" + i + "" + j}
            placeholder={"a" + i + "" + j}
          />
        );
      }
      matrixA.push(<br key={"br a" + i} />);
      matrixB.push(
        <Input
          style={{
            width: "30%",
            marginInlineEnd: "12%",
            marginBlockEnd: "12%",
          }}
          id={"b" + i}
          key={"b" + i}
          placeholder={"b" + i}
        />
      );
      matrixB.push(<br key={"br b" + i} />);
      matrixX.push(
        <Input
          style={{
            width: "30%",
            marginInlineEnd: "12%",
            marginBlockEnd: "12%",
          }}
          id={"x" + i}
          key={"x" + i}
          placeholder={"x" + i}
        />
      );
      matrixX.push(<br key={"br x" + i} />);
    }
  }
  return (
    <div>
      <div>
        <Card>
          <Select
            id="inputmatrix"
            defaultValue="Please select ---"
            style={{ width: "80%" }}
            onChange={handleChange}
          >
            <Option value="0">Please select ---</Option>
            <Option value="3">3 x 3</Option>
            <Option value="4">4 x 4</Option>
            <Option value="5">5 x 5</Option>
            <Option value="6">6 x 6</Option>
          </Select>
          <Button
            style={{ marginLeft: "5%" }}
            onClick={async (e) => {
              await getdata();
            }}
          >
            Example
          </Button>
        </Card>
        {
          <div>
            <div style={{ display: "flex" }}>
              <Card
                style={{ display: "inline-block", width: "60%" }}
                title="Matrix [A]"
              >
                {matrixA}
              </Card>
              <Card
                style={{ display: "inline-block", width: "20%" }}
                title="Vector [B]"
              >
                {matrixB}
              </Card>
              <Card
                style={{ display: "inline-block", width: "20%" }}
                title="Initial [X]"
              >
                {matrixX}
              </Card>
            </div>
            {matrix !== 0 && (
              <Card>
                <Button
                  size="large"
                  id="matrix_button"
                  // onClick={() => setanswercount(answercount + 1)}
                  onClick={() => conjugate_gradient()}
                >
                  Submit
                </Button>
              </Card>
            )}
          </div>
        }
      </div>
      <Card title="Answer">
        <Table
          pagination={{ defaultPageSize: 5 }}
          columns={columns}
          dataSource={dataInTable}
          bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "black" }}
        />
      </Card>
    </div>
  );
}
