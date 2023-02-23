export const createElem = (tag, className, id) => {
  let tagName = null;

  if (!tagName) tagName = `<div></div>`;

  tagName = document.createElement(tag);

  // className ? tagName.classList.add(className) : null;
  className ? (tagName.classList = className) : null;
  if (id) tagName.id = id;

  return tagName;
};

export const removeActive = (className) => {
  if (!className) {
    className = "active";
  }

  const active = document.getElementsByClassName(className);

  for (let i = 0; i < active.length; i++) {
    active[i].classList.remove(className);
  }
};
