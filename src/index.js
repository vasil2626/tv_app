import { Navigation } from "./components/navigation/Navigation";
import "./index.css";
import pages from "./remote/pages";
import { layOut } from "./layout";

layOut(Navigation());

pages.setCurrent("movie");
