import './admin.css'

import { Nav } from '../../components/Nav'
import { Logo } from '../../components/Logo'
import { Input } from '../../components/Input'

import { MdAddLink } from 'react-icons/md'
import { FiTrash2 } from 'react-icons/fi'
import { useState, useEffect } from 'react'

import { db } from '../../services/firebaseConnection'

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc
} from 'firebase/firestore'

import { toast } from 'react-toastify'

export default function Admin() {
  const [nameInput, setNameInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [backgroundColorInput, setBackGroundColorInput] = useState('#f1f1f1')
  const [textColorInput, setTextColorInput] = useState('#121212')

  const [links, setLinks] = useState([])

  useEffect(() => {
    const linksRef = collection(db, 'links')
    const queryRef = query(linksRef, orderBy('created', 'asc'))

    onSnapshot(queryRef, (snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color
        })
      })

      setLinks(lista);
    })

  }, [])

  async function handleRegister(e) {
    e.preventDefault();

    if (nameInput === '' || urlInput === '') {
      toast.warn('Preencha todos os campos!')
      return;
    }

    addDoc(collection(db, 'links'), {
      name: nameInput,
      url: urlInput,
      bg: backgroundColorInput,
      color: textColorInput,
      created: new Date(),
    })
      .then(() => {
        setNameInput('')
        setUrlInput('')
        toast.success('Link registrado com sucesso!')
      })
      .catch((error) => {
        console.log('Erro ao registrar: ' + error)
        toast.error('Ops, erro ao salvar o link!')
      })
  }

  async function handleDeleteLink(id) {
    const docRef = doc(db, 'links', id)
    await deleteDoc(docRef)
  }

  return (
    <div className='admin-container'>
      <Nav />
      <Logo />

      <form className='form' onSubmit={handleRegister}>
        <label className='label'>Nome do link</label>
        <Input
          placeholder='Nome do link...'
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <label className='label'>Url do link</label>
        <Input
          type='url'
          placeholder='Url do link...'
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <section className='container-colors'>
          <div>
            <label className='label right'>Fundo do link</label>
            <input
              type='color'
              value={backgroundColorInput}
              onChange={(e) => setBackGroundColorInput(e.target.value)}
            />
          </div>

          <div>
            <label className='label right'>Cor do link</label>
            <input
              type='color'
              value={textColorInput}
              onChange={(e) => setTextColorInput(e.target.value)}
            />
          </div>
        </section>

        {nameInput !== '' && (
          <div className='preview'>
            <label className='label'>Veja como esta ficando 👇</label>
            <article className='list' style={{ marginBottom: 8, marginTop: 8, backgroundColor: backgroundColorInput }}>
              <p style={{ color: textColorInput }}> {nameInput}</p>
            </article>
          </div>
        )}

        <button className='btn-register' type='submit'>
          Cadastrar <MdAddLink size={24} color='#FFF' />
        </button>
      </form>

      <h2 className='title'>
        Meus links
      </h2>

      {links.map((item, index) => (
        <article
          key={index}
          className='list animate-pop'
          style={{ backgroundColor: item.bg, color: item.color }}
        >
          <p>{item.name}</p>
          <div>
            <button className='btn-delete' onClick={() => handleDeleteLink(item.id)}>
              <FiTrash2 size={18} color='#FFF' />
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}