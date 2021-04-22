import React from "react";
import { useState } from "react";
import { InputNumber, Button, Card, Row, Col } from "antd";

import axios from "axios";

const { regression } = require("multiregress");

let InputX = [];
let InputY = [];
let InputEX = [];
let inx = [];
let iny = [];
let inex = [];
let xy = [];
let fx = 0;

export default function Multiple() {
  const [row, setrow] = useState(0);
  const [columns, setcolumns] = useState(1);
  const [answercount, setanswercount] = useState(0);

  async function getdata() {
    let key = "AbksdfbjhI56sdf5Sd89f9sdSF41";
    let fetchdata = await axios({
      method: "get",
      url: "http://localhost:8080/Muultiple?auth_key=" + key,
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
    console.log(fetchdata);
    createInput(parseInt(fetchdata.col), parseInt(fetchdata.row));
    createExpectX(fetchdata.row);
    setrow(fetchdata.col);
    setcolumns(fetchdata.row);
    for (let i = 1; i <= fetchdata.col; i++) {
      for (let j = 1; j <= fetchdata.row; j++) {
        document.getElementById("x" + i + "" + j).value =
          fetchdata.X[i - 1][j - 1];
      }
    }
    for (let i = 1; i <= fetchdata.col; i++) {
      document.getElementById("y" + i).value = fetchdata.Y[i - 1];
    }
    for (let i = 1; i <= fetchdata.row; i++) {
      document.getElementById("ex" + i).value = fetchdata.Xi[i - 1];
    }
  }

  function Multiple() {
    initValue();
    var arr = regression(xy);
    console.log(arr);
    console.log(inex);
    var sum = arr[0];
    for (let i = 1; i < arr.length; i++) {
      sum += inex[i - 1] * arr[i];
    }
    console.log(sum);
    fx = sum;
    setanswercount(answercount + 1);
  }

  function createInput(row, column) {
    InputX = [];
    InputY = [];
    for (var i = 1; i <= row; i++) {
      for (var j = 1; j <= column; j++) {
        InputX.push(
          <InputNumber
            style={{
              width: "10%",
              marginInlineEnd: "3%",
              marginBlockEnd: "3%",
            }}
            id={"x" + i + "" + j}
            key={"x" + i + "" + j}
            placeholder={"x" + i + "" + j}
          />
        );
      }
      InputX.push(<br key={"br x" + i} />);
      InputY.push(
        <InputNumber
          style={{
            width: "80%",
            marginInlineEnd: "3%",
            marginBlockEnd: "15%",
          }}
          id={"y" + i}
          key={"y" + i}
          placeholder={"y" + i}
        />
      );
      InputY.push(<br key={"br y" + i} />);
    }
  }

  function createExpectX(row) {
    InputEX = [];
    for (var i = 1; i <= row; i++) {
      InputEX.push(
        <InputNumber
          style={{
            width: "10%",
            marginLeft: "1%",
          }}
          id={"ex" + i}
          key={"ex" + i}
          placeholder={"ex" + i}
        />
      );
    }
  }

  function initValue() {
    inx = [];
    iny = [];
    inex = [];
    xy = [];
    for (var i = 0; i < row; i++) {
      inx[i] = [];
      xy[i] = [];
      for (var j = 0; j < columns; j++) {
        if (
          document.getElementById("x" + (i + 1) + "" + (j + 1)).value === ""
        ) {
          inx[i][j] = 0;
        } else {
          inx[i][j] = parseFloat(
            document.getElementById("x" + (i + 1) + "" + (j + 1)).value
          );
        }
        xy[i][j] = inx[i][j];
      }
      if (document.getElementById("y" + (i + 1)).value === "") {
        iny[i] = 0;
      } else {
        iny[i] = parseFloat(document.getElementById("y" + (i + 1)).value);
      }
      xy[i][columns] = iny[i];
    }
    for (let i = 0; i < columns; i++) {
      if (document.getElementById("ex" + (i + 1)).value === "") {
        inex[i] = 0;
      } else {
        inex[i] = parseFloat(document.getElementById("ex" + (i + 1)).value);
      }
    }
    console.log(xy);
  }

  function handleInput(value) {
    if (value === null || value < 0) {
      value = 0;
    }
    if (value >= 0) {
      createInput(parseInt(value), columns);
      setrow(parseInt(value));
    }
  }

  // function handleExpectX(value) {
  //   if (value === null) {
  //     value = 0;
  //   }
  //   // setexpectx(parseFloat(value));
  // }

  function handleColumn(value) {
    if (value === null || value < 0) {
      value = 0;
    }
    if (value >= 0) {
      createInput(row, parseInt(value));
      createExpectX(value);
      setcolumns(parseInt(value));
    }
  }

  return (
    <div>
      <Card title="Initial">
        <Row>
          <Col span={2}>
            <span>Input</span>
          </Col>
          <Col span={1}>
            <span>:</span>
          </Col>
          <Col span={5}>
            <InputNumber
              value={row}
              id="input"
              onChange={handleInput}
              min={0}
            />
          </Col>
          <Col span={2}>
            <span>Column</span>
          </Col>
          <Col span={1}>
            <span>:</span>
          </Col>
          <Col span={5}>
            <InputNumber
              id="column"
              value={columns}
              onChange={handleColumn}
              min={1}
            />
          </Col>
          <Col span={5}>
            <Button
              style={{ marginLeft: "5%" }}
              onClick={async (e) => {
                await getdata();
              }}
            >
              Example
            </Button>
          </Col>
        </Row>
      </Card>
      <div style={{ display: "flex" }}>
        <Card style={{ display: "inline-block", width: "80%" }} title="Input X">
          {InputX}
        </Card>
        <Card style={{ display: "inline-block", width: "20%" }} title="Input Y">
          {InputY}
        </Card>
        <br />
      </div>
      <Card title="Expect X">{InputEX}</Card>
      {row > 0 && columns >= 1 && (
        <Card>
          <Button size="large" id="matrix_button" onClick={() => Multiple()}>
            Submit
          </Button>
        </Card>
      )}
      <Card title="Answer (Fx)">
        <span> f(x) : </span>
        {fx}
      </Card>
    </div>
  );
}
