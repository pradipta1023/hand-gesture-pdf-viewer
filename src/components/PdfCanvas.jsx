import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useEffect, useRef, useState } from "react";
import PageNavigation from "./PageNavigation";
import ZoomControls from "./ZoomControls";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfCanvas = () => {
    const canvasRef = useRef(null);
    const pdfRef = useRef(null);

    const renderIdRef = useRef(0);

    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.5);
    const [numPages, setNumPages] = useState(0);

    const pdfUrl = "/sample.pdf";

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
    }, []);

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
            viewport
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
    }, [pageNumber, scale]);

    const zoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.1, 3));
    };

    const zoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
    };

    return <>
        <PageNavigation onPrev={prevPage} onNext={nextPage} />
        <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} scale={scale} />
        <center>
            <canvas ref={canvasRef}></canvas>
        </center>
    </>;
};

export default PdfCanvas;