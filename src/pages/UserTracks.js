import React, { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import axios from 'axios';

import Track from '../components/Track.js';
import styles from './UserTracks.module.css';

function UserTracks()
{
    const { state } = useLocation();
    const [tracks, setTracks] = useState([]);
    const token = sessionStorage.getItem("token");
    console.log("Token: " + token);

    useEffect(() =>
    {
        const pullRecentTracks = async () => {
            const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played",
            {
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json'
                }
            });

            var tracks = [];
            for(var i = 0; i < 18; i++)
            {
                var track = new Track(response.data.items[i].track.name, response.data.items[i].track.artists[0].name, response.data.items[i].track.album.images[0].url, response.data.items[i].track.id);

                tracks.push(track);
            }

            setTracks(tracks);
        }

        const pullTopTracks = async () => {
            const response = await axios.get("https://api.spotify.com/v1/me/top/tracks",
            {
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json'
                }
            });

            var tracks = [];
            for(var i = 0; i < 18; i++)
            {
                var track = new Track(response.data.items[i].name, response.data.items[i].artists[0].name, response.data.items[i].album.images[0].url, response.data.items[i].id);
                
                tracks.push(track);
            }
            
            setTracks(tracks);
        }

        if(!state)
            return;
        else if(state.title === "Recently Played")
            pullRecentTracks();
        else if(state.title === "Your Top Tracks")
            pullTopTracks();
    }, []);

    const toggleLogout = () =>
    {
        console.log("Clicked")
        var logout = document.getElementById("logout");
        var arrow = document.getElementById("logoutArrow");
        if(logout.classList.contains(`${styles.hide}`))
        {
            logout.classList.remove(`${styles.hide}`);
            arrow.style.transform = 'rotate(180deg)';
        }
        else
        {
            logout.classList.add(`${styles.hide}`);
            arrow.style.transform = 'rotate(0deg)';
        }
    }
    
    if(state)
    {
        return (
            <div className={styles.container} style={{'--color1': state.color}}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.arrows}>
                            <a href="/home"><span className={`${styles.iconify} ${"iconify"}`}data-icon="dashicons:arrow-left-alt2"></span></a>
                            <span className={`${styles.iconify} ${"iconify"}`}data-icon="dashicons:arrow-right-alt2" id={styles.right}></span>
                        </div>
                        <div className={styles.accountIcons}>
                            <div className={styles.imageWrapper}>
                                <img src={state.accImage} alt={"Profile"} />
                            </div>
                            <div onClick={toggleLogout}>
                                <span className={`${styles.iconify} ${"iconify"}`} id="logoutArrow" data-icon="dashicons:arrow-down-alt2"></span>
                            </div>
                            <button className={`${styles.logout} ${styles.hide}`} id="logout">
                                <a href="/"><h2>Log out</h2></a>
                            </button>
                        </div>
                    </div>
                    <h1>{state.title}</h1>
                    <div className={styles.tracks}>
                        {tracks.map((track) => track.card)}
                    </div>
                </div>
            </div>
        );
    }
    else
    {
        return <Navigate to="/" />;
    }
}

export default UserTracks;