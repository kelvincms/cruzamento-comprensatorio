import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import Button from "@material-ui/core/Button";

import BasicTable from "./Table";
import { PriorityQueue } from "./queue-priority";

import {
  gerarAnimais,
  contagemAcasalamentos,
  calcularVariancia,
  calcularMedia,
  mediaProleC,
  vacasPossiveisAcasalar,
  criarMatriz,
  createTable,
  deleteRow,
  deleteColumn,
  printMatriz,
  printArray
} from "./helpers";

const calcularDistancia = (matrizC, matrizP, touros, vacas, media) => {
  let matrizDistanciaCalculada = criarMatriz(vacas.length, touros.length);

  for (let i = 0; i < touros.length; i++) {
    let vetorTemp = [];

    //Pular a linha do touro se não houver acasalamentos
    if (touros[i].acasalamentos === 0) {
      touros[i].acasalou = true;
      continue;
    }

    for (let j = 0; j < vacas.length; j++) {
      /// percorre a matriz de cosanguinidade, caso o valor do [touro][vaca] seja 0, então eles podem acasalar. Caso contrário é colocado -1 na posição
      if (matrizP[i][j] === 0) {
        const contrib = (touros[i].contribuicao + vacas[j].contribuicao) / 2;

        matrizDistanciaCalculada[i][j] = Math.pow(contrib - media, 2); //distancia

        vacas[j].paresPossiveis.push({
          vaca: vacas[j],
          touro: touros[i],
          distancia: matrizDistanciaCalculada[i][j]
        });

        touros[i].paresPossiveis.push({
          vaca: vacas[j],
          touro: touros[i],
          distancia: matrizDistanciaCalculada[i][j]
        });
      } else {
        matrizDistanciaCalculada[i][j] = -1;
      }

      const ultimaLinha = touros.length - 1;

      /// perspectiva da vaquinha :)
      /// Se estiver na ultima linha e o par possivel da vaca for 1, então ela só pode acasalar com um touro
      if (i === ultimaLinha) {
        if (vacas[j].paresPossiveis.length === 1) {
          vacas[j].paresFechados = {
            vaca: vacas[j],
            touro: vacas[j].paresPossiveis[0].touro
          };
          vacas[j].acasalou = true;

          touros[i].paresFechados.push({
            vaca: vacas[j],
            touro: vacas[j].paresPossiveis[0].touro
          });

          touros[i].acasalamentosRestantes--;

          if (touros[i].acasalamentosRestantes === 0) {
            touros[i].acasalou = true;
          }
        }
      }
    }

    // perspectiva do tourinho :O
    if (touros[i].paresPossiveis.length === touros[i].acasalamentosRestantes) {
      touros[i].acasalou = true;
      touros[i].paresFechados = touros[i].paresPossiveis;

      touros[i].paresFechados.map((par) => {
        touros[i].acasalamentosRestantes--;

        vacas[par.vaca.id].acasalou = true;
        vacas[par.vaca.id].paresFechados = {
          vaca: par.vaca,
          touro: touros[i]
        };
      });
    }
  }

  let alterarLinhas = false;

  for (let index = 0, contador = 0; index < touros.length; index++) {
    if (alterarLinhas) {
      touros[index].idAlterado = touros[index].id - contador;
    }

    if (touros[index].acasalou) {
      const touro = touros[index];

      matrizDistanciaCalculada = deleteRow(matrizDistanciaCalculada, touro.id - contador);
      touros[index].idAlterado = -1;

      alterarLinhas = true;
      contador++;
    }
  }

  let alterarColunas = false;

  for (let index = 0, contador = 0; index < vacas.length; index++) {
    if (alterarColunas) {
      vacas[index].idAlterado = vacas[index].id - contador;
    }

    if (vacas[index].acasalou) {
      const vaca = vacas[index];

      matrizDistanciaCalculada = deleteColumn(matrizDistanciaCalculada, vaca.id - contador);
      vacas[index].idAlterado = -1;

      alterarColunas = true;
      contador++;
    }
  }

  return { matrizDistanciaCalculada, touros, vacas };
};

