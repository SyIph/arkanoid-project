import { Assets } from "pixi.js";

export const AssetsIds = Object.freeze({
    BorderTexture: "/assets/BorderTex.png",
    BorderElementTexture: "/assets/BorderElementTex.png",
    PlateTexture: "/assets/Plate1.png",
    BallTexture: "/assets/Ball.png",
    PlateBreak1Texture: "/assets/PlateBreak1.png",
    PlateBreak2Texture: "/assets/PlateBreak2.png",
    PlateBreak3Texture: "/assets/PlateBreak3.png",
    ArmorBrick1Texture: "/assets/ArmorBrick1.png",
    ArmorBrick2Texture: "/assets/ArmorBrick2.png",
    ArmorBrick3Texture: "/assets/ArmorBrick3.png",
    ArmorBrick4Texture: "/assets/ArmorBrick4.png",
    ArmorBrick5Texture: "/assets/ArmorBrick5.png",
    ArmorBrick6Texture: "/assets/ArmorBrick6.png",
    Level1BgTexture: "/assets/LevelBg1.png"
});

export async function load() {
    const textures = await Assets.load(Object.values(AssetsIds));
    for (const texture of Object.values(textures)) {
        texture.source.scaleMode = 'nearest';
    }
}