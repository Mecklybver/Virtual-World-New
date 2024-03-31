class Stop extends Marking {
   constructor(center, directionVector, width, height,degree, range) {
      super(center, directionVector, width, height, degree, range);

      this.border = this.poly.segments[2];
      this.type = "stop";
      this.range = range
      this.degree = this.range ? degree : this.directionVector;
      this.radian = degree 
   }

   draw(ctx) {
      ctx.save();
      ctx.translate(this.border.p1.x, this.border.p1.y);
      ctx.rotate(this.degree);
      ctx.translate(-this.border.p1.x, -this.border.p1.y);
      this.border.draw(ctx, { width: 5, color: "white" });
      ctx.translate(this.center.x, this.center.y);
      ctx.rotate((angle(this.directionVector) - Math.PI / 2));
      ctx.scale(1, 3);
      
      ctx.beginPath();
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.font = "bold " + this.height * 0.3 + "px Arial";
      ctx.fillText("STOP", 0, 1);

      ctx.restore();
   }
}