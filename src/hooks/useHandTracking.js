import { useEffect, useRef } from "react";

let globalHands = null;
let globalCamera = null;

const useHandTracking = (onHands) => {
    const videoRef = useRef(null);
    const onHandsRef = useRef(onHands);

    useEffect(() => {
        onHandsRef.current = onHands;
    }, [onHands]);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        if (globalHands || globalCamera) return;

        const hands = new window.Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });

        hands.onResults((results) => {
            console.log("Frame");
            const landmarks = results.multiHandLandmarks;
            if (landmarks) {
                onHandsRef.current?.(landmarks);
            }
        });

        const camera = new window.Camera(video, {
            onFrame: async () => {
                await hands.send({ image: video });
            },
            width: 640,
            height: 480,
        });

        globalHands = hands;
        globalCamera = camera;

        camera.start();

        return () => {
            console.log("Cleaning up hand tracking resources...");
            camera.stop();

            const stream = videoRef.current?.srcObject;
            if (stream) {
                stream.getTracks()[0].stop();
                videoRef.current = null;
            }


            globalHands = null;
            globalCamera = null;
        };
    }, []);

    return videoRef;
};

export default useHandTracking;
