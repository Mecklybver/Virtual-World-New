class Door {
  constructor(position, size, style) {
      this.position = position; // Position relative to the wall
      this.size = size; // Size of the door
      this.style = "brown"
  }

  draw(ctx, wallPolygon) {
      // Calculate door position relative to the building
      const doorPosition = [
          wallPolygon.points[0][0] + this.position[0],
          wallPolygon.points[0][1] + this.position[1]
      ];

      // Draw door
      ctx.fillStyle = this.style;
      ctx.fillRect(doorPosition[0], doorPosition[1], this.size[0], this.size[1]);
  }
}

