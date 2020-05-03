import React, { useState, useEffect } from 'react'
import { writeStorage, deleteFromStorage, useLocalStorage } from '@rehooks/local-storage'
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import './style.css'
import api from '../api'

function SearchPage() {

  const [ value, setValue ] = useLocalStorage('value')
  const [ data, setData ] = useLocalStorage('data', {})

  const [ prevDisabled, setPrevDisabled ] = useLocalStorage('prevDisabled')
  const [ nextDisabled, setNextDisabled ] = useLocalStorage('nextDisabled')

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
    try {
      const res = await api.get(`/v1/search?query=${value}&count=10`)

      setData(res.data)
    } catch(e) {      
      alert('Não foi possível enviar a requisição, verifique as credenciais da API e tente novamente')
    }
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

  function getItems() {
    const items = (data.data || [])
    if (items.length > 0) {
      return items.map(tweet => (
        <tr key={tweet.id}>
          <td><img src={ tweet.user.imageUrl } alt={ tweet.user.name }/></td>
          <td>{ tweet.user.name }</td>
          <td>{ tweet.user.location }</td>
          <td>{ tweet.created_at }</td>
          <td>{ tweet.text }</td>
        </tr>
        )
      )
    } else {
      return (
        <tr>
          <td colSpan="5" className="empty-result">Nenhum resultado encontrado</td>
        </tr>
      )
    }    
  }
  
  return (
    <div className="app-container">
      <h3>Twitter Search</h3>

      <div className="form-row align-items-center">
        <div className="col-auto">
          <input
            className="form-control mb-2" 
            placeholder="Termo para busca"
            value={value}
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
          {getItems()}
        </tbody>
      </table>
    </div>    
  );
}

export default SearchPage
