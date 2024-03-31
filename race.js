const carCanvas = document.getElementById("carCanvas");
const miniMapCanvas = document.getElementById("miniMapCanvas");
carCanvas.height = window.innerHeight;
carCanvas.width = window.innerWidth;
const carCtx = carCanvas.getContext("2d");
const miniMapCtx = miniMapCanvas.getContext("2d");
let frameCount = 0;


statistics.style.width = window.innerWidth / 4 + "px";
statistics.style.height = window.innerHeight - 200 + "px";

const worldString = localStorage.getItem("world");
const worldInfo = worldString ? JSON.parse(worldString) : null;
const world = worldInfo ? World.load(worldInfo) : new World(new Graph());
const viewport = new Viewport(carCanvas, world.zoom, world.offset);

const N = 10;
const cars = generateCars(N).concat(generateCars(1, "KEYS"));
const miniMap = new Map(miniMapCanvas, world, 300);
let myCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

  for (let i = 0; i < cars.length; i++){
  const div = document.createElement("div");
  div.id = "stat_" + i;
  div.innerText = "Car " + i;
  div.style.color = cars[i].color;  
  div.classList.add("stat");
  statistics.appendChild(div);
}

const traffic = [];
let roadBorder = [];
const target = world.markings.find((m) => m instanceof Target);
if (target) {
  world.generateCorridor(myCar, target.center);
  roadBorders = world.corridor.borders.map((s) => [s.p1, s.p2]);
} else {
   roadBorders = world.roadBorders.map((s) => [s.p1, s.p2]);
}


animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(myCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N, type = "AI") {
  const startPoints = world.markings.filter((m) => m instanceof Start);
  const startPoint =
    startPoints.length > 0 ? startPoints[0].center : new Point(100, 100);
  const dir =
    startPoints.length > 0 ? startPoints[0].directionVector : new Point(0, -1);
  const startAngle = -angle(dir) + Math.PI / 2;
  const cars = [];
  for (let i = 1; i <= N; i++) {
    const color = type  == "AI" ? getRandomColor() : "red";
    const car = new Car(startPoint.x, startPoint.y, 30, 50, type, startAngle, 4, color);
    car.name = type == "AI" ? "AI" + i.toString().padStart(2, "0") : "Me";
    cars.push(car);
  }
  return cars;
}

function updateCarProgress(car) {
  car.progress = 0;
  const carSeg = getNearestSegment(car, world.corridor.skeleton);
  // carSeg.draw(carCtx, { color: "red", width: 5 });

  for (let i = 0; i < world.corridor.skeleton.length; i++){
    const s = world.corridor.skeleton[i];
    // s.draw(carCtx, { color: "red", width: 5 });
    if (s.equals(carSeg)){
      const proj = s.projectPoint(car)
      proj.point.draw(carCtx);
      const firstPartOfSegment = new Segment(s.p1, proj.point);
      firstPartOfSegment.draw(carCtx, { color: "red", width: 5 });
      car.progress += firstPartOfSegment.length();
      break;
    } else {
      s.draw(carCtx, { color: "red", width: 5 });
      car.progress += s.length();
    }
  }
  const totalDistance = world.corridor.skeleton.reduce((a, b) => a + b.length(), 0);
  car.progress /= totalDistance
  car.finishTime = frameCount
  
}
function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(roadBorders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(roadBorders, traffic);
  }
  myCar = cars.find(car=> car.type == "KEYS");
  // .find(
  //   (c) => c.fitness == Math.max(...cars.map((c) => c.fitness))
  // );

  world.cars = cars;
  world.bestCar = myCar;

  viewport.offset.x = -myCar.x;
  viewport.offset.y = -myCar.y;

  viewport.reset();

  const viewPoint = scale(viewport.getOffset(), -1);
  world.draw(carCtx, viewPoint, false);

  miniMap.update(viewPoint, time, cars);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  for (let i = 0; i < cars.length; i++){
  updateCarProgress(cars[i]);
  
  }
  cars.sort((a, b) => b.progress - a.progress);
  for (let i = 0; i < cars.length; i++) {
    const stat = document.getElementById("stat_" + i);
    stat.style.color = cars[i].color;
    stat.innerText = (i+1).toString().padStart(2, "0") + ": "  + cars[i].name + " - "
    + (cars[i].damaged ? "💀" : "✅")
    + (cars[i].progress*100).toFixed(1) + "%" + " - " 
    + " "+ cars[i].finishTime.toString().padStart(5, "0");
    stat.style.background = cars[i].type == "AI" ? "black" : "white";

  }
  frameCount++
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  carCanvas.width = innerWidth  
  carCanvas.height = window.innerHeight;
});