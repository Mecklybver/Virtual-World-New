class Light extends Marking {
  constructor(center, directionVector, width, height) {
    super(center, directionVector, width, height);

    this.borders = [
      this.poly.segments[0],
      this.poly.segments[1],
      this.poly.segments[2],
      this.poly.segments[3],
    ];

    this.state = "off"
    this.type = "light";
  }

  draw(ctx) {
    const perp = perpendicular(this.directionVector);
    const line = new Segment(
      add(this.center, scale(perp, this.width / 4)),
      add(this.center, scale(perp, -this.width / 4))
    );

    const green = lerp2D(line.p1, line.p2, 0.98);
    const orange = lerp2D(line.p1, line.p2, 0.5);
    const red = lerp2D(line.p1, line.p2, 0.02);
    
    
  
    line.draw(ctx, { width: 24, cap: "round" });
    red.draw(ctx, { size: this.height * 0.45, color: "#600" });
    orange.draw(ctx, { size: this.height * 0.45, color: "#620" });
    green.draw(ctx, { size: this.height * 0.45, color: "#060" });

    switch (this.state){
      case "red":
         red.draw(ctx, { size: this.height * 0.45, color: "#F00", blur : true });
         break;
      case "orange":
         orange.draw(ctx, { size: this.height * 0.45, color: "#FA0", blur : true });
         break;
      case "green":
         green.draw(ctx, { size: this.height * 0.45, color: "#0F0", blur : true });
         break;

    }
  }
}
