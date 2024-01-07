import ParInput from "./UI/ParInput/ParInput";

interface SidebarInfo {
  setK1: (k1: number) => void;
  setK2: (k2: number) => void;
  setK3: (k3: number) => void;
}

function Sidebar({ setK1, setK2, setK3 }: SidebarInfo) {
  return (
    <div className="sidebar">
      <label>kx</label>
      <ParInput setK={setK1} />
      <label>ky</label>
      <ParInput setK={setK2} />
      <label>kz</label>
      <ParInput setK={setK3} />
    </div>
  );
}

export default Sidebar;
