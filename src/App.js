import React, { } from "react";

import { PriorityQueue } from "./queue-priority";

import { gerarAnimais, contagemAcasalamentos, mediaProleC, criarMatriz, printMatriz,  checaVacasTouros } from "./helpers";

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
  console.log("Elementos da fila:");
  priorityQueue.getItems().map((item) => console.log(item));
  //0.3 Recalculo de quantiade de acasalamentos restantes baseado em: (`tamanho da matriz em colunas` menos a `quantidade de pares impossiveis`)
  const tamPriorityQueue = priorityQueue.size();
  for (let index = 0; index < tamPriorityQueue; index++) {
    //1. Retira o elemento da fila de prioridade, a ordem da retirada é pelo maior valor.
    const {
      element: { vaca, touro },
    } = priorityQueue.dequeue();
    const idTouroAtual = touro.id;
    const idVacaAtual = vaca.id;
    if (touros[idTouroAtual].acasalou === false && vacas[idVacaAtual].acasalou === false) {
      for (let index = 0; index < vacas.length; index++) {
        if (vacas[index].paresPossiveis === 1 && touros[idTouroAtual].acasalou === false && matriz[idTouroAtual][index] !== -1 && vacas[index].acasalou === false) {
          touros[idTouroAtual].paresGarantidos.push({
            vaca: vacas[index],
            distancia: matriz[idTouroAtual][index],
          });
          if (touros[idTouroAtual].paresGarantidos.length === touros[idTouroAtual].acasalamentos) {
            touros[idTouroAtual].acasalou = true;
            for (let index = 0; index < vacas.length; index++) {
              if (matriz[idTouroAtual][index] !== -1) {
                vacas[index].paresPossiveis--;
                matriz[idTouroAtual][index] = -1;
              }
            }

          }
          vacas[index].acasalou = true;
          vacas[index].paresPossiveis = -1;
        }
      }
      if (touros[idTouroAtual].paresGarantidos.length === touros[idTouroAtual].acasalamentos) {
        matriz[idTouroAtual][index] = -1;
        continue;
      } else {
        if (vacas[idVacaAtual].acasalou === false) {
          touros[idTouroAtual].paresGarantidos.push({
            vaca: vacas[idVacaAtual],
            distancia: matriz[idTouroAtual][idVacaAtual],
          });
          vacas[idVacaAtual].acasalou = true;
          vacas[idVacaAtual].paresPossiveis = -1;
          if (touros[idTouroAtual].paresGarantidos.length === touros[idTouroAtual].acasalamentos) {
            touros[idTouroAtual].acasalou = true;
            for (let index = 0; index < vacas.length; index++) {
              if (matriz[idTouroAtual][index] !== -1) {
                vacas[index].paresPossiveis--;
                matriz[idTouroAtual][index] = -1;
              }
            }
          }
        }
      }
    } else {
      matriz[idTouroAtual][idVacaAtual] = -1;
    }
  }

  let matrizMontada = criarMatriz(coluna, linha);
  for (let touross = 0; touross < touros.length; touross++) {
    touros[touross].paresGarantidos.map((item) => {
      matrizMontada[touros[touross].id][item.vaca.id] = 1;
    });
  }
  return matrizMontada;
};

const linha = 6,
  coluna = 15;

export default function App() {
  let queuePriority;
  let mediaMatrizC;
  let vacas;
  let touros;
  let matrizC = Array.from({ length: linha }, (v) => Array.from({ length: coluna }, (v) => 0));
  let matrizP = Array.from({ length: linha }, (v) => Array.from({ length: coluna }, (v) => 0));
  let matrizDistancia = Array.from({ length: linha }, (v) => Array.from({ length: coluna }, (v) => 0));

  const { arrayVacas, arrayTouros } = gerarAnimais(linha, coluna);
  
  matrizC = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  ];
  
  matrizP = [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  ];
  
  // matrizC = [
  //   [1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  //   [0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  // ];
  // matrizP = [
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // ];
    

    // matrizP = [
      //   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
      //   [0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
      //   [0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      //   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      //   [0, 0, 1, 1, 0, 0, 0, 1, 0, 0],
      // ];
      
  // matrizP = [
  //   [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  //   [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
  //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  //   [1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
  //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  // ];
  
  // matrizP = [
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // ];

  // matrizC = [
  //   [1, 0, 0],
  //   [0, 1, 0],
  //   [0, 0, 1],
  // ];

  // matrizP = [
  //   [0, 1, 0],
  //   [0, 0, 0],
  //   [0, 1, 0],
  // ];

  // matrizP = [
  //   [0, 0, 0],
  //   [0, 0, 0],
  //   [0, 0, 0],
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
  
  console.log("Touros e vacas pós execucao");
  checaVacasTouros(touros, vacas);

  console.log("Solucao");
  console.log(paresSolucao);
  const { mediaC: mediaS, varianciaC: varianciaS } = mediaProleC(paresSolucao, vacas, touros);
  if (mediaC.toPrecision(2) === mediaS.toPrecision(2)) {
    console.log("Media:", mediaC, "Variancia antiga", varianciaC);
    console.log("Media:", mediaS, "Nova variancia:", varianciaS);
  } else {
    console.log("Erro na execução");
  }
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
