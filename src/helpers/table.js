export function createTable(tableData) {
  var table = document.createElement("table");
  // table.style.alignItems = "center";
  // table.style.direction = "flex";
  // table.style.justifyContent = "center";

  table.style.border = "1px solid black";
  table.style.backgroundColor = "white";
  table.style.borderCollapse = "collapse";

  var tableBody = document.createElement("tbody");
  tableBody.style.border = "1px solid black";

  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");
    row.style.border = "1px solid black";

    rowData.forEach(function (cellData) {
      var cell = document.createElement("td");
      cell.style.border = "1px solid black";
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
}

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
