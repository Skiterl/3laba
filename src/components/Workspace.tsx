import { useState } from "react";
import { Matrix, Mxy, Mxz, Myz } from "../utils/math";
import Canvas3D from "./UI/Canvas3D/Canvas3D";

interface WorkspaceInfo {
  k1: number;
  k2: number;
  k3: number;
}

function Workspace({ k1, k2, k3 }: WorkspaceInfo) {
  const [kxold, setKxold] = useState(1);
  const [kyold, setKyold] = useState(1);
  const [kzold, setKzold] = useState(1);
  let kx: number, ky: number, kz: number;
  (kx = k1), (ky = k2), (kz = k3);

  let coswy = ky * Math.sqrt(2 / (kx * kx + ky * ky + kz * kz));
  if (coswy > 1) coswy = 1;
  else if (coswy < -1) coswy = -1;
  let coswz = kz * Math.sqrt(2 / (kx * kx + ky * ky + kz * kz));
  if (coswz > 1) coswz = 1;
  else if (coswz < -1) coswz = -1;

  const sinwz = Math.sqrt(1 - coswz * coswz);

  const phix = coswy <= 1 ? -Math.acos(coswy) : -Math.acosh(coswy);
  const phiy =
    sinwz / coswy <= 1 ? Math.acos(sinwz / coswy) : Math.acosh(sinwz / coswy);

  const sin_phix = Math.sin(phix);
  const sin_phiy = Math.sin(phiy);

  const sin_phiz = Math.sqrt(1 - sin_phix * sin_phix - sin_phiy * sin_phiy);
  const phiz = Math.asin(sin_phiz);
  //-35.264389682754654 45 24.0948425521107
  console.log(
    (phix * 180) / Math.PI,
    (phiy * 180) / Math.PI,
    (phiz * 180) / Math.PI
  );

  const _phix = (35.264389682754654 * Math.PI) / 180;
  const _phiy = (-45 * Math.PI) / 180;
  const _phiz = (-24.0948425521107 * Math.PI) / 180;

  const _Rphix = new Matrix(4, 4, [
    [1, 0, 0, 0],
    [0, Math.cos(_phix), Math.sin(_phix), 0],
    [0, -Math.sin(_phix), Math.cos(_phix), 0],
    [0, 0, 0, 1],
  ]);

  const _Rphiy = new Matrix(4, 4, [
    [Math.cos(_phiy), 0, -Math.sin(_phiy), 0],
    [0, 1, 0, 0],
    [Math.sin(_phiy), 0, Math.cos(_phiy), 0],
    [0, 0, 0, 1],
  ]);
  const _Rphiz = new Matrix(4, 4, [
    [Math.cos(_phiz), Math.sin(_phiz), 0, 0],
    [-Math.sin(_phiz), Math.cos(_phiz), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);

  const Rphix = new Matrix(4, 4, [
    [1, 0, 0, 0],
    [0, Math.cos(phix), Math.sin(phix), 0],
    [0, -Math.sin(phix), Math.cos(phix), 0],
    [0, 0, 0, 1],
  ]);

  const Rphiy = new Matrix(4, 4, [
    [Math.cos(phiy), 0, -Math.sin(phiy), 0],
    [0, 1, 0, 0],
    [Math.sin(phiy), 0, Math.cos(phiy), 0],
    [0, 0, 0, 1],
  ]);

  const Rphiz = new Matrix(4, 4, [
    [Math.cos(phiz), Math.sin(phiz), 0, 0],
    [-Math.sin(phiz), Math.cos(phiz), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);

  const R = Rphix.multiply(Rphiy);
  const Rxy = R.multiply(Mxy);
  const Rxz = R.multiply(Mxz);
  const Ryz = R.multiply(Myz);

  const rotateMatrixXY = R.multiply(_Rphiy).multiply(_Rphix);
  const rotateMatrixXZ = R.multiply(_Rphiz).multiply(_Rphix);
  const rotateMatrixYZ = R.multiply(_Rphiz).multiply(_Rphiy);

  const axesPoints: Matrix[] = [
    new Matrix(4, 1, [[5], [0], [0], [0]]),
    new Matrix(4, 1, [[0], [0], [0], [0]]),
    new Matrix(4, 1, [[0], [5], [0], [0]]),
    new Matrix(4, 1, [[0], [0], [0], [0]]),
    new Matrix(4, 1, [[0], [0], [5], [0]]),
    new Matrix(4, 1, [[0], [0], [0], [0]]),
  ];

  //console.log(coswy, coswz, sinwz, phix, phiy);

  const scale = 40;

  const draw = (context: CanvasRenderingContext2D) => {
    //console.log(kxold, kyold, kzold, kx, ky, kz);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const poligon = rotatePoints(points);
    poligon.forEach((point, i) => {
      drawLinexy(context, point, poligon[(i + 1) % poligon.length]);
    });
    const axes = rotatePoints(axesPoints);
    axes.forEach((point, i) => {
      drawLinexy(context, point, axes[(i + 1) % axes.length]);
    });
    setKxold(kx), setKyold(ky), setKzold(kz);
  };

  const drawFront = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const poligon = rotatePointsFront(points);
    poligon.forEach((point, i) => {
      drawLinexy(context, point, poligon[(i + 1) % poligon.length]);
    });
    const axes = rotatePointsFront(axesPoints);
    axes.forEach((point, i) => {
      drawLinexy(context, point, axes[(i + 1) % axes.length]);
    });
  };

  const drawUp = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const poligon = rotatePointsUp(points);
    poligon.forEach((point, i) => {
      drawLinexz(context, point, poligon[(i + 1) % poligon.length]);
    });
    const axes = rotatePointsUp(axesPoints);
    axes.forEach((point, i) => {
      drawLinexz(context, point, axes[(i + 1) % axes.length]);
    });
  };

  const drawRight = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const poligon = rotatePointsRight(points);
    poligon.forEach((point, i) => {
      drawLineyz(context, point, poligon[(i + 1) % poligon.length]);
    });
    const axes = rotatePointsRight(axesPoints);
    axes.forEach((point, i) => {
      drawLineyz(context, point, axes[(i + 1) % axes.length]);
    });
  };

  const rotatePoints = (points: Matrix[]) => {
    const figure = points;

    const poligon = figure.map((value) => {
      return R.multiply(value);
    });
    return poligon;
  };

  const rotatePointsUp = (points: Matrix[]) => {
    const figure = points;

    const poligon = figure.map((value) => {
      return rotateMatrixXZ.multiply(value);
    });
    return poligon;
  };

  const rotatePointsFront = (points: Matrix[]) => {
    const figure = points;

    const poligon = figure.map((value) => {
      return rotateMatrixXY.multiply(value);
    });
    return poligon;
  };

  const rotatePointsRight = (points: Matrix[]) => {
    const figure = points;

    const poligon = figure.map((value) => {
      return rotateMatrixYZ.multiply(value);
    });
    return poligon;
  };

  const drawLinexy = (
    context: CanvasRenderingContext2D,
    p1: Matrix,
    p2: Matrix
  ) => {
    if (p1 == null || p2 == null) return;
    const dispXp1 = p1.at(0, 0) * scale + context.canvas.width / 2;
    const dispYp1 = context.canvas.height / 2 - p1.at(1, 0) * scale;
    const dispXp2 = p2.at(0, 0) * scale + context.canvas.width / 2;
    const dispYp2 = context.canvas.height / 2 - p2.at(1, 0) * scale;
    context.beginPath();
    context.moveTo(dispXp1, dispYp1);
    context.lineTo(dispXp2, dispYp2);
    context.stroke();
  };

  const drawLinexz = (
    context: CanvasRenderingContext2D,
    p1: Matrix,
    p2: Matrix
  ) => {
    if (p1 == null || p2 == null) return;
    const dispXp1 = p1.at(0, 0) * scale + context.canvas.width / 2;
    const dispYp1 = context.canvas.height / 2 - p1.at(2, 0) * scale;
    const dispXp2 = p2.at(0, 0) * scale + context.canvas.width / 2;
    const dispYp2 = context.canvas.height / 2 - p2.at(2, 0) * scale;
    context.beginPath();
    context.moveTo(dispXp1, dispYp1);
    context.lineTo(dispXp2, dispYp2);
    context.stroke();
  };

  const drawLineyz = (
    context: CanvasRenderingContext2D,
    p1: Matrix,
    p2: Matrix
  ) => {
    if (p1 == null || p2 == null) return;
    const dispXp1 = p1.at(1, 0) * scale + context.canvas.width / 2;
    const dispYp1 = context.canvas.height / 2 - p1.at(2, 0) * scale;
    const dispXp2 = p2.at(1, 0) * scale + context.canvas.width / 2;
    const dispYp2 = context.canvas.height / 2 - p2.at(2, 0) * scale;
    context.beginPath();
    context.moveTo(dispXp1, dispYp1);
    context.lineTo(dispXp2, dispYp2);
    context.stroke();
  };

  const points: Matrix[] = [
    /*new Matrix(4, 1, [[1], [1], [1], [0]]),
    new Matrix(4, 1, [[1], [1], [0], [0]]),
    new Matrix(4, 1, [[0], [1], [0], [0]]),
    new Matrix(4, 1, [[0], [1], [1], [0]]),
    new Matrix(4, 1, [[0], [0], [1], [0]]),
    new Matrix(4, 1, [[0], [0], [0], [0]]),
    new Matrix(4, 1, [[1], [0], [0], [0]]),
    new Matrix(4, 1, [[1], [0], [1], [0]]),*/
    new Matrix(4, 1, [[0], [0], [0], [0]]),
    new Matrix(4, 1, [[0], [0], [1], [0]]),
    new Matrix(4, 1, [[1], [0], [0], [0]]),
    new Matrix(4, 1, [[0], [0], [0], [0]]),
    new Matrix(4, 1, [[1], [2], [2], [0]]),
    new Matrix(4, 1, [[1], [0], [0], [0]]),
    new Matrix(4, 1, [[1], [2], [2], [0]]),
    new Matrix(4, 1, [[0], [0], [1], [0]]),
  ];

  const readPoints = (event) => {
    const input: HTMLInputElement = document.querySelector("#enterFile")!;
    const file = input.files![0];
    console.log(file.name);
  };
  return (
    <div className="workspace">
      <Canvas3D draw={drawUp} />
      <Canvas3D draw={draw} />
      <Canvas3D draw={drawFront} />
      <Canvas3D draw={drawRight} />
      <div>
        <input id="enterFile" type="file" onChange={readPoints}></input>
        <input type="number"></input>
      </div>
    </div>
  );
}

export default Workspace;
