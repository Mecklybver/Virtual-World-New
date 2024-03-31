class Window {
  constructor(position, size, style) {
      this.position = position; // Position relative to the wall
      this.size = size; // Size of the window
      this.style = "blue";
  }

  draw(ctx, wallPolygon) {
      // Calculate window position relative to the building
      const windowPosition = [
          wallPolygon.points[0][0] + this.position[0],
          wallPolygon.points[0][1] + this.position[1]
      ];

      // Draw window
      ctx.fillStyle = this.style;
      ctx.fillRect(windowPosition[0], windowPosition[1], this.size[0], this.size[1]);
  }
}

