import Car from './modules/Car.js'
import Network from './modules/Network.js'
import {ctx, canvas} from "./modules/canvas.js"

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

function drawCars(cars,obstacles,SPEED,POPSIZE){
   const nearestObstacle = obstacles.filter(el=>el[1]<SIZE[1]-250).sort((a,b)=>b[1]-a[1])[0]
   ctx.fillStyle = 'orange'
   ctx.fillRect(nearestObstacle[0],nearestObstacle[1],120,170);
   for (let i = 0; i < POPSIZE; i ++ ){
      if (!cars[i].alive) continue
      if (cars[i].checkObstacle(nearestObstacle)) cars[i].alive = false
      cars[i].angle += cars[i].network.compute([cars[i].x/SIZE[0],cars[i].y/SIZE[1],nearestObstacle[0]/SIZE[0],nearestObstacle[1]/SIZE[1],1 / (1 + Math.exp(-cars[i].angle))])
      cars[i].update(SPEED,SIZE)
      cars[i].draw()
   }

   const selectCar = cars.find((car)=>car.alive)
   if (selectCar){
      selectCar.draw("rgba(0,255,255,0.8)")
      selectCar.network.draw()
   }
   return cars
}

function drawObstacle(obstacles,SIZE,cars){
   ctx.fillStyle = "red"
   const oldSize = obstacles.length
   obstacles = obstacles.filter(obstacle => obstacle[1] < SIZE[1])
   obstacles.forEach(obstacle => {
      obstacle[1] += SPEED / 1.5
      ctx.fillRect(obstacle[0],obstacle[1],120,170);
   });
   if (obstacles.length == 0 ){
      obstacles.push([Math.random() > 0.5 ? 55 : 290,-170])
   }else if ( obstacles.sort((a,b)=>a[1]-b[1])[0][1] > 170 * 3) {
      obstacles.push([Math.random() > 0.5 ? 55 : 290,-170])
   }

   if (oldSize - obstacles.length != 0){
      cars.filter(car=>car.alive).forEach(car=>car.fitScore += 1000)
   }
   return obstacles
}

const SIZE = [450,window.innerHeight]
canvas.width = SIZE[0];
canvas.height = SIZE[1];
const LINELEN = SIZE[1]/15
const SPEED = 20
const POPSIZE = 3000
let start = 0
let cars = []
let genCount = 0
let obstacles = []
for (let i = 0; i < POPSIZE; i ++ ){
   cars.push(new Car(SIZE[0]/2,SIZE,true))
   cars[i].network = new Network()
   cars[i].network.init()
}
console.log("Population : ",POPSIZE, "\n",
"Speed : ",SPEED, "\n",
"Function : Sigmoid", "\n",
"Network : 5 : 16 : 8 : 1", "\n",
)
function animate(){
   ctx.clearRect(0,0,SIZE[0],SIZE[1])  
   drawRoad(SPEED, LINELEN, SIZE)
   obstacles = drawObstacle(obstacles,SIZE,cars)
   cars  = drawCars(cars,obstacles,SPEED,POPSIZE,SIZE)
   
   if (cars.filter(car => car.alive) != 0){
      requestAnimationFrame(animate)
   }else {
      genCount ++
      const totalFitness = cars.reduce((sum,el)=>sum += el.fitScore,0)
      console.log("AVG FITNESS : ",totalFitness/POPSIZE, "\n", "GENERATION : ",genCount)
      const best = cars.sort((a,b)=>b.fitScore-a.fitScore)
      cars = []
      const pool = []
      for (let i = 0; i < POPSIZE; i ++ ){
         for (let j = 0; j < POPSIZE- i; j ++ ){
            pool.push(best[i])
         }
      }
      for (let i = 0; i < POPSIZE; i ++ ){
         cars.push(new Car(SIZE[0]/2,SIZE,true))
         if (i < POPSIZE/10){
            cars[i].network = best[Math.floor(Math.random()*10)].network
            cars[i].network.mutate()
         }else if (i < POPSIZE/2){
            const randomNetwork = Math.floor(Math.random()*pool.length)
            cars[i].network = pool[randomNetwork].network
            cars[i].network.mutate()
         }else {
            cars[i].network = new Network()
            cars[i].network.init()
         }
      }
      
      obstacles = []
      requestAnimationFrame(animate)
   }
}

animate()


window.addEventListener("resize",()=>{
   SIZE[1] = window.innerHeight 
})