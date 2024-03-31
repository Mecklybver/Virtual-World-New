class GraphEditor {
   constructor(viewport, graph) {
     this.viewport = viewport;
     this.canvas = viewport.canvas;
     this.graph = graph
     this.world = world;
     this.snapDistance = 30
 
     this.ctx = this.canvas.getContext("2d");
 
     this.selected = null;
     this.hovered = null;
     this.dragging = false;
     this.mouse = null;
     this.show = true;
 
     //   this.#addEventListeners();
   }
 
   enable() {
     this.#addEventListeners();
     this.show = true;
   }
   disable() {
     this.#removeEventListeners();
     this.selected = false;
     this.hovered = false;
     this.show = false;
   }
 
   #addEventListeners() {
     this.boundMouseDown = this.#handleMouseDown.bind(this);
     this.boundMouseMove = this.#handleMouseMove.bind(this);
     this.boundMouseUp = () => (this.dragging = false);
     this.boundContextMenu = (evt) => evt.preventDefault();
     this.canvas.addEventListener("mousedown", this.boundMouseDown);
     this.canvas.addEventListener("mousemove", this.boundMouseMove);
     this.canvas.addEventListener("mouseup", this.boundMouseUp);
     this.canvas.addEventListener("contextmenu", this.boundContextMenu);

     window.addEventListener("keydown", (e) => {
      if (e.key == "s") {
         this.start = this.mouse;
      }
      if (e.key == "e") {
         this.end = this.mouse;
      }
      if (this.start && this.end) {
         world.generateCorridor(this.start, this.end);
      }
   });
   }
 
   #removeEventListeners() {
     this.canvas.removeEventListener("mousedown", this.boundMouseDown);
     this.canvas.removeEventListener("mousemove", this.boundMouseMove);
     this.canvas.removeEventListener("mouseup", this.boundMouseUp);
     this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
   }
 
   #handleMouseMove(evt) {
     this.mouse = this.viewport.getMouse(evt, true);
     this.hovered = getNearestPoint(
       this.mouse,
       this.graph.points,
       this.snapDistance * this.viewport.zoom
     );
     if (this.dragging == true) {
       this.selected.x = this.mouse.x;
       this.selected.y = this.mouse.y;
     }
 
     const seg = getNearestSegment(
       this.mouse,
       this.world.graph.segments,
       this.snapDistance * this.viewport.zoom
     );
     if (seg) {
       const proj = seg.projectPoint(this.mouse);
       if (proj.offset >= 0 && proj.offset <= 1) {
         this.intent = proj.point;
       } else {
         this.intent = null;
       }
     } else {
       this.intent = null;
     }
   }
 
   #handleMouseDown(evt) {
     if (evt.button == 2) {
       // right click
       if (this.selected) {
         this.selected = null;
       } else if (this.hovered) {
         this.#removePoint(this.hovered);
       }
     }
     if (evt.button == 0) {
       // left click
       if (this.hovered) {
         this.#select(this.hovered);
         this.dragging = true;
         return;
       }
       if (this.intent ) {
         this.#select(this.intent);
         this.dragging = true;
         return;
       }
       
       this.graph.addPoint(this.mouse);
       this.#select(this.mouse);
       this.hovered = this.mouse;
     }
   }
 
   #select(point) {
     if (this.selected) {
       this.graph.tryAddSegment(new Segment(this.selected, point));
     }
     this.selected = point;
   }
 
   #removePoint(point) {
     this.graph.removePoint(point);
     this.hovered = null;
     if (this.selected == point) {
       this.selected = null;
     }
   }
 
   dispose() {
     this.graph.dispose();
     this.selected = null;
     this.hovered = null;
   }
 
   display() {
    const {zoom}= viewport
     if (this.show) {
       this.graph.draw(this.ctx,{});
       if (this.hovered) {
         this.hovered.draw(this.ctx, { fill: true , zoom});
       }
       if (this.selected) {
         const intent = this.hovered ? this.hovered : this.mouse;
         new Segment(this.selected, intent).draw(ctx, { dash: [3, 3] });
         this.selected.draw(this.ctx, { outline: true , zoom});
       }
       if (this.intent &&!this.hovered) {
         this.intent.draw(this.ctx, {zoom});
       }
     }
   }
 }
 