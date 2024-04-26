import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ReactGA from "react-ga4";

// 구글 애널리틱스 운영서버만 적용
if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
