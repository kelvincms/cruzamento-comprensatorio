import React, { useEffect, useState } from "react";
//import { Chart } from "react-google-charts";
//import Button from "@material-ui/core/Button";

//import BasicTable from "./Table";
import { PriorityQueue } from "./queue-priority";

import { gerarAnimais, contagemAcasalamentos, calcularVariancia, calcularMedia, mediaProleC, vacasPossiveisAcasalar, criarMatriz, createTable, deleteRow, deleteColumn, printMatriz, printArray, checaVacasTouros } from "./helpers";

const calcularDistancia = (matriz, matrizP, touros, vacas, media) => {
  let matrizDistanciaCalculada = criarMatriz(vacas.length, touros.length);
  var priorityQueue = new PriorityQueue();
  for (let i = 0; i < touros.length; i++) {
    for (let j = 0; j < vacas.length; j++) {
      if (matrizP[i][j] === 0 && touros[i].acasalamentos !== 0) {
        const contrib = (touros[i].contribuicao + vacas[j].contribuicao) / 2;
        const distancia = Math.pow(contrib - media, 2);
        matrizDistanciaCalculada[i][j] = distancia; //distancia
        vacas[j].paresPossiveis++;
        touros[i].paresPossiveis++;
        const item = {
          touro: touros[i],
          vaca: vacas[j],
          distancia: distancia,
        };
        priorityQueue.enqueue(item, item.distancia);
      } else {
        matrizDistanciaCalculada[i][j] = -1;
      }
    }
  }
  console.log("Matriz Distancia");
  printMatriz(matrizDistanciaCalculada);
  return { matrizDistanciaCalculada, priorityQueue, vacas, touros };
};

const execucao = (matriz, touros, vacas, priorityQueue) => {
  priorityQueue.getItems().map((item) => console.log(item));
  const tamPriorityQueue = priorityQueue.size();
  for (let index = 0; index < tamPriorityQueue; index++) {
    const {
      element: { vaca, touro },
    } = priorityQueue.dequeue();
    if (matriz[touro.id][vaca.id] != -1) {
      touros[touro.id].paresPossiveis--;
      vacas[vaca.id].paresPossiveis--;
      if (touros[touro.id].paresPossiveis === touros[touro.id].acasalamentos) {
       matriz= recursaoTouro(matriz, vacas, touros, touro.id);
      } else if (vacas[vaca.id].paresPossiveis === 1) {
       matriz= recursaoVaca(matriz, vacas, touros, vaca.id);
      } else {
        matriz[touro.id][vaca.id] = -1;
      }
    }


  }

  console.log("Touros e vacas pós execucao");
  checaVacasTouros(touros, vacas);
  console.log("Matriz de saida");
  //printMatriz(matriz);
};
const recursaoTouro = (matriz, vacas, touros, indice) => {
  for (let index = 0; index < matriz[0].length; index++) {
      if (touros[indice].paresGarantidos.length === touros[indice].acasalamentos){
        let contem = false;
        for (let indexx = 0; indexx < touros[indice].paresGarantidos.length; indexx++) {
          if(index === touros[indice].paresGarantidos[indexx]){
            contem = true;
          }
        }
        if(contem === false){
          vacas[index].paresPossiveis--;
          if(vacas[index].paresPossiveis === 1 && vacas[index].acasalou === false){
            matriz = recursaoVaca(matriz,vacas,touros,index);
          }
         }
        }else if(touros[indice].paresPossiveis === touros[indice].acasalamentos){
          if(matriz[indice][index] !== -1){
            if(vacas[index].acasalou === false){
            vacas[index].acasalou = true;
            touros[indice].paresGarantidos.push({
              vaca: vacas[index],
              distancia: matriz[indice][index],
            });
            touros[indice].acasalamentos--;
            vacas[index].parVaca.push({
              touro: touros[indice],
              distancia: matriz[indice][index],
            });
            vacas[index].paresPossiveis--;
            if(vacas[index].paresPossiveis>1){
              matriz = recursaoVaca(matriz,vacas,touros,index);
            }
          }
        }
        }
      }
      return matriz;
    };
    // if (matriz[indice][index] !== -1) {
    //   touros[indice].paresGarantidos.push({
    //     vaca: vacas[index],
    //     distancia: matriz[indice][index],
    //   });
    //   vacas[index].paresPossiveis--;
    //   console.log("Comecei a recursão da vaca: ", index);
    //   console.log("Matriz antes desta recursao");
    //   printMatriz(matriz);
    //   recursaoVaca(matriz, vacas, touros, index);
    //   console.log("Matriz pós recursao da vaca:", index);
    //   printMatriz(matriz);
    // }
    for (let index = 0; index < vacas.length; index++) {
      if(vacas[index].paresPossiveis === 1){

      }
      
    }
    
    const recursaoVaca = (matriz, vacas, touros, indice) => {
  // if (vacas[indice].paresPossiveis === 1 || vacas[indice].acasalou) { // condição que é SEMPRE verdadeira
  for (let index = 0; index < matriz.length; index++) {
    if (vacas[indice].acasalou) {
      if (vacas[indice].parVaca[0].touro.id !== index) {
        matriz[index][indice] = -1;
        vacas[indice].paresPossiveis--;
        touros[index].paresPossiveis--;
        if (touros[index].paresPossiveis === touros[index].acasalamentos) {
        matriz = recursaoTouro(matriz, vacas, touros, index);
        }
      }
    } else if (vacas[indice].paresPossiveis === 1) {
      vacas[indice].acasalou = true;
      if (matriz[index][indice] !== -1) {
        touros[index].paresGarantidos.push({
          vaca: vacas[indice],
          distancia: matriz[index][indice],
        });
        vacas[indice].parVaca.push({
          touro: touros[index],
          distancia: matriz[index][indice],
        });
        touros[index].paresPossiveis--;
        if(touros[index].paresGarantidos.length === touros[index].acasalamentos){
         matriz = recursaoTouro(matriz,vacas,touros,index);
        }
      }
      // }
      // if (matriz[index][indice] !== -1) {
      //   vacas[indice].acasalou = true;
      //   // touros[index].paresGarantidos.push({
      //   //   vaca: vacas[indice],
      //   //   distancia: matriz[index][indice],
      //   // });
      //   touros[index].paresPossiveis--;

      //   console.log("Comecei a recursão do touro: ", index);
      //   console.log("Matriz antes desta recursao");
      //   printMatriz(matriz);
      //   recursaoTouro(matriz, vacas, touros, index);
      //   console.log("Matriz pós recursao do touro:", index);
      //   printMatriz(matriz);
      // } else if (vacas[indice].acasalou) {
      //   matriz[index][indice] = -1;
      // }
    }
  }
  return matriz;
  // }else{
  //   console.log("Isto é uam condição impossível mesmo");
  //   return;
  // }
};

