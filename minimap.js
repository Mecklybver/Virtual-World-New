class Map {
  constructor(canvas, world, size) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.graph = world.graph;
    this.size = size;
    this.world = world;
    canvas.width = size;
    canvas.height = size;
    this.point = new Point(this.size / 2, this.size / 2);
  }

  update(viewPoint, time = null, cars) {
    this.ctx.clearRect(0, 0, this.size, this.size);

    const scaler = 0.05;
    const scaledViewPoint = scale(viewPoint, -scaler);
    this.ctx.save();

    this.ctx.beginPath();
    this.ctx.arc(this.size / 2, this.size / 2, 150, 0, Math.PI * 2);
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.clip();
    this.ctx.globalAlpha = 0.2;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(
      scaledViewPoint.x + this.size / 2,
      scaledViewPoint.y + this.size / 2
    );
    this.ctx.globalAlpha = 0.4;

    this.ctx.scale(scaler, scaler);
    for (const seg of this.graph.segments) {
      seg.draw(this.ctx, { width: 3 / scaler, color: "white" });
    }
    if (this.world.corridor.borders) {
      for (const seg of this.world.corridor.borders) {
        seg.draw(this.ctx, { width: 3 / scaler, color: "black" });
      }
    }

    if (this.world.corridor.skeleton) {
      for (const seg of this.world.corridor.skeleton) {
        seg.draw(this.ctx, { width: 3 / scaler, color: "yellow" });
      }
    }

    for (const point of this.graph.points) {
      point.draw(this.ctx, { size: 40, color: "red" });
    }

    // Draw cars' positions
    this.ctx.restore();
    this.ctx.arc(this.size / 2, this.size / 2, 150, 0, Math.PI * 2);
    this.ctx.strokeStyle = "transparent";
    this.ctx.clip();

    for (const car of cars) {
      const carPosition = car.getPosition();
      const scaledCarX = (carPosition.x - viewPoint.x) * scaler + this.size / 2;
      const scaledCarY = (carPosition.y - viewPoint.y) * scaler + this.size / 2;
      this.ctx.fillStyle = car.color;
      this.ctx.beginPath();
      this.ctx.arc(scaledCarX, scaledCarY, 6, 0, Math.PI * 2);
      this.ctx.fill();

      if (car.type === "KEYS") {
        const carSeg = getNearestSegment(car, this.world.corridor.skeleton);

        for (let i = 0; i < this.world.corridor.skeleton.length; i++) {
          const s = this.world.corridor.skeleton[i];
          const scaledP1 = {
            x: (s.p1.x - viewPoint.x) * scaler + this.size / 2,
            y: (s.p1.y - viewPoint.y) * scaler + this.size / 2,
          };

          if (s.equals(carSeg)) {
            const proj = s.projectPoint(car);
            proj.point.draw(this.ctx);

            const scaledProjPoint = {
              x: (proj.point.x - viewPoint.x) * scaler + this.size / 2,
              y: (proj.point.y - viewPoint.y) * scaler + this.size / 2,
            };

            const firstPartOfSegment = new Segment(scaledP1, scaledProjPoint);
            firstPartOfSegment.draw(this.ctx, { color: "red", width: 3 });
            car.progress += firstPartOfSegment.length();
            break;
          }

          const scaledP2 = {
            x: (s.p2.x - viewPoint.x) * scaler + this.size / 2,
            y: (s.p2.y - viewPoint.y) * scaler + this.size / 2,
          };

          // Draw the segment
          this.ctx.beginPath();
          this.ctx.moveTo(scaledP1.x, scaledP1.y);
          this.ctx.lineTo(scaledP2.x, scaledP2.y);
          this.ctx.strokeStyle = "red";
          this.ctx.lineWidth = 3;
          this.ctx.stroke();
        }
      }
      this.ctx.restore()
      this.ctx.lineWidth = 1;

      this.point.draw(this.ctx, {
        color: car.color,
        fill: true,
        dash: [3, 3],
        time,
      });
    }
  }
}
// }
