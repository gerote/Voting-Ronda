export default function Home() {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      margin: 0,
      padding: 0,
      background: "#000",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <iframe
        src="https://www.youtube.com/embed/CKDxmMIhxI4?si=B54XGNYGF-KD6J7i?autoplay=1"
        style={{ width: "100%", height: "100%", border: "none" }}
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  );
}
