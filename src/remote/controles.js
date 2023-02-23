import { removeActive } from "../../util";
import { changeInfo, renderMovieItems } from "../components/movies/movie";
import { playerConf } from "../components/player/playerConfig";
import { vodData } from "../db/db";
import { move } from "./keys";

export const controls = {
  current: "",
  previous: "",

  setCurrent: function (current) {
    if (this.current === current) return;
    if (["rate", "protected", "logout"].indexOf(this.current) == -1) {
      this.previous = this.current;
    }

    this.current = current;
  },

  setPrevious: function () {
    this.setCurrent(this.previous);
    move();
  },

  nav: {
    current: "",
    previous: "",

    setCurrent: function (current) {
      if (this.current === current) return;
      if (["rate", "protected", "logout"].indexOf(this.current) == -1) {
        this.previous = this.current;
      }

      this.current = current;
    },

    setPrevious: function () {
      this.setCurrent(this.previous);
      move();
    },

    leftBlock: {
      index: 0,
      items: document.getElementsByClassName("nav_item"),

      left: function () {
        if (this.index === 0) return;

        this.index--;
        this.move();
      },

      right: function () {
        if (this.index < this.items.length - 1) {
          this.index++;
          this.move();
          return;
        }
        controls.nav.setCurrent("rightBlock");
        controls.nav.rightBlock.move();
      },

      down: function () {
        controls.setCurrent("movie");
        controls.movie.info.move();
      },

      move: function () {
        removeActive();
        this.items[this.index].classList.add("active");
      },
    },
    rightBlock: {
      index: 0,
      items: document.getElementsByClassName("right_item"),

      left: function () {
        if (this.index === 0) {
          controls.nav.setCurrent("leftBlock");
          controls.nav.leftBlock.move();
          return;
        }
        this.index--;
        this.move();
      },
      right: function () {
        if (this.index < this.items.length - 1) {
          this.index++;
          this.move();
        }
      },
      down: function () {
        controls.setCurrent("movie");
        move();
      },
      move: function () {
        removeActive();
        this.items[this.index].classList.add("active");
      },
    },
  },

  movie: {
    current: "",
    previous: "",

    setCurrent: function (current) {
      if (this.current === current) return;
      if (["rate", "protected", "logout"].indexOf(this.current) == -1) {
        this.previous = this.current;
      }

      this.current = current;
    },

    setPrevious: function () {
      this.setCurrent(this.previous);
      move();
    },

    info: {
      index: 0,
      items: document.getElementsByClassName("info_button"),

      left: function () {
        if (this.index === 0) return;
        this.index--;
        this.move();
      },
      right: function () {
        if (this.index < this.items.length - 1) {
          this.index++;
          this.move();
        }
      },

      up: function () {
        controls.setCurrent("nav");
        controls.nav.setCurrent("leftBlock");
        controls.nav.leftBlock.move();
      },
      down: function () {
        controls.movie.setCurrent("categories");
        controls.movie.categories.move();
      },
      move: function () {
        removeActive();
        this.items[this.index].classList.add("active");
      },
    },

    categories: {
      index: 0,
      rowIndex: 0,
      rowItems: document.getElementsByClassName("movie_scroll"),
      items: [],

      left: function () {
        if (this.index === 0) return;

        if (this.index <= 4) {
          this.printLeft();
        } else {
          this.index--;
        }
        this.move("x");
      },

      right: function () {
        if (this.index >= this.items.length - 1) return;
        if (this.index >= 4) {
          this.printRight();
        } else {
          this.index++;
        }
        this.move("x");
      },

      up: function () {
        if (this.rowIndex === 0) {
          controls.movie.setCurrent("info");
          controls.movie.info.move();
          return;
        }

        this.rowIndex--;
        this.index =
          parseInt(this.rowItems[this.rowIndex].getAttribute("index")) || 0;
        this.move("y");
      },

      down: function () {
        if (this.rowIndex < this.rowItems.length - 1) {
          this.rowIndex++;
          this.index =
            parseInt(this.rowItems[this.rowIndex].getAttribute("index")) || 0;
          this.move("y");
        }
      },

      ok: function () {
        this.items[this.index].click();
      },

      move: function (xy) {
        removeActive();

        this.items =
          this.rowItems[this.rowIndex].getElementsByClassName("movie_item");

        this.rowItems[this.rowIndex].setAttribute("index", this.index);
        this.items[this.index].classList.add("active");

        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
          changeInfo(
            parseInt(this.items[this.index].getAttribute("num")),
            this.rowIndex
          );
        }, 400);

        this.scroll(xy);
      },

      scroll: function (xy) {
        let scrollItem;
        let offset = 0;
        let pos;

        if (xy === "x") {
          pos = "X";
          scrollItem =
            document.getElementsByClassName("movie_scroll")[this.rowIndex];

          if (this.index > 3 && this.items.length > 7) {
            if (this.index > this.items.length - 4) {
              offset = Math.floor((this.items.length - 7) * 28);
            } else {
              const itemNumber = parseInt(
                this.items[this.index].getAttribute("num")
              );

              offset = Math.floor((itemNumber - 3) * 28);
            }
          }
        } else {
          pos = "Y";
          scrollItem = document.getElementById("scroll_parent");
          offset = this.rowIndex * 37;
        }

        scroll(scrollItem, -offset, pos);
      },
      printRight: function () {
        const elem = this.items;
        if (elem.length) {
          let lastElem = parseInt(
            this.items[this.items.length - 1].getAttribute("num")
          );
          const parentElement = this.rowItems[this.rowIndex];
          lastElem++;
          if (lastElem > vodData?.movieData[this.rowIndex].vod.length - 1) {
            this.index++;
            return;
          }

          const data = vodData.movieData[this.rowIndex].vod[lastElem];

          const item = renderMovieItems(data, lastElem);

          elem[0].remove();
          parentElement.appendChild(item);
        }
      },
      printLeft: function () {
        let elem = this.items;

        if (elem.length) {
          let firstElem = parseInt(this.items[0].getAttribute("num"));
          let parent = this.rowItems[this.rowIndex];

          firstElem--;

          if (firstElem < 0) {
            this.index--;
            return;
          }

          let movieData = vodData?.movieData[this.rowIndex].vod[firstElem];
          let item = renderMovieItems(movieData, firstElem);
          this.items[this.items.length - 1].remove();
          parent.insertBefore(item, parent.firstChild);
        }
      },
    },
  },
  player: {
    current: "",
    previous: "",

    setCurrent: function (current) {
      if (this.current === current) return;
      if (["rate", "protected", "logout"].indexOf(this.current) == -1) {
        this.previous = this.current;
      }

      this.current = current;
    },

    setPrevious: function () {
      this.setCurrent(this.previous);
      move();
    },

    progress: {
      item: document.getElementsByClassName("line_point"),

      left: function () {
        playerConf.replay();
      },
      right: function () {
        playerConf.rewind();
      },
      down: function () {
        controls.player.setCurrent("buttons");
        controls.player.buttons.move();
      },
      back: function () {
        playerConf.hide();
        controls.setPrevious();
        move();
      },
      move: function () {
        removeActive();
        this.item[0].classList.add("active");
      },
    },

    buttons: {
      index: 0,
      items: document.getElementsByClassName("player_button"),

      left: function () {
        if (this.index === 0) return;
        this.index--;
        this.move();
      },
      right: function () {
        if (this.index >= this.items.length - 1) return;
        this.index++;
        this.move();
      },
      up: function () {
        controls.player.setCurrent("progress");
        controls.player.progress.move();
      },
      back: function () {
        playerConf.hide();
        controls.setPrevious();
        move();
      },
      ok: function () {
        this.items[this.index].click();
      },
      move: function () {
        removeActive();
        this.items[this.index].classList.add("active");
      },
    },
    keydown: function () {
      playerConf.showInfo();
    },
  },
};

function scroll(elem, offset, xy) {
  let scrollAnimation;

  cancelAnimationFrame(scrollAnimation);

  scrollAnimation = requestAnimationFrame(() => {
    elem.style.transform = `translate${xy}(${offset}rem)`;
  });
}
