import { join } from "path";
import readDirectory from "recursive-readdir";

console.log("Starting routes builder...");

const createRoutes = async () => {
  const routesDirectory = join(".", "src", "router");
  const routes = await readDirectory(routesDirectory);
  console.log(routes);
};

createRoutes()
  .then(() => console.log("Completed routes builder!"))
  .catch(error => console.log("Got an error", error));
