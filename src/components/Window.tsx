import Canvas3D from "./UI/Canvas3D/Canvas3D";
interface CanvasInfo {
  id: string;
}
function Window({ id }: CanvasInfo) {
  return <Canvas3D id={id} />;
}

export default Window;
