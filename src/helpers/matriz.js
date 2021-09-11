export const criarMatriz = (columnLength, lineLength) => {
  const matriz = [];

  for (let i = 0; i < lineLength; i++) {
    matriz[i] = new Array(columnLength);
  }

  for (let index = 0; index < lineLength; index++) {
    for (let j = 0; j < columnLength; j++) {
      matriz[index][j] = 0;
    }
  }

  return matriz;
};

export const criarMatrizSolucao = (touros, vacas) => {
  const matrizSolucao = criarMatriz(vacas.length, touros.length);

  console.log("matriz solucao", matrizSolucao);
};
