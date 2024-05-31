

function chart(ctx,canvas,data,lineColor,fillColor,bgColor,margins = 20){
   ctx.fillStyle = bgColor
   ctx.fillRect(0,0,canvas.width,canvas.height);
   const xRange = [margins,canvas.width-margins]
   const YRange = [canvas.height-margins,margins]
   const xTotal = canvas.width - margins *2
   const yTotal = canvas.height - margins *2
   const maxValue = Math.max( ...data );
   const valueScale = yTotal/maxValue
   const drawScales = ()=>{
      ctx.fillStyle = "white"
      ctx.font = "10px serif";
      let ctr = 0
      for (let i = YRange[0]; i >= YRange[1]; i -= yTotal/10){
         ctx.fillRect(margins,i,5,1)
         ctx.fillText(Math.floor((maxValue/10) * ctr * 10)/10, 1, i);
         ctr ++
      }
      for (let i = xRange[0]; i <= xRange[1]; i += xTotal / 10){
         ctx.fillRect(i,YRange[0],1,5)
      }
   }

   const drawData = ()=>{
      ctx.fillStyle = fillColor
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 3
      const values = data.length >= 10 ? data.slice(data.length-11,data.length-1) : data
      ctx.beginPath()
      ctx.moveTo(10+margins,YRange[0]-(values[0]*valueScale))
      for (let i = 0; i < 11; i ++){
         ctx.lineTo(10+xRange[0]+(xTotal/10) * i,YRange[0]-(values[i]*valueScale))
      }
      ctx.stroke()
      ctx.lineTo(xRange[0]+(xTotal/10) * values.length,YRange[0])
      ctx.lineTo(xRange[0]+10,YRange[0])
      ctx.fill()
   }

   

   drawScales()
   drawData()
}
//
//
//function chart(ctx,canvas,data,lineColor,fillColor,bgColor,margins = 20){
//   ctx.fillStyle = bgColor
//   ctx.fillRect(0,0,canvas.width,canvas.height);
//   const xRange = [margins,canvas.width-margins]
//   const YRange = [canvas.height-margins,margins]
//   const xTotal = canvas.width - margins *2
//   const yTotal = canvas.height - margins *2
//   const maxValue = Math.max( ...data );
//   const scale = maxValue/canvas.height
//   const scale1 = canvas.height-20/maxValue
//   const drawScales = ()=>{
//      ctx.fillStyle = "white"
//      ctx.font = "10px serif";
//      for (let  i = 20; i <= canvas.height-20; i += (canvas.height-40) /10 ){
//         ctx.fillRect(20,i,5,1)
//         ctx.fillText(Math.round((i - 20) * scale *100)/100, 5,canvas.height-i+10);
//      }
//      for (let  i = 20; i <= canvas.width-20; i += (canvas.width-40) /10 ){
//         ctx.fillRect(i,canvas.height-20,1,5)
//      }
//   }
//
//   const drawData = ()=>{
//      ctx.fillStyle = fillColor
//      ctx.beginPath();
//      ctx.moveTo(30, canvas.height-20 - data[0]*scale1);
//      for (let i = 0; i < data.length; i++){
//         ctx.lineTo(30  + i * (canvas.width-40) / 10,canvas.height-20 - data[i]*scale1);
//      }
//      ctx.lineTo(canvas.width-20,canvas.height-20);
//      ctx.lineTo(20,canvas.height-20);
//      ctx.lineTo(30, canvas.height-20 - data[0]*scale1);
//
//      ctx.fill();
//
//      ctx.strokeStyle= lineColor
//      ctx.beginPath();
//      ctx.moveTo(30, canvas.height-20 - data[0]*scale1);
//      for (let i = 0; i < data.length; i++){
//         ctx.lineTo(30  + i * (canvas.width-40) / 10,canvas.height-20 - data[i]*scale1);
//      }
//      ctx.lineWidth = 2;
//      ctx.stroke();
//
//   }
//
//   drawScales()
//   drawData()
//}
//
export default chart