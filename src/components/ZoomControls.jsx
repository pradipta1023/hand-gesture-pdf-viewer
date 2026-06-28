const ZoomControls = ({ onZoomIn, onZoomOut, scale }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        display: "flex",
        gap: "10px",
        alignItems: "center",
        background: "rgba(0,0,0,0.6)",
        padding: "8px 12px",
        borderRadius: "8px",
        color: "white"
      }}
    >
      <button onClick={onZoomOut} style={{ fontSize: "18px" }}>
        -
      </button>

      <span>{Math.round(scale * 100)}%</span>

      <button onClick={onZoomIn} style={{ fontSize: "18px" }}>
        +
      </button>
    </div>
  );
};

export default ZoomControls;