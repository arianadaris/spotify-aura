import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import styles from './LogIn.module.css';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

function handleClick()
{
    const redirectUrl = "http://localhost:3000/";
    const apiUrl = "https://accounts.spotify.com/authorize";
    const scope = [
        "user-read-recently-played", 
        "user-top-read", 
        "playlist-read-collaborative", 
        "user-read-email"
    ];
    window.location.href = `${apiUrl}?client_id=${CLIENT_ID}&redirect_uri=${redirectUrl}&scope=${scope.join(
        " "
    )}&response_type=token&show_dialog=true`;
}

function createRows()
{
    var links = [
        "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png",
        "https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg",
        "https://i.scdn.co/image/ab67616d0000b273ea09823f8158e233c637fd33",
        "https://media.pitchfork.com/photos/61fbea0ec968401d75b0b153/master/w_1600%2Cc_limit/Red-Hot-Chili-Peppers.jpeg",
        "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
        "https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,q_auto,w_1400/fl_lossy,pg_1/susj5kbr4x27cug4wtss/ella-mai-cover?fimg-ssr-default",
        "https://m.media-amazon.com/images/I/712U0PCvjES._SL1200_.jpg",
        "https://upload.wikimedia.org/wikipedia/en/5/51/Igor_-_Tyler%2C_the_Creator.jpg",
        "https://upload.wikimedia.org/wikipedia/en/e/eb/Bruno_Mars_-_Doo-Wops_%26_Hooligans.png"
    ];
    var rows = [];

    for(var i = 0; i < 9; i++)
    {
        rows.push(
            <div className={styles.album}>
                <img src={links[i]} alt="Album Cover" />
            </div>
        );
    }
    return rows;
}

function LogIn()
{
    const [token, setToken] = useState("");
    var rows = createRows();

    useEffect(() => {
        const hash = window.location.hash;
        if(hash)
        {
            let token = hash.substring(1).split("&")[0].split("=")[1];
            setToken(token);
            sessionStorage.setItem("token", token);
        }
    }, []);

    if(!token)
    {
        return (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.title}>
                        <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" alt="Spotify Logo" />
                        <h1>Aura</h1>
                    </div>
                    <p>Generate an aura based on your recent listening to learn more about your current mood.</p>
                    <button onClick={handleClick}>Connect Spotify</button>
                </div>
                <div className={styles.right}>
                    <div className={styles.row} id={styles.row1}>
                        {rows.slice(0,3)}
                    </div>
                    <div className={styles.row} id={styles.row2}>
                        {rows.slice(3,6)}
                    </div>
                    <div className={styles.row} id={styles.row3}>
                        {rows.slice(6,9)}
                    </div>
                </div>
            </motion.div>
        );
    }
    else
    {
        return(
            <Navigate to="/home" state={{token: token}} />
        )
    }
}

export default LogIn;