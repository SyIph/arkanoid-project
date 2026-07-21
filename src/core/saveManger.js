export class SaveManager {
    static HIGH_SCORE_KEY = "arkanoid-high-score";

    static loadHighScore() {
        return Number(localStorage.getItem(this.HIGH_SCORE_KEY)) || 0;
    }

    static saveHighScore(score) {
        localStorage.setItem(this.HIGH_SCORE_KEY, score);
    }
}