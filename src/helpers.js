// function createTable(tableData) {
//   var table = document.createElement("table");
//   var tableBody = document.createElement("tbody");

//   tableData.forEach(function (rowData) {
//     var row = document.createElement("tr");

//     rowData.forEach(function (cellData) {
//       var cell = document.createElement("td");
//       cell.appendChild(document.createTextNode(cellData));
//       row.appendChild(cell);
//     });

//     tableBody.appendChild(row);
//   });

//   table.appendChild(tableBody);
//   document.body.appendChild(table);
// }

// const criarDadosGraficos = (vetorContribuicaoIndividual) => {
//   let dados = [];

//   dados = [
//     vetorContribuicaoIndividual.map(
//       (item) => `t${item.touro.id}-v${item.vaca.id}`,
//       item.contribuicaoIndividual
//     ),
//   ];

//   return dados;
// };

// const Grafico = ({ dadosGraficos }) => {
//   // const maxValue = () => {
//   //   const allValues = dadosGraficos.map((item) => item.y);
//   //   return Math.max(allValues);
//   // };

//   const options = {
//     title: "Age vs. Weight comparison",
//     hAxis: { title: "y", viewWindow: { min: 0, max: 10 } },
//     vAxis: { title: "x", viewWindow: { min: 0, max: maxValue() } },
//     legend: "none",
//   };

//   return (
//     <div className='App'>
//       <Chart
//         width={"500px"}
//         height={"300px"}
//         chartType='BarChart'
//         data={dadosGraficos}
//         options={options}
//       />
//     </div>
//   );
// };
