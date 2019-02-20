import { Vector2 } from "./Vector2";
import Numeric from "./Numeric";

class Perspective {
  private corners: Vector2[] = [];
  private matrix: number[] = [];
  private inverseMatrix: number[] = [];
  private srcMatrix: number[][];
  private dstMatrix: number[][];
  private loaded: boolean = false;

  addCorners(position: Vector2) {
    this.corners.push(position);
    console.log(this.corners.length)

    if (this.corners.length === 4) {
      this.srcMatrix = [
        [this.corners[0].x, this.corners[0].y],
        [this.corners[1].x, this.corners[1].y],
        [this.corners[2].x, this.corners[2].y],
        [this.corners[3].x, this.corners[3].y]
      ];
      this.dstMatrix = [[0, 0], [1, 0], [1, 1], [0, 1]];
      this.computePerspectiveMatrix();
      this.computeInversePerspectiveMatrix();
    }
  }

  hasMatrix() {
    return this.loaded;
  }

  computePerspectiveMatrix() {
    let a = [],
      b = [];
    for (let i = 0, n = this.srcMatrix.length; i < n; ++i) {
      let s = this.srcMatrix[i],
        t = this.dstMatrix[i];
      a.push([s[0], s[1], 1, 0, 0, 0, -s[0] * t[0], -s[1] * t[0]]),
        b.push(t[0]);
      a.push([0, 0, 0, s[0], s[1], 1, -s[0] * t[1], -s[1] * t[1]]),
        b.push(t[1]);
    }
    const X = Numeric.solve(a, b, true);
    this.matrix = [
      X[0],
      X[3],
      0,
      X[6],
      X[1],
      X[4],
      0,
      X[7],
      0,
      0,
      1,
      0,
      X[2],
      X[5],
      0,
      1
    ];
    this.loaded = true;
  }

  computeInversePerspectiveMatrix() {
    let a = [],
      b = [];
    for (let i = 0, n = this.dstMatrix.length; i < n; ++i) {
      let s = this.dstMatrix[i],
        t = this.srcMatrix[i];
      a.push([s[0], s[1], 1, 0, 0, 0, -s[0] * t[0], -s[1] * t[0]]),
        b.push(t[0]);
      a.push([0, 0, 0, s[0], s[1], 1, -s[0] * t[1], -s[1] * t[1]]),
        b.push(t[1]);
    }
    const X = Numeric.solve(a, b, true);
    this.inverseMatrix = [
      X[0],
      X[3],
      0,
      X[6],
      X[1],
      X[4],
      0,
      X[7],
      0,
      0,
      1,
      0,
      X[2],
      X[5],
      0,
      1
    ];
    this.loaded = true;
  }
  transformPoint(x: number, y: number) {
    return this.multiplyVector([x, y, 0, 1], this.matrix);
  }
  transformInversePoint(x: number, y: number) {
    return this.multiplyVector([x, y, 0, 1], this.inverseMatrix);
  }

  multiplyVector(vector: number[], matrix: number[]) {
    return new Promise(resolve => {
      const result = [
        matrix[0] * vector[0] +
          matrix[4] * vector[1] +
          matrix[8] * vector[2] +
          matrix[12] * vector[3],
        matrix[1] * vector[0] +
          matrix[5] * vector[1] +
          matrix[9] * vector[2] +
          matrix[13] * vector[3],
        matrix[2] * vector[0] +
          matrix[6] * vector[1] +
          matrix[10] * vector[2] +
          matrix[14] * vector[3],
        matrix[3] * vector[0] +
          matrix[7] * vector[1] +
          matrix[11] * vector[2] +
          matrix[15] * vector[3]
      ];
      resolve(result);
    });
  }

  applyTransformation(vector: number[]) {
    return new Promise(resolve => {
      const point = [vector[0] / vector[3], vector[1] / vector[3]];
      resolve(point);
    });
  }

  roundPoint(point: number[]) {
    return new Promise(resolve => {
      const roundedPoint = point.map((coord: number) =>
        parseFloat(coord.toFixed(5))
      );
      resolve(roundedPoint);
    });
  }

  computePoint(point: Vector2) {
    return this.transformPoint(point.x, point.y)
      .then((rawPoint: number[]) => {
        return this.applyTransformation(rawPoint);
      })
      .then((point: number[]) => {
        return this.roundPoint(point);
      });
  }

  computeInversePoint(point: Vector2): Promise<any> {
    return this.transformInversePoint(point.x, point.y)
      .then((rawPoint: number[]) => {
        return this.applyTransformation(rawPoint);
      })
      .then((point: number[]) => {
        return this.roundPoint(point);
      });
  }
}

export default new Perspective();
