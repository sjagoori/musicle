import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import Block from "components/block/Block.js";
import ReactAudioPlayer from "react-audio-player";
import Toast from "light-toast";
import Link from "next/link";
import { WheelGestures } from "wheel-gestures";
import VolumeUp from "assets/svg/VolumeUp";
import VolumeDown from "assets/svg/VolumeDown";
import SkipSong from "assets/svg/SkipSong";
import PrevSong from "assets/svg/PrevSong";
import DragIcon from "assets/svg/DragIcon";
import PlayPause from "assets/svg/PlayPause";
import c from "../styles/Test4.module.css";

export default function Test4() {
  let rap = useRef(null);
  let toastDuration = 350;
  let songs = [
    "bensound-buddy.mp3",
    "bensound-dubstep.mp3",
    "bensound-happyrock.mp3",
  ];
  const [song, setSong] = useState(songs[1]);
  const [state, setState] = useState(false);
  const wheelGestures = WheelGestures();

  useEffect(function mount() {
    rap.current.audioEl.current.volume = 0.5;
    let element = window.document.getElementById("trackpad");

    wheelGestures.observe(element);
    wheelGestures.on("wheel", async (wheelEventState) => {
      console.log(wheelEventState);
      if (wheelEventState.isEnding) {
        let axis = wheelEventState.axisMovement;
        if (
          axis[1] > 20 &&
          rap.current.audioEl.current.volume <= 1 &&
          rap.current.audioEl.current.volume >= 0
        ) {
          rap.current.audioEl.current.volume > 0.9
            ? Toast.fail(
                `Max volume (${
                  Math.round(rap.current.audioEl.current.volume) * 100 + "%"
                })`,
                toastDuration
              )
            : Toast.info(
                `Volume (${
                  Math.round(rap.current.audioEl.current.volume) * 100 + "%"
                })`,
                toastDuration
              );
          if (
            rap.current.audioEl.current.volume != 1 &&
            rap.current.audioEl.current.volume < 1
          )
            rap.current.audioEl.current.volume =
              rap.current.audioEl.current.volume + 0.2;
          Toast.hide();
        } else if (
          axis[1] < -20 &&
          rap.current.audioEl.current.volume <= 1 &&
          rap.current.audioEl.current.volume > 0.2
        ) {
          rap.current.audioEl.current.volume <= 0.1
            ? Toast.fail(
                `Min volume (${
                  rap.current.audioEl.current.volume.toFixed(2) * 100 + "%"
                })`,
                toastDuration
              )
            : Toast.info(
                `Volume down (${
                  rap.current.audioEl.current.volume.toFixed(2) * 100 + "%"
                })`,
                toastDuration
              );
          rap.current.audioEl.current.volume =
            rap.current.audioEl.current.volume - 0.2;
        } else if (axis[0] > 20 && axis[1] < 20 && axis[1] > -20) {
          Toast.info("Next song", toastDuration);
          rap.current.audioEl.current.src = songs[2];
          await rap.current.audioEl.current.play();
          setSong(songs[2]);
          setState(true);
        } else if (axis[0] < -20 && axis[1] < 20 && axis[1] > -20) {
          Toast.info("Previous song", toastDuration);
          rap.current.audioEl.current.src = songs[0];
          await rap.current.audioEl.current.play();
          setSong(songs[0]);
          setState(true);
        }
      }
    });
  }, []);

  async function handleClick() {
    console.log("click", state);
    if (!state) {
      Toast.success("Playing", toastDuration);
      setState(true);
      Toast.hide();
      return await rap.current.audioEl.current.play();
    } else if (state) {
      Toast.fail("Paused", toastDuration);
      setState(false);
      return rap.current.audioEl.current.pause();
    }
  }

  console.log(state, song);

  return (
    <>
      <Centered id="trackpad" onClick={handleClick}>
        <Link href="/">⇦ Back</Link>
        {state ? <Title>♫ {song} ♫</Title> : <Title></Title>}
        <ReactAudioPlayer src={songs[1]} ref={rap} />
        <div className={`${c.outerBox}`}>
          <span className={c.label}>
            <PlayPause />
          </span>
          <div className={`${c.wheelIndicator}`}>
            <div className={c.fingers}>
              <span className={c.finger}>
                <DragIcon />
              </span>
              <span className={c.finger} />
            </div>
          </div>
        </div>

        <IconBox>
          <VolumeUp />
          <SkipSong />
          <VolumeDown />
          <PrevSong />
        </IconBox>
      </Centered>
    </>
  );
}

const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > a {
    position: absolute;
    left: 20px;
    top: 20px;
    padding: 5px 10px;
    border-radius: 5px;
    margin-bottom: 100px;
    border: 1px solid black;
    padding: 10px 15px;
    border-radius: 5px;
    margin-bottom: 100px;
    background-color: grey;
    color: white;
  }
`;

const IconBox = styled.div`
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  align-items: center;
  justify-items: center;

  z-index: 0;

  height: 60vh;
  width: 60vh;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%);
  transform: translate(-50%, -50%);

  > :nth-child(1) {
    grid-column: 2;
  }

  > :nth-child(2) {
    grid-column: 3;
    grid-row: 2;
  }

  > :nth-child(3) {
    grid-column: 2;
    grid-row: 3;
  }

  > :nth-child(4) {
    grid-column: 1;
    grid-row: 2;
  }
`;

const Title = styled.p`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
`;
