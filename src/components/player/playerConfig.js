import { initPlayer, showPlayer } from "./player";
import { controls } from "../../remote/controles";
import { removeActive } from "../../../util";

export const playerConf = {
  videoConfig: {
    currentTime: 0,
    playerState: true,
  },

  show: function (url, title, img) {
    document.body.appendChild(initPlayer(url, title, img));
    this.progress();
    this.showInfo();
  },
  hide: function () {
    const videoElem = document.getElementById("video_player");
    videoElem.remove();
  },
  progress: function () {
    const { progress, video } = showPlayer();
    video.addEventListener("timeupdate", () => {
      this.videoConfig.currentTime = video.currentTime;
      const progressWidth =
        (this.videoConfig.currentTime / video.duration) * 100;
      progress.style.width = `${progressWidth}%`;
    });

    controls.setCurrent("player");
    controls.player.setCurrent("progress");
    controls.player.progress.move();
  },

  rewind: function () {
    const { video } = showPlayer();
    if (video.currentTime > this.videoConfig.currentTime) {
      video.pause();
      clearTimeout(this.rewindTimeOut);
      this.rewindTimeOut = setTimeout(() => {
        this.videoConfig.currentTime += 5;
        video.currentTime = this.videoConfig.currentTime;
        video.play();
      }, 0);
    }
  },

  replay: function () {
    const { video } = showPlayer();
    if (this.videoConfig.currentTime > 0) {
      video.pause();

      clearTimeout(this.rewindTimeOut);

      this.rewindTimeOut = setTimeout(() => {
        this.videoConfig.currentTime -= 5;
        video.currentTime = this.videoConfig.currentTime;
        console.log(this.videoConfig.currentTime);
        video.play();
      }, 0);
    }
  },
  forwardTo: function () {
    const { video } = showPlayer();

    this.videoConfig.currentTime += 10;
    video.currentTime = this.videoConfig.currentTime;
  },
  replayTo: function () {
    const { video } = showPlayer();

    this.videoConfig.currentTime -= 10;
    video.currentTime = this.videoConfig.currentTime;
  },
  playPause: function () {
    const { video } = showPlayer();
    if (this.videoConfig.playerState) {
      video.pause();
      this.videoConfig.playerState = false;
    } else {
      video.play();
      this.videoConfig.playerState = true;
    }
  },
  showInfo: function () {
    const infoLayer = document.querySelector(".controls_wrapper");
    infoLayer.classList.add("show");
    clearTimeout(this.showTimeOut);
    this.showTimeOut = setTimeout(() => {
      removeActive("show");
    }, 5000);
  },
};
