import React from "react";
import logo from "../logo.svg";
import { Layout } from "antd";

import "./Home.css";

const { Header, Footer, Sider, Content } = Layout;

export default function Home() {
  return (
    <>
      <Layout>
        <section className="section">
          <article>
            <img src={logo} className="App-logo" alt="logo" />
            Welcome to Numerical Meathod Website
          </article>
        </section>
      </Layout>
    </>
  );
}
