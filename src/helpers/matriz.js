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

  console.log("matriz solucao ");
};

export const deleteRow = (arr, row) => {
  arr = arr.slice(0); // make copy
  arr.splice(row, 1);
  return arr;
};

export const deleteColumn = (array, index) => {
  for (var i = 0; i < array.length; i++) {
    array[i].splice(index, 1);
  }
  return array;
};

export const printMatriz = (matriz) => {
  let line = "";

  for (let i = 0; i < matriz.length; i++) {
    line += "[";
    for (let j = 0; j < matriz[i].length; j++) {
      line += ` ${parseFloat(matriz[i][j]).toPrecision(2)} ${
        j === matriz[i].length - 1 ? "" : ","
      }`;
    }
    line += "]";

    console.log(line);
    line = "";
  }
};

export const printArray = (array) => {
  let line = "";

  for (let i = 0; i < array.length; i++) {
    line += "[";
    line += ` ${parseFloat(array[i].indexAlterado).toPrecision(2)} ${
      i === array.length - 1 ? "" : ","
    }`;

    line += "]";
  }
  console.log(line);
  line = "";
};
