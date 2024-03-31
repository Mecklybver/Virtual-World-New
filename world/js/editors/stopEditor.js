class StopEditor extends MarkingEditor {
   constructor(viewport, world, inputDegree) {
      super(viewport, world, world.laneGuides);
      inputDegree.addEventListener("change", (e) => {
         this.degree = (e.target.value * Math.PI) / 180
         this.range = true
       });
   }

   createMarking(center, directionVector) {
      return new Stop(
         center,
         directionVector,
         world.roadWidth / 2,
         world.roadWidth / 2,
         this.degree,
         this.range
      );
   }
}