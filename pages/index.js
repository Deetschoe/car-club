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
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [message, setMessage] = useState("good morning");
  const [hasLeft, setHasLeft] = useState(false);
  const [hasUnopenedChest, setHasUnopenedChest] = useState(false);
  const [chestOpen, setChestOpen] = useState(false);
  const [cardSlideIn, setCardSlideIn] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const drivers = users.filter((user) => user.isDriver).map((user) => {
    const validDrive = drives?.find(drive => drive.driverId === user.id);
  
    if(validDrive) {
      const date = dayjs(validDrive.departureTime);

      const formattedTime = date.format("HH:mm")
      return {
        ...user,
        departureTime: formattedTime,
        driveId: validDrive.id
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
  const [myTokens, setMyTokens] = useState(0);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const diff = dayjs(departureTime).diff(dayjs(), "seconds");

    let hours;
    let minutes;
    let seconds;

    if (diff > 3600) {
      hours = Math.floor(diff / 3600);
      minutes = Math.floor((diff % 3600) / 60);
      seconds = Math.floor((diff % 3600) % 60);
    } else {
      hours = 0;
      minutes = Math.floor(diff / 60);
      seconds = Math.floor(diff % 60);
    }

    return {
      hours,
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

    };
  }, [departureTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      getAllDriveDetails();

    }, 1000);

    return () => {
      clearInterval(timer)

    };
  }, [drives, driveId, departureTime]);
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

  const getTicket = async () => {
    try {
      await axios.post("/api/createTicket", {
        driveId: selectedDrive.driveId,
        username: character,
      })

      setDriveDeets(drives.find((drive) => drive.id == selectedDrive.driveId))
      setDepartureTime(drives.find((drive) => drive.id == selectedDrive.driveId).departureTime)
      console.log(drives.find((drive) => drive.id == selectedDrive.driveId))
      
      
      const hoursSelectedDrive = parseInt(selectedDrive.departureTime.split(":")[0], 10);
      function computeValue() {
        let roundedHour = hoursSelectedDrive; // Getting the current hour and rounding it
        let randomInt = Math.floor(Math.random() * (10 - 7 + 1) + 7); // Getting a random integer between 7 and 10 (inclusive)
        return ((24 - roundedHour) * (randomInt));
    }
        
      
      let resultingValue = computeValue();
      setMessage(`YEAH! +${resultingValue} Tokens`)
      await axios.post("/api/coins/add", {
        username: character,
        amount: resultingValue,
      });

      setTimeout(() => {
        setMessage("Good Morning")
    }, 3000);
      
      const incrementByInterval = () => {

        const targetValue = myTokens + resultingValue;
        const interval = setInterval(() => {
            setMyTokens(prevValue => {
                if (prevValue + 1 >= targetValue) {
                    clearInterval(interval);  // Clear the interval.
                    return targetValue; // Set the final value.
                }
                return prevValue + 1; // Otherwise, increment by 1.
            });
        }, 20); // Every 0.5 seconds.
    }
    incrementByInterval()

    } catch (err) {
      console.error(err);
    }
  };


  const confirmDrivingTime = async () => {
    try {

      function computeValue() {
        let roundedHour = Math.round(time.getHours()); // Getting the current hour and rounding it
        let randomInt = Math.floor(Math.random() * (10 - 7 + 1) + 7); // Getting a random integer between 7 and 10 (inclusive)
        return ((24 - roundedHour) * (randomInt));
    }
        
        let result = computeValue();
        console.log(result);

        try {
          await axios.post("/api/coins/add", {
            username: character,
            amount: result,
          });

          const incrementByInterval = () => {
            const targetValue = myTokens + result;
            const interval = setInterval(() => {
                setMyTokens(prevValue => {
                    if (prevValue + 1 >= targetValue) {
                        clearInterval(interval);  // Clear the interval.
                        return targetValue; // Set the final value.
                    }
                    return prevValue + 1; // Otherwise, increment by 1.
                });
            }, 20); // Every 0.5 seconds.
        }
        
        incrementByInterval();
          
          // setMyTokens(prevValue => prevValue + result)
          setMessage(`WOAH +${result} TOKENS!`)
          setTimeout(() => {
            setMessage("Good Morning")
        }, 3000);
        } catch (err) {
          console.error(err);
        }
        

      await axios.post("/api/drive/create", {
        username: character,
        time: time,
      }).then((result) => {
        setDriveId(result.data.id)
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
      // console.log(data)
      setDepartureTime(data.departureTime)

    } catch (err) {
      console.error(err);
    }}
  }

  const getAllDriveDetails = async () => {
    try {
      const { data } = await axios.get(`/api/drive/all`);
      setDrives(data)
      //console.log(data)
      //console.log(data.some((drive) => drive.driver.username == character))
      data.map((drive) => {
      // console.log(drive.driver.username, character)
      if(drive.driver.username == character) {
        // console.log("already have ride")
        setDriveId(drive.id)
        setDepartureTime(drive.departureTime)   
      }
      console.log(drive.riders)
      if(drive.riders.some((rider) => rider.user.username == character)) {
        console.log("auto select")
        // console.log("already have ride")
        console.log(drive.id)
        setDriveDeets(drives.find((driveMap) => driveMap.id == drive.id))

        setDriveId(drive.id)
        setDepartureTime(drive.departureTime)   

      }
      
    })

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
        <link rel="manifest" href="/manifest.json" />

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
                  <div onClick={async () => {
                    setCharacter(user.username)
                    //Actually get tokens here TODO

                    try {
                      await axios.get(`/api/user/me?username=${user.username}`).then((result) => {
                        console.log(result)
                        setMyTokens(result.data.coins)
                      })
                    } catch (err) {
                      console.error(err);
                    }


                    getAllDriveDetails()
                  }} style={{ cursor: "pointer" }}>
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
        {character != "" && !hasUnopenedChest && (
          <Div100vh style={{backgroundColor: "#000", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", zIndex: 5}}>
            {!chestOpen && 
            (
            <>
              <p style={{color: "#fff", fontFamily: "Billy", fontSize: 28, paddingTop: 16, marginLeft: 16, marginRight: 16}}>Congrats on being first this morning!</p>
            <div
            onClick={() => setChestOpen(true)
          
          }
            style={{flexDirection: "column", width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <img src={"/animations/chest.gif"} style={{backgroundColor: "#000", display: "flex", justifyContent: "center", width: "450px", height: "450px"}}/>
            </div>
            <p style={{fontFamily: "Billy", width: "100%", marginBottom: 64, textAlign: "center", fontSize: 24, color: "#fff"}}>Tap to open uwu</p>
            </>
            )}
            {chestOpen && (
            <>
            <p style={{color: "#fff", fontFamily: "Billy", fontSize: 28, paddingTop: 16, marginLeft: 16, marginRight: 16}}>Select Your Card {selectedCard}</p>
            <div 
            onClick={() => setSelectedCard(0)}
            style={{position: "absolute", justifyContent: "center", display: "flex", alignItems: "center", backgroundColor: "#fff",
            width: selectedCard == 0 ? ("calc(100vw - 32px)") : selectedCard != null && selectedCard != 0 ? ("0px") : ("100px"),
            borderRadius: 16, transition: "all 0.3s ease-in-out", bottom: selectedCard == 0 ? (128) : !cardSlideIn ? ("calc(50% + 144px)") : ("calc(50% - 128px)"), left: 16}}>
            <img style={{
              width: selectedCard == 0 ? ("calc(100vw - 32px)") : selectedCard != null && selectedCard != 0 ? ("0px") : ("120px"),
                animation: `shake 0.75s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite`,
                transition: "all 0.3s ease-in-out",
                display: 'inline-block', // This is important for transform to work properly
            }} src="/cards/back.png"
            />
            </div>

            
            <div
                        onClick={() => setSelectedCard(2)}

            style={{position: "absolute", justifyContent: "center", display: "flex", alignItems: "center", backgroundColor: "#fff", width: 100, borderRadius: 16, transition: "all 0.3s ease-in-out", bottom: selectedCard == 2 ? (128) : !cardSlideIn ? ("calc(50% - 400px)") : ("calc(50% - 128px)"), right: selectedCard != 2 ? (16) : ("calc(50vw - 48px)")}}>
            <img 
            onLoad={() => setCardSlideIn(true)}
            
            style={{
              transition: "all 0.3s ease-in-out",

              width: selectedCard == 2 ? ("calc(100vw - 32px)") : selectedCard != null && selectedCard != 2 ? ("0px") : ("120px"),
              animation: `shake 0.75s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite`,
              display: 'inline-block', // This is important for transform to work properly
            }} src="/cards/back.png"/>
            </div>

            <div 
                        onClick={() => setSelectedCard(1)}

            style={{
  position: "absolute",
  justifyContent: "center",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#fff",
  width: 100,
  borderRadius: 16,
  transition: "all 0.7s ease-in-out",
  bottom: selectedCard == 1 ? (128) : cardSlideIn ? ("calc(50% - 128px)") : ("calc(50% - 128px)"),
  right: "calc(50% - 50px)"
}}>
  <img style={{
    transition: "all 0.3s ease-in-out",
    width: selectedCard == 1 ? ("calc(100vw - 32px)") : selectedCard != null && selectedCard != 1 ? ("0px") : ("120px"),
    animation: `shake 0.75s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite`,
    display: 'inline-block', // This is important for transform to work properly
  }} src="/cards/back.png" />
</div>

          </>
            )}
          </Div100vh>
        )
        
        }
        {myUser?.isDriver && (
          <div>
            <Div100vh style={{ backgroundColor: "#000" }}>
              <div style={{display: "flex", marginLeft: 16, marginRight: 16, alignItems: "center", justifyContent: "space-between"}}>
              <p
                style={{
                  color: "#fff",
                  paddingTop: 8,
                  paddingBottom: 16,
                  fontFamily: "Billy",
                  fontSize: 24,
                }}
              >
                {message} 
              </p>
              <p style={{color: "#000", fontSize: 18, fontWeight: 500, padding: "4px 8px", borderRadius: 16, backgroundColor: "#FFD500"}}>
                {myTokens}
              </p>
              </div>
              {departureTime == null ? (
                <div
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
                      <p onClick={confirmDrivingTime} style={{ fontSize: 24, fontWeight: 500 }}>
                        Confirm Driving Time
                      </p>
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
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    padding: 16,
                    height: "100%",
                    backgroundColor: "#fff",
                    borderRadius: "24px 24px 0px 0px",
                    justifyContent: "space-between"
                  }}
                >
                  <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                  <p
                    style={{
                      color: "#000",
                      fontSize: 96,
                      width: "100%",
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    {timeLeft.hours > 0 ? timeLeft.hours + ":" : ""}
                    {timeLeft.minutes < 10 && "0"}
                    {timeLeft.minutes}:{timeLeft.seconds < 10 && "0"}
                    {timeLeft.seconds}
                  </p>
                  <div style={{ width: "100%", height: "2px", backgroundColor: "#000" }}></div>
                  <p style={{fontSize: 18}}>Crew:</p>
                  <div style={{display: "flex", alignContent: "center"}}>

                <img style={{width: 64, height: 64, borderRadius: 32}} src={users.find((user) => user.username == character).profilePhoto}/>
              <div style={{display: "flex", alignContent: "center", justifyContent: "center", marginLeft: 16, flexDirection: "column"}}>
              <p style={{fontSize: 24, fontWeight: 500}}>
                    {users.find((user) => user.username == character).username}
                  </p>
                  <p style={{fontSize: 18, fontWeight: 500}}>
                  {drives?.find((drive) => drive?.id == driveId)?.driver?.coins} Tokens
                  </p>
              </div>
               </div>
                  {drives.find((drive) => drive.id == driveId)?.riders?.map((rider => 
              <div style={{display: "flex", alignContent: "center"}}>
                <img style={{width: 64, height: 64, borderRadius: 32}} src={users.find((user) => user.id == rider.userId).profilePhoto}/>
              <div style={{display: "flex", alignContent: "center", justifyContent: "center", marginLeft: 16, flexDirection: "column"}}>
              <p style={{fontSize: 24, fontWeight: 500}}>
                    {users.find((user) => user.id == rider.userId).username}
                  </p>
                  <p style={{fontSize: 18, fontWeight: 500}}>
                    {rider?.user?.coins} Tokens
                  </p>
              </div>
               </div>
                ))}
              </div>
                    <div
                    onClick={() => console.log("Heading out")}
                      style={{
                        backgroundColor: hasLeft ? (`#000`) : ("#FFD500"),
                        marginBottom: 32,
                        marginTop: 16,
                        paddingTop: 16,
                        borderRadius: 16,
                        marginBottom: 128,
                        color: !hasLeft ? (`#000`) : ("#FFD500"),
                        justifyContent: "center",
                        alignContent: "center",
                        display: "flex",
                        paddingBottom: 16,
                      }}
                    >


                    <p 
                    onClick={async () => {
                      console.log("leaving")
                      setHasLeft(true)

                      // try {
                      //   await axios.post("/api/markLeft", {
                      //     driveId: driveId,
                      //   }).then((resultingThing) => console.log(resultingThing))
                      // } catch (err) {
                      //   console.error(err);
                      // }
                    }}
                    style={{ fontSize: 24, fontWeight: 500 }}
                    >{!hasLeft ? (`I'm Leaving Now`) : ("Notified Passengers")}
                    </p>
                    
                    
                    </div>
                </div>
              )}
            </Div100vh>
          </div>
        )}



        {!myUser?.isDriver && character != "" && departureTime == null && (

 <Div100vh style={{ marginLeft: "25", backgroundColor: "#000" }}>
              <div style={{display: "flex", marginLeft: 16, marginRight: 16, alignItems: "center", justifyContent: "space-between"}}>
              <p
                style={{
                  color: "#fff",
                  paddingTop: 8,
                  paddingBottom: 16,
                  fontFamily: "Billy",
                  fontSize: 24,
                }}
              >
                {message} 
              </p>
              <p style={{color: "#000", fontSize: 18, fontWeight: 500, padding: "4px 8px", borderRadius: 16, backgroundColor: "#FFD500"}}>
                {myTokens}
              </p>
              </div>
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
                  {drivers.map((driver) => {
                    return <div
                    onClick={() => {
                      // console.log(drives)
                      setSelectedDrive(driver)
                    
                    }}

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
                      }}>{driver?.departureTime}</b>
  
                    <img
                        style={{position: "absolute", right: 12, bottom: 2, maxWidth: 175, objectFit: "cover"}}
                        src={driver.car}
                      />
  
                      
                    </div>
                  }
                  )}
                  {selectedDrive != null &&
                  <button onClick={getTicket} style={{marginTop: 16, padding: 16, marginLeft: 16, marginRight: 16, padding: 16}}>Claim Ticket {selectedDrive.driveId}</button>
                  }
              </Div100vh>
              </Div100vh>
        )}
        {departureTime != null && character != "" && !myUser?.isDriver && (
          <div>
          <Div100vh style={{ backgroundColor: "#000" }}>
            <div style={{display: "flex", marginLeft: 16, marginRight: 16, alignItems: "center", justifyContent: "space-between"}}>
            <p
              style={{
                color: "#fff",
                paddingTop: 8,
                paddingBottom: 16,
                fontFamily: "Billy",
                fontSize: 24,
              }}
            >
              {message} 
            </p>
            <p style={{color: "#000", fontSize: 18, fontWeight: 500, padding: "4px 8px", borderRadius: 16, backgroundColor: "#FFD500"}}>
              {myTokens}
            </p>
            </div>
            {departureTime == null ? (
              <div
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
                    <p onClick={confirmDrivingTime} style={{ fontSize: 24, fontWeight: 500 }}>
                      Confirm Driving Time
                    </p>
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
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  padding: 16,
                  height: "100%",
                  backgroundColor: "#fff",
                  borderRadius: "24px 24px 0px 0px",
                }}
              >
                <p
                  style={{
                    color: "#000",
                    fontSize: 96,
                    width: "100%",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {timeLeft.hours > 0 ? timeLeft.hours + ":" : ""}
                  {timeLeft.minutes < 10 && "0"}
                  {timeLeft.minutes}:{timeLeft.seconds < 10 && "0"}
                  {timeLeft.seconds}
                </p>
                <div style={{ width: "100%", height: "2px", backgroundColor: "#000" }}></div>
                <p style={{fontSize: 18}}>Crew:</p>
                <div style={{display: "flex", alignContent: "center"}}>

              <img style={{width: 64, height: 64, borderRadius: 32}} src={users.find((user) => user.username == driveDeets.driver.username)?.profilePhoto}/>
            <div style={{display: "flex", alignContent: "center", justifyContent: "center", marginLeft: 16, flexDirection: "column"}}>
            <p style={{fontSize: 24, fontWeight: 500}}>
                  {users.find((user) => user.username == driveDeets.driver.username)?.username}
                </p>
                <p style={{fontSize: 18, fontWeight: 500}}>
                {driveDeets.driver.coins} Tokens
                </p>
            </div>
             </div>
                {drives.find((drive) => drive.id == driveDeets.id)?.riders?.map((rider => 
            <div style={{display: "flex", alignContent: "center"}}>
              <img style={{width: 64, height: 64, borderRadius: 32}} src={users.find((user) => user.id == rider.userId).profilePhoto}/>
            <div style={{display: "flex", alignContent: "center", justifyContent: "center", marginLeft: 16, flexDirection: "column"}}>
            <p style={{fontSize: 24, fontWeight: 500}}>
                  {users.find((user) => user.id == rider.userId).username}
                </p>
                <p style={{fontSize: 18, fontWeight: 500}}>
                  {rider?.user?.coins} Tokens
                </p>
            </div>
             </div>
              ))}
              </div>
            )}
          </Div100vh>
        </div>
        )}
      </main>
    </>
  );
}
