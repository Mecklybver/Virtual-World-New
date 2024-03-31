class Start extends Marking {
  constructor(center, directionVector, width, height,color,range) {
    super(center, directionVector, width, height, color,range);
    this.img = new Image();
    this.img.src = "../car.png";
    this.mask = document.createElement("canvas");
    this.mask.width = width;
    this.mask.height = height;
    this.narrowing = 10;
    
    this.color = range ? color : getRandomColor()
    
    const maskCtx = this.mask.getContext("2d");

    this.img.onload = () => {
      maskCtx.fillStyle =  this.color
      maskCtx.rect(0, 0, this.width, this.height);
      maskCtx.fill();

      maskCtx.globalCompositeOperation = "destination-atop";
      maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
    };

   

    this.border = [
      this.poly.segments[0],
      this.poly.segments[1],
      this.poly.segments[2],
      this.poly.segments[3],
    ];

    this.type="car"
  }
  update(color){
   console.log(color)
  }
  

  draw(ctx) {
     // for (const b of this.border) {
     //   b.draw(ctx);
     // }
   
     ctx.save();
     ctx.translate(this.center.x, this.center.y);
     ctx.rotate(angle(this.directionVector) - Math.PI * 0.5);
   
     // Draw the masked color
     if (!this.damaged) {
       ctx.drawImage(
         this.mask,
         -this.width * 0.5 + this.narrowing * 0.5,
         -this.height + this.width-15 ,
         this.width - this.narrowing,
         this.height
       );
       ctx.globalCompositeOperation = "multiply";
     }
   
     // Draw the image
     ctx.drawImage(
       this.img,
       -this.width * 0.5 + this.narrowing * 0.5,
       -this.height + this.width -15   ,
       this.width - this.narrowing,
       this.height 
     );
   
     ctx.restore();
   }
   
}