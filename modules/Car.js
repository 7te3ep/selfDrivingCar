import {ctx, canvas} from "./canvas.js"

export default class Car {
   constructor(x,SIZE, isClone = false,){
      this.isClone = isClone
      this.x = x
      this.size = [120,170]
      this.y = SIZE[1] - 20 - this.size[1] 
      this.angle = isClone ? Math.floor(Math.random()*80) - 40 : 0
      this.alive = true
      this.fitScore = 0
      this.network
   }

   update(SPEED,SIZE){
      if (!this.alive) return
      if (this.angle < 0) this.angle += 0.2
      else if (this.angle > 0) this.angle -= 0.2
      this.x += Math.sin(this.angle* Math.PI/180) * 1.1 * SPEED
      if (this.x - this.size[0]/2 < 0 || this.x + this.size[0]/2 > SIZE[0]) this.alive = false
      this.fitScore += 1
   }

   checkObstacle(obstacle){
      const rect1 = {
         x: this.x - this.size[0]/2,
         y: this.y - this.size[1]/2
      }
      const rect2 = {
         x : obstacle[0],
         y: obstacle[1]
      }
      return  rect1.x < rect2.x + this.size[0] &&
      rect1.x + this.size[0]> rect2.x &&
      rect1.y < rect2.y + this.size[1] &&
      rect1.y + this.size[1] > rect2.y
   }

   draw(){
      ctx.fillStyle = "rgb(0,0,255)"
      if (this.isClone) ctx.fillStyle = "rgba(0,0,255,0.5)"
      if (!this.alive) ctx.fillStyle = "rgba(255,0,255,0)"
      ctx.save();
      ctx.translate(this.x, this.y);
      //ctx.rotate(this.angle * Math.PI/180)
      ctx.fillRect(-this.size[0]/2,-this.size[1]/2,this.size[0],this.size[1]);
      ctx.restore();

   }
}