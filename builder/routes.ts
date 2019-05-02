import { join } from "path";
import readDirectory from "recursive-readdir";
import { readFile, writeFile } from "fs-extra";

console.log("Starting routes builder...");

const getRoutes = async () => {
  const routesDirectory = join(".", "src", "router");
  return (await readDirectory(routesDirectory)).map(route =>
    route
      .replace(routesDirectory, "")
      .replace(/\.[^/.]+$/, "")
      .replace(/\/_/g, "/:")
  );
};

const getMethods = async (file: string) => {
  let methods: string[] = [];
  const filePath =
    join(".", "src", "router", file).replace(/\/:/g, "/_") + ".ts";
  const fileContents = (await readFile(filePath)).toString().toLowerCase();
  methods = fileContents
    .split("export const ")
    .map(line => line.split(" ")[0])
    .filter(line => line !== "import");
  return methods;
};

const mapMethodToImportName = (method: string, route: string) =>
  (method + route.replace(/\//g, "_").replace(/:/g, "")).toUpperCase();

const createRoutes = async () => {
  const routes = await getRoutes();
  let routesCode = "";
  for await (let route of routes) {
    const methods = await getMethods(route);
    routesCode += `import { ${methods
      .map(
        method =>
          `${method.toUpperCase()} as ${mapMethodToImportName(method, route)}`
      )
      .join(", ")} } from "./router${route.replace(/\/:/g, "/_")}";\n`;
    methods.forEach(
      method =>
        (routesCode += `app.${method}("${route}", ${mapMethodToImportName(
          method,
          route
        )});\n`)
    );
  }
  let app = (await readFile(join(".", "src", "app.ts"))).toString();
  await writeFile(
    join(".", "src", "index.ts"),
    app.replace("/* inject_routes */", routesCode)
  );
};

createRoutes()
  .then(() => console.log("Completed routes builder!"))
  .catch(error => console.log("Got an error", error));
