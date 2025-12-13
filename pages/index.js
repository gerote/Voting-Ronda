export default function Home() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        background: "#000",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* FULLSCREEN BACKGROUND VIDEO */}
      <iframe
        src="https://www.youtube.com/embed/CKDxmMIhxI4?si=B54XGNYGF-KD6J7i&autoplay=0&controls=1&modestbranding=1&rel=0&playsinline=1"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          objectFit: "cover",
        }}
        allow="encrypted-media"
        allowFullScreen
      />

      {/* FLOATING CARD */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "5%",
          width: "340px",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
        }}
      >
        <img
          src="https://i.imgur.com/lbOYAlc.png"
          alt="Hasil Voting"
          style={{
            width: "100%",
            borderRadius: "8px",
          }}
        />
      </div>
    </div>
  );
}
