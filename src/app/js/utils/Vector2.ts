export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(vector: Vector2): Vector2 {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  substract(vector: Vector2): Vector2 {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  scalar(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  angle(vector: Vector2) {
    const vector1 = this.clone();
    const vector2 = vector.clone();
    vector1.multiply(1 / vector1.magnitude());
    vector2.multiply(1 / vector2.magnitude());
    return Math.acos(vector1.scalar(vector2));
  }

  normal(): Vector2 {
    const y = (-1 * this.x) / this.y;
    return new Vector2(1, y);
  }

  multiply(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  distance(vector: Vector2): number {
    const sum = Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2);
    return Math.sqrt(sum);
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
