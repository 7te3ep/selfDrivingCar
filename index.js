import Car from './modules/Car.js'
import {init, compute, draw, mutate} from "./modules/network.js"
import {ctx, canvas} from "./modules/canvas.js"
import chart from "./modules/chart.js"
import { canvas1, ctx1 } from './modules/canvas1.js'

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
   for (let i = 0; i < POPSIZE; i ++ ){
      if (!cars[i].alive) continue
      if (cars[i].checkObstacle(nearestObstacle)) cars[i].alive = false
      cars[i].angle += compute(cars[i].network,[cars[i].x/SIZE[0],cars[i].y/SIZE[1],nearestObstacle[0]/SIZE[0],nearestObstacle[1]/SIZE[1],1 / (1 + Math.exp(-cars[i].angle))])[0]
      cars[i].update(SPEED,SIZE)
      cars[i].draw()
   }

   const selectCar = cars.find((car)=>car.alive)
   if (selectCar){
      selectCar.draw("rgba(0,255,255,0.8)")
      draw(selectCar.network,canvas1,ctx1,1.)
   }
   return cars
}

function drawObstacle(obstacles,SIZE,cars,alternator,obstacleImg){
   ctx.fillStyle = "red"
   const oldSize = obstacles.length
   obstacles = obstacles.filter(obstacle => obstacle[1] < SIZE[1])
   obstacles.forEach(obstacle => {
      obstacle[1] += SPEED / 1.5
      //ctx.fillRect(obstacle[0],obstacle[1],120,170);
      ctx.drawImage(obstacleImg,obstacle[0],obstacle[1]);
   });
   if (obstacles.length == 0 ){
      obstacles.push([alternator ? 55 : 290,-170])
      alternator = alternator ? false : true
   }else if ( obstacles.sort((a,b)=>a[1]-b[1])[0][1] > 170 * 4) {
      obstacles.push([alternator ? 55 : 290,-170])
      alternator = alternator ? false : true
   }

   if (oldSize - obstacles.length != 0){
      cars.filter(car=>car.alive).forEach(car=>car.fitScore += 1000)
   }
   return [obstacles,alternator]
}

function nextGen(oldPop,POPSIZE){   
   const newPop = []
   for (let i = 0; i < POPSIZE; i ++){
      newPop.push(new Car(SIZE[0]/2,SIZE,true))
      if (oldPop[i].fitScore < oldPop[i].oldScore){
         newPop[i].network = oldPop[i].oldNetwork
      }
      newPop[i].oldNetwork = newPop[i].network
      newPop[i].oldScore = oldPop[i].fitScore
      newPop[i].network = mutate( oldPop[i].network, 10) 
   }
   return newPop
}

const SIZE = [450,window.innerHeight]
canvas.width = SIZE[0];
canvas.height = SIZE[1];
const LINELEN = SIZE[1]/15
let SPEED = 20
const obstacleImg = new Image()
obstacleImg.src = "./obstacle.png"

const POPSIZE = 100
const networkStruct = [5,8,8,1]
let start = 0
let cars = []
let genCount = 0
let obstacles = []
let alternator = false
let lastFitness= []
for (let i = 0; i < POPSIZE; i ++ ){
   cars.push(new Car(SIZE[0]/2,SIZE,true))
   cars[i].network = init([],networkStruct)
}
console.log("Population : ",POPSIZE, "\n",
"Speed : ",SPEED, "\n",
"Function : Sigmoid", "\n",
"Network : 5 : 16 : 8 : 1", "\n",
)

const chart1 = document.getElementById("chart");
const ctxChart = chart1.getContext("2d");
chart1.width = 300
chart1.height = 300

document.getElementById('speed').oninput = function() {
   SPEED = this.value;
 } 
function animate(){
   ctx.clearRect(0,0,SIZE[0],SIZE[1])  
   
   chart(ctxChart,chart1,lastFitness,"red","rgba(255,100,100,0.5)","#222")

   drawRoad(SPEED, LINELEN, SIZE)
   const obstacleResult = drawObstacle(obstacles,SIZE,cars,alternator,obstacleImg)
   obstacles = obstacleResult[0]
   alternator = obstacleResult[1]
   cars  = drawCars(cars,obstacles,SPEED,POPSIZE,SIZE)
   
   if (cars.filter(car => car.alive) != 0){
      requestAnimationFrame(animate)
   }else {
      genCount ++
      const totalFitness = cars.reduce((sum,el)=>sum += el.fitScore,0)
      lastFitness.push(totalFitness)
      console.log(new Date(),"\n","AVG FITNESS : ",totalFitness/POPSIZE, "\n", "GENERATION : ",genCount)
      const best = cars.sort((a,b)=>b.fitScore-a.fitScore)
      cars = nextGen(best,POPSIZE)
      obstacles = []
      requestAnimationFrame(animate)
   }
}

animate()


window.addEventListener("resize",()=>{
   SIZE[1] = window.innerHeight 
})