//1º Acessar a primeira posição da fila de prioridade, nesse caso temos uma distancia grande
//2º Por isso precisamos verificar se
//2º Verificar se t2 tem acasalamentos
//3º checar se t2 passou do numero de acasalmentos, se o
const execucao = (matriz, touros, vacas) => {
  const pares = [];
  var priorityQueue = new PriorityQueue();

  for (let index = 0; index < touros.length; index++) {
    if (touros[index].acasalou) {
      touros[index].paresFechados.map((item) => {
        pares.push(item);
      });
    } else {
      touros[index].paresPossiveis.map((item) => {
        priorityQueue.enqueue(item, item.distancia);
      });
    }
    // const {
    // element: { vaca, touro }
    // } = priorityQueue.dequeue();
    // Lê toda coluna da vaca escolhida
    // for (let j = 0; j < matriz.length; j++) {
    //   console.log(matriz[j][vaca]);
    // }
    // Lê toda linha do touro escolhido
    // for (let j = 0; j < matriz[0].length; j++) {
    // }
  }

  console.log("fechou ja ai irmao?: pares fechados", pares);
  console.log("vamo trabalhar", priorityQueue.getItems());
  return pares;
};

export default function App() {
  let queuePriority;
  let mediaMatrizC;
  let vacas;
  let touros;

  let matrizC = Array.from({ length: 5 }, (v) => Array.from({ length: 10 }, (v) => 0));
  let matrizP = Array.from({ length: 5 }, (v) => Array.from({ length: 10 }, (v) => 0));
  let matrizDistancia = Array.from({ length: 5 }, (v) => Array.from({ length: 10 }, (v) => 0));

  const { arrayVacas, arrayTouros } = gerarAnimais(5, 10);

  matrizC = [
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
  ];

  matrizP = [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1]
  ];

  vacas = arrayVacas;
  touros = contagemAcasalamentos(matrizC, arrayTouros);

  const { mediaC, varianciaC } = mediaProleC(matrizC, vacas, touros);

  mediaMatrizC = mediaC;

  const { matrizDistanciaCalculada } = calcularDistancia(matrizC, matrizP, touros, vacas, mediaC);

  matrizDistancia = matrizDistanciaCalculada;

  console.log("Touros Depois", touros);
  console.log("Vacas Depois", vacas);

  const paresSolucao = execucao(matrizDistanciaCalculada, touros, vacas);

  return <div></div>;
}

// const CoisasINUTEIS = () => {
// return (
//      <div></div>

//       <div style={{ display: "flex" }}>
//         <div style={{ flex: "50%" }}>
//           <div>
//             <h3>Listagem de touros</h3>
//           </div>

//           <Button
//             style={{ marginBottom: "10px" }}
//             onClick={() => setShowTouros(!showTouros)}
//             variant='contained'
//           >
//             Mostrar Listagem
//           </Button>

//           {showTouros &&
//             touros.map((item, index) => (
//               <div key={index} style={{ marginBottom: "10px" }}>
//                 <div>
//                   <div>Id:{item.id}</div>
//                   <div>IdGeral:{item.idGeral}</div>
//                   <div>Contribuição:{item.contribuicao}</div>
//                   <div>Sexo:{item.sexo}</div>
//                   <div>Acasalamento:{item.acasalamentosRestantes && item.acasalamentosRestantes}</div>
//                 </div>
//               </div>
//             ))}
//         </div>

//         <div style={{ flex: "50%" }}>
//           <div>
//             <h3>Listagem de Vacas</h3>
//           </div>

//           {showTouros &&
//             vacas.map((item, index) => (
//               <div key={index} style={{ marginBottom: "10px" }}>
//                 <div>
//                   <div>Id:{item.id}</div>
//                   <div>IdGeral:{item.idGeral}</div>
//                   <div>Contribuição:{item.contribuicao}</div>
//                   <div>Sexo:{item.sexo}</div>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>

//       <h3>Matrizes</h3>

//        <Button
//         style={{ marginBottom: "10px" }}
//         onClick={() => setShowMatriz(!showMatriz)}
//         variant='contained'
//       >
//         Mostrar Matrizes Iniciais
//       </Button>

//        <div>
//         <h3>Matriz C </h3>
//         <div>
//           <BasicTable rows={matrizC} />
//         </div>
//         <div>
//           <h4>Média:{Number(mediaMatrizC)}</h4>
//         </div>
//         <h3>Matriz P </h3>
//         <div>
//           <BasicTable rows={matrizP} />
//         </div>
//       </div>

//        <div>
//        <Button
//           style={{ marginBottom: "10px" }}
//           onClick={() => setShowMatrizDistancia(!showMatrizDistancia)}
//           variant='contained'
//         >
//           Mostrar Matriz Distancia
//         </Button>

//         <div>
//           <h3>Matriz Distancia </h3>

//           <BasicTable rows={matrizDistancia} />
//         </div>
//     </div>
// )
// }
