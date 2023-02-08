import { useState, useEffect } from 'react'
import './networks.css'

import { Header } from '../../components/Header'
import { Input } from '../../components/Input'
import { MdAddLink } from 'react-icons/md'

import { toast } from 'react-toastify'

import { db } from '../../services/firebaseConnection'
import {
  setDoc,
  doc,
  getDoc
} from 'firebase/firestore'

export default function Networks() {
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [youtube, setYoutube] = useState('')

  function handleSave(e) {
    e.preventDefault();

    setDoc(doc(db, 'social', 'link'), {
      facebook: facebook,
      instagram: instagram,
      youtube: youtube
    })
      .then(() => {
        toast.success('Urls salvas com sucesso!')
      })
      .catch((error) => {
        console.log('Erro ao salvar: ' + error)
        toast.error('Ops, erro ao salvar o link!')
      })
  }

  useEffect(() => {
    function loadLinks() {
      const docRef = doc(db, 'social', 'link')
      getDoc(docRef)
        .then((snapshot) => {
          if (snapshot.data() !== undefined) {
            setFacebook(snapshot.data().facebook)
            setInstagram(snapshot.data().instagram)
            setYoutube(snapshot.data().youtube)
          }
        })
        .catch((error) => {
          console.log('Erro ao carregar links: ' + error)
          toast.error('Ops, erro ao carregar o links!')
        })
    }
    loadLinks();
  }, [])


  return (
    <div className='admin-container'>
      <Header />

      <h1 className='title-social'>Suas redes sociais</h1>

      <form className='form' onSubmit={handleSave}>
        <label className='label'>Link do facebook</label>
        <Input
          placeholder='Digite a url do facebook'
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
        />

        <label className='label'>Link do instagram</label>
        <Input
          placeholder='Digite a url do instagram'
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />

        <label className='label'>Link do youtube</label>
        <Input
          placeholder='Digite a url do youtube'
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
        />

        <button type='submit' className='btn-register'>
          Salvar links <MdAddLink size={24} color='#fff' />
        </button>

      </form>
    </div>
  )
}