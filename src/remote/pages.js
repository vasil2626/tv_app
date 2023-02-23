import { MoviePage } from "../components/movies/movie";
import { initPlayer } from "../components/player/player";
import { controls } from "./controles";

const root = document.getElementById("root");

window.pages = {
  current: "",
  previous: "",
  pageVisited: false,

  setCurrent: function (current) {
    const root = document.getElementById("root");
    root.innerHTML = "";

    if (current != this.current) {
      this.previous = this.current;
      // if (this[this.previous]) {
      //   this[this.previous].hide();
      // }
    }

    this.current = current;

    pages[current].show();
  },

  setPrevious: function () {
    this.setCurrent(this.previous);
  },

  nav: {
    show: () => {
      controls.setCurrent("nav");
      controls.nav.move();
    },

    // hide: () => {
    //   document.body.classList.remove("nav");
    // },
  },
  movie: {
    show: () => {
      root.appendChild(MoviePage());
      controls.setCurrent("movie");
      // controls.movie.categories.move();
    },
    hide: () => {
      root.remove(MoviePage());
    },
  },
  // player: {
  //   show: () => {
  //     root.appendChild(initPlayer());
  //   },
  //   hide: () => {},
  // },
};
console.log(controls);
export default pages;
