const XLSX = require("xlsx");
var Excel = require('exceljs');
const fs = require("fs");



function writeData(data){
  const jsonData = JSON.stringify(data);
  fs.writeFile("data.json", jsonData, (error) => {
    if (error) {
      // logging the error
      console.error(error);
  
      throw error;
    }  console.log("data.json written correctly");
  });

}
module.exports = function (file1, file2, file2SheetIndex) {
  const file1SheetName = file1.SheetNames[0];
  const file1Worksheet = file1.Sheets[file1SheetName];
  const file1Data = XLSX.utils.sheet_to_json(file1Worksheet, {
    header: "A",
    range: 5,
  });


  const file1DataMapped = file1Data
    .filter((data) => data.A && data.N && ((data==null)?0:data))
    .map((data) => ({
      id: data.A,
      value: data.N ==null ? 0 : data.N ,
      palet: data.AG ==null ? 0 : data.AG,
      variance:data.P==null ? 0 : data.P,
     monday:data.S ==null ? 0 : data.S,
      tuesday:data.T ==null ? 0 : data.T,
      wednesday:data.U ==null ? 0 : data.U,
      thursday:data.V==null ? 0 : data.V,
      friday:data.W==null ? 0 : data.W,
      saturday:data.X==null ? 0 : data.X,
     sunday:data.Y==null ? 0 : data.Y
    }));

  const file2SheetName = file2.SheetNames[file2SheetIndex];
  const file2Worksheet = file2.Sheets[file2SheetName];
  const file2Data = XLSX.utils.sheet_to_json(file2Worksheet, {
    header: "A",
    range: 1,
  });

  

  const file2DataMapped = file2Data
    .filter((data) => data.A && data.B)
    .map((data) => ({
      id: data.A,
      value: data.B,
    }));

  const results = [];
  const result= [];

  for (const file1Item of file1DataMapped) {
    const found = file2DataMapped.find(
      (file2Item) => file2Item.id === file1Item.id
    );
    if (!found) continue;

   
 const total = found.value + file1Item.monday
     + file1Item.tuesday + file1Item.wednesday + file1Item.thursday + file1Item.friday + file1Item.saturday + file1Item.sunday;
   const variance =   total - file1Item.value;
   const variancePercent = ((variance*100) /file1Item.value).toFixed(3) ;
   const pallet = (-variance)/file1Item.palet;


  

   const response =  fs.readFile("data.json", (error, data) => {
      // if the reading process failed,
      // throwing the error
      if (error) {
        // logging the error
        console.error(error);
    
        throw err;
      }
      const user =  JSON.parse(data);
      for(let i in user){
        console.log(user[i].id);
        }
      // console.log(user);
    });
    
    // console.log(response);
    // const newWb = XLSX.utils.book_new();
    // var newsh = XLSX.utils.json_to_sheet(newData);
    // XLSX.utils.book_append_sheet(newWb,newsh,0);
    // XLSX.writeFile(newWb,"./files/file1.xlsx");

  

    // workbook.xlsx.readFile('./files/file1.xlsx')
    // .then(function() {
    //     var worksheet = workbook.getWorksheet(0);
    //     var row = worksheet.getRow(5);
    //     row.getCell(1).value = 5; // A5's value set to 5
    //     row.commit();
    //     return workbook.xlsx.writeFile('new.xlsx');
    // })





 
   
    // const moreThan5Percent = file1Item.value * 1.05;
    // const lessThan5Percent = file1Item.value * 0.95;

    // const result1 = Math.floor(moreThan5Percent + found.value);
    // const result2 = Math.ceil(lessThan5Percent + found.value);

    const result = {
      id: file1Item.id,
      // monday: file1Item.monday,
      // value2: found.value,
      // total,
      // variance,
      // variancePercent,
      pallet
      // result1,
      // result2,
    };
    const newData = [];
    results.push(result);
    // for(let id in result){
    // // results.push(result);
    //   // results.push({id:id, total:total[id]});
    // writeData(results);

    // }
    
  }
  writeData(results);
  return results;
};
