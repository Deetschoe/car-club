import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import users from '../users.json'
import Div100vh from 'react-div-100vh'
import { useState } from 'react'
import TimePicker from "../components/TimePicker";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [character, setCharacter] = useState('');
  const myUser = users.find(user => user.username === character);

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
        
        
      {character == "" && (<Div100vh style={{width: "100vw", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#000", color: "#fff"}}>
        <p style={{fontWeight: "700", fontSize: 24, width: "100%", textAlign: "center", paddingTop: 8, }}>Who's Riding?</p>
          <div style={{width: "100%", alignItems: "center", justifyContent: "center", display: "flex"}}>
          <div style={{display: "flex", justifyContent: "space-between", width: 220, rowGap: 24, columnGap: 24, flexWrap: "wrap"}}>
          {users.map((user) => 
          <div onClick={() => setCharacter(user.username)} style={{cursor: "pointer"}}>
          <img style={{width: 96, height: 96, objectFit: "cover", borderRadius: 8}} src={user.profilePhoto}/>  
          <p style={{width: "100%", paddingTop: 6, textAlign: "center", fontWeight: 600}}>{user.username}
          </p>
          </div>
          )}
          </div>
          </div>
        <div/>
      </Div100vh>)}

      {myUser?.isDriver && <div>
        <Div100vh style={{backgroundColor: "#000"}}>
          <p style={{color: "#fff", marginLeft: 16, marginRight: 16, paddingTop: 8, paddingBottom: 16, fontFamily: "Billy", fontSize: 24}}>good morning</p>
          <div style={{display: "flex", justifyContent: "space-between", flexDirection: "column", gap: 16,padding: 16, height: "100%", backgroundColor: "#fff",  borderRadius: "24px 24px 0px 0px"}}>
            <p style={{fontSize: 38, marginLeft: 16, marginTop: 16, fontFamily: "Billy"}}>When are you departing?</p>
            <TimePicker/>
            <div style={{marginBottom: 16,}}>
            <div style={{backgroundColor: "#000", paddingTop: 16, borderRadius: 16, color: "#fff", justifyContent: "center", alignContent: "center", display: 'flex', paddingBottom: 16}}>
            <p style={{fontSize: 24, fontWeight: 500}}>Confirm Driving Time</p>
            </div>
            <div>
            <div style={{backgroundColor: "#ECECEC", marginBottom: 32, marginTop: 16, paddingTop: 16, borderRadius: 16, color: "#000", justifyContent: "center", alignContent: "center", display: 'flex', paddingBottom: 16}}>
            <p style={{fontSize: 24, fontWeight: 500}}>I'm Not Driving In</p>
            </div>
            </div>
            </div>
          </div>


        </Div100vh>
      </div>}

      </main>
    </>
  )
}
