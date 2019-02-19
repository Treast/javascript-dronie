import Canvas from '../../core/Canvas';

export default class Rect {
  constructor({ x, y, width, height } = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(point) {
    const { x, y } = point;
    return this.x <= x && x <= this.x + this.width && this.y <= y && y <= this.y + this.height;
  }

  render() {
    Canvas.ctx.strokeStyle = 'red';
    Canvas.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
