import axios from 'axios';
import React, {useState} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Combobox } from 'react-widgets';
import Select from 'react-select';

function Weekly(){
 
    const navigate = useNavigate();
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");
    const [sheetName, setSheetName] = useState([]);
    const [selectValue, setSelectValue] = useState();
    const [data, setData] = useState();
    const [error, setError] = useState('')


    // const options = [
    //   sheetName.map((e,y)=>{
    //     label : e, 
    //   })
      
    // ]

    const saveFile = (e) => {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    };

    const uploadFile = async (e) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("sheetName", sheetName);
      try {
        const res = await axios.post(
          "http://localhost:4000/calculate/sheets",
          formData
        ).then(res=>{
            setSheetName(res.data);
        });
      } catch (ex) {
        console.log(ex);
      }
    };

   
 
    

    // console.log("Ön yüz ",file);
    // const handleChange = (selectedOption) => {
    //   console.log("handle change", selectedOption);
    // }


  //   const SelectDropdown = () => {
  //     return (
  //         <select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
  //             <option value="" key="none"> -- Select One -- </option>
  //             {
  //                 sheetName?.map( (item,index) => (
  //                     <option value={index} key={index}>{item}</option>
  //                 ))
  //             }
  //         </select>

          
  //     )
      
  // }


console.log(selectValue);

const calculate = async (e) => {

  const formData = new FormData();
  formData.append("file2", file);
  formData.append("file2SheetIndex", selectValue);

  try {
    const res = await axios.postForm(
      "http://localhost:4000/calculate", formData)
    .then((res) => {
      console.log("Success ", res);
      setData(res.data);
    })
  } catch (ex) {
    console.log(ex);
  }
};


let optionItems = sheetName.map((item,q) =>
        <option key={item} value={q+1}>{item}</option>
    );




    console.log(selectValue);

 
    return (
      <div className="App">
        <input type="file" onChange={saveFile} />
        <button onClick={uploadFile}>Upload</button>
        {/* <SelectDropdown name='file2SheetIndex'/> */}
        <select value={selectValue}  onChange={(e) => setSelectValue(e.target.value)} defaultValue="">
        <option value="" key="none"> -- Select One -- </option>
        
           {optionItems}
        
                       
                    </select>

        <button onClick={calculate} >Calculate</button>

        <table>
          <tr>
            <th>Title</th>
            <th>Author</th>
          </tr>

          {data?.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.id}</td>
                {/* <td>{item.monday}</td>
                <td>{item.value2}</td>
                <td>{item.total}</td>
                <td>{item.variance}</td>
                <td>{item.variancePercent}</td> */}
                <td>{item.pallet}</td>  
              </tr>
            );
          })}
        </table>
      </div>
    );
  
            }
export default Weekly