import { useState, useRef, useEffect, useCallback } from 'react';
import { Grid, IconButton, Paper, Slider, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {
    PauseCircle,
    PlayCircle,
    Add,
    Remove,
    Replay10,
    Forward30,
    VolumeUp,
    VolumeMute
} from '@mui/icons-material'
import {
    Button
} from '@nextui-org/react'
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function Player({ title, url }: { title: string; url: string; }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [playingSpeed, setPlayingSpeed] = useState(1)
    const [currentProgress, setCurrentProgress] = useState(0)
    const [displayedProgress, setDisplayedProgress] = useState(0)
    const [totalAudioLength, setTotalAudioLength] = useState(0)
    const [showVolumeSlider, setShowVolumeSlider] = useState(false)
    const [volume, setVolume] = useState({
        currentValue: .5,
        previousValue: .5
    })
    const audioEl = useRef(new Audio(url));
    const togglePlayer = () => {


        setIsPlaying(!isPlaying)
    }
    const increaseSpeed = () => {
        setPlayingSpeed(playingSpeed + .25)
    }
    const decreaseSpeed = () => {
        if (playingSpeed === 0) {
            return
        }
        setPlayingSpeed(playingSpeed - .25)
    }
    const volumeSliderHandler = () => {
        setShowVolumeSlider(!showVolumeSlider)
    }
    useEffect(() => {
        if (isPlaying) {
            audioEl?.current?.play();
        }
        else {
            audioEl?.current?.pause();
        }
    }, [isPlaying])
    const updateSliderProgress = useCallback(
        () => {
            return (currentProgress / totalAudioLength) * 100
        },
        [currentProgress, totalAudioLength],
    )
    const secondsToHHMMSS = (seconds: number, returnSeconds: boolean) => {
        const HH = `${Math.floor(seconds / 3600)}`.padStart(2, '0');
        const MM = `${Math.floor(seconds / 60) % 60}`.padStart(2, '0');
        const SS = `${Math.floor(seconds % 60)}`.padStart(2, '0');
        return returnSeconds ? [HH, MM, SS].join(':') : [HH, MM].join(':');
    };
    const volumeHandler = (chosenVolume: number) => {
        audioEl.current.volume = chosenVolume
        setVolume({
            currentValue: chosenVolume,
            previousValue: volume.currentValue
        })
    }
    useEffect(() => {
        audioEl.current.currentTime = currentProgress
    }, [currentProgress])
    useEffect(() => {
        audioEl.current.playbackRate = playingSpeed
    }, [playingSpeed])

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <audio autoPlay={true} src={url} ref={audioEl} onTimeUpdate={() => {
                setDisplayedProgress(audioEl.current.currentTime)
            }} onCanPlay={() => {
                setTotalAudioLength(audioEl.current.duration || 0)
                setDisplayedProgress(audioEl.current.currentTime || 0)
                setCurrentProgress(audioEl.current.currentTime || 0)
            }} onLoad={() => { console.log(audioEl.current.duration) }} />
            <Paper className='playerContainer'>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{paddingRight:2, paddingLeft:2}}>
                    <Grid container item xs={12} sx={{ justifyContent: "center" }}><Typography>{title}</Typography></Grid>
                    <Grid item xs={1.5} style={{ height: "100%", alignSelf: "center", padding: 0 }}>
                        <IconButton aria-label="add" size='large' onClick={togglePlayer} >
                            {
                                isPlaying ? (<PauseCircle fontSize="large" />) : (<PlayCircle fontSize="large" />)
                            }
                        </IconButton>

                    </Grid>
                    <Grid item xs={10.5} >

                        <Slider defaultValue={50} value={updateSliderProgress()} valueLabelDisplay="off" aria-label="Default" onChange={(e) => {
                            const t: any = e?.target
                            setCurrentProgress((t.value / 100) * totalAudioLength)
                        }}

                        />

                        <Grid container item xs={12} sx={{ justifyContent: "space-between", flexWrap: "nowrap", padding:0}}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{  width: 25, fontSize: 11, marginRight: 2 }}>{playingSpeed}x</div>
                                <Button.Group>
                                    <IconButton aria-label="minus" size='small' style={{ border: "solid", borderRadius: 10, margin: 1 }} onClick={decreaseSpeed}>
                                        <Remove fontSize="small" />
                                    </IconButton>
                                    <IconButton aria-label="add" size='small' style={{ border: "solid", borderRadius: 10, margin: 1 }} onClick={increaseSpeed}>
                                        <Add fontSize="small" />
                                    </IconButton>

                                </Button.Group>
                                <Button.Group>
                                    <IconButton aria-label="add" size='small' onClick={() => { setCurrentProgress(audioEl.current.currentTime - 10) }} >
                                        <Replay10 fontSize="small" />
                                    </IconButton>
                                    <IconButton aria-label="minus" size='small' onClick={() => { setCurrentProgress(audioEl.current.currentTime + 30) }} >
                                        <Forward30 fontSize="small" />
                                    </IconButton>
                                </Button.Group>
                                <div style={{ display: "flex", maxWidth: 80, }} onMouseEnter={volumeSliderHandler} onMouseLeave={volumeSliderHandler} >
                                    <IconButton aria-label="add" size='small' onClick={() => { volumeHandler(volume.currentValue === 0 ? volume.previousValue : 0) }}>
                                        {volume.currentValue === 0 ? (<VolumeMute fontSize="small" />) : (<VolumeUp fontSize="small" />)}
                                    </IconButton>

                                    {
                                        showVolumeSlider && (<div style={{ display: "flex", alignItems: "center", width: "100px" }}><Slider defaultValue={volume.currentValue * 100} value={volume.currentValue * 100} onChange={(e) => { const t: any = e?.target; volumeHandler(t.value / 100); }} aria-label="small" size="small" valueLabelDisplay="auto" sx={{ width: "100%" }} /></div>)
                                        }

                                </div>
                            </div>
                            <div style={{ alignSelf: "center", fontSize: 11, width:"auto" }}>
                                {secondsToHHMMSS(displayedProgress, false)} / {secondsToHHMMSS(totalAudioLength, true)}
                            </div>
                        </Grid>
                    </Grid>

                </Grid>

            </Paper>
        </ThemeProvider>

    );
}

export default Player;
