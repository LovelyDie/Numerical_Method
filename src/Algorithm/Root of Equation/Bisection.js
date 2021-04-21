import React from "react";
import { useState } from "react";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import { Table, Card, Col, Row, Button, Input } from "antd";

import GraphD from "../../Layout_component/GraphD";
import axios from "axios";

import "../Layout.css";

addStyles();

const mathjs = require("mathjs");

const AlgebraLatex = require("algebra-latex");

var dataInTable = [];

const columns = [
  {
    title: "Iteration",
    dataIndex: "iteration",
    key: "iteration",
  },
  {
    title: "XL",
    dataIndex: "xl",
    key: "xl",
  },
  {
    title: "XR",
    dataIndex: "xr",
    key: "xr",
  },
  {
    title: "X",
    dataIndex: "x",
    key: "x",
  },
  {
    title: "Error",
    key: "error",
    dataIndex: "error",
  },
];

var data = [];
data["xl"] = [];
data["xr"] = [];
data["x"] = [];
data["error"] = [];

function createTable(xl, xr, x, error) {
  dataInTable = [];
  for (var i = 0; i < xl.length; i++) {
    dataInTable.push({
      iteration: i + 1,
      xl: xl[i],
      xr: xr[i],
      x: x[i],
      error: error[i],
    });
  }
}

function cleardata() {
  data = [];
  data["xl"] = [];
  data["xr"] = [];
  data["x"] = [];
  data["error"] = [];
  dataInTable = [];
}

export default function Bisection() {
  const [latex, setlatex] = useState("");
  const [start, setstart] = useState("");
  const [stop, setstop] = useState("");
  const [err, seterr] = useState("");
  const [c, setc] = useState(1);

  async function getdata() {
    let fetchdata = await axios({
      method: "get",
      url: "http://localhost:8080/Bisection",
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
    setlatex(fetchdata.fx);
    setstart(fetchdata.xL);
    setstop(fetchdata.xR);
    seterr(fetchdata.err);
  }

  function fx(x) {
    const algebraObj = new AlgebraLatex().parseLatex(latex).toMath();
    return mathjs.evaluate(algebraObj, { x: x });
  }

  function calbi(l, r, inerr) {
    cleardata();
    if (l && r && inerr != "") {
      let m = (l + r) / 2;
      let xm = fx(m);
      let xr = fx(r);
      if (xm * xr > 0) {
        r = m;
      } else {
        l = m;
      }
      // console.log(data);
      // console.log(dataInTable);
      bisec(l, r, m, inerr, 1, 0);
    }
  }

  function bisec(l, r, old_m, inerr, err, i) {
    // console.log(inerr);
    if (err <= inerr || i == 49) {
      // console.log(l);
      // console.log(r);
      // console.log(i);
      // console.log(err);
      data["xl"][i] = l;
      data["xr"][i] = r;
      data["x"][i] = old_m.toFixed(8);
      data["error"][i] = err.toFixed(8);
      createTable(data["xl"], data["xr"], data["x"], data["error"]);
      return;
    } else {
      let m = (l + r) / 2;
      // console.log(old_m);
      let err = Math.abs((m - old_m) / m);
      let xm = fx(m);
      let xr = fx(r);
      // console.log(l);
      // console.log(r);
      // console.log(i);
      // console.log(err);
      data["xl"][i] = l;
      data["xr"][i] = r;
      data["x"][i] = old_m.toFixed(8);
      data["error"][i] = err.toFixed(8);
      i++;
      if (xm * xr > 0) {
        return bisec(l, m, m, inerr, err, i);
      } else {
        return bisec(m, r, m, inerr, err, i);
      }
    }
  }

  // console.log(start);
  // console.log(stop);

  return (
    <>
      <Row>
        <Col span={12}>
          <Card
            className="CardInput"
            title="Input"
            style={{ width: "100", height: "100%" }}
          >
            <Row>
              <Col span={3}>Function</Col>
              <Col span={1}>:</Col>
              <Col span={8}>
                <EditableMathField
                  style={{ background: "white", minHeight: "23px" }}
                  latex={latex}
                  config={{ autoCommands: "pi theta sqrt sum nthroot" }}
                  onChange={(mathField) => {
                    setlatex(mathField.latex());
                  }}
                />
              </Col>
            </Row>
            <hr />
            <Row>
              <Col span={3}>Start</Col>
              <Col span={1}>:</Col>
              <Col span={8}>
                <Input
                  value={start}
                  onChange={(event) => setstart(event.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col span={3}>Stop</Col>
              <Col span={1}>:</Col>
              <Col span={8}>
                <Input
                  value={stop}
                  onChange={(event) => setstop(event.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col span={3}>Error</Col>
              <Col span={1}>:</Col>
              <Col span={8}>
                <Input
                  value={err}
                  onChange={(event) => seterr(event.target.value)}
                />
              </Col>
            </Row>
            <hr />
            <Button
              type="primary"
              onClick={() => {
                calbi(parseFloat(start), parseFloat(stop), parseFloat(err));
                // printlatex();
                setc(c + 1);
              }}
            >
              Calculate
            </Button>
            <Button onClick={getdata}>Example</Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            className="CardGraph"
            title="Graph"
            style={{ width: "100", height: "100%" }}
          >
            <Row className="Funclatex">
              <Col span={7} className="Func">
                Function :{" "}
              </Col>
              <Col span={5} className="Latex">
                <StaticMathField>{latex}</StaticMathField>
              </Col>
            </Row>
            <GraphD func={latex} />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card
            className="CardAnswer"
            title="Answer"
            style={{ width: "100hv", height: "100%" }}
          >
            <Table
              columns={columns}
              dataSource={dataInTable}
              bodyStyle={{
                fontWeight: "bold",
                fontSize: "18px",
                color: "black",
              }}
            ></Table>
          </Card>
        </Col>
      </Row>
    </>
  );
}
