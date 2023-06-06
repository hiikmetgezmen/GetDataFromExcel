import axios from 'axios'
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Logout from './Logout'

function Weekly () {
  const navigate = useNavigate()
  const [file, setFile] = useState()
  const [fileName, setFileName] = useState('')
  const [sheetName, setSheetName] = useState([])
  const [selectValue, setSelectValue] = useState()
  const [data, setData] = useState()
  const [show, setShow] = useState(true);

  const saveFile = e => {
    setFile(e.target.files[0])
    setFileName(e.target.files[0].name)
  }

  const uploadFile = async e => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName)
    formData.append('sheetName', sheetName)
    try {
      const res = await axios
        .post('http://localhost:4000/calculate/sheets', formData)
        .then(res => {
          setSheetName(res.data)
        })
    } catch (ex) {
      console.log(ex)
    }
  }

  console.log(selectValue)

  const calculate = async e => {
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
    <div className="container">
         {show &&   
         <div className="home">
         
      <input type='file' onChange={saveFile} />
      <button onClick={uploadFile}>Upload</button>
      <select
        value={selectValue}
        onChange={e => setSelectValue(e.target.value)}
        defaultValue=''
      >
        <option value='null' key='none'>
          {' '}
          -- Select One --{' '}
        </option>

        {optionItems}
      </select>

      <button className='button' onClick={calculate}>Calculate</button>
         </div>}
      
         {!show && <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
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
