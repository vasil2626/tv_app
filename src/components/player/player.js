import { createElem } from "../../../util";
import {
  PLAYER_PREV,
  PLAYER_NEXT,
  PLAYER_PAUSE,
  PLAYER_PLAY,
} from "../../constants";
import { playerConf } from "./playerConfig";
import imgErr from "../../../assets/movie/error.jpeg";

export const initPlayer = (url, title, img) => {
  const videPlayer = createElem("div", "video_player", "video_player");
  videPlayer.appendChild(renderControls(title, img));
  videPlayer.appendChild(renderPlayer(url));

  return videPlayer;
};

const renderPlayer = (src) => {
  const video = createElem("video", "video");
  video.src = src;
  video.play();

  return video;
};

const renderControls = (title, img) => {
  const controlsWrapper = createElem("div", "controls_wrapper");

  controlsWrapper.appendChild(playerInfo(title, img));
  controlsWrapper.appendChild(renderProgress());
  controlsWrapper.appendChild(controlsButtons());

  return controlsWrapper;
};

const renderProgress = () => {
  const progressParent = createElem("div", "progress_parent");
  const progressLine = createElem("div", "progress_line");
  const linePoint = createElem("div", "line_point", "line_point");

  progressLine.appendChild(linePoint);
  progressParent.appendChild(progressLine);

  return progressParent;
};

const controlsButtons = () => {
  const buttonsParent = createElem("div", "buttons_parent");
  const buttonsWrapper = createElem("div", "player_button_wrapper");
  const buttonPrev = createElem("div", "button_prev player_button");
  buttonPrev.innerHTML = PLAYER_PREV;
  buttonPrev.onclick = () => {
    prevClick();
  };
  const buttonPlayPause = createElem("div", "play_pause player_button");
  buttonPlayPause.innerHTML = PLAYER_PAUSE;
  buttonPlayPause.onclick = () => {
    pausePlayClick();
    buttonPlayPause.innerHTML = playerConf.videoConfig.playerState
      ? PLAYER_PAUSE
      : PLAYER_PLAY;
  };
  const buttonForward = createElem("div", "button_forward player_button");
  buttonForward.innerHTML = PLAYER_NEXT;

  buttonForward.onclick = () => {
    nextClick();
  };

  buttonsWrapper.appendChild(buttonPrev);
  buttonsWrapper.appendChild(buttonPlayPause);
  buttonsWrapper.appendChild(buttonForward);
  buttonsParent.appendChild(buttonsWrapper);

  return buttonsParent;
};

const prevClick = () => {
  playerConf.replayTo();
};

const pausePlayClick = () => {
  playerConf.playPause(false);
};

const nextClick = () => {
  playerConf.forwardTo();
};

const playerInfo = (title, img) => {
  const infoWrapper = createElem("div", "info_wrapper");
  const infoImg = createElem("div", "info_img");
  const infoTitle = createElem("h1", "title");

  const imgSrc = new Image();

  let infoAnimationFrame;
  cancelAnimationFrame(infoAnimationFrame);

  imgSrc.onload = function () {
    infoAnimationFrame = requestAnimationFrame(() => {
      infoImg.style.backgroundImage = `url(${this.src})`;
    });
  };

  imgSrc.onerror = function () {
    infoAnimationFrame = requestAnimationFrame(() => {
      infoImg.style.backgroundImage = `url(${imgErr})`;
    });
  };

  imgSrc.src = img;

  infoTitle.innerHTML = title;

  infoWrapper.appendChild(infoImg);
  infoWrapper.appendChild(infoTitle);

  return infoWrapper;
};

export const showPlayer = () => {
  const video = document.querySelector(".video");
  const progress = document.querySelector(".progress_line");
  const obj = {
    video,
    progress,
  };
  return obj;
};
