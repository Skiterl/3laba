interface InputInfo {
  setK: (k: number) => void;
}

function ParInput({ setK }: InputInfo) {
  return (
    <input
      className="custominput"
      type="number"
      step={0.01}
      defaultValue={1}
      onChange={(e) => setK(Number(e.target.value))}
    />
  );
}

export default ParInput;
