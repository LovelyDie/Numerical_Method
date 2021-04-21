import React from "react";
import { useState } from "react";
import { InputNumber, Button, Card, Row, Col } from "antd";
import axios from "axios";

const Cubic_Spline = require("cubic-spline");

let InputX = [];
let InputY = [];
let inx = [];
let iny = [];
let fx = 0;

export default function Spline() {
  const [quantity, setquantity] = useState(0);
  const [expectx, setexpectx] = useState(0);
  const [answercount, setanswercount] = useState(0);

  function spline() {
    initValue();
    fx = new Cubic_Spline(inx, iny).at(expectx);
    // console.log();
    setanswercount(answercount + 1);
  }

  async function getdata() {
    let fetchdata = await axios({
      method: "get",
      url: "http://localhost:8080/Spline",
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
    createInput(fetchdata.col);
    // createInterpolateInput(fetchdata.i);
    setquantity(fetchdata.col);
    setexpectx(fetchdata.Xi);
    // setinterpolate(fetchdata.i);
    for (var i = 1; i <= fetchdata.col; i++) {
      document.getElementById("x" + i).value = fetchdata.X[i - 1];
      document.getElementById("y" + i).value = fetchdata.Y[i - 1];
    }
  }

  function createInput(row) {
    InputX = [];
    InputY = [];
    for (var i = 1; i <= row; i++) {
      InputX.push(
        <InputNumber
          style={{
            width: "80%",
            marginInlineEnd: "3%",
            marginBlockEnd: "3%",
          }}
          id={"x" + i}
          key={"x" + i}
          placeholder={"x" + i}
        />
      );
      InputX.push(<br key={"br x" + i} />);
      InputY.push(
        <InputNumber
          style={{
            width: "80%",
            marginInlineEnd: "3%",
            marginBlockEnd: "3%",
          }}
          id={"y" + i}
          key={"y" + i}
          placeholder={"y" + i}
        />
      );
      InputY.push(<br key={"br y" + i} />);
    }
  }

  function initValue() {
    inx = [];
    iny = [];
    for (var i = 1; i <= quantity; i++) {
      if (document.getElementById("x" + i).value == "") {
        inx[i] = 0;
      } else {
        inx[i] = parseFloat(document.getElementById("x" + i).value);
      }
      if (document.getElementById("y" + i).value == "") {
        iny[i] = 0;
      } else {
        iny[i] = parseFloat(document.getElementById("y" + i).value);
      }
    }
  }

  function handleInput(value) {
    if (value == null || value < 0) {
      value = 0;
    }
    if (value >= 0) {
      createInput(parseInt(value));
      setquantity(parseInt(value));
    }
  }

  function handleExpectX(value) {
    if (value == null) {
      value = 0;
    }
    setexpectx(parseFloat(value));
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
          <Col span={7}>
            <InputNumber
              value={quantity}
              id="input"
              onChange={handleInput}
              min={0}
            />
          </Col>

          <Col span={2}>
            <span>Expect X</span>
          </Col>
          <Col span={1}>
            <span>:</span>
          </Col>
          <Col span={7}>
            <InputNumber
              value={expectx}
              id="expectX"
              onChange={handleExpectX}
            />
          </Col>
          <Col span={4}>
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
        <Card style={{ display: "inline-block", width: "50%" }} title="Input X">
          {InputX}
        </Card>
        <Card style={{ display: "inline-block", width: "50%" }} title="Input Y">
          {InputY}
        </Card>
        <br />
      </div>
      {quantity > 0 && (
        <Card>
          <Button
            size="large"
            id="matrix_button"
            // onClick={() => newton_difference(interpolate, expectx)}
            onClick={() => spline()}
          >
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
