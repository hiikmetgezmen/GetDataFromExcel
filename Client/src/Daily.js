import axios from 'axios'
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Logout from './Logout'
import SyncLoader from "react-spinners/SyncLoader";

function Weekly () {
  const navigate = useNavigate()
  const [file, setFile] = useState()
  const [err, setErr] = useState(false);
  const [fileName, setFileName] = useState('')
  const [sheetName, setSheetName] = useState([])
  const [selectValue, setSelectValue] = useState()
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState()
  const [show, setShow] = useState(true);
  const [show2, setShow2] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const saveFile = e => {
    setShow2(show2);
    setFile(e.target.files[0])
    setFileName(e.target.files[0].name)
    
  }

  const uploadFile = async e => {
    if(file === undefined )
    {
      return setErr(true);
    }
    setLoading(true);
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName)
    formData.append('sheetName', sheetName)
    try {
      const res = await axios
        .post('http://localhost:4000/calculate/sheets', formData)
        .then(res => {
          setLoading(false);
          setShow2(!show2);
          setSheetName(res.data)
        })
    } catch (ex) {
      console.log(ex)
    }
  }

  console.log(file)

  const calculate = async e => {
    if(selectValue === undefined )
    {
      return setErr(true);
    }
    setLoading(true);
    setDisabled(true);
    const formData = new FormData()
    formData.append('file2', file)
    formData.append('file2SheetIndex', selectValue)
      if(selectValue === undefined) 
      throw new Error("Err");
    try {
      const res = await axios
        .postForm('http://localhost:4000/calculate', formData)
        .then(res => {
          console.log('Success ', res)
          setShow(!show);
          setData(res.data)
        }).catch((err)=>{
          console.log(err.message);
        })
    } catch (ex) {
      console.log(ex)
    }
  }

  let optionItems = sheetName.map((item, q) => (
    <option key={item} value={q + 1}>
      {item}
    </option>
  ))

  console.log(selectValue)

  return (
    <div className="container" disabled={disabled}>
      

         {show &&   
         <div className="home">
         
      <input type='file' onChange={saveFile} onClick={(show2)=>setShow2(!show2)} disabled={disabled} req/>
      {err && file==undefined ?<label>File can't be empty</label>:""}
      <SyncLoader color="#36d7b7"
        loading={loading}
        size={15}/>
    
      <button onClick={uploadFile} disabled={disabled}>Upload</button>
     {show2 &&
    <> <select
        value={selectValue}
        disabled={disabled}
        onChange={e => setSelectValue(e.target.value)}
        defaultValue=''
      >
         
        <option value='null' key='none'>
          {' '}
          -- Select One --{' '}
        </option>
        {optionItems}
      </select>
      {err && selectValue==undefined ?<label>Please select</label>:""}
      <button className='button' onClick={calculate} disabled={disabled}>Calculate</button>
      </>}
         </div>}
      
         {!show && <table>
      <thead>
        <tr>
          <th>SAP</th>
          <th>Stok</th>
        </tr>
        </thead>
        <tbody>
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
          )
        })}
        </tbody>
      </table>}
    
    </div>

  )
}
export default Weekly
