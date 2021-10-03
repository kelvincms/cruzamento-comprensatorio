import { checaVacasTouros } from ".";

export const mediaProleC = (matrizC, vacas, touros) => {
  let sum = 0;
  let vetorContribuicaoIndividual = [];
checaVacasTouros(touros,vacas);
  for (let i = 0; i < matrizC.length; i++) {
    for (let j = 0; j < matrizC[0].length; j++) {
      if (matrizC[i][j] === 1) {
        const contribuicaoIndividual = (touros[i].contribuicao + vacas[j].contribuicao) / 2;
        sum += contribuicaoIndividual;

        vetorContribuicaoIndividual.push({
          contribuicaoIndividual: contribuicaoIndividual,
          touro: touros[i],
          vaca: vacas[j]
        });
      }
    }
  }

  const media = sum / vacas.length;

  const variancia = calcularVariancia(media, vetorContribuicaoIndividual, vacas, touros);

  return {
    mediaC: media,
    varianciaC: variancia
  };
};

export const calcularVariancia = (media, vetorProle) => {
  let variancia = 0;
  let sum = 0;

  for (let i = 0; i < vetorProle.length; i++) {
    sum += Math.pow(vetorProle[i].contribuicaoIndividual - media, 2);
  }

  variancia = sum / vetorProle.length;

  return variancia;
};
