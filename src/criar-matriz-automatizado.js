const criarMatrizC = (animais) => {
  const matrizC = [];

  animais.forEach((element) => {
    if (element.sexo === "femea") {
      vacas.push(element);
    }
    if (element.sexo === "macho") {
      touros.push(element);
    }
  });

  for (let i = 0; i < touros.length; i++) {
    matrizC[i] = new Array(vacas.lenght);
  }

  for (let i = 0; i < touros.length; i++) {
    for (let j = 0; j < vacas.length; j++) {
      const randomNumber = Math.floor(Math.random() * 2);

      if (randomNumber === 1) {
        for (let x = 0; x < touros.length; x++) {
          if (matrizC[x][j] == 1) {
            matrizC[i][j] = 0;

            break;
          } else {
            matrizC[i][j] = randomNumber;
          }
        }
      } else {
        matrizC[i][j] = 0;
      }

      // for (let x = 0; x < touros.length; x++) {
      //     break;
      //   } else {
      // matrizC[i][j] = Math.floor(Math.random() * 2);
      //   }
      // }
    }
  }

  return matrizC;
};
