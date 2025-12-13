export default function Home() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <iframe
        src="https://www.youtube.com/embed/CKDxmMIhxI4?si=B54XGNYGF-KD6J7i?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&playsinline=1"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          border: "none",
        }}
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  );
}
