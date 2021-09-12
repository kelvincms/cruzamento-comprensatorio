import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import Button from "@material-ui/core/Button";

import BasicTable from "./Table";
import { PriorityQueue } from "./queue-priority";

import {
  createTable,
  gerarAnimais,
  contagemAcasalamentos,
  calcularVariancia,
  calcularMedia,
  mediaProleC,
  criarMatriz,
  vacasPossiveisAcasalar
} from "./helpers";

const calcularDistancia = (matrizC, matrizP, touros, vacas, media) => {
  let matrizDistanciaCalculada = criarMatriz(vacas.length, touros.length);
  var priorityQueue = new PriorityQueue();

  for (let i = 0; i < touros.length; i++) {
    for (let j = 0; j < vacas.length; j++) {
      if (matrizP[i][j] === 0) {
        const contrib = (touros[i].contribuicao + vacas[j].contribuicao) / 2;

        matrizDistanciaCalculada[i][j] = Math.pow(contrib - media, 2); //distancia

        priorityQueue.enqueue(
          { vaca: vacas[j].id, touro: vacas[i].id },
          matrizDistanciaCalculada[i][j]
        );
      } else {
        matrizDistanciaCalculada[i][j] = -1;
      }
    }
  }

  console.log("print matrizDistanciaCalculada");
  console.log(matrizDistanciaCalculada);
  console.log("print priority queue");
  console.log(priorityQueue);

  return { matrizDistanciaCalculada, priorityQueue };
};

//1º Acessar a primeira posição da fila de prioridade
//2º Verificar
//3º
//4º
//5º
const execucao = (matriz, touros, vacas, priorityQueue) => {
  console.log("print matriz");
  console.log(matriz);
  console.log("print priority queue");
  console.log(priorityQueue);

  const pares = [];

  for (let index = 0; index < priorityQueue.length(); index++) {
    const {
      element: { vaca, touro }
    } = priorityQueue.dequeue();

    console.log(`first: ${vaca} ${touro}`);

    // for (let j = 0; j < matriz[vaca].length; j++) {
    //   console.log(matriz[j][touro]);
    // }

    // for (let j = 0; j < matriz.length; j++) {
    //   console.log(matriz[first.touro][j]);
    // }
  }

  return pares;
};

export default function App() {
  const [queuePriority, setQueuePriority] = useState();
  const [mediaMatrizC, setMediaMatrizC] = useState();
  const [vacas, setVacas] = useState([]);
  const [touros, setTouros] = useState([]);

  const [matrizC, setMatrizC] = useState(
    Array.from({ length: 5 }, (v) => Array.from({ length: 10 }, (v) => 0))
  );

  const [matrizP, setMatrizP] = useState(
    Array.from({ length: 5 }, (v) => Array.from({ length: 10 }, (v) => 0))
  );

  const [matrizDistancia, setMatrizDistancia] = useState(
    Array.from({ length: 5 }, (v) => Array.from({ length: 10 }, (v) => 0))
  );

  const [showMatriz, setShowMatriz] = useState(true);
  const [showMatrizDistancia, setShowMatrizDistancia] = useState(true);
  const [showTouros, setShowTouros] = useState(false);

  useEffect(() => {
    const { arrayVacas, arrayTouros } = gerarAnimais(5, 10);

    setMatrizC([
      [1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
    ]);

    setMatrizP([
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 1]
    ]);

    setMatrizDistancia([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);

    setVacas(arrayVacas);

    setTouros(contagemAcasalamentos(matrizC, arrayTouros));

    const { mediaC, varianciaC } = mediaProleC(matrizC, vacas, touros);

    setMediaMatrizC(mediaC);

    const { matrizDistanciaCalculada, priorityQueue } = calcularDistancia(
      matrizC,
      matrizP,
      touros,
      vacas,
      mediaC
    );

    setMatrizDistancia(matrizDistanciaCalculada);

    const paresSolucao = execucao(matrizDistanciaCalculada, touros, vacas, priorityQueue);
  }, []);

  return (
    <div>
      {/* <div></div>

      <div style={{ display: "flex" }}>
        <div style={{ flex: "50%" }}>
          <div>
            <h3>Listagem de touros</h3>
          </div>

          <Button
            style={{ marginBottom: "10px" }}
            onClick={() => setShowTouros(!showTouros)}
            variant='contained'
          >
            Mostrar Listagem
          </Button>

          {showTouros &&
            touros.map((item, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <div>
                  <div>Id:{item.id}</div>
                  <div>IdGeral:{item.idGeral}</div>
                  <div>Contribuição:{item.contribuicao}</div>
                  <div>Sexo:{item.sexo}</div>
                  <div>Acasalamento:{item.acasalamentos && item.acasalamentos}</div>
                </div>
              </div>
            ))}
        </div>

        <div style={{ flex: "50%" }}>
          <div>
            <h3>Listagem de Vacas</h3>
          </div>

          {showTouros &&
            vacas.map((item, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <div>
                  <div>Id:{item.id}</div>
                  <div>IdGeral:{item.idGeral}</div>
                  <div>Contribuição:{item.contribuicao}</div>
                  <div>Sexo:{item.sexo}</div>
                </div>
              </div>
            ))}
        </div>
      </div> */}

      {/*
      <h3>Matrizes</h3>

      <Button
        style={{ marginBottom: "10px" }}
        onClick={() => setShowMatriz(!showMatriz)}
        variant='contained'
      >
        Mostrar Matrizes Iniciais
      </Button>

       {showMatriz ? (
        <div></div>
      ) : (
        <div>
          <h3>Matriz C </h3>
          <div>
            <BasicTable rows={matrizC} />
          </div>
          <div>
            <h4>Média:{Number(mediaMatrizC)}</h4>
          </div>
          <h3>Matriz P </h3>
          <div>
            <BasicTable rows={matrizP} />
          </div>
        </div>
      )}

      <div>
        <Button
          style={{ marginBottom: "10px" }}
          onClick={() => setShowMatrizDistancia(!showMatrizDistancia)}
          variant='contained'
        >
          Mostrar Matriz Distancia
        </Button>

        {showMatrizDistancia && (
          <div>
            <h3>Matriz Distancia </h3>

            <BasicTable rows={matrizDistancia} />
          </div>
        )}
      </div> */}
    </div>
  );
}
