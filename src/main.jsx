import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

// Prevent arrow keys from changing number input values (make them behave like text boxes)
document.addEventListener("keydown", (e) => {
  if (
    (e.key === "ArrowUp" || e.key === "ArrowDown") &&
    e.target instanceof HTMLInputElement &&
    e.target.type === "number"
  ) {
    e.preventDefault();
  }
});

// Also prevent mouse scroll wheel from changing number input values
document.addEventListener("wheel", (e) => {
  if (
    e.target instanceof HTMLInputElement &&
    e.target.type === "number"
  ) {
    e.target.blur();
  }
}, { passive: true });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);