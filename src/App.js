import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
// import './App.css';

import Menubar from "./Layout_component/Menubar";
import Home from "./Layout_component/Home";
import Bisection from "./Algorithm/Root of Equation/Bisection";
import FalsePosition from "./Algorithm/Root of Equation/FalsePosition";
import OnePoint from "./Algorithm/Root of Equation/OnePoint";
import NewtonRaphson from "./Algorithm/Root of Equation/NewtonRaphson";
import Secant from "./Algorithm/Root of Equation/Secant";
import Camer from "./Algorithm/Linear Algebra/Camer";
import Jacobi from "./Algorithm/Linear Algebra/Jacobi";
import GaussEliminate from "./Algorithm/Linear Algebra/GaussEliminate";
import GaussJordan from "./Algorithm/Linear Algebra/GaussJordan";
import LUDecomposition from "./Algorithm/Linear Algebra/LUDecomposition";
import GaussSeidei from "./Algorithm/Linear Algebra/GaussSeidei";
import ConjugateGradient from "./Algorithm/Linear Algebra/ConjugateGradient";
import NewtonDivide from "./Algorithm/Interpolation/NewtonDivide";
import Lagrange from "./Algorithm/Interpolation/Lagrange";
import Spline from "./Algorithm/Interpolation/Spline";
import Linear from "./Algorithm/LSR/Linear";
import Polynomial from "./Algorithm/LSR/Polynomial";
import Multiple from "./Algorithm/LSR/Multiple";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Menubar />
        <Switch>
          <Route path="/Home" component={Home} />
          <Route path="/Bisection" component={Bisection} />
          <Route path="/FalsePosition" component={FalsePosition} />
          <Route path="/OnePoint" component={OnePoint} />
          <Route path="/NewtonRaphson" component={NewtonRaphson} />
          <Route path="/Secant" component={Secant} />
          <Route path="/Camer" component={Camer} />
          <Route path="/Jacobi" component={Jacobi} />
          <Route path="/GaussEli" component={GaussEliminate} />
          <Route path="/GaussJor" component={GaussJordan} />
          <Route path="/LU" component={LUDecomposition} />
          <Route path="/GaussSei" component={GaussSeidei} />
          <Route path="/Conjugate" component={ConjugateGradient} />
          <Route path="/NewtonDivide" component={NewtonDivide} />
          <Route path="/Lagrange" component={Lagrange} />
          <Route path="/Spline" component={Spline} />
          <Route path="/LeastL" component={Linear} />
          <Route path="/LeastP" component={Polynomial} />
          <Route path="/LeastM" component={Multiple} />
          <Route path="" component={Home} />
          {/* <Route path="/about" component={About} />
          <Route path="/posts" component={Post} />
          <Route path="/projects" component={Project} /> */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
