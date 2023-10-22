import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import users from '../users.json'
import Div100vh from 'react-div-100vh'


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
        <Div100vh style={{width: "100vw", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#000", color: "#fff"}}>
          <p style={{fontWeight: "700", fontSize: 24, width: "100%", textAlign: "center", paddingTop: 8, }}>Who's Riding?</p>
            <div style={{width: "100%", alignItems: "center", justifyContent: "center", display: "flex"}}>
            <div style={{display: "flex", justifyContent: "space-between", width: 220, rowGap: 24, columnGap: 24, flexWrap: "wrap"}}>
            {users.map((user) => 
            <div>
            <img style={{width: 96, height: 96, objectFit: "cover", borderRadius: 8}} src={user.profilePhoto}/>  
            <p style={{width: "100%", paddingTop: 6, textAlign: "center", fontWeight: 600}}>{user.username}
            </p>
            </div>
            )}
            </div>
            </div>
          <div/>
        </Div100vh>
      </main>
    </>
  )
}
