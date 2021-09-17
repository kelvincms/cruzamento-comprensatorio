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
  //var priorityQueue = new PriorityQueue();

  //  printMatriz(matriz);
  priorityQueue.getItems().map((item) => console.log(item));
  //0.3 Recalculo de quantiade de acasalamentos restantes baseado em: (`tamanho da matriz em colunas` menos a `quantidade de pares impossiveis`)
  const tamPriorityQueue = priorityQueue.size();
  for (let index = 0; index < tamPriorityQueue; index++) {
    //1. Retira o elemento da fila de prioridade, a ordem da retirada é pelo maior valor.
    const {
      element: { vaca, touro },
    } = priorityQueue.dequeue();

    // && touros[touro.id].paresPossiveis !== 0
    if (touros[touro.id].paresPossiveis <= touros[touro.id].acasalamentos) {
      if (touros[touro.id].paresGarantidos.length < touros[touro.id].acasalamentos) {
        if (vacas[vaca.id].acasalou === false) {
          vacas[vaca.id].acasalou = true;
          touros[touro.id].paresGarantidos.push({
            vaca: vacas[vaca.id],
            distancia: matriz[touro.id][vaca.id],
          });
          console.log("Sou o touro", touros[touro.id].id);
          touros[touro.id].paresPossiveis--;
          vacas[vaca.id].paresPossiveis--;
          if (touros[touro.id].paresGarantidos.length === touros[touro.id].acasalamentos) {
            touros[touro.id].acasalou = true;
          }
        }else{
          touros[touro.id].paresPossiveis--;
          vacas[vaca.id].paresPossiveis--;
          matriz[touro.id][vaca.id] = -1;
        }
      } else {
        touros[touro.id].acasalou = true;
        touros[touro.id].paresPossiveis--;
        vacas[vaca.id].paresPossiveis--;
        matriz[touro.id][vaca.id] = -1;
      }
    } else {
      if (vacas[vaca.id].paresPossiveis === 1) {
        if(vacas[vaca.id].acasalou === false){
        console.log("Sou a vaca:", vacas[vaca.id].id);
        vacas[vaca.id].acasalou = true;
        touros[touro.id].paresPossiveis--;
        vacas[vaca.id].paresPossiveis--;
        touros[touro.id].paresGarantidos.push({
          vaca: vacas[vaca.id],
          distancia: matriz[touro.id][vaca.id],
        });
      
        if (touros[touro.id].paresGarantidos.length === touros[touro.id].acasalamentos) {
          touros[touro.id].acasalou = true;
        }
      }
      } else {
        console.log("Sou a vaca: e não preciso deste par", vacas[vaca.id].id);
        touros[touro.id].paresPossiveis--;
        vacas[vaca.id].paresPossiveis--;
        matriz[touro.id][vaca.id] = -1;
      }
    }
  }

  console.log("Touros e vacas pós execucao");
  checaVacasTouros(touros, vacas);
  console.log("Matriz de saida");
  printMatriz(matriz);
};

export default function App() {
  const linha = 5,
    coluna = 10;
  let queuePriority;
  let mediaMatrizC;
  let vacas;
  let touros;
  let matrizC = Array.from({ length: linha }, (v) => Array.from({ length: coluna }, (v) => 0));
  let matrizP = Array.from({ length: linha }, (v) => Array.from({ length: coluna }, (v) => 0));
  let matrizDistancia = Array.from({ length: linha }, (v) => Array.from({ length: coluna }, (v) => 0));

  const { arrayVacas, arrayTouros } = gerarAnimais(linha, coluna);

  matrizC = [
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  ];

  matrizP = [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 1, 0, 1, 1, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 1, 0, 0],
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
