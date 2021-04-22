import React from "react";
import { useState } from "react";
import { InputNumber, Button, Card, Row, Col } from "antd";
import axios from "axios";

let InputX = [];
let InputY = [];
let InputP = [];
let inx = [];
let iny = [];
let interpolatePoint = [];
let fx = 0;

export default function Lagrange() {
  const [quantity, setquantity] = useState(0);
  const [interpolate, setinterpolate] = useState(0);
  const [expectx, setexpectx] = useState(0);
  const [answercount, setanswercount] = useState(0);

  async function getdata() {
    let key = "AbksdfbjhI56sdf5Sd89f9sdSF41";
    let fetchdata = await axios({
      method: "get",
      url: "http://localhost:8080/Lagrange&key=" + key,
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
    createInterpolateInput(fetchdata.i);
    setquantity(fetchdata.col);
    setexpectx(fetchdata.Xi);
    setinterpolate(fetchdata.i);
    for (let i = 1; i <= fetchdata.col; i++) {
      document.getElementById("x" + i).value = fetchdata.X[i - 1];
      document.getElementById("y" + i).value = fetchdata.Y[i - 1];
    }
    for (let i = 1; i <= fetchdata.i; i++) {
      document.getElementById("p" + i).value = fetchdata.I[i - 1];
    }
  }

  function createInput(row) {
    InputX = [];
    InputY = [];
    for (let i = 1; i <= row; i++) {
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

  function createInterpolateInput(row) {
    InputP = [];
    for (var i = 1; i <= row; i++) {
      InputP.push(
        <InputNumber
          style={{
            width: "80%",
            marginInlineEnd: "3%",
            marginBlockEnd: "3%",
          }}
          id={"p" + i}
          key={"p" + i}
          placeholder={"p" + i}
          max={quantity}
          min={1}
        />
      );
      InputP.push(<br key={"br p" + i} />);
    }
  }

  function initValue() {
    inx = [];
    iny = [];
    interpolatePoint = [];
    for (let i = 1; i <= quantity; i++) {
      if (document.getElementById("x" + i).value === "") {
        inx[i] = 0;
      } else {
        inx[i] = parseFloat(document.getElementById("x" + i).value);
      }
      if (document.getElementById("y" + i).value === "") {
        iny[i] = 0;
      } else {
        iny[i] = parseFloat(document.getElementById("y" + i).value);
      }
    }
    for (let i = 1; i <= interpolate; i++) {
      if (document.getElementById("p" + i).value === "") {
        interpolatePoint[i] = 0;
      } else {
        interpolatePoint[i] = parseFloat(
          document.getElementById("p" + i).value
        );
      }
    }
    // console.log(inx);
    // console.log(iny);
    // console.log(interpolatePoint);
  }

  function handleInput(value) {
    if (value === null || value < 0) {
      value = 0;
    }
    if (value >= 0) {
      createInput(parseInt(value));
      setquantity(parseInt(value));
    }
  }

  function handleInterpolate(value) {
    if (value === null || value < 0) {
      value = 0;
    }
    if (value >= 0) {
      setinterpolate(parseInt(value));
      createInterpolateInput(parseInt(value));
    }
  }
  function handleExpectX(value) {
    if (value === null) {
      value = 0;
    }
    setexpectx(parseFloat(value));
  }

  function lagrange() {
    initValue();
    var arr = [];
    var x = [];
    var y = [];
    var xi = expectx;
    for (let i = 0; i < interpolate; i++) {
      arr.push([]);
      x.push(inx[interpolatePoint[i + 1]]);
      y.push(iny[interpolatePoint[i + 1]]);
    }
    var sum = 0;
    for (let i = 0; i < x.length; i++) {
      var temp = 1;
      for (let j = 0; j < x.length; j++) {
        if (i !== j) {
          console.log("index:" + j);
          console.log("value:" + x[j]);
          temp *= (x[j] - xi) / (x[j] - x[i]);
        }
      }
      sum += temp * y[i];
    }
    // console.log(arr);
    // console.log(x);
    // console.log(y);
    // console.log(sum);
    fx = sum;
    setanswercount(answercount + 1);
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
          <Col span={4}>
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
          <Col span={4}>
            <InputNumber
              value={expectx}
              id="expectX"
              onChange={handleExpectX}
            />
          </Col>

          <Col span={2}>
            <span>Interpolate</span>
          </Col>
          <Col span={1}>
            <span>:</span>
          </Col>
          <Col span={4}>
            <InputNumber
              id="interpolate"
              onChange={handleInterpolate}
              value={interpolate}
              max={quantity}
              min={0}
            />
          </Col>
          <Col span={3}>
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
        <Card style={{ display: "inline-block", width: "35%" }} title="Input X">
          {InputX}
        </Card>
        <Card style={{ display: "inline-block", width: "35%" }} title="Input Y">
          {InputY}
        </Card>
        <Card
          style={{ display: "inline-block", width: "30%" }}
          title="Interpolate Point"
        >
          {InputP}
        </Card>
        <br />
      </div>
      {quantity > 0 && interpolate >= 2 && (
        <Card>
          <Button
            size="large"
            id="matrix_button"
            // onClick={() => newton_difference(interpolate, expectx)}
            onClick={() => lagrange()}
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
