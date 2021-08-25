import React from "react";
import { Chart } from "react-google-charts";

import "./styles.css";

var MIN = 0.0,
  MAX = 1.0;

const gerarAnimais = (machos, femeas) => {
  let animais = [];

  for (let i = 0; i < machos + femeas; i++) {
    animais[i] = {
      id: i,
      contribuicao: Math.random() * (MAX - MIN) + MIN,
      sexo: i < 5 ? "macho" : "femea",
    };
  }

  animais = animais.sort((a, b) => (a.contribuicao > b.contribuicao ? -1 : 1));

  for (let i = 0; i < machos + femeas; i++) {
    animais[i].id = i;
  }
  return animais;
};

const criarMatrizC = (animais, vacas, touros) => {
  const matrizC = [];

  animais.forEach((element) => {
    if (element.sexo === "femea") {
      vacas.push(element);
      console.log("a");
    }
    if (element.sexo === "macho") {
      console.log("b");
      touros.push(element);
    }
  });

  for (let i = 0; i < touros.length; i++) {
    matrizC[i] = new Array(vacas.lenght);
  }

  for (let index = 0; index < touros.length; index++) {
    for (let j = 0; j < vacas.length; j++) {
      matrizC[index][j] = 0;
    }
  }

  console.log("vacas ijnit ", vacas);
  console.log("touros ijnit ", touros);
  matrizC[0][0] = 1;
  matrizC[0][3] = 1;
  matrizC[0][6] = 1;

  matrizC[1][1] = 1;
  matrizC[1][4] = 1;
  matrizC[1][5] = 1;
  matrizC[1][9] = 1;

  matrizC[3][2] = 1;
  matrizC[3][8] = 1;

  matrizC[4][7] = 1;

  for (let index = 0; index < touros.length; index++) {
    touros[index].acasalamentos = contagemAcasalamentosPorTouro(index, matrizC);
  }

  return matrizC;
};

const mediaProleC = (matrizC, vacas, touros) => {
  let sum = 0;
  let vetorContribuicaoIndividual = [];

  for (let i = 0; i < matrizC.length; i++) {
    for (let j = 0; j < matrizC[0].length; j++) {
      if (matrizC[i][j] === 1) {
        const contribuicaoIndividual = (touros[i].contribuicao + vacas[j].contribuicao) / 2;
        sum += (touros[i].contribuicao + vacas[j].contribuicao) / 2;

        vetorContribuicaoIndividual.push({
          contribuicaoIndividual: contribuicaoIndividual,
          touro: touros[i],
          vaca: vacas[j],
        });
      }
    }
  }

  const media = sum / vacas.length;

  const variancia = calcularVariancia(media, vetorContribuicaoIndividual, vacas, touros);

  return {
    media: media,
    variancia: variancia,
  };
};

const calcularVariancia = (media, vetorProle) => {
  let variancia = 0;
  let sum = 0;

  console.log("vetorRecebido", vetorProle);

  for (let i = 0; i < vetorProle.length; i++) {
    sum += Math.pow(vetorProle[i].contribuicaoIndividual - media, 2);
  }

  variancia = sum / vetorProle.length;

  console.log("lenght", vetorProle.length);

  return variancia;
};

const criarMatrizP = (vacas, touros) => {
  const matrizP = [];

  for (let i = 0; i < touros.length; i++) {
    matrizP[i] = new Array(vacas.lenght);
  }

  for (let index = 0; index < touros.length; index++) {
    for (let j = 0; j < vacas.length; j++) {
      matrizP[index][j] = 0;
    }
  }

  return matrizP;
};

const contagemAcasalamentosPorTouro = (touroIndice, matriz) => {
  const vacas = matriz[touroIndice];

  let contagem = 0;

  for (let i = 0; i < vacas.length; i++) {
    if (vacas[i] === 1) {
      contagem = contagem + 1;
    }
  }

  return contagem;
};

