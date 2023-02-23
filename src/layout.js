export const layOut = (component) => {
  const root = document.getElementById("root");

  document.body.insertBefore(component, root);
};
