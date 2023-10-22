import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import users from '../users.json'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Car Club</title>
        <meta name="description" content="Car Club with Friends" />
        <meta name="theme-color" content="#000" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{fontFamily: "system-ui, Helvetica"}}>
        <div style={{width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#000", color: "#fff"}}>
          <p style={{fontWeight: "700", fontSize: 24, width: "100%", textAlign: "center", paddingTop: 8, }}>Who's Riding?</p>
          <div>
            <p>ok</p>
          </div>

          <div/>
        </div>
      </main>
    </>
  )
}
