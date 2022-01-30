import React, { useRef, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { saveAs } from 'file-saver'
import './App.css';

function FileUpload() {

    const [file, setFile] = useState(''); 
    const [data, getFile] = useState({ name: "", path: "" });
    const el = useRef(); 
    const [fileList, setFileList] = useState([]);
    

    const handleChange = (e) => {
        const file = e.target.files[0]; 
        console.log(file);
        setFile(file); 
    }

    const uploadFile = () => {
        const formData = new FormData();
        formData.append('file', file); 
        axios.post('http://192.168.0.220:3001/upload', formData).then(res => {
            getFile({ name: res.data.name,
                     path: 'http://192.168.0.220:3001' + res.data.path
                   })
        }).catch(err => console.log(err))}

    const getFolder = () => {
      axios.get('http://192.168.0.220:3001/show').then((response) => {
        setFileList(response.data)
      });
    };

    const deleteFile = (id) => {
      axios.delete(`http://192.168.0.220:3001/delete/${id}`).then((response) => {
        setFileList(fileList.filter((val) => {
          return val.id !== id
        }))
      });
    };

    const downloadFile = (path,name) => {
      saveAs('/uploads/',name);
      const leng = path+name
      return console.log(leng)
    };
       
    return (
      <div className="App">
        <div className="container">
        <input className="upload" type="file" ref={el} onChange={handleChange} />
        <button onClick={uploadFile}>Upload</button>
        </div>
        <div>
        <hr />
        {data.path && <img src={data.path} alt={data.name} />}
        <button className="bu1" onClick={getFolder}>ShowFolder</button>
        
        
        </div>
        <table className="table table-hover table-striped">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Path</th>
            <th>Action</th>
          </tr>
        </thead> 

        <tbody>
        
        {fileList.map((val,key) => (
            <tr key={val.id}>
              <td>{val.id}/{fileList.length}</td>
              <td>{val.name}</td> 
              <td>{val.pathH}</td>
              <td>
                <button className="btn btn-danger" onClick={() => {deleteFile(val.id)}}>delete</button>
                <button className="btn btn-primary" onClick={() => {downloadFile('./uploads/', val.name)}}>download</button>
                
              </td>
            </tr>
        ))}
        </tbody> 
        </table> 
        </div>
      
    );     
}

export default FileUpload;
