import './App.css';
import defaultImg from './default.png'
import selada from './bg1.png'
import warn from './warn.svg'
import { useState} from 'react';
import axios from 'axios';

// const axios = require("axios").default;

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  const handleFileUpload = async (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(false)
    } 
  };

  const handleCLick = async () => {
    if(file){
      setLoading(true)
      await sendFile(file);
      setPreview(true)
      setLoading(false);
    }else{
      alert("Masukan Gambar");
    }
  }

  const sendFile = async (file) => {
        if(file){
          let formData = new FormData();
          formData.append("image", file);

          // axios
          await axios.post(`http://127.0.0.1:5000/selada`, formData, 
                {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                }).then((res)=>{
                  // console.log(res);
                  setData(res?.data || null)
                
                }).catch((err)=>
                  console.log(err)
               )
            }
      }

  const reset = () => {
    setData(null)
    setFile(null)
    setPreview(false)
  }

  




  return (
    <>
    <section id="hero" class="d-flex align-items-center">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1 mb-3">
            <h1>Kualitas Tanaman Selada Berdasarkan Citra Daun</h1>
            <h2>Memprediksi Kualitas Tanaman Selada dengan Menggunakan Algoritma CNN </h2>
            <div class="d-flex justify-content-center justify-content-lg-start my-4">
              <div className='d-flex align-items-center justify-content-between'>
                <div class="custom-file">
                  <input type="file" className="custom-file-input"
                  accept="image/x-png,image/jpeg, image/jpg" onChange={handleFileUpload}/>
                  <label className="custom-file-label w-10" for="customFile">{file ? file.name : 'Masukan Gambar'}</label>
                </div>
                <div className='btn btn-danger mx-2 ' onClick={reset}>
                  Reset
                </div>
                <div className='btn btn-primary' onClick={handleCLick}>
                  Identifikasi
                </div>
              </div>
            </div>
            <h6 className='info'>
              *Gambar yang dimasukan akan diprediksi hanya berupa selada sehat, berjamur, busuk, dan mengalami defisiensi nutrisi. Adapun jika dimasukan gambar selain selada akan mengalami ketidaktepatan prediksi.
            </h6>
          </div>
          <div class="col-lg-6 order-2 order-lg-2">
            {data === null ? (
              <div className='d-flex justify-content-center'>
                <img src={selada} className='image-bg'/>
              </div>
              
            ):loading ? (
              <div className='d-flex justify-content-center align-items-center h-100'>
                <div className="spinner-border text-success  " role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
                <>
                  <div className='d-flex justify-content-center'>
                    <img src={data.quality ? URL.createObjectURL(file) : defaultImg} className='image-input'/>
                  </div>
                  {preview ? data.quality !== 'Not-Lettuce' ? (
                    <>
                      <div className='d-flex align-items-center justify-content-around mt-5'>
                        <div className='text-center box'>
                            <div className='title'>Kualitas</div>
                            <div className='detail'>
                              {
                                data?.quality
                              }
                            </div>
                        </div>
                        <div className='text-center box'>
                            <div className='title'>Kondisi Selada</div>
                            <div className='detail'>
                              { 
                                data?.condition
                              }
                            </div>
                        </div>
                        <div className='text-center box'>
                            <div className='title'>Tingkat Keyakinan</div>
                            <div className='detail'>{data?.confidence} % </div>
                        </div>
                      </div> 
                    </> 
                    ):(
                    <>
                        <div className='d-flex justify-content-around align-items-center w-100 bg-white p-3 rounded mt-5'>
                            <div>
                              <img src={warn} className='warn'/>
                            </div>
                            <div className='title'>
                                Gambar teridentifikasi
                                <span className='text-primary'> {data?.confidence}% </span> sebagai <span className='text-danger'>Bukan Selada</span>. 
                                Masukan kembali Gambar daun selada dengan Benar
                            </div>
                        </div>
                    </> 
                  ):(
                      ' '
                )} 
              </>  
            )}
           
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default App;
