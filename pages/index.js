import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import users from "../users.json";
import Div100vh from "react-div-100vh";
import { useState, useEffect } from "react";
import TimePicker from "../components/TimePicker";
import axios from "axios"
const inter = Inter({ subsets: ["latin"] });
import dayjs from 'dayjs';

export default function Home() {
  const [time, setTime] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [driveId, setDriveId] = useState();
  const [drives, setDrives] = useState([]);

  const drivers = users.filter((user) => user.isDriver).map((user) => {
  
    const validDrive = drives?.find(drive => drive.driverId === user.id);
  
    // console.log(validDrive)
    if(validDrive) {
      const date = new Date(validDrive.departureTime);


      let hours = date.getUTCHours();
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      
      // Convert to 12-hour format
      hours = hours % 12;
      // To handle case of midnight
      hours = hours || 12;
      
      const formattedTime = `${hours}:${minutes}`;
      return {
        ...user,
        departureTime: formattedTime
      };
    
    }
    else {
      return {
      ...user,
      departureTime: "--:--"
    }}
  });
  

  const [character, setCharacter] = useState("");
  const myUser = users.find((user) => user.username === character);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const diff = dayjs(departureTime).diff(dayjs(), "seconds");
    const minutes = Math.floor(diff / 60);
    const seconds = Math.floor(diff % 60);
    
    return {
      minutes,
      seconds
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());

    }, 1);
    const secondOne = setInterval(() => {
      getDriveDetails(driveId);

    }, 1000);
    return () => {
      clearInterval(timer)
      clearInterval(secondOne)

    };
  }, [departureTime]);
  useEffect(() => {
    const timer = setInterval(() => {
      getAllDriveDetails();

    }, 1000);

    return () => {
      clearInterval(timer)

    };
  }, []);
  const addCoin = async () => {
    try {
      await axios.post("/api/coins/add", {
        username: character,
        amount: 10,
      });
    } catch (err) {
      console.error(err);
    }
  };


  const confirmDrivingTime = async () => {
    try {
      await axios.post("/api/drive/create", {
        username: character,
        time: time,
      }).then((result) => {
    
        setDepartureTime(result.data.departureTime)
      })


    } catch (err) {
      console.error(err);
    }
  };

  const [driveDeets, setDriveDeets] = useState();

  const getDriveDetails = async (specificID) => {
    if(specificID != undefined){ 
    try {
      const { data } = await axios.get(`/api/drive/${parseInt(specificID)}`);
      setDriveDeets(data);
      setDepartureTime(data.departureTime)

    } catch (err) {
      console.error(err);
    }}
  }

  const getAllDriveDetails = async () => {
    try {
      const { data } = await axios.get(`/api/drive/all`);
      setDrives(data)
    } catch (err) {
      console.error(err);
    }
  }

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
        {character == "" && (
          <Div100vh
            style={{
              width: "100vw",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "#000",
              color: "#fff",
            }}
          >
            <p
              style={{
                fontWeight: "700",
                fontSize: 24,
                width: "100%",
                textAlign: "center",
                paddingTop: 8,
              }}
            >
              Who's Riding?
            </p>
            <div
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: 220,
                  rowGap: 24,
                  columnGap: 24,
                  flexWrap: "wrap",
                }}
              >
                {users.map((user) => (
                  <div onClick={() => setCharacter(user.username)} style={{ cursor: "pointer" }}>
                    <img
                      style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 8 }}
                      src={user.profilePhoto}
                    />
                    <p
                      style={{ width: "100%", paddingTop: 6, textAlign: "center", fontWeight: 600 }}
                    >
                      {user.username}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div />
          </Div100vh>
        )}

        {myUser?.isDriver && (
          <div>
            <Div100vh style={{ backgroundColor: "#000" }}>
              <p
                style={{
                  color: "#fff",
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
              {departureTime == null ?
              (<div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  gap: 16,
                  padding: 16,
                  height: "100%",
                  backgroundColor: "#fff",
                  borderRadius: "24px 24px 0px 0px",
                }}
              >
                <p style={{ fontSize: 38, marginLeft: 16, marginTop: 16, fontFamily: "Billy" }}>
                  When are you departing?
                </p>
                <TimePicker onTimeChange={setTime} />
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      backgroundColor: "#000",
                      paddingTop: 16,
                      borderRadius: 16,
                      color: "#fff",
                      justifyContent: "center",
                      alignContent: "center",
                      display: "flex",
                      paddingBottom: 16,
                    }}
                  >
                    <p onClick={confirmDrivingTime} style={{ fontSize: 24, fontWeight: 500 }}>Confirm Driving Time</p>
                  </div>
                  <div>
                    <div
                      style={{
                        backgroundColor: "#ECECEC",
                        marginBottom: 32,
                        marginTop: 16,
                        paddingTop: 16,
                        borderRadius: 16,
                        color: "#000",
                        justifyContent: "center",
                        alignContent: "center",
                        display: "flex",
                        paddingBottom: 16,
                      }}
                    >
                      <p style={{ fontSize: 24, fontWeight: 500 }}>I'm Not Driving In</p>
                    </div>
                  </div>
                </div>
              </div>) : (
              <div               
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                padding: 16,
                height: "100%",
                backgroundColor: "#fff",
                borderRadius: "24px 24px 0px 0px",
              }}>
                <p style={{color: "#000", fontSize: 96, width: "100%", textAlign: "center", fontWeight: 600}}>{timeLeft.minutes}:{timeLeft.seconds < 10 && ("0")}{timeLeft.seconds}</p>
                <div style={{width: "100%", height: "2px", backgroundColor: "#000"}}></div>
                <p>Crew: {driveId}</p>
                {!driveDeets?.hasLeft && (<p>{driveId}</p>)}
              </div>)}
              
            </Div100vh>
          </div>
        )}



        {!myUser?.isDriver && character != "" && (

 <Div100vh style={{ marginLeft: "25", backgroundColor: "#000" }}>
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
              <Div100vh style={{  
                borderRadius: "50", 
                backgroundColor: "white",
                borderRadius: 21,   
                display: "flex",
                borderRadius: "24px 24px 0px 0px",
                flexDirection: "column",
              }}>
                <p
                style=
                {{        
                fontFamily: "Billy", 
                fontSize: 32,
                paddingTop: 30, 
                justifyContent: "left",
                marginLeft: 16, 
                color: "#000",
                }}
                >
                  Select Your Car Club
                  </p>
                  {drivers.map((driver) => 
                                    <div
                                    style={{
                                      borderRadius: 32,
                                      backgroundColor: "black",
                                      display: "flex",
                                      alignContent: "center",
                                      marginLeft: 10,
                                      marginRight: 10,
                                      marginTop: 24,
                                      padding: "32px",
                                      flexDirection: "column",
                                      position: "relative",
                                    }}>
                                      <img
                                        style={{position: "absolute", right: 12, top: 12, width: 42, height:42, objectFit: "cover", borderRadius: 100 }}
                                        src={driver.profilePhoto}/>
                  
                                      <p style={{
                                        fontSize: 20,
                                        marginLeft: -6,
                                        color: "#FFD500",
                                        zIndex: 2,
                                      }}>Departing @</p>
                  
                                      <b style={{
                                          zIndex: 2,
                                          color: "#FFD500",
                                          fontSize: 72,
                                          textShadow: "2px 2px 12 px rgba(12, 2, 2, 1)"
                                      }}>{driver?.departureTime ? dayjs(driver?.departureTime).format("HH:mm") : "--:--"}</b>
                  
                                    <img
                                        style={{position: "absolute", right: 12, bottom: 2, maxWidth: 175, objectFit: "cover"}}
                                        src={driver.car}
                                      />
                  
                                      
                                    </div>
                  )}


              </Div100vh>
              </Div100vh>
        )}
      </main>
    </>
  );
}
