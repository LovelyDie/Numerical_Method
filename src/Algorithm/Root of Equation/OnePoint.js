import React from "react";
import { useState } from "react";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import { Table, Card, Col, Row, Button, Input } from "antd";

import GraphD from "../../Layout_component/GraphD";
// import EditableMath from "../Layout_component/EditableMath";
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
data["x"] = [];
data["error"] = [];

function createTable(x, error) {
  dataInTable = [];
  for (var i = 1; i < x.length; i++) {
    dataInTable.push({
      iteration: i,
      x: x[i],
      error: error[i],
    });
  }
}

function cleardata() {
  data = [];
  data["x"] = [];
  data["error"] = [];
  dataInTable = [];
}

export default function OnePoint() {
  const [latex, setlatex] = useState("");
  const [start, setstart] = useState("");
  const [err, seterr] = useState("");
  const [c, setc] = useState(1);

  async function getdata() {
    let fetchdata = await axios({
      method: "get",
      url: "http://localhost:8080/Onepoint",
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
    setstart(fetchdata.x0);
    seterr(fetchdata.err);
  }

  function fx(x) {
    const algebraObj = new AlgebraLatex().parseLatex(latex).toMath();
    return mathjs.evaluate(algebraObj, { x: x });
  }

  function one_point(xo, inerr, i) {
    if (xo && inerr != "") {
      let xn = fx(xo);
      let err = Math.abs((xn - xo) / xn);

      data["x"][i] = xn.toFixed(8);
      data["error"][i] = err.toFixed(8);
      if (err < inerr || i == 50 || xn == "Infinity") {
        createTable(data["x"], data["error"]);
        return;
      } else {
        i++;
        return one_point(xn, inerr, i);
      }
    }
  }

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
              <Col span={3}>Start X</Col>
              <Col span={1}>:</Col>
              <Col span={8}>
                <Input
                  value={start}
                  onChange={(event) => setstart(event.target.value)}
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
                cleardata();
                one_point(parseFloat(start), parseFloat(err), 1);
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
