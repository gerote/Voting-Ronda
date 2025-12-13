export default function Home() {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      {/* VIDEO */}
      <div
        style={{
          width: "100%",
          height: "40vh",
          background: "#000",
          overflow: "hidden",
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/CKDxmMIhxI4?si=B54XGNYGF-KD6J7i&autoplay=0&controls=1&modestbranding=1&rel=0"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allow="encrypted-media"
          allowFullScreen
        ></iframe>
      </div>

      {/* GAMBAR */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          marginTop: "20px",
          padding: "10px",
        }}
      >
        <img
          src="https://i.imgur.com/lbOYAlc.png"
          alt="Hasil Voting"
          style={{
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
      </div>

    </div>
  );
}
