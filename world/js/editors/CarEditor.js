class StartEditor extends MarkingEditor {
  constructor(viewport, world, inputColor) {
    super(viewport, world, world.laneGuides, inputColor);

    inputColor.addEventListener("change", (e) => {
      this.color = `hsl(${e.target.value},100%,60%)`;
      this.range = true
    });

  }

  createMarking(center, directionVector) {
    return new Start(
      center,
      directionVector,
      world.roadWidth / 2,
      world.roadWidth * 0.7,
      this.color,
      this.range
    );
  }
}