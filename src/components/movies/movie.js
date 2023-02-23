import { createElem } from "../../../util";
import { controls } from "../../remote/controles";
import { vodData } from "../../db/db";
import {
  getCategories,
  getMovieUrl,
  searchBySort,
} from "../../request/request";
import { NAVIGATE_BUTTON } from "../../constants";
import errorImg from "../../../assets/movie/error.jpeg";
import CloudinaryService from "../../cloudinary";
import { playerConf } from "../player/playerConfig";

export const MoviePage = () => {
  sortData();

  const moviePage = createElem("div", "movie_page", "movie_page");
  const movieBackground = createElem(
    "div",
    "movie_background",
    "movie_background"
  );
  const container = createElem("div", "container");
  container.appendChild(renderContent());
  moviePage.appendChild(movieBackground);
  moviePage.appendChild(container);
  return moviePage;
};

const renderContent = () => {
  const content = createElem("div", "content", "content");
  content.appendChild(renderInfo());

  return content;
};

const renderInfo = () => {
  const infoBlock = createElem("div", "info_block");
  const infoTitle = createElem("h1", "title", "page_title");
  const infoSubTitle = createElem("h3", "sub_title", "sub_title");
  const infoDescription = createElem("p", "description", "info_description");

  const ratting = createElem("div", "ratting");
  const buttonWrapper = createElem("div", "button_wrapper");
  const watchButton = createElem("button", "info_button", "watch_button");
  const watchButtonText = createElem("span", "watch_button_text");
  watchButtonText.innerHTML = "watch now";
  const trailerButton = createElem("button", "info_button", "trailer_button");
  const trailerButtonText = createElem("span", "trial_button_text");
  trailerButtonText.innerHTML = "trailer";

  infoBlock.appendChild(infoTitle);
  infoBlock.appendChild(infoSubTitle);
  infoBlock.appendChild(infoDescription);
  infoBlock.appendChild(ratting);
  infoBlock.appendChild(buttonWrapper);
  watchButton.appendChild(watchButtonText);
  trailerButton.appendChild(trailerButtonText);
  buttonWrapper.appendChild(watchButton);
  buttonWrapper.appendChild(trailerButton);

  return infoBlock;
};

export const renderCategories = () => {
  const moviesBlock = createElem("div", "movie_block");
  const movieRowWrapper = createElem("div", "movie_row_wrapper");
  const scrollController = createElem("div", "scroll_controller");

  const leftRightLeft = createElem("div", "left");
  leftRightLeft.onclick = () => {
    controls.movie.categories.left();
  };
  leftRightLeft.innerHTML = NAVIGATE_BUTTON;
  const leftRightRight = createElem("div", "right");
  leftRightRight.onclick = () => {
    controls.movie.categories.right();
  };
  leftRightRight.innerHTML = NAVIGATE_BUTTON;

  const upDownUp = createElem("div", "up");
  upDownUp.onclick = () => {
    const index = controls.movie.categories.rowIndex;
    if (index <= 0) {
      return;
    }
    controls.movie.categories.up();
  };
  upDownUp.innerHTML = NAVIGATE_BUTTON;
  const upDownDown = createElem("div", "down");
  upDownDown.onclick = () => {
    controls.movie.categories.down();
  };
  upDownDown.innerHTML = NAVIGATE_BUTTON;

  const rowTitle = createElem("h5", "row_title", "row_title");
  rowTitle.innerHTML = "row title";
  const movieBoard = createElem("div", "movie_board");
  const scrollParent = createElem("div", "scroll_parent", "scroll_parent");

  vodData?.movieData?.forEach((row) => {
    const movieScrollParent = createElem("div", "movie_scroll_parent");
    const movieScroll = createElem("div", "movie_scroll", "movie_scroll");
    for (let i = 0; i < 11; i++) {
      movieScrollParent.appendChild(movieScroll);
      movieScroll.appendChild(renderMovieItems(row.vod[i], i));
    }

    scrollParent.appendChild(movieScrollParent);
    movieBoard.appendChild(scrollParent);
  });
  scrollController.appendChild(upDownUp);
  scrollController.appendChild(upDownDown);
  scrollController.appendChild(leftRightLeft);
  scrollController.appendChild(leftRightRight);

  movieRowWrapper.appendChild(rowTitle);
  movieRowWrapper.appendChild(movieBoard);
  moviesBlock.appendChild(scrollController);
  moviesBlock.appendChild(movieRowWrapper);

  const parent = document.getElementById("content");

  parent.appendChild(moviesBlock);

  controls.movie.setCurrent("categories");
  controls.movie.categories.move();

  return moviesBlock;
};

