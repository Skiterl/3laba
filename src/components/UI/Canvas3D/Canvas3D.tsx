import styles from "./Canvas3D.module.css";
import useCanvas from "../../../hooks/useCanvas";

interface CanvasInfo {
  draw: (context: CanvasRenderingContext2D) => void;
  rest?: JSX.Element | JSX.Element[];
}

function Canvas3D({ draw, ...rest }: CanvasInfo) {
  const styleClasses = [styles.Canvas3D];
  const ref = useCanvas(draw);

  /*const points: Matrix[] = [
    new Matrix(4, 4, [[1], [1], [1], [0]]),
    new Matrix(4, 4, [[-1], [-1], [-1], [0]]),
    new Matrix(4, 4, [[1], [-1], [1], [0]]),
    new Matrix(4, 4, [[-1], [1], [1], [0]]),
  ];*/

  return (
    <canvas
      ref={ref}
      {...rest}
      className={styleClasses.join(" ")}
      width={700}
      height={400}
    />
  );
}

export default Canvas3D;
