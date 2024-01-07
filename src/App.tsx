import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Workspace from "./components/Workspace";
import "./styles/App.css";

function App() {
  const [kx, setKx] = useState(1);
  const [ky, setKy] = useState(1);
  const [kz, setKz] = useState(1);

  const setK1 = (k: number) => {
    setKx(k);
  };
  const setK2 = (k: number) => {
    setKy(k);
  };
  const setK3 = (k: number) => {
    setKz(k);
  };
  console.log(kx, ky, kz);
  return (
    <>
      <Workspace k1={kx} k2={ky} k3={kz} />
      <Sidebar setK1={setK1} setK2={setK2} setK3={setK3} />
    </>
  );
}

export default App;
