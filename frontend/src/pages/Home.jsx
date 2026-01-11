import { useEffect, useState } from "react";
import { getAllFiles } from "../services/api";
import UploadButton from "../components/UploadButton";
import FileList from "../components/FileList";

function Home() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllFiles();
      setFiles(res.data || []);
    } catch (err) {
      console.error("Failed to fetch files", err);
      setError("Unable to connect to the server. Please check in sometime");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="container">
      <h2>My Files</h2>

      <div className="upload-box">
        <UploadButton onUploadSuccess={fetchFiles} />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: "15px" }}>
            ⏳ Loading your files...
          </p>
          <div
            style={{
              display: "inline-block",
              width: "40px",
              height: "40px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : error ? (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "30px 20px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontSize: "1.2rem", color: "#991b1b", marginTop: 0, fontWeight: "600" }}>
            ⚠️ Connection Error
          </p>
          <p style={{ color: "#7f1d1d", marginBottom: "20px", fontSize: "1rem" }}>
            {error}
          </p>
          <button
            onClick={fetchFiles}
            style={{
              padding: "12px 28px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
            }}
          >
            🔄 Try Again
          </button>
        </div>
      ) : files.length === 0 ? (
        <div
          style={{
            backgroundColor: "#f0f9ff",
            border: "1px solid #bfdbfe",
            borderRadius: "12px",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.1rem", color: "#1e40af", margin: 0, fontWeight: "600" }}>
            📁 No files uploaded yet
          </p>
          <p style={{ color: "#1e40af", marginTop: "10px", fontSize: "0.95rem" }}>
            Upload your first file using the button above to get started!
          </p>
        </div>
      ) : (
        <FileList files={files} onFileDeleted={fetchFiles} />
      )}
    </div>
  );
}

export default Home;
