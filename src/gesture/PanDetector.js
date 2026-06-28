class PanDetector {
    constructor() {
        this.threshold = 0.03;
        this.locked = false;
    }

    detect(motion) {
        if (this.locked || !motion) return null;

        const dy = motion.dy;

        if (Math.abs(dy) < this.threshold) {
            return null;
        }

        let gesture = null;

        if (dy < -this.threshold) {
            gesture = "MOVE_UP";
        }

        if (dy > this.threshold) {
            gesture = "MOVE_DOWN";
        }

        if (gesture) {
            this.lock();
            return gesture;
        }

        return null;
    }

    lock() {
        this.locked = true;

        setTimeout(() => {
            this.locked = false;
        }, 500);
    }
}

export default PanDetector;