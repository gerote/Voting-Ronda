export default function Home() {
  return (
    <div className="container">
      <div className="videoWrapper">
        <iframe
          src="https://www.youtube.com/embed/CKDxmMIhxI4?si=B54XGNYGF-KD6J7i&controls=1&modestbranding=1&rel=0"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="imageSection">
        <img
          src="https://i.imgur.com/lbOYAlc.png"
          alt="vote result"
        />
      </div>

      <style jsx>{`
        .container {
          width: 100%;
          height: 100vh;
          overflow-y: auto;
          background: #000;
        }

        /* Fullscreen video, crop seperti background-cover */
        .videoWrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .videoWrapper iframe {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 177vw; /* 16:9 trick : isi layar tanpa letterbox */
          height: 100vh;
          transform: translate(-50%, -50%);
        }

        .imageSection {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 20px 0;
          background: #fff;
        }

        .imageSection img {
          max-width: 520px;
          width: 90%;
        }
      `}</style>
    </div>
  );
}
