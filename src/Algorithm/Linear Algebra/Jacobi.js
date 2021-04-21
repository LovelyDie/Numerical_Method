import React from "react";
import { useState } from "react";
import { Select, Input, Button, Card, Table } from "antd";
import axios from "axios";

const { Option } = Select;

let matrixA = [];
let matrixB = [];
let matrixX = [];
let A = [];
let B = [];
let x = [];
let epsilon;
let count = 1;

let dataInTable = [];
let columns = [];

export default function Jacobi() {
  const [matrix, setmatrix] = useState("0");
  const [answercount, setanswercount] = useState(0);

  async function getdata() {
    let fetchdata = await axios({
      method: "get",
      url: "http://localhost:8080/Jacobi",
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
    initialSchema(fetchdata.col);
    // console.log(matrix);
    // setanswercount(answercount + 1);
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
    initialSchema(value);
  }

  function jacobi() {
    count = 1;
    dataInTable = [];
    initMatrix();
    console.log(A, B, x);
    // console.log("jacobi start");
    let temp;
    let xold;
    epsilon = new Array(matrix);
    do {
      temp = [];
      // xold = JSON.parse(JSON.stringify(x));
      xold = x;
      // console.log(xold);
      // console.log(x);
      for (var i = 0; i < matrix; i++) {
        var sum = 0;
        for (var j = 0; j < matrix; j++) {
          if (i !== j) {
            //else i === j That is a divide number
            sum = sum + A[i][j] * x[j];
          }
        }
        temp[i] = (B[i] - sum) / A[i][i]; //update x[i]
      }
      x = temp;
      // x = JSON.parse(JSON.stringify(temp));
      // console.log(x);
      // console.log(temp);
    } while (error(x, xold)); //if true , continue next iteration
    // console.log("jacobi stop");
    console.log(dataInTable);
    setanswercount(answercount + 1);
  }

  function error(xnew, xold) {
    for (let i = 0; i < xnew.length; i++) {
      epsilon[i] = Math.abs((xnew[i] - xold[i]) / xnew[i]);
    }
    testdata(x, epsilon);
    for (let i = 0; i < epsilon.length; i++) {
      if (epsilon[i] > 0.000001 && count <= 50) {
        return true;
      }
    }
    return false;
  }

  function testdata(xin, error) {
    let temp = [{}];
    // console.log(xin);
    // console.log(columns);
    temp.iteration = count;
    count++;
    for (var i = 0; i < xin.length; i++) {
      temp = {
        ...temp,
        ["x" + (i + 1)]: xin[i].toFixed(8),
        ["error" + (i + 1)]: error[i].toFixed(8),
      };
    }
    dataInTable.push(temp);
    // console.log(temp);
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

  function initialSchema(n) {
    columns = [];
    columns.push({
      title: "Iteration",
      dataIndex: "iteration",
      key: "iteration",
    });
    for (var i = 1; i <= n; i++) {
      columns.push({
        title: "X" + i,
        dataIndex: "x" + i,
        key: "x" + i,
      });
    }
    for (i = 1; i <= n; i++) {
      columns.push({
        title: "Error" + i,
        dataIndex: "error" + i,
        key: "error" + i,
      });
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
          {/* <Button onClick={getdata}>Example</Button> */}
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
                  onClick={() => jacobi()}
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
