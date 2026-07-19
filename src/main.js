import { Application, Point, Assets } from "pixi.js";
import { GameWindow } from "./gameWindow";

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container").appendChild(app.canvas);

  // Примитивнй прототип уровня: квадрат, плитка, шарик
  const windowSize = 250;

  await Assets.load([
    "/assets/BorderTex.png",
    "/assets/BorderElementTex.png",
    "/assets/Plate1.png",
    "/assets/Ball.png"
  ]);

  const gameWindow = new GameWindow(app, windowSize).setMarginPercent(0.8);
  app.stage.addChild(gameWindow);

})();
