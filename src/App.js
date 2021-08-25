import "./styles.css";

var MIN = 0.0,
  MAX = 1.0;

// interface Animal {
//   id: Number;
//   contribuicao: Number;
//   sexo: String;
// }

const gerarAnimais = (machos, femeas) => {
  let animais = [];

  for (let i = 0; i < machos + femeas; i++) {
    animais[i] = {
      id: i,
      contribuicao: Math.random() * (MAX - MIN) + MIN,
      sexo: i < 5 ? "macho" : "femea"
    };
  }

  return animais;
};

const criarMatrizC = (animais) => {
  const vacas = [];
  const touros = [];

  animais.forEach((element) => {
    if (element.sexo === "femea") {
      vacas.push(element);
    }
    if (element.sexo === "macho") {
      touros.push(element);
    }
  });

  const matrizP = [];

  for (let i = 0; i < touros.length / 2; i++) {
    matrizP[i] = new Array(vacas.lenght);
  }

  // for (let i = 0; i < touros.length; i++) {
  //   for (let j = 0; j < vacas.length; j++) {
  //     matrizP[i][j] = `T:${touros.id} V:${vacas.id}`;
  //   }
  // }

  return matrizP;
};

const animais = gerarAnimais(5, 10);
const matrizC = criarMatrizC(animais);

const criarMatrizP = () => {
  const matrizP = [];

  return matrizP;
};

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
