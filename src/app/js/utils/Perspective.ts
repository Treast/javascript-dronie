import { Vector2 } from "./Vector2";
import Numeric from "./Numeric";

class Perspective {
  private corners: Vector2[] = [];
  private matrix: number[] = [];
  private srcMatrix: number[][];
  private dstMatrix: number[][];
  private loaded: boolean = false;

  addCorners(position: Vector2) {
    this.corners.push(position);

    if (this.corners.length === 4) {
      this.srcMatrix = [
        [this.corners[0].x, this.corners[0].y],
        [this.corners[1].x, this.corners[1].y],
        [this.corners[2].x, this.corners[2].y],
        [this.corners[3].x, this.corners[3].y]
      ];
      this.dstMatrix = [[0, 0], [1, 0], [1, 1], [0, 1]];
      this.computePerspectiveMatrix();
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
  transformPoint(x: number, y: number) {
    return this.multiplyVector([x, y, 0, 1]);
  }

  multiplyVector(vector: number[]) {
    return new Promise(resolve => {
      const result = [
        this.matrix[0] * vector[0] +
          this.matrix[4] * vector[1] +
          this.matrix[8] * vector[2] +
          this.matrix[12] * vector[3],
        this.matrix[1] * vector[0] +
          this.matrix[5] * vector[1] +
          this.matrix[9] * vector[2] +
          this.matrix[13] * vector[3],
        this.matrix[2] * vector[0] +
          this.matrix[6] * vector[1] +
          this.matrix[10] * vector[2] +
          this.matrix[14] * vector[3],
        this.matrix[3] * vector[0] +
          this.matrix[7] * vector[1] +
          this.matrix[11] * vector[2] +
          this.matrix[15] * vector[3]
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
}

export default new Perspective();
