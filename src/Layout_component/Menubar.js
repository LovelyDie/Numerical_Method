import { useState } from "react";
import { Menu } from "antd";

// import { Router } from "react-router-dom";
import { Link } from "react-router-dom";
import { PageHeader } from "antd";

// import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
// import reactDom from 'react-dom';

import "./Menubar.css";

const { SubMenu } = Menu;

function Menubar() {
  const [current, setcurrent] = useState("Home");
  const [title, settitle] = useState("Home");
  const [subtitle, setsubtitle] = useState("Home Page");

  // const location = useLocation();

  // useEffect(() => {
  //   // console.log(location.pathname.substring(1,));
  //   // setcurrent(location.pathname.substring(1));
  //   for (const i in alltitle) {
  //     if (current === alltitle[i].cu) {
  //       settitle(alltitle[i].tt);
  //       setsubtitle(alltitle[i].st);
  //     }
  //   }
  // });

  const alltitle = [
    {
      cu: "Home",
      tt: "Home",
      st: "Home Page",
    },
    {
      cu: "Bisection",
      tt: "Bisection",
      st: "",
    },
    {
      cu: "FalsePosition",
      tt: "False Position",
      st: "",
    },
    {
      cu: "OnePoint",
      tt: "One Point Iteration",
      st: "",
    },
    {
      cu: "NewtonRaphson",
      tt: "Newton Raphson",
      st: "",
    },
    {
      cu: "Camer",
      tt: "Camer",
      st: "",
    },
    {
      cu: "GaussEli",
      tt: "Gauss Eliminate",
      st: "",
    },
    {
      cu: "GaussJor",
      tt: "Gauss Jordan",
      st: "",
    },
    {
      cu: "LU",
      tt: "LU Decomposition",
      st: "",
    },
    {
      cu: "GaussSei",
      tt: "Gauss Seidei",
      st: "",
    },
    {
      cu: "Conjugate",
      tt: "Conjugate Gradient",
      st: "",
    },
    {
      cu: "NewtonDivide",
      tt: "Newton Divide Difference",
      st: "",
    },
    {
      cu: "Lagrange",
      tt: "Lagrange",
      st: "",
    },
    {
      cu: "Spline",
      tt: "Spline",
      st: "",
    },
    {
      cu: "LeastL",
      tt: "Least Squre Regression",
      st: "Linear",
    },
    {
      cu: "LeastP",
      tt: "Least Squre Regression",
      st: "Polynomial",
    },
    {
      cu: "LeastM",
      tt: "Least Squre Regression",
      st: "Multiple Linear",
    },
    {
      cu: "Secant",
      tt: "Secant",
      st: "",
    },
    {
      cu: "Jacobi",
      tt: "Jabobi",
      st: "",
    },
  ];

  const handleClick = (e) => {
    setcurrent(e.key);
    for (const i in alltitle) {
      if (e.key === alltitle[i].cu) {
        settitle(alltitle[i].tt);
        setsubtitle(alltitle[i].st);
      }
    }
  };

  return (
    <>
      <Menu onClick={handleClick} selectedKeys={current} mode="horizontal">
        <Menu.Item key="Home">
          <Link to="/Home">Home Page</Link>
        </Menu.Item>
        <SubMenu title="Root of Equation">
          <Menu.Item key="Bisection">
            <Link to="/Bisection">Bisection</Link>
          </Menu.Item>
          <Menu.Item key="FalsePosition">
            <Link to="/FalsePosition">False Position</Link>
          </Menu.Item>
          <Menu.Item key="OnePoint">
            <Link to="/OnePoint">One Point Iteration</Link>
          </Menu.Item>
          <Menu.Item key="NewtonRaphson">
            <Link to="/NewtonRaphson">Newton Rhapson</Link>
          </Menu.Item>
          <Menu.Item key="Secant">
            <Link to="/Secant">Secant</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu title="Linear Algebra">
          <Menu.Item key="Camer">
            <Link to="/Camer">Camer</Link>
          </Menu.Item>
          <Menu.Item key="Jacobi">
            <Link to="/Jacobi">Jacobi</Link>
          </Menu.Item>
          <Menu.Item key="GaussEli">
            <Link to="/GaussEli">Gauss Eliminate</Link>
          </Menu.Item>
          <Menu.Item key="GaussJor">
            <Link to="/GaussJor">Gauss Jordan</Link>
          </Menu.Item>
          <Menu.Item key="LU">
            <Link to="/LU">LU Decomposition</Link>
          </Menu.Item>
          <Menu.Item key="GaussSei">
            <Link to="/GaussSei">Gauss Seidei</Link>
          </Menu.Item>
          <Menu.Item key="Conjugate">
            <Link to="/Conjugate">Conjugate Gradient</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu title="Interpolation">
          <Menu.Item key="NewtonDivide">
            <Link to="/NewtonDivide">Newton Divide Difference</Link>
          </Menu.Item>
          <Menu.Item key="Lagrange">
            <Link to="/Lagrange">Lagrange</Link>
          </Menu.Item>
          <Menu.Item key="Spline">
            <Link to="/Spline">Spline</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu title="Least Squre Regression">
          <Menu.Item key="LeastL">
            <Link to="/LeastL">Linear</Link>
          </Menu.Item>
          <Menu.Item key="LeastP">
            <Link to="/LeastP">Polynomial</Link>
          </Menu.Item>
          <Menu.Item key="LeastM">
            <Link to="/LeastM">Multiple Linear</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
      <PageHeader
        className="site-page-header"
        // onBack={() => null}
        title={title}
        subTitle={subtitle}
      />
    </>
  );
}

export default Menubar;
