// gesture/SwipeDetector.js

class SwipeDetector {
    constructor() {
        this.startX = null;
        this.lastSwipeTime = 0;

        this.SWIPE_THRESHOLD = 0.15;
        this.COOLDOWN = 800;
    }

    detect(motion) {
        const now = Date.now();

        if (now - this.lastSwipeTime < this.COOLDOWN) {
            return null;
        }

        if (this.startX === null) {
            this.startX = motion.current.x;
            return null;
        }

        const distance = motion.current.x - this.startX;

        if (distance > this.SWIPE_THRESHOLD) {
            this.startX = motion.current.x;
            this.lastSwipeTime = now;

            return "NEXT_PAGE";
        }

        if (distance < -this.SWIPE_THRESHOLD) {
            this.startX = motion.current.x;
            this.lastSwipeTime = now;

            return "PREVIOUS_PAGE";
        }

        return null;
    }
}

export default SwipeDetector;