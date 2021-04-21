import React from "react";
import { useState } from "react";
import { Select, Input, Button, Card, Table } from "antd";
import axios from "axios";

const { Option } = Select;

let matrixA = [];
let matrixB = [];
let A = [];
let B = [];
let X;

var dataInTable = [];
const columns = [
  {
    title: "X",
    dataIndex: "X",
    key: "X",
  },
  {
    title: "Value",
    dataIndex: "Value",
    key: "Value",
  },
];

export default function GaussEliminate() {
  const [matrix, setmatrix] = useState("0");
  const [answercount, setanswercount] = useState(0);

  async function getdata() {
    let fetchdata = await axios({
      method: "get",
      url: "http://localhost:8080/Gausseliminate",
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
    createMatrix(parseInt(fetchdata.col), parseInt(fetchdata.col));
    setmatrix(parseInt(fetchdata.col));
    for (var i = 0; i < fetchdata.col; i++) {
      for (var j = 0; j < fetchdata.col; j++) {
        document.getElementById("a" + (i + 1) + "" + (j + 1)).value =
          fetchdata.A[i][j];
      }
      document.getElementById("b" + (i + 1)).value = fetchdata.B[i][0];
    }
  }

  function initMatrix() {
    A = [];
    B = [];
    for (var i = 0; i < matrix; i++) {
      A[i] = [];
      for (var j = 0; j < matrix; j++) {
        if (document.getElementById("a" + (i + 1) + "" + (j + 1)).value == "") {
          A[i][j] = 0;
        } else {
          A[i][j] = parseFloat(
            document.getElementById("a" + (i + 1) + "" + (j + 1)).value
          );
        }
      }
      if (document.getElementById("b" + (i + 1)).value == "") {
        B.push(0);
      } else {
        B.push(parseFloat(document.getElementById("b" + (i + 1)).value));
      }
    }
  }

  function gauss() {
    initMatrix();
    let data = [];
    if (A[0][0] === 0) {
      //pivoting
      var tempRow = JSON.parse(JSON.stringify(A[0]));
      var tempColumn = B[0];
      A[0] = A[1];
      A[1] = tempRow;
      B[0] = B[1];
      B[1] = tempColumn;
    }
    //Forward eliminated
    for (var k = 0; k < matrix; k++) {
      for (var i = k + 1; i < matrix; i++) {
        var factor = A[i][k] / A[k][k];
        for (var j = k; j < matrix; j++) {
          A[i][j] = A[i][j] - factor * A[k][j];
        }
        B[i] = B[i] - factor * B[k];
      }
    }
    //Backward Substitution
    X = new Array(matrix);
    X[matrix - 1] = Math.round(B[matrix - 1] / A[matrix - 1][matrix - 1]); //find Xn
    for (i = matrix - 2; i >= 0; i--) {
      //find Xn-1 to X1
      var sum = B[i];
      for (j = i + 1; j < matrix; j++) {
        sum = sum - A[i][j] * X[j];
      }
      X[i] = Math.round(sum / A[i][i]);
    }
    for (i = 0; i < matrix; i++) {
      data[i] = X[i];
    }

    createTable(data);
    setanswercount(answercount + 1);
  }

  function createTable(Value) {
    dataInTable = [];
    for (var i = 0; i < matrix; i++) {
      dataInTable.push({
        X: i + 1,
        Value: Value[i],
      });
    }
  }

  function handleChange(value) {
    // console.log(value);
    setmatrix(value);
    // console.log(matrix);
    createMatrix(parseInt(value), parseInt(value));
  }

  function createMatrix(row, column) {
    matrixA = [];
    matrixB = [];
    for (var i = 1; i <= row; i++) {
      for (var j = 1; j <= column; j++) {
        matrixA.push(
          <Input
            style={{
              width: "10%",
              // height: "50%",
              // backgroundColor: "#06d9a0",
              marginInlineEnd: "3%",
              marginBlockEnd: "3%",
              // color: "white",
              // fontSize: "18px",
              // fontWeight: "bold",
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
            width: "10%",
            // height: "50%",
            // backgroundColor: "black",
            marginInlineEnd: "3%",
            marginBlockEnd: "3%",
            // color: "white",
            // fontSize: "18px",
            // fontWeight: "bold",
          }}
          id={"b" + i}
          key={"b" + i}
          placeholder={"b" + i}
        />
      );
      matrixB.push(<br key={"br b" + i} />);
    }
  }

  return (
    <div>
      {/* <p>{matrix}</p> */}
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
                style={{ display: "inline-block", width: "50%" }}
                title="Matrix [A]"
              >
                {matrixA}
              </Card>
              <Card
                style={{ display: "inline-block", width: "50%" }}
                title="Vector [B]"
              >
                {matrixB}
              </Card>
              <br />
            </div>
            {matrix != 0 && (
              <Card>
                <Button
                  size="large"
                  id="matrix_button"
                  // style={{ background: "blue", color: "white" }}
                  onClick={() => gauss()}
                >
                  Submit
                </Button>
              </Card>
            )}
          </div>
        }
      </div>
      {/* <Card>{answer}</Card> */}
      <Card title="Answer">
        <Table
          pagination={{ defaultPageSize: 10 }}
          columns={columns}
          dataSource={dataInTable}
          bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "black" }}
        />
      </Card>
    </div>
  );
}
