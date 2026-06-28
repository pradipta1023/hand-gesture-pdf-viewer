class SwipeDetector {
    constructor() {
        this.startX = null;
        this.locked = false;
        this.THRESHOLD = 0.15;
    }

    detect(motion) {
        if (this.locked) return null;

        const { current } = motion;

        if (this.startX === null) {
            this.startX = current.x;
            return null;
        }

        const distance = current.x - this.startX;

        // NEXT PAGE
        if (distance > this.THRESHOLD) {
            this.triggerLock();
            return "NEXT_PAGE";
        }

        // PREVIOUS PAGE
        if (distance < -this.THRESHOLD) {
            this.triggerLock();
            return "PREVIOUS_PAGE";
        }

        return null;
    }

    triggerLock() {
        this.locked = true;
        this.startX = null;

        setTimeout(() => {
            this.locked = false;
        }, 500); // your 300–400ms idea
    }
}

export default SwipeDetector;