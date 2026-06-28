const PageNavigation = ({ onPrev, onNext }) => {
  return (
    <>
      {/* Left Arrow */}
      <button
        onClick={onPrev}
        style={{
          position: "fixed",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          fontSize: "24px",
          padding: "10px 15px",
          cursor: "pointer"
        }}
      >
        ◀
      </button>

      {/* Right Arrow */}
      <button
        onClick={onNext}
        style={{
          position: "fixed",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          fontSize: "24px",
          padding: "10px 15px",
          cursor: "pointer"
        }}
      >
        ▶
      </button>
    </>
  );
};

export default PageNavigation;