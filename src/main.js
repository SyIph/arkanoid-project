import { Application, Point } from "pixi.js";
import * as GameAssets from "./core/gameAssets";
import { GameWindow } from "./gameWindow";

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container").appendChild(app.canvas);

  // Примитивнй прототип уровня: квадрат, плитка, шарик
  const windowSize = 238;

  await GameAssets.load();

  const gameWindow = new GameWindow(app, windowSize).setMarginPercent(0.8);
  app.stage.addChild(gameWindow);

})();
