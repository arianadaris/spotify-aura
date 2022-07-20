import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import MediaQuery from 'react-responsive';

import Track from '../components/Track.js';
import hexToHSL from '../components/hexToHSL.js';
import moodsDict from '../data/Mood.json';

import styles from './Home.module.css';

// Aura - personal energy signature

// COLORS
// purple - get amped up, entertained, moving (energetic)
// green - calm, analytical, introspective (calm)
// pink - hopeless romantic (hopeful)
// orange - rebellious, high-energy (angry)
// yellow - focused, motivated (happy)
// blue - emotional, soothing (sad)


function Home()
{
    const token = sessionStorage.getItem("token");
    const [name, setName] = useState("");
    const [accImage, setAccImage] = useState("");
    const [recentTracks, setRecent] = useState([]);
    const [topTracks, setTop] = useState([]);
    const [colors, setColors] = useState({});

    useEffect(() => {
        const pullAccount = async () => {
            const response = await axios.get("https://api.spotify.com/v1/me",
            {
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json'
                }
            });

            setName(response.data.display_name);
            setAccImage(response.data.images[0].url);
        };

        const pullRecentTracks = async () => {
            const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played",
            {
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json'
                }
            });

            var tracks = [];
            var colors = {};
            for(var i = 0; i < 20; i++)
            {
                var track = new Track(response.data.items[i].track.name, response.data.items[i].track.artists[0].name, response.data.items[i].track.album.images[0].url, response.data.items[i].track.id);
                
                // Get Audio Features
                const response2 = await axios.get("https://api.spotify.com/v1/audio-features/" + track.artistID,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        'Content-Type': 'application/json'
                    }
                });
                track.valence = response2.data.valence;
                track.energy = response2.data.energy;
                track.instrument = response2.data.instrumentalness;
                track.dance = response2.data.danceability;
                track.acoustic = response2.data.acousticness;
                track.getMood();
                track.getColor();
                
                var index = '--color' + (i+1);
                colors[index] = hexToHSL(track.color);

                tracks.push(track);
                
            }

            setColors(colors);
            setRecent(tracks);
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
            for(var i = 0; i < 20; i++)
            {
                var track = new Track(response.data.items[i].name, response.data.items[i].artists[0].name, response.data.items[i].album.images[0].url, response.data.items[i].id);
                
                tracks.push(track);
            }
            
            setTop(tracks);
        }

        pullAccount();
        pullRecentTracks();
        pullTopTracks();
    }, []);

    const toggleHint = () => 
    {
        var hint = document.getElementById("hint");
        if(hint.classList.contains(`${styles.hide}`))
            hint.classList.remove(`${styles.hide}`);
        else
            hint.classList.add(`${styles.hide}`);
    }

    const toggleLogout = () =>
    {
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

    const toggleSide = () => 
    {
        // Change left side width
        var leftSide = document.getElementsByClassName(`${styles.left}`)[0];
        var border1 = document.getElementById(`${styles.border1}`);
        var border2 = document.getElementById(`${styles.border2}`);
        var button = document.getElementsByClassName(`${styles.toggle}`)[0];
        var rightContent = document.getElementsByClassName(`${styles.rightContent}`)[0];

        if(leftSide.style.width === "65%")
        {
            leftSide.style.width = "55%"; // shrink left side
            border1.style.width = "85%"; // expand borders
            border2.style.width = "90%";
            button.classList.remove(`${styles.rightBtn}`); // flip button
            rightContent.classList.remove(`${styles.hide}`); // show content
        }
        else
        {
            leftSide.style.width = "65%"; // shrink left side
            border1.style.width = "50%"; // expand borders
            border2.style.width = "55%";
            button.classList.add(`${styles.rightBtn}`); // flip button
            rightContent.classList.add(`${styles.hide}`); // show content
        }
    }

    const exportAura = async () =>
    {
        const element = document.getElementById("capture");
        element.style.display = "flex";
        element.style.zIndex = -1;

        const canvas = await html2canvas(element);
        const image = canvas.toDataURL("image/png", 1.0);

        if(window.innerWidth > 1008)
            element.style.display = "none";

        downloadImage(image, "aura");
    }

    const downloadImage = (blob, fileName) => 
    {
        const fakeLink = window.document.createElement("a");
        fakeLink.style = "display:none;";
        fakeLink.download = fileName;

        fakeLink.href = blob;

        document.body.appendChild(fakeLink);
        fakeLink.click();
        document.body.removeChild(fakeLink);

        fakeLink.remove();
    };

    if(token && recentTracks.length > 0)
    {
        var mood1 = recentTracks[0].mood;
        var mood2 = "";
        for(var i = 1; i < recentTracks.length; i++)
            if (recentTracks[i].mood !== mood1)
            {
                mood2 = recentTracks[i].mood;
                break;
            }

        var descriptor1 = recentTracks[0].descriptor;
        var descriptor2 = "";
        for(var j = 1; j < recentTracks.length; j++)
            if (recentTracks[j].descriptor !== descriptor1)
            {
                descriptor2 = recentTracks[j].descriptor;
                break;
            }

        return(
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className={styles.container}>
                <MediaQuery minWidth={1008}>
                    <div className={styles.left}>
                        <div className={styles.content}>
                            <div className={styles.header}>
                                <div className={styles.title}>
                                    <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" alt="Spotify Logo" />
                                    <h1>Aura</h1>
                                </div>
                                <div className={styles.account}>
                                    <h1>Hi, {name}</h1>
                                    <div className={styles.accountIcons}>
                                        <div className={styles.imageWrapper}>
                                            <img src={accImage} alt={name} />
                                        </div>
                                        <div onClick={toggleLogout}>
                                            <span className={`${styles.iconify} ${"iconify"}`} id="logoutArrow" data-icon="dashicons:arrow-down-alt2"></span>
                                        </div>
                                        <button className={`${styles.logout} ${styles.hide}`} id="logout" onClick={() => sessionStorage.removeItem("token")}>
                                            <a href="/"><h2>Log out</h2></a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.auraInfo}>
                                <div className={styles.tracksHeader}>
                                    <h1>Your Audio Aura</h1>
                                    <button className={styles.question} onClick={toggleHint}>
                                        ?
                                    </button>
                                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className={`${styles.hint} ${styles.hide}`} id="hint">
                                        <h2>What do the colors mean?</h2>
                                        <h3>Purple - Happy</h3>
                                        <h3>Orange - Angry</h3>
                                        <h3>Yellow - Energetic</h3>
                                        <h3>Green - Calm</h3>
                                        <h3>Blue - Sad</h3>
                                        <h3>Pink - Hopeful</h3>
                                    </motion.div>
                                </div>
                                <div className={styles.auraWrapper}>
                                    <h1>Your recent music moods are <span style={{color: moodsDict[recentTracks[0].mood]["colors"][1]}}>{mood1}</span> and <span style={{color: moodsDict[recentTracks[1].mood]["colors"][2]}}>{mood2}</span>.</h1>
                                    <button style={colors}>
                                        <span className={`${styles.iconify} ${"iconify"}`} data-icon="fluent:share-ios-24-filled"></span>
                                        <h1 onClick={() => exportAura()}>Share Aura</h1>
                                    </button>
                                </div>
                            </div>
                            <div className={styles.recentTracks}>
                                <div className={styles.tracksHeader}>
                                    <h1>Recently Played</h1>
                                    <Link to="/tracks/recent" state={{title: "Recently Played", color: colors['--color1'], accImage: accImage}} className={styles.link}>
                                        SEE ALL
                                    </Link>
                                </div>
                                <div className={styles.tracks}>
                                    {recentTracks.splice(0, 4).map((track) => track.card)}
                                </div>
                            </div>
                            <div className={styles.recentTracks}>
                                <div className={styles.tracksHeader}>
                                    <h1>Your Top Tracks</h1>
                                    <Link to="/tracks/top" state={{title: "Your Top Tracks", color: colors['--color1'], accImage: accImage}} className={styles.link}>
                                        SEE ALL
                                    </Link>
                                </div>
                                <div className={styles.tracks}>
                                    {topTracks.splice(0, 4).map((track) => track.card)}
                                </div>
                            </div>
                            <div className={styles.footer}>
                                <p>© 2022 Ariana Rajewski</p>
                                <span className={`${styles.iconify} ${"iconify"}`} data-icon="akar-icons:github-fill"></span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.right} style={colors}>
                        <div className={styles.border} id={styles.border1}/>
                        <div className={styles.border} id={styles.border2}/>
                        <button className={`${styles.toggle} ${styles.rightBtn}`} onClick={toggleSide}>
                            <span className={`${styles.iconify} ${"iconify"}`}data-icon="dashicons:arrow-right-alt2"></span>
                        </button>
                        <div className={`${styles.rightContent} ${styles.hide}`}>
                            <h1>{mood1.toUpperCase()} & <br></br>{mood2.toUpperCase()}</h1>
                            <p>Your recent listening shows that you have been feeling {descriptor1} and {descriptor2}. </p>
                        </div>
                        <div className={styles.aura} id="capture"/>
                    </div>
                </MediaQuery>
                <MediaQuery minWidth={898} maxWidth={1007}>

                </MediaQuery>
                <MediaQuery maxWidth={897}>
                    <div className={styles.mobile}>
                        <div className={styles.header}>
                            <div className={styles.title}>
                                <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" alt="Spotify Logo" />
                                <h1>Aura</h1>
                            </div>
                            <div className={styles.accountIcons}>
                                <div className={styles.imageWrapper}>
                                    <img src={accImage} alt={name} />
                                </div>
                                <div onClick={toggleLogout}>
                                    <span className={`${styles.iconify} ${"iconify"}`} id="logoutArrow" data-icon="dashicons:arrow-down-alt2"></span>
                                </div>
                                <button className={`${styles.logout} ${styles.hide}`} id="logout" onClick={() => sessionStorage.removeItem("token")}>
                                    <a href="/"><h2>Log out</h2></a>
                                </button>
                            </div>
                        </div>
                        <div className={styles.aura} style={colors} id="capture" />
                        <div className={styles.auraText}>
                            <h1>{name}'s Audio Aura</h1>
                            <h2>Your recent music moods are <span style={{color: moodsDict[recentTracks[0].mood]["colors"][1]}}>{mood1}</span> and <span style={{color: moodsDict[recentTracks[1].mood]["colors"][2]}}>{mood2}</span>.</h2>
                            <button style={colors}>
                                <span className={`${styles.iconify} ${"iconify"}`} data-icon="fluent:share-ios-24-filled"></span>
                                <h1 onClick={() => exportAura()}>Share Aura</h1>
                            </button>
                        </div>
                    </div>
                </MediaQuery>
            </motion.div>
        );
    }
    else
    {
        return(
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className={styles.loadingContainer}>
                <div className={styles.loader}>
                    Generating aura...
                </div>
                <div className={styles.spinner} />
            </motion.div>
        );
    }
}

export default Home;