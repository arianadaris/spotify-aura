import LinesEllipsis from 'react-lines-ellipsis';
import styles from '../pages/Home.module.css';

import moodsDict from '../data/Mood.json';

export default class Track
{
    constructor(title, artist, image, id)
    {
        this.title = title;
        this.artist = artist;
        this.image = image;
        this.artistID = id;
        this.card = this.createCard();
        this.valence = 0;
        this.energy = 0;
        this.instrument = 0;
        this.dance = 0;
        this.acoustic = 0;
        this.mood = "";
        this.color = "";
        this.num = 0;
        this.descriptor = "";

        this.createCard.bind(this);
        this.getMood.bind(this);
        this.getColor.bind(this);
    }

    createCard()
    {
        return(
            <div className={styles.card}>
                <img src={this.image} alt={this.title} />
                <LinesEllipsis className={styles.cardTitle} text={this.title} maxLine="1" ellipsis='...' trimRight basedOn='words' />
                <h2 className={styles.cardArtist}>{this.artist}</h2>
            </div>
        );
    }

    getMood()
    {
        var moods = Object.keys(moodsDict); // angry, happy, sad, hopeful, energized, calm
        var elements = Object.keys(moodsDict[moods[0]]); // valence, energy, dance, instrument, acoustic
        var totals = [];
        var closestNum = 0;
        var finalMood = "";

        for(var i = 0; i < moods.length; i++)
        {
            var total = 0;
            for(var j = 0; j < 5; j++)
                total += moodsDict[moods[i]][elements[j]];
            
                var valDif = Math.abs(moodsDict[moods[i]][elements[0]] - this.valence);
                var energyDif = Math.abs(moodsDict[moods[i]][elements[1]] - this.energy);
                var instrDif = Math.abs(moodsDict[moods[i]][elements[2]] - this.instrument);
                var danceDif = Math.abs(moodsDict[moods[i]][elements[3]] - this.dance);
                var acoDif = Math.abs(moodsDict[moods[i]][elements[4]] - this.acoustic);
    
                var dataTotal = valDif + energyDif + instrDif + danceDif + acoDif;
                totals.push(dataTotal);

                if(total - dataTotal > closestNum)
                {
                    closestNum = (total - dataTotal);
                    finalMood = moods[i];
                }
        }

        this.mood = finalMood;
        this.num = 0;
    }

    getColor()
    {

        var colorNum = this.num - 1;
        if(colorNum >= 0 && colorNum < 0.25)
            this.color = moodsDict[this.mood]['colors'][0];
        else if(colorNum >= 0.25 && colorNum < 0.5)
            this.color = moodsDict[this.mood]['colors'][1];
        else if(colorNum >= 0.5 && colorNum < 0.75)
            this.color = moodsDict[this.mood]['colors'][2];
        else
            this.color = moodsDict[this.mood]['colors'][3];

        if(colorNum >= 0 && colorNum < 0.33)
            this.descriptor = moodsDict[this.mood]['descriptors'][0];
        if(colorNum >= 0.33 && colorNum < 0.66)
            this.descriptor = moodsDict[this.mood]['descriptors'][1];
        else
            this.descriptor = moodsDict[this.mood]['descriptors'][2];
    }
}