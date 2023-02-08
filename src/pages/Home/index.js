import './home.css'
import { useState, useEffect } from 'react'
import { Social } from '../../components/Social'
import { Logo } from '../../components/Logo'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'

import { toast } from 'react-toastify'

import { db } from '../../services/firebaseConnection'
import {
  getDocs,
  collection,
  orderBy,
  query,
  doc,
  getDoc
} from 'firebase/firestore'

export default function Home() {
  const [links, setLinks] = useState([])
  const [socialLinks, setSocialLinks] = useState({})

  useEffect(() => {
    function loadLinks() {
      const linksRef = collection(db, 'links')
      const queryRef = query(linksRef, orderBy('created', 'asc'))
      getDocs(queryRef)
        .then((snapshot) => {
          let lista = []

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
        .catch((error) => {
          console.log('Erro ao carregar links: ' + error)
          toast.error('Ops, erro ao carregar o links!')
        })
    }
    loadLinks();
  }, [])

  useEffect(() => {
    function loadSocialLinks() {
      const docRef = doc(db, 'social', 'link')
      getDoc(docRef)
        .then((snapshot) => {
          if (snapshot.data() !== undefined) {
            setSocialLinks({
              facebook: snapshot.data().facebook,
              instagram: snapshot.data().instagram,
              youtube: snapshot.data().youtube
            })
          }
        })
        .catch((error) => {
          console.log('Erro ao carregar social: ' + error)
          toast.error('Ops, erro ao carregar o social!')
        })
    }
    loadSocialLinks();
  }, [])

  return (
    <div className="home-container">
      <Logo />
      <span>Veja meus links 👇 </span>

      <main className="links">

        {links.map((item) => (
          <session key={item.id} className="link-area" style={{ backgroundColor: item.bg }}>
            <a href={item.url} target='blank'>
              <p className="link-text" style={{ color: item.color }}>
                {item.name}
              </p>
            </a>
          </session>
        ))}

        {links.length !== 0 && Object.keys(socialLinks).length > 0 && (
          <footer>
            <Social url={socialLinks?.facebook}>
              <FaFacebook size={35} color="#FFF" />
            </Social>
            <Social url={socialLinks?.youtube}>
              <FaYoutube size={35} color="#FFF" />
            </Social>
            <Social url={socialLinks?.instagram}>
              <FaInstagram size={35} color="#FFF" />
            </Social>
          </footer>
        )}

      </main>
    </div>
  )
}