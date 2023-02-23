import { createElem } from "../../../util";
import { navItems } from "../../db/db";
import log from "../../../assets/nav/logo.png";
import { NAV_NOTE_ICON, NAV_SEARCH_ICON } from "../../constants";

export const Navigation = () => {
  const navBlock = createElem("div", "nav_block");
  navBlock.appendChild(renderNavigation());

  return navBlock;
};

function renderNavigation() {
  const navBlockWrapper = createElem("div", "nav_block_wrapper");
  const navBlockList = createElem("ul", "nav_block_list");
  navItems.map((el) => {
    const navItemList = createElem("li", "nav_item");
    const navItemsWrapper = createElem("span", "item_wrapper");
    const navItem = createElem("div", "nav_item_text");
    navItem.innerHTML = el.name;

    navItemsWrapper.appendChild(navItem);
    navItemList.appendChild(navItemsWrapper);
    navBlockList.appendChild(navItemList);
  });

  const navLogo = createElem("img", "nav_logo");
  navLogo.src = log;
  navLogo.alt = "logo";

  const navRightBlock = createElem("div", "right_block");

  const navLogoNote = createElem("span", "right_item", "nav_note");
  navLogoNote.innerHTML = NAV_NOTE_ICON;
  const navLogoSearch = createElem("span", "right_item", "nav_search");
  navLogoSearch.innerHTML = NAV_SEARCH_ICON;

  const logOut = createElem("span", "right_item", "logout");
  logOut.innerHTML = "Sign Up";

  navBlockWrapper.appendChild(navBlockList);
  navBlockWrapper.appendChild(navLogo);
  navBlockWrapper.appendChild(navRightBlock);
  navRightBlock.appendChild(navLogoNote);
  navRightBlock.appendChild(navLogoSearch);
  navRightBlock.appendChild(logOut);

  return navBlockWrapper;
}
