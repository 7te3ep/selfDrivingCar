function sigmoid(z) {
  return 1 / (1 + Math.exp(-z/2000));
}


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
}
