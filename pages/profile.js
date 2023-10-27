import axios from "axios";
import { Inter } from "next/font/google";
import Head from "next/head";
import users from "../users.json";
import { useEffect, useState } from "react";
import Div100vh from "react-div-100vh";
import Tabbar from "@/components/Tabbar";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [user, setUser] = useState(null);
  const details = users.find((user) => user.username === "Fayd");

  const getUser = async () => {
    const res = await axios.get("/api/user/me?username=Fayd");
    setUser(res.data);
  };

  useEffect(() => {
    getUser();
  }, []);

  console.log(user);
  return (
    <>
      <Head>
        <title>Car Club</title>
        <meta name="description" content="Car Club with Friends" />
        <meta name="theme-color" content="#000" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ fontFamily: "system-ui, Helvetica" }}>
        <Div100vh style={{ marginLeft: "25", backgroundColor: "#000", marginBottom: "50px" }}>
          <div style={{ width: "100%" }}>
            <p
              style={{
                color: "white",
                marginLeft: 16,
                marginRight: 16,
                paddingTop: 8,
                paddingBottom: 16,
                fontFamily: "Billy",
                fontSize: 24,
              }}
            >
              good morning
            </p>
            <Div100vh
              style={{
                borderRadius: "50",
                backgroundColor: "white",
                borderRadius: 21,
                display: "flex",
                borderRadius: "24px 24px 0px 0px",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  fontFamily: "Billy",
                  fontSize: 32,
                  paddingTop: 30,
                  justifyContent: "left",
                  marginLeft: 16,
                  color: "#000",
                }}
              >
                Your profile
              </p>
              <div
                style={{
                  marginLeft: 25,
                  marginTop: 25,
                  maxWidth: "400px",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <img
                  style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 100 }}
                  src={details.profilePhoto}
                />
                <div>
                  <p style={{ textAlign: "left", fontWeight: 600, fontSize: 48 }}>
                    {details.username}
                  </p>
                  <p style={{ textAlign: "left", marginTop: 8, fontSize: 24 }}>
                    Coins: {user?.coins}
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontFamily: "Billy",
                  fontSize: 32,
                  paddingTop: 30,
                  justifyContent: "left",
                  marginLeft: 16,
                  color: "#000",
                }}
              >
                Your cards
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  gap: 16, marginLeft: 16, marginRight: 16
                }}
              >
                
                {user?.cards.map((card) => (


                <img
                  style={{ display: "flex", imageFit: "cover", overflow: "hidden", aspectRatio: 3/4, objectFit: "cover", border: "1px solid #000", objectFit: "cover", borderRadius: 15 }}
                   src={`/cards/${card.cardName}.jpg`} >
                  </img>

                ))}
              </div>
            </Div100vh>
          </div>
          <Tabbar />
        </Div100vh>
      </main>
    </>
  );
}
