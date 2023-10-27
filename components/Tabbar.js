import { useRouter } from "next/router";
import React from "react";

const Tabbar = () => {
  const router = useRouter();

  return (
    <div
      style={{
        height: "92px",
        background: "#F2F2F2",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderTop: "1px solid black",
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 100,
      }}
    >
      <button style={{
        opacity: router.pathname === "/" ? 1 : 0.33,
        border: "none"
      }}>
        <a href="/">
        <img width={52} height={52} src="https://cloud-nto2cwnb5-hack-club-bot.vercel.app/0shuttle.svg"/>

        </a>
      </button>
      <button style={{
                opacity: router.pathname === "/leaderboard" ? 1 : 0.33,
                border: "none"

      }}>
        <a href="/leaderboard">
          <img width={52} height={52} src="https://cloud-nto2cwnb5-hack-club-bot.vercel.app/1chart.svg"/>
        </a>
      </button>
      <button style={{border: "none"}}>
        <a href="/profile"
        style={{
          opacity: router.pathname === "/profile" ? 1 : 0.33,
          border: "none"

        }} 
        >
          <img src={"https://cloud-1jx8fszou-hack-club-bot.vercel.app/0account_circle.svg"} width={52} height={52} style={{
          border: "none",
          }} />
        </a>
      </button>
    </div>
  );
};

export default Tabbar;