export const renderMovieItems = (data, index) => {
  const movieItem = createElem("div", "movie_item", "movie_item");
  movieItem.style.left = `${index * 28}rem`;

  const img = new Image();

  // const cloudinaryService = new CloudinaryService();

  let itemAnimation;
  cancelAnimationFrame(itemAnimation);

  img.onload = function () {
    itemAnimation = requestAnimationFrame(() => {
      movieItem.style.backgroundImage = `url(${this.src})`;

      // movieItem.style.backgroundImage = `url(${cloudinaryService.getCloudinaryUrl(
      //   this.src,
      //   250,
      //   348
      // )})`;
    });
  };

  img.onerror = function () {
    itemAnimation = requestAnimationFrame(() => {
      movieItem.style.backgroundImage = `url(${errorImg})`;
    });
  };

  img.src = data?.stream_icon;

  movieItem.setAttribute("num", index);

  movieItem.onclick = () => {
    handleItemClick(data);
  };

  return movieItem;
};

const handleItemClick = ({
  stream_id,
  container_extension,
  name,
  stream_icon,
}) => {
  getVodUrl(stream_id, container_extension, name, stream_icon);
};

const getData = async () => {
  const response = await Promise.all([getCategories(), searchBySort()])
    .then((res) => {
      return res;
    })
    .catch((er) => {
      console.log(er);
    });

  return response;
};

const sortData = () => {
  const resObject = {};

  getData()
    .then((res) => {
      resObject.genres = res[0].data;
      resObject.movies = res[1].data;
      sortItems(resObject);
    })
    .catch((er) => {
      console.log(er);
    });
};

const sortItems = ({ genres, movies }) => {
  const vodObj = {};

  genres.forEach((item, i) => {
    vodObj[item.category_id] = {
      genre: item.category_name,
      vod: [],
      index: i,
    };
  });

  movies.forEach((item) => {
    if (!item.category_id) {
      vodObj.other = { genre: "Other", vod: [item] };
    } else {
      vodObj[item.category_id]?.vod.push(item);
    }
  });

  for (let key in vodObj) {
    if (vodObj[key].vod.length) {
      vodData.movieData?.push(vodObj[key] || []);
    }
  }
  renderCategories();
};

const getVodUrl = (id, ext, title, img) => {
  // const url =
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  // playerConf.show(url, title, img);
  getMovieUrl(id, ext)
    .then((res) => {
      // playerConf.show(res);
      playerConf.show(url, title, img);
    })
    .catch((err) => {
      controls.log(err);
    });
};

export const changeInfo = (index, rowIndex) => {
  const dataItem = vodData.movieData;
  const title = document.getElementById("page_title");
  title.innerHTML = dataItem[rowIndex].vod[index].name || "Not found";

  const subtitle = document.getElementById("sub_title");
  subtitle.innerHTML = dataItem[rowIndex].vod[index].name || "Not found";

  const description = document.getElementById("info_description");
  description.innerHTML = dataItem[rowIndex].vod[index].name || "Not found";

  const poster = document.getElementById("movie_page");

  const img = new Image();

  let frameAnimation;

  // const cloudinaryService = new CloudinaryService();

  cancelAnimationFrame(frameAnimation);

  img.onload = function () {
    frameAnimation = requestAnimationFrame(() => {
      poster.style.backgroundImage = `url(${this.src})`;
      // poster.style.backgroundImage = `url(${cloudinaryService.getCloudinaryUrl(
      //   this.src,
      //   1280,
      //   720
      // )})`;
    });
  };

  img.onerror = function () {
    frameAnimation = requestAnimationFrame(() => {
      poster.style.backgroundImage = `url(${errorImg})`;
    });
  };

  img.src = dataItem[rowIndex].vod[index].stream_icon;

  const genre = document.getElementById("row_title");
  genre.innerHTML = dataItem[rowIndex].genre;
};
