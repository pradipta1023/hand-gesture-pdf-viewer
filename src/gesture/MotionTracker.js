class MotionTracker {
    constructor() {
        this.previous = null;
    }

    update(hand) {
        // We'll use wrist for now
        const wrist = hand[0];

        const current = {
            x: wrist.x,
            y: wrist.y,
            timestamp: Date.now(),
        };

        if (!this.previous) {
            this.previous = current;

            return {
                current,
                previous: null,
                dx: 0,
                dy: 0,
                dt: 0,
            };
        }

        const motion = {
            current,
            previous: this.previous,

            dx: current.x - this.previous.x,
            dy: current.y - this.previous.y,

            dt: current.timestamp - this.previous.timestamp,
        };

        this.previous = current;

        return motion;
    }
}

export default MotionTracker;