export default function App() {
  const linha = 3,
    coluna = 3;
  let queuePriority;
  let mediaMatrizC;
  let vacas;
  let touros;
  let matrizC = Array.from({ length: linha }, (v) => Array.from({ length: coluna }, (v) => 0));
  let matrizP = Array.from({ length: linha }, (v) => Array.from({ length: coluna }, (v) => 0));
  let matrizDistancia = Array.from({ length: linha }, (v) => Array.from({ length: coluna }, (v) => 0));

  const { arrayVacas, arrayTouros } = gerarAnimais(linha, coluna);

  // matrizC = [
  //   [1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  //   [0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  // ];
  matrizC = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  // matrizP = [
  //   [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 1, 0, 0, 1, 0, 1, 1, 0, 0],
  //   [0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  //   [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 1, 1, 0, 0, 0, 1, 0, 0],
  // ];
  matrizP = [
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
  ];
  // matrizP = [
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // ];

  vacas = arrayVacas;
  touros = contagemAcasalamentos(matrizC, arrayTouros);

  const { mediaC, varianciaC } = mediaProleC(matrizC, vacas, touros);

  mediaMatrizC = mediaC;

  const { matrizDistanciaCalculada, priorityQueue } = calcularDistancia(matrizC, matrizP, touros, vacas, mediaC);
  console.log("Vacas e touros antes da execucao");
  checaVacasTouros(touros, vacas);

  matrizDistancia = matrizDistanciaCalculada;

  const paresSolucao = execucao(matrizDistancia, touros, vacas, priorityQueue);

  return <div></div>;
}

// touros[touro.id].paresGarantidos.push({
//   vaca: vacas[vaca.id],
//   touro: touros[touro.id],
//   distancia: matriz[touro.id][vaca.id],
// });
// vacas[vaca.id].acasalou = true;
// vacas[vaca.id].paresPossiveis - 1;
// if (touros[touro.id].paresGarantidos.length === touro.acasalamentos) {
// touros[touro.id].acasalou = true;
// }
