import React, { useState } from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import { UseLatexContext } from "../Algorithm/Bisection";

import "./EditableMath.css";

// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles();

export default function EditableMath() {
  const { latex, setlatex } = UseLatexContext();

  return (
    <div className="divinput">
      <EditableMathField
        latex={latex}
        onChange={(mathField) => {
          setlatex.setlatex(mathField.latex());
        }}
      />
    </div>
  );
}
