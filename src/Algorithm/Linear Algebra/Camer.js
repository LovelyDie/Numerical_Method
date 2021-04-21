import React from "react";
import { useState } from "react";
import { Select, Input, Button, Card, Table } from "antd";
import { det } from "mathjs";
import axios from "axios";

const { Option } = Select;

let matrixA = [];
let matrixB = [];
let A = [];
let B = [];
let answer = [];

// const InputStyle = {
//   background: "#1890ff",
//   color: "white",
//   fontWeight: "bold",
//   fontSize: "24px",
// };

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

export default function Camer() {
  const [matrix, setmatrix] = useState("0");
  const [answercount, setanswercount] = useState(0);

  async function getdata() {
    let fetchdata = await axios({
      method: "get",
      url: "http://localhost:8080/Cramer",
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

  function cramer() {
    initMatrix();
    answer = [];
    var data = [];
    var counter = 0;

    while (counter != matrix) {
      var transformMatrix = JSON.parse(JSON.stringify(A)); //Deep copy
      for (var i = 0; i < matrix; i++) {
        for (var j = 0; j < matrix; j++) {
          if (j === counter) {
            transformMatrix[i][j] = B[i];
            break;
          }
        }
      }
      counter++;
      answer.push(
        <h2 key={"k" + counter}>
          X<sub>{counter}</sub>=&nbsp;&nbsp;
          {Math.round(det(transformMatrix)) / Math.round(det(A))}
        </h2>
      );
      answer.push(<br />);
      data[counter - 1] = Math.round(det(transformMatrix)) / Math.round(det(A));
    }
    createTable(data);
    setanswercount(answercount + 1);
    console.log(dataInTable);
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
            width: "10%",
            marginInlineEnd: "3%",
            marginBlockEnd: "3%",
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
                  onClick={() => cramer()}
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
          pagination={{ defaultPageSize: 10 }}
          columns={columns}
          dataSource={dataInTable}
          bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "black" }}
        />
      </Card>
    </div>
  );
}
