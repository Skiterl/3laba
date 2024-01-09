import { useState } from "react";
import { Matrix } from "../utils/math";
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

  let allTimeKx = kx - kxold;
  let allTimeKy = ky - kyold;
  let allTimeKz = kz - kzold;

  if (kx > kxold) {
    setKxold(kx + 0.02);
  } else if (kx < kxold) {
    setKxold(kx - 0.02);
  }

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

  //-35.264389682754654 45 24.0948425521107

  const _phix = (35.264389682754654 * Math.PI) / 180;
  const _phiy = (-45 * Math.PI) / 180;
  const _phiz = (-35.264389682754654 * Math.PI) / 180;

  const _Rphix = new Matrix(4, 4, [
    [1, 0, 0, 0],
    [0, Math.cos(_phix), Math.sin(_phix), 0],
    [0, -Math.sin(_phix), Math.cos(_phix), 0],
    [0, 0, 0, 1],
  ]);

  const angle = phix - 0.335;

  const RphixToz = new Matrix(4, 4, [
    [1, 0, 0, 0],
    [0, Math.cos(angle), Math.sin(angle), 0],
    [0, -Math.sin(angle), Math.cos(angle), 0],
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

  const R = Rphix.multiply(Rphiy);

  const rotateMatrixXY = R.multiply(_Rphiy).multiply(_Rphix);
  const rotateMatrixXZ = R.multiply(_Rphiy).multiply(RphixToz);
  const rotateMatrixYZ = R.multiply(Rphiy).multiply(_Rphiz);

  const drawGridxy = (
    context: CanvasRenderingContext2D,
    rotateMatrix: Matrix
  ) => {
    for (let i = -5; i <= 5; i++) {
      let _px = new Matrix(4, 1, [[i], [-5], [0], [0]]);
      let px = new Matrix(4, 1, [[i], [5], [0], [0]]);
      let _py = new Matrix(4, 1, [[-5], [i], [0], [0]]);
      let py = new Matrix(4, 1, [[5], [i], [0], [0]]);

      _px = rotateMatrix.multiply(_px);
      px = rotateMatrix.multiply(px);
      _py = rotateMatrix.multiply(_py);
      py = rotateMatrix.multiply(py);

      drawLinexyAxes(context, _px, px);
      drawLinexyAxes(context, _py, py);
    }
  };

  const drawGridxz = (
    context: CanvasRenderingContext2D,
    rotateMatrix: Matrix
  ) => {
    for (let i = -5; i <= 5; i++) {
      let _px = new Matrix(4, 1, [[i], [0], [-5], [0]]);
      let px = new Matrix(4, 1, [[i], [0], [5], [0]]);
      let _pz = new Matrix(4, 1, [[-5], [0], [i], [0]]);
      let pz = new Matrix(4, 1, [[5], [0], [i], [0]]);

      _px = rotateMatrix.multiply(_px);
      px = rotateMatrix.multiply(px);
      _pz = rotateMatrix.multiply(_pz);
      pz = rotateMatrix.multiply(pz);

      drawLinexyAxes(context, _px, px);
      drawLinexyAxes(context, _pz, pz);
    }
  };

  const drawGridyz = (
    context: CanvasRenderingContext2D,
    rotateMatrix: Matrix
  ) => {
    for (let i = -5; i <= 5; i++) {
      let _py = new Matrix(4, 1, [[0], [i], [-5], [0]]);
      let py = new Matrix(4, 1, [[0], [i], [5], [0]]);
      let _pz = new Matrix(4, 1, [[0], [-5], [i], [0]]);
      let pz = new Matrix(4, 1, [[0], [5], [i], [0]]);

      _py = rotateMatrix.multiply(_py);
      py = rotateMatrix.multiply(py);
      _pz = rotateMatrix.multiply(_pz);
      pz = rotateMatrix.multiply(pz);

      drawLinexyAxes(context, _py, py);
      drawLinexyAxes(context, _pz, pz);
    }
  };

  const drawTri = (
    context: CanvasRenderingContext2D,
    rotateMatrix: Matrix,
    a: Matrix,
    b: Matrix,
    c: Matrix
  ) => {
    a = rotateMatrix.multiply(a);
    b = rotateMatrix.multiply(b);
    c = rotateMatrix.multiply(c);
    context.beginPath();
    context.moveTo(
      a.at(0, 0) * scale + context.canvas.width / 2,
      context.canvas.height / 2 - a.at(1, 0) * scale
    );
    context.lineTo(
      b.at(0, 0) * scale + context.canvas.width / 2,
      context.canvas.height / 2 - b.at(1, 0) * scale
    );
    context.lineTo(
      c.at(0, 0) * scale + context.canvas.width / 2,
      context.canvas.height / 2 - c.at(1, 0) * scale
    );
    context.fill();
  };

  const drawAxes = (
    context: CanvasRenderingContext2D,
    rotateMatrix: Matrix
  ) => {
    const axesPoints: Matrix[] = [
      new Matrix(4, 1, [[0], [0], [0], [0]]),
      new Matrix(4, 1, [[5], [0], [0], [0]]),
      new Matrix(4, 1, [[0], [5], [0], [0]]),
      new Matrix(4, 1, [[0], [0], [5], [0]]),
      new Matrix(4, 1, [[-5], [0], [0], [0]]),
      new Matrix(4, 1, [[0], [-5], [0], [0]]),
      new Matrix(4, 1, [[0], [0], [-5], [0]]),
    ];

    const poligon = axesPoints.map((value) => {
      return rotateMatrix.multiply(value);
    });

    drawTri(
      context,
      rotateMatrix,
      new Matrix(4, 1, [[5], [0], [0], [0]]),
      new Matrix(4, 1, [[4.8], [-0.2], [0], [0]]),
      new Matrix(4, 1, [[4.8], [0.2], [0], [0]])
    );
    drawTri(
      context,
      rotateMatrix,
      new Matrix(4, 1, [[5], [0], [0], [0]]),
      new Matrix(4, 1, [[4.8], [0], [-0.2], [0]]),
      new Matrix(4, 1, [[4.8], [0], [0.2], [0]])
    );

    drawTri(
      context,
      rotateMatrix,
      new Matrix(4, 1, [[0], [5], [0], [0]]),
      new Matrix(4, 1, [[-0.2], [4.8], [0], [0]]),
      new Matrix(4, 1, [[0.2], [4.8], [0], [0]])
    );
    drawTri(
      context,
      rotateMatrix,
      new Matrix(4, 1, [[0], [5], [0], [0]]),
      new Matrix(4, 1, [[0], [4.8], [-0.2], [0]]),
      new Matrix(4, 1, [[0], [4.8], [0.2], [0]])
    );
    drawTri(
      context,
      rotateMatrix,
      new Matrix(4, 1, [[0], [0], [5], [0]]),
      new Matrix(4, 1, [[-0.2], [0], [4.8], [0]]),
      new Matrix(4, 1, [[0.2], [0], [4.8], [0]])
    );
    drawTri(
      context,
      rotateMatrix,
      new Matrix(4, 1, [[0], [0], [5], [0]]),
      new Matrix(4, 1, [[0], [-0.2], [4.8], [0]]),
      new Matrix(4, 1, [[0], [0.2], [4.8], [0]])
    );

    context.beginPath();
    context.font = "bold 15px sans-serif";
    context.fillText(
      String("x"),
      Number(poligon[1].at(0, 0)) * scale + context.canvas.width / 2 + 15,
      context.canvas.height / 2 - poligon[1].at(1, 0) * scale
    );
    context.fillText(
      String("y"),
      Number(poligon[2].at(0, 0)) * scale + context.canvas.width / 2 + 15,
      context.canvas.height / 2 - poligon[2].at(1, 0) * scale
    );
    context.fillText(
      String("z"),
      Number(poligon[3].at(0, 0)) * scale + context.canvas.width / 2 + 15,
      context.canvas.height / 2 - poligon[3].at(1, 0) * scale
    );

    for (let i = 1; i < axesPoints.length; i++) {
      drawLinexyAxes(context, axesPoints[0], poligon[i]);
    }
    for (let i = -5; i <= 5; i++) {
      let l = new Matrix(4, 1, [[i], [0], [0], [0]]);
      l = rotateMatrix.multiply(l);
      context.beginPath();
      context.font = "bold 15px sans-serif";
      context.fillText(
        String(i),
        Number(l.at(0, 0)) * scale + context.canvas.width / 2,
        context.canvas.height / 2 - l.at(1, 0) * scale
      );
    }
    for (let i = -5; i <= 5; i++) {
      let l = new Matrix(4, 1, [[0], [i], [0], [0]]);
      l = rotateMatrix.multiply(l);
      context.beginPath();
      context.font = "bold 15px sans-serif";
      context.fillText(
        String(i),
        Number(l.at(0, 0)) * scale + context.canvas.width / 2,
        context.canvas.height / 2 - l.at(1, 0) * scale
      );
    }
    for (let i = -5; i <= 5; i++) {
      let l = new Matrix(4, 1, [[0], [0], [i], [0]]);
      l = rotateMatrix.multiply(l);
      context.beginPath();
      context.font = "bold 15px sans-serif";
      context.fillText(
        String(i),
        Number(l.at(0, 0)) * scale + context.canvas.width / 2,
        context.canvas.height / 2 - l.at(1, 0) * scale
      );
    }
  };
  //console.log(coswy, coswz, sinwz, phix, phiy);

  const scale = 40;

  const draw = (context: CanvasRenderingContext2D) => {
    //console.log(kxold, kyold, kzold, kx, ky, kz);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const poligon = rotatePoints(points, R);
    poligon.forEach((point, i) => {
      drawLinexy(context, point, poligon[(i + 1) % poligon.length]);
    });
    /*const axes = rotatePoints(axesPoints, R);
    axes.forEach((point, i) => {
      drawLinexy(context, point, axes[(i + 1) % axes.length]);
    });*/
    drawGridxy(context, R);
    drawGridxz(context, R);
    drawGridyz(context, R);
    drawAxes(context, R);
    setKxold(kx), setKyold(ky), setKzold(kz);
  };

  const drawFront = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const poligon = rotatePoints(points, rotateMatrixXY);
    poligon.forEach((point, i) => {
      drawLinexy(context, point, poligon[(i + 1) % poligon.length]);
    });
    drawGridxy(context, rotateMatrixXY);
    drawAxes(context, rotateMatrixXY);
  };

  const drawUp = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const poligon = rotatePoints(points, rotateMatrixXZ);
    poligon.forEach((point, i) => {
      drawLinexy(context, point, poligon[(i + 1) % poligon.length]);
    });
    drawGridxz(context, rotateMatrixXZ);
    drawAxes(context, rotateMatrixXZ);
  };

  const drawRight = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const poligon = rotatePoints(points, rotateMatrixYZ);
    poligon.forEach((point, i) => {
      drawLinexy(context, point, poligon[(i + 1) % poligon.length]);
    });
    drawGridyz(context, rotateMatrixYZ);
    drawAxes(context, rotateMatrixYZ);
  };

  const rotatePoints = (points: Matrix[], rotateMatrix: Matrix) => {
    const figure = points;

    const poligon = figure.map((value) => {
      return rotateMatrix.multiply(value);
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
    context.strokeStyle = "red";
    context.lineWidth = 4;
    context.moveTo(dispXp1, dispYp1);
    context.lineTo(dispXp2, dispYp2);
    context.stroke();
    context.lineWidth = 1;
    context.strokeStyle = "black";
  };

  const drawLinexyAxes = (
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
  const [points, setPoints] = useState<Matrix[]>([]);

  const readPoints = (event) => {
    const input: HTMLInputElement = document.querySelector("#enterFile")!;
    const file = input.files![0];

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      console.log(reader.result);
      const text: string = reader.result;
      const arr = text.split("\n");
      console.log(arr);
      const newPoints: Matrix[] = [];
      for (let i = 0; i < arr.length; i++) {
        const els = arr[i].split(","); //str.replace(/[^a-zA-Z ]/g, "")
        console.log(els);
        newPoints.push(
          new Matrix(4, 1, [
            [Number(els[0])],
            [Number(els[1])],
            [Number(els[2])],
            [Number(els[3][0])],
          ])
        );
      }
      setPoints(newPoints);
      console.log(points);
    };
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
        <table className="matrix">
          <tr>
            {R.at(0, 0).toFixed(4)} | {R.at(1, 0).toFixed(4)} |{" "}
            {R.at(2, 0).toFixed(4)} | {R.at(3, 0).toFixed(4)}
          </tr>
          <tr>----------------------------------------------</tr>
          <tr>
            {R.at(0, 1).toFixed(4)} | {R.at(1, 1).toFixed(4)} |{" "}
            {R.at(2, 1).toFixed(4)} | {R.at(3, 1).toFixed(4)}
          </tr>
          <tr>----------------------------------------------</tr>
          <tr>
            {R.at(0, 2).toFixed(4)} | {R.at(1, 2).toFixed(4)} |{" "}
            {R.at(2, 2).toFixed(4)} | {R.at(3, 2).toFixed(4)}
          </tr>
          <tr>----------------------------------------------</tr>
          <tr>
            {R.at(0, 3).toFixed(4)} | {R.at(1, 3).toFixed(4)} |{" "}
            {R.at(2, 3).toFixed(4)} | {R.at(3, 3).toFixed(4)}
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Workspace;
