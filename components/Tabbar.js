import { useRouter } from "next/router";
import React from "react";

const Tabbar = () => {
  const router = useRouter();

  return (
    <div
      style={{
        height: "50px",
        background: "grey",
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
        backgroundColor: router.pathname === "/" ? "red" : "white",
      }}>
        <a href="/">Home</a>
      </button>
      <button>
        <a href="/leaderboard">Leaderboard</a>
      </button>
      <button>
        <a href="/profile">Profile</a>
      </button>
    </div>
  );
};

export default Tabbar;
