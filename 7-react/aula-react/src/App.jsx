import { useState } from "react";
import "./App.css";
import LogoList from "./components/LogoList";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LogoList />
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 2)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;