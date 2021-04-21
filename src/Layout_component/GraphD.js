import React from "react";
import Desmos from "desmos";
import { useEffect } from "react";
// import { UseLatexContext } from '../Algorithm/Bisection'

export default function GraphD(props) {
  // const {latex, setlatex} = UseLatexContext();

  useEffect(() => {
    const elt = document.getElementById("showgraph");
    elt.style.width = "600px";
    elt.style.height = "400px";

    const calculator = Desmos.GraphingCalculator(elt, {
      expressions: false,
      autosize: false,
      settingsMenu: false,
      zoomButtons: false,
    });
    calculator.setExpression({ id: "graph1", latex: props.func });
    document.getElementsByClassName(
      "dcg-graphpaper-branding"
    )[0].style.display = "none";
    return () => {
      calculator.destroy();
    };
  });

  return <div id="showgraph" className="showgraph"></div>;
}
