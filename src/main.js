import { Application, Assets, Container, Sprite, Graphics, autoDetectRenderer } from "pixi.js";
import { GameWindow } from "./gameWindow";
import { PlayerPlate } from "./playerPlate";

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container").appendChild(app.canvas);

  // Примитивнй прототип уровня: квадрат, плитка, шарик
  const windowSize = 800;

  const gameWindow = new GameWindow(app, windowSize).setMarginPercent(0.8);
  app.stage.addChild(gameWindow);

  const playerPlate = new PlayerPlate(150, 20, windowSize);
  gameWindow.addChild(playerPlate);

})();
