
function init(network,layers){
   for (let i = 0; i < layers.length; i++){
      // create layer
      network.push([])
      for (let j = 0; j < layers[i]; j ++){
         // add neurons
         network[i].push([0,randBias(),[]])
         const nextLayerSize = layers.length != i + 1 ? layers[i + 1] : 0
         for (let l =0; l < nextLayerSize; l ++){
            // add links
            network[i][j][2].push(randBias())
         }
      }
   }
   return network
}

function compute(network,inputs){
   if (network[0].length != inputs.length) return "Incorrect Input Size"

   // clear all values
   for (let i = 0; i < network.length; i ++){
      for (let j = 0; j < network[i].length; j ++){
         network[i][j][0] = 0
      }
   }
   // input
   for (let j = 0; j < network[0].length; j ++){
      network[0][j][0] = inputs[j]
   }
   // compute
   for (let i = 0; i < network.length; i ++){
      for (let j = 0; j < network[i].length; j ++){
         network[i][j][0] += network[i][j][1]
         for (let l = 0; l < network[i][j][2].length; l ++){
            network[i+1][l][0] += network[i][j][0] * network[i][j][2][l]
         }
      }
   }
   return network[network.length-1].map(neuron=>neuron[0])
}

function mutate(network,iterations){
   for (let i = 0; i < iterations; i ++){
      const isBias = Math.random() < 0.5
      if (isBias){
         const randomLayer = Math.floor(Math.random()*(network.length - 1))
         const randomNeuron = Math.floor(Math.random()*network[randomLayer].length)
         network[randomLayer][randomNeuron][1] = randBias()
      }
      else {
         const randomLayer = Math.floor(Math.random()*(network.length - 2))
         const randomNeuron = Math.floor(Math.random()*network[randomLayer].length)
         const randomLink = Math.floor(Math.random()*network[randomLayer][randomNeuron][2].length)
         network[randomLayer][randomNeuron][2][randomLink] = randBias()
      }
   }
   return network
}

function draw(network, canvas, ctx,size){
   const margins = 30 *size
   const layerGap = 40*size
   const neuronsGap = 25 * size
   const neuronSize = 5 * size

   ctx.strokeStyle = "white"

   const layersStart = [] 
   for (let i = 0; i < network.length; i ++){
      const surplus = (canvas.height - ((network[i].length-1)*neuronsGap))
      layersStart.push(surplus/2)
   }
  
   let y = layersStart[0]
   for (let i = 0; i < network.length; i ++){
      y = layersStart[i] 
      for (let j = 0; j < network[i].length; j ++){
         ctx.fillStyle = network[i][j][0] >= 0 ? `rgb(0,${255*network[i][j][0]},0)` :  `rgb(${255*(network[i][j][0]*-1)},0,0)`
         ctx.beginPath();
         ctx.arc(margins + i * layerGap, y, neuronSize , 0, 2 * Math.PI);
         ctx.fill();
         
         for (let l = 0; l < network[i][j][2].length; l ++){
            const linkNeuronPosX = margins + (i + 1) * layerGap
            const linkNeuronPosY = layersStart[i+1] + l * neuronsGap 
            ctx.beginPath(); // Start a new path
            ctx.moveTo(margins + i * layerGap, y); // Move the pen to (30, 50)
            ctx.lineTo(linkNeuronPosX, linkNeuronPosY); // Draw a line to (150, 100)
            ctx.stroke(); // Render the path
         }
         y += neuronsGap
      }
   }
}

function randBias(){
   return (Math.random()*2)-1
}

export {init, compute, draw, mutate}
