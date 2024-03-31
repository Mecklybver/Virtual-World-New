class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(point) {
    return this.x == point.x && this.y == point.y;
  }

  draw(
    ctx,
    {
      size = 18,
      color = "black",
      outline = false,
      fill = false,
      zoom = 1,
      blur = false,
      dash = [],
      time = null
    } = {}
  ) {
    const rad = size / 2;

    ctx.beginPath();
    ctx.fillStyle = color;
    if (blur) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 150;
    }
    ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    if (outline) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      ctx.arc(this.x, this.y, rad * 0.3 * zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.setLineDash(dash);
      if(time)ctx.lineDashOffset=time;
      ctx.arc(this.x, this.y, rad * 0.6 * zoom, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x, this.y, rad * 4.6 * zoom, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x, this.y, rad * 6.6 * zoom, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (fill) {
      ctx.beginPath();

      ctx.arc(this.x, this.y, rad * 0.4 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.strokeStyle = "yellow";
      ctx.fill();
      ctx.beginPath();
      ctx.setLineDash(dash);
      if(time)ctx.lineDashOffset=time/50 ;
      ctx.arc(this.x, this.y, rad * 4.6 * zoom, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      if(time)ctx.lineDashOffset=-time /50;

      ctx.arc(this.x, this.y, rad * 6.6 * zoom, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}
