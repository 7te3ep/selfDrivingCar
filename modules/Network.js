import {ctx1,canvas1} from "./canvas1.js"

export default class Network {
   constructor() {
      this.inputs = [];
      this.hidden1 = [];
      this.hidden2 = [];
      this.outputs = [];
   }

   init() {
      this.inputs = [];
      this.hidden1 = [];
      this.hidden2 = [];
      this.outputs = [];
      this.genLayer(this.inputs,5,16)
      this.genLayer(this.hidden1,16,8)
      this.genLayer(this.hidden2,8,1)
      this.genLayer(this.outputs,1,0)

   }

   genLayer(layer,size,nextLayerSize){
      // neuron : [value,bias,links[weight]]
      for (let i = 0; i < size; i ++){
         layer.push([0,(Math.random()*2)-1,[]])
         for (let j = 0; j < nextLayerSize; j ++){
            layer[i][2].push([(Math.random()*2)-1])
         }
      }
      return layer
   }

   mutate(){
      for (let i = 0; i < 11; i++){
         this.mutation()
      }
   }

   mutation(){
      const randomlayer = Math.floor(Math.random()*3)
      let layer 
      switch (randomlayer){
         case 0 :
            layer = this.inputs
         case 1 : 
            layer = this.hidden1
         case 2 : 
            layer = this.hidden2
         case 3 : 
            layer = this.outputs
      }
      const randomNeuron = Math.floor(Math.random()*layer.length)
      const mutateBias = Math.random() < 0.5
      if (mutateBias){
         layer[randomNeuron][1] = (Math.random()*2)-1
      }else {
         const randomLink = Math.floor(Math.random()*layer[randomNeuron][2].length)
         layer[randomNeuron][2][randomLink] = (Math.random()*2)-1
      }
   }

   clearLayer(layer) {
      for (let i = 0; i < layer.length; i ++){
         layer[i][0] = 0
      } 
   }


   computeLayer(layer,nextLayer) {
      for (let i = 0; i < layer.length; i ++){
         for (let j = 0; j < nextLayer.length; j ++){
            nextLayer[j][0] += (layer[i][0] + layer[i][1]) * layer[i][2][j][0]
         }
      }  
      return nextLayer
   }

   compute(inputs) {
      this.clearLayer(this.inputs)
      this.clearLayer(this.hidden1)
      this.clearLayer(this.hidden2)
      this.clearLayer(this.outputs)
      for (let i = 0; i < inputs.length; i ++){
         this.inputs[i][0] = inputs[i]
      }
      this.computeLayer(this.inputs,this.hidden1)
      this.computeLayer(this.hidden1,this.hidden2)
      this.computeLayer(this.hidden2,this.outputs)
      return this.outputs[0][0]
   }

   draw(){
      const margins = 30
      const jump = (canvas1.width - margins * 2) / 3
      ctx1.fillStyle = "white"
      this.drawLayer(this.inputs,jump * 0, margins,this.hidden1, jump * 1)
      this.drawLayer(this.hidden1,jump * 1,margins,this.hidden2, jump * 2)
      this.drawLayer(this.hidden2,jump * 2,margins,this.outputs, jump * 3)
      this.drawLayer(this.outputs,jump * 3,margins,[],0)

   }
   drawLayer(layer,pos,margins,nextLayer,nextPos){
      const nextHeight = (nextLayer.length-1) * 30
      let startLayer = 1+ (canvas1.height - nextHeight) / 2

      const totalHeight = (layer.length-1) * 30
      let y = 1+ (canvas1.height - totalHeight) / 2
      for (let i = 0; i < layer.length; i ++){
         ctx1.strokeStyle = "white"
         ctx1.lineWidth = 0.05;
         for (let j = 0; j < nextLayer.length; j ++){
            ctx1.beginPath();
            ctx1.moveTo(margins + pos,margins+ y); 
            ctx1.lineTo(margins+nextPos,margins+ startLayer + j * 30);
            ctx1.stroke(); 
         }

         const value = layer[i][0]
         ctx1.fillStyle = value > 0 ? `rgb(0,${255 * value},0)` : `rgb(${255 * value*-1},0,0)`
         ctx1.beginPath();
         ctx1.arc(margins +pos, margins + y, 10, 0, 2 * Math.PI);
         ctx1.fill();


         y +=30
      }
   }
}
