import Car from './modules/Car.js'
import Network from './modules/Network.js'
import {ctx, canvas} from "./modules/canvas.js"
const SIZE = [450,window.innerHeight]
let side = true
canvas.width = SIZE[0];
canvas.height = SIZE[1];

function drawRoad(SPEED, LINELEN, SIZE){
   ctx.fillStyle = "white"
   let draw = true
   for (let i = start; i < SIZE[1] ; i += LINELEN){
      if (draw) ctx.fillRect(220, i, 10, LINELEN);
      draw = draw ? false : true
   }
   start += SPEED
   if (start > LINELEN) start = -LINELEN
}

function drawCars(cars,obstacle,SPEED,POPSIZE){
   for (let i = 0; i < POPSIZE; i ++ ){
      if (cars[i].checkObstacle(obstacle)) cars[i].alive = false
      cars[i].angle += cars[i].network.compute([cars[i].x/SIZE[0],cars[i].y/SIZE[1],obstacle[0]/SIZE[0],obstacle[1]/SIZE[1],1 / (1 + Math.exp(-cars[i].angle))])
      cars[i].update(SPEED,SIZE)
      cars[i].draw()
   }
   return cars
}

function drawObstacle(obstacle,SIZE){
   ctx.fillStyle = "red"
   obstacle[1] += SPEED / 1.5
   ctx.fillRect(obstacle[0],obstacle[1],120,170);
   if (obstacle[1] > SIZE[1] ){
      const pos = side ? 55 : 290
      side = side ? false : true
      obstacle = [pos,-170]
   }
   return obstacle
}

const LINELEN = SIZE[1]/15
const SPEED = 20
const POPSIZE = 1000
let start = 0
let cars = []
let genCount = 0
let obstacle = [0,SIZE[1]]
for (let i = 0; i < POPSIZE; i ++ ){
   cars.push(new Car(SIZE[0]/2,SIZE,true))
   cars[i].network = new Network()
   cars[i].network.init()
}
console.clear()
console.log("Population : ",POPSIZE, "\n",
"Speed : ",SPEED, "\n",
"Function : Sigmoid", "\n",
"Network : 5 : 16 : 8 : 1", "\n",
)
function animate(){
   ctx.clearRect(0,0,SIZE[0],SIZE[1])

   drawRoad(SPEED, LINELEN, SIZE)

   cars  = drawCars(cars,obstacle,SPEED,POPSIZE,SIZE)
   obstacle = drawObstacle(obstacle,SIZE)
   if (cars.filter(car => car.alive) != 0){
      requestAnimationFrame(animate)
   }else {
      genCount ++
      const totalFitness = cars.reduce((sum,el)=>sum += el.fitScore,0)
      console.log("AVG FITNESS : ",totalFitness/POPSIZE, "\n", "GENERATION : ",genCount)
      const best = cars.sort((a,b)=>b.fitScore-a.fitScore)
      cars = []
      for (let i = 0; i < POPSIZE; i ++ ){
         cars.push(new Car(SIZE[0]/2,SIZE,true))
         if (i < POPSIZE/2){
            cars[i].network = best[i].network
            cars[i].network.mutate()
         }else {
            cars[i].network = new Network
            cars[i].network.init()
         }
      }
      
      obstacle[1] = -170
      requestAnimationFrame(animate)
   }
}

animate()


window.addEventListener("resize",()=>{
   SIZE[1] = window.innerHeight 
})