const vacasPossiveisAcasalar = (touroIndice, matrizP, touros, vacas) => {
  const linhaMatriz = matrizP[touroIndice];

  touros[touroIndice].pares = linhaMatriz.map((item, index) => {
    if (linhaMatriz[index] == 0) {
      return vacas[index];
    } else {
      return {};
    }
  });

  const ordenados = touros[touroIndice].pares.sort((a, b) => (a.id > b.id ? 1 : -1));

  touros[touroIndice].pares = ordenados;
};

const melhoresPares = (vacas, touros, media) => {
  const melhoramento = [];

  console.log("touros antes da parada toda", touros);

  let vacasDisponiveis = [];

  for (let index = 0; index < vacas.length; index++) {
    vacasDisponiveis.push({
      acasalou: false,
      id: vacas[index].id,
      contribuicao: vacas[index].contribuicao,
    });
  }

  for (let i = 0; i < touros.length; i++) {
    melhoramento[i] = new Array(vacas.length);
  }

  for (let touroIndex = 0; touroIndex < touros.length; touroIndex++) {
    touros[touroIndex].filhotes = [];

    for (let i = 0; i < touros[touroIndex].pares.length; i++) {
      if (touros[touroIndex].pares[i].id === vacasDisponiveis[i].id) {
        if (vacasDisponiveis[i].acasalou === false) {
          if (touros[touroIndex].acasalamentos > 0) {
            touros[touroIndex].acasalamentos -= 1;
            const contribuicao =
              (touros?.[touroIndex]?.contribuicao + vacasDisponiveis?.[i]?.contribuicao) / 2;
            touros[touroIndex].filhotes.push({
              vacaId: vacasDisponiveis?.[i]?.id,
              contribuicao: contribuicao,
              distancia: Math.abs(contribuicao - media),
            });

            vacasDisponiveis[i].acasalou = true;
            touros[touroIndex].filhotes.sort((a, b) => (a.distancia > b.distancia ? 1 : -1));
          } else {
            const ultimoFilhoteIndex = touros[touroIndex].filhotes.length;
            const distanciaUltimoFilhote =
              touros?.[touroIndex]?.filhotes?.[ultimoFilhoteIndex]?.distancia;

            const contribuicaoAtual =
              (touros?.[touroIndex]?.contribuicao + vacasDisponiveis?.[i]?.contribuicao) / 2;

            const distanciaAtual = Math.abs(contribuicaoAtual - media);

            if (distanciaAtual < distanciaUltimoFilhote) {
              touros[touroIndex].filhotes[ultimoFilhoteIndex] = {
                contribuicao: contribuicaoAtual,
                distancia: distanciaAtual,
              };
            }

            vacasDisponiveis = vacasDisponiveis.map((item, index) => {
              if (item?.id === touros?.[touroIndex].filhotes?.[ultimoFilhoteIndex]?.vacaId) {
                return {
                  ...item,
                  acasalou: false,
                };
              }
              return item;
            });

            touros[touroIndex].filhotes.sort((a, b) => (a.distancia > b.distancia ? 1 : -1));
          }
        }
      }
    }
  }

  console.log("vacasdisponievis", vacasDisponiveis);
};

export default function App() {
  let vacas = [];
  let touros = [];

  const animais = gerarAnimais(5, 10);
  const matrizC = criarMatrizC(animais, vacas, touros);

  const { media, variancia: varianciaAntes } = mediaProleC(matrizC, vacas, touros);

  const matrizP = criarMatrizP(vacas, touros);

  for (let index = 0; index < touros.length; index++) {
    vacasPossiveisAcasalar(index, matrizP, touros, vacas);
  }

  touros.sort((a, b) => (a.contribuicao > b.contribuicao ? 1 : -1));

  melhoresPares(vacas, touros, media);

  const filhotes = [];

  touros.forEach((touro) => {
    touro.filhotes.forEach((filhote) =>
      filhotes.push({ contribuicaoIndividual: filhote.contribuicao })
    );
  });

  const varianciaDepois = calcularVariancia(media, filhotes);

  console.log("variancia Antes", varianciaAntes);
  console.log("variancia Depois", varianciaDepois);

  return (
    <div className='App'>
      <h1>Algoritmo de casalamento</h1>
      <h1>Grafico </h1>
    </div>
  );
}
