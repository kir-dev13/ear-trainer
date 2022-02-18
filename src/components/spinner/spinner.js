const Spinner = () => {
  return (
    <svg
      style={{
        position: "absolute",
        margin: "auto",
        left: "50%",
        transform: "translate(-50%)",
        background: "none",
        display: "block",
        shapRendering: "auto",
        textAlign: "center",
      }}
      width="128px"
      // height="128px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <path
        d="M21 50A29 29 0 0 0 79 50A29 32 0 0 1 21 50"
        fill="#292664"
        stroke="none"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="1s"
          repeatCount="indefinite"
          keyTimes="0;1"
          values="0 50 51.5;360 50 51.5"
        ></animateTransform>
      </path>
    </svg>
  );
};

export default Spinner;
