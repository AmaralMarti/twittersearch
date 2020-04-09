import React, { useState, useEffect } from 'react'
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import './style.css'
import api from '../api'

function SearchPage() {

  const [ value, setValue ] = useState('')
  const [ data, setData ] = useState({})

  const [ prevDisabled, setPrevDisabled ] = useState('')
  const [ nextDisabled, setNextDisabled ] = useState('')

  useEffect(() => {
    if ((data.metadata || {}).prev) {
      setPrevDisabled('')      
    } else {
      setPrevDisabled('disabled')      
    }

    if ((data.metadata || {}).next) {
      setNextDisabled('')      
    } else {
      setNextDisabled('disabled')      
    }    
  }, [data])

  async function search() {
    const res = await api.get(`/v1/search?query=${value}&count=10`)

    setData(res.data)
  }

  async function searchNext() {
    const next = data.metadata.next
    const res = await api.get(`/v1/search?query=${value}&count=10&current=${next}`)

    setData(res.data)
  }
  
  async function searchPrev() {
    const prev = data.metadata.prev
    const res = await api.get(`/v1/search?query=${value}&count=10&current=${prev}`)

    setData(res.data)
  }  
  
  return (
    <div className="container-2">
      <h3>Twitter Search</h3>

      <div className="form-row align-items-center">
        <div className="col-auto">
          <input
            className="form-control mb-2" 
            placeholder="Termo para busca"
            onChange={e => setValue(e.target.value)}
            onKeyPress={e=> { if (e.key === 'Enter') search() }}
          />
        </div>

        <div className="col-auto">
          <button onClick={search} className="btn btn-primary mb-2"><FaSearch/></button>
        </div>

        <div className="col-auto">
          <button onClick={searchPrev} className="btn btn-primary mb-2" disabled={prevDisabled}><FaArrowLeft/></button>
        </div>

        <div className="col-auto">
          <button onClick={searchNext} className="btn btn-primary mb-2" disabled={nextDisabled}><FaArrowRight/></button>
        </div>        
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Imagem</th>
            <th scope="col">Usuário</th>
            <th scope="col">Local</th>
            <th scope="col">Data</th>
            <th scope="col">Texto</th>
          </tr>
        </thead>
        <tbody>
          {(data.data || []).map(tweet => (
          <tr key={tweet.id}>
            <td><img src={ tweet.user.imageUrl } alt={ tweet.user.name }/></td>
            <td>{ tweet.user.name }</td>
            <td>{ tweet.user.location }</td>
            <td>{ tweet.created_at }</td>
            <td>{ tweet.text }</td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>    
  );
}

export default SearchPage
