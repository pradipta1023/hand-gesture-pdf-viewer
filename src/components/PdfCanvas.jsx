import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useEffect, useRef, useState } from "react";
import PageNavigation from "./PageNavigation";
import ZoomControls from "./ZoomControls";
import useHandTracking from "../hooks/useHandTracking";
import MotionTracker from "../gesture/MotionTracker";
import SwipeDetector from "../gesture/SwipeDetector";
import PanDetector from "../gesture/PanDetector";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfCanvas = () => {
    const canvasRef = useRef(null);
    const pdfRef = useRef(null);
    const motionTracker = useRef(new MotionTracker());
    const swipeDetector = useRef(new SwipeDetector());
    const panDetector = useRef(new PanDetector());
    const handleHandsRef = useRef(null);
    const renderIdRef = useRef(0);

    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.5);
    const [numPages, setNumPages] = useState(0);
    const [pdfUrl, setPdfUrl] = useState("/sample.pdf");
    const [offset, setOffset] = useState({ x: 0, y: 0, });



    handleHandsRef.current = (landmarks) => {
        const hand = landmarks[0];

        if (!hand) return;

        const motion = motionTracker.current.update(hand);

        const gesture = swipeDetector.current.detect(motion);

        const panGesture = panDetector.current.detect(motion);

        if (panGesture) {
            switch (panGesture) {
                case "MOVE_UP":
                    setOffset((prev) => ({ ...prev, y: prev.y - 100 }));
                    break;
                case "MOVE_DOWN":
                    setOffset((prev) => ({ ...prev, y: prev.y + 100 }));
                    break;
            }
        }

        if (gesture) {
            switch (gesture) {
                case "NEXT_PAGE":
                    setOffset({ x: 0, y: 0 });
                    nextPage();
                    break;

                case "PREVIOUS_PAGE":
                    setOffset({ x: 0, y: 0 });
                    prevPage();
                    break;
            }
        }

    };

    const videoRef = useHandTracking(handleHandsRef.current);

    const nextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const prevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    useEffect(() => {
        const loadPdf = async () => {
            const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });

            pdfRef.current = await loadingTask.promise;
            setNumPages(pdfRef.current.numPages);

            requestRender();
        };

        loadPdf();
    }, [pdfUrl]);

    // RENDER PAGE
    const renderPage = async (pdf, pageNumber, scale, renderId) => {
        if (!pdf || !canvasRef.current) return;

        // ❗ IMPORTANT: cancel outdated render
        if (renderIdRef.current !== renderId) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport,
            transform: [1, 0, 0, 1, offset.x, offset.y],
        };

        await page.render(renderContext).promise;

        // final safety check
        if (renderIdRef.current !== renderId) return;
    };

    // REQUEST RENDER (latest wins)
    const requestRender = () => {
        if (!pdfRef.current) return;

        const renderId = Date.now();
        renderIdRef.current = renderId;

        renderPage(pdfRef.current, pageNumber, scale, renderId);
    };

    // REACT TRIGGERS
    useEffect(() => {
        requestRender();
    }, [pageNumber, scale, offset]);

    const zoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.1, 3));
    };

    const zoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
    };

    return <>
        <PageNavigation onPrev={prevPage} onNext={nextPage} />
        <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} scale={scale} />
        <button onClick={() =>
            setOffset(prev => ({ ...prev, y: prev.y - 50 }))
        }>
            Up
        </button>

        <button onClick={() =>
            setOffset(prev => ({ ...prev, y: prev.y + 50 }))
        }>
            Down
        </button>
        <center>
            <video ref={videoRef} style={{ display: "none" }} />
            <canvas ref={canvasRef}></canvas>
        </center>
    </>;
};

export default PdfCanvas;