import axios from 'axios';
import React, {useState} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Combobox } from 'react-widgets';

function Weekly(){
 
    const navigate = useNavigate();
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");
    const [sheetName, setSheetName] = useState("");

    const saveFile = (e) => {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    };

    const uploadFile = async (e) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
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

 
    return (
      <div className="App">
        <input type="file" onChange={saveFile} />
        <button onClick={uploadFile}>Upload</button>

{sheetName.length &&(
    <>
        {
            <Combobox
            data={sheetName}
            dataKey='id'
            textField='name'
            defaultValue={1}
          />
            }</>)}
      </div>
    );
  
            }
export default Weekly