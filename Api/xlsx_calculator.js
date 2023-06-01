const XLSX = require("xlsx");

module.exports = function (file1, file2, file1SheetIndex, file2SheetIndex) {
  const file1SheetName = file1.SheetNames[file1SheetIndex];
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
    // const moreThan5Percent = file1Item.value * 1.05;
    // const lessThan5Percent = file1Item.value * 0.95;

    // const result1 = Math.floor(moreThan5Percent + found.value);
    // const result2 = Math.ceil(lessThan5Percent + found.value);

    const result = {
      id: file1Item.id,
      monday: file1Item.monday,
      value2: found.value,
      total,
      variance,
      variancePercent,
      pallet
      // result1,
      // result2,
    };
    results.push(result);
  }
  return results;
};
