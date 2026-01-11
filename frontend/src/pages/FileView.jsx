import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { downloadFile, getFileMetadata } from "../services/api";

function FileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFilePreview = async () => {
      try {
        setLoading(true);
        
        // First, fetch file metadata to get the original filename
        const metadataRes = await getFileMetadata(id);
        const metadata = metadataRes.data;
        console.log("Metadata:", metadata);
        setFileName(metadata.originalFileName);
        setFileType(metadata.contentType);

        // Then download the file content
        const res = await downloadFile(id);
        console.log("Download response data type:", typeof res.data);
        console.log("Download response data:", res.data);
        
        // Determine file type by extension
        const fileExtension = metadata.originalFileName.split(".").pop()?.toLowerCase();
        const contentType = metadata.contentType?.toLowerCase() || "";

        console.log("File Extension:", fileExtension);
        console.log("Content Type:", contentType);
        console.log("Content Type includes 'image':", contentType.includes("image"));
        console.log("Content Type includes 'pdf':", contentType.includes("pdf"));

        // Handle different file types - try multiple checks
        if (["png", "jpg", "jpeg", "gif", "webp"].includes(fileExtension) || contentType.includes("image")) {
          // Image file
          console.log("Treating as image");
          const blob = new Blob([res.data], { type: contentType || "image/jpeg" });
          const url = URL.createObjectURL(blob);
          setFileContent({ type: "image", url });
        } else if (["pdf"].includes(fileExtension) || contentType.includes("pdf")) {
          // PDF file
          console.log("Treating as PDF");
          const blob = new Blob([res.data], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setFileContent({ type: "pdf", url });
        } else if (["doc", "docx"].includes(fileExtension) || contentType.includes("document") || contentType.includes("msword")) {
          // Word document - show message with download option
          console.log("Treating as Word document");
          setFileContent({ type: "document", message: "Word documents cannot be previewed in browser. Click Download to open." });
        } else {
          // All other files - treat as text preview
          console.log("Treating as text");
          try {
            // Convert blob to text
            let text;
            if (res.data instanceof Blob) {
              console.log("Data is a Blob, converting to text");
              text = await res.data.text();
            } else {
              console.log("Data is not a Blob, using TextDecoder");
              text = new TextDecoder().decode(new Uint8Array(res.data));
            }
            console.log("Decoded text length:", text.length);
            console.log("First 200 chars:", text.substring(0, 200));
            setFileContent({ type: "text", text });
          } catch (e) {
            // If decoding fails, show unsupported message
            console.error("Decoding error:", e);
            setFileContent({ type: "unsupported", message: "Cannot preview this file type. Use download to open it." });
          }
        }
        setError(null);
      } catch (err) {
        console.error("Error loading file:", err);
        console.error("Error details:", err.message);
        setError("Failed to load file preview: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFilePreview();
  }, [id]);

  const handleDownload = async () => {
    try {
      const res = await downloadFile(id);
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || `file-${id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file");
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/")} className="back-button">
          ← Back to Files
        </button>
        <button onClick={handleDownload} className="download-button" style={{ marginLeft: "10px" }}>
          ⬇️ Download
        </button>
      </div>

      <h2>{fileName || "Loading..."}</h2>

      {loading && <p>Loading file preview...</p>}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && fileContent && (
        <>
          {fileContent.type === "image" && (
            <div style={{ marginTop: "20px" }}>
              <img src={fileContent.url} alt={fileName} style={{ maxWidth: "100%", maxHeight: "500px" }} />
            </div>
          )}

          {fileContent.type === "text" && (
            <div style={{ marginTop: "20px" }}>
              <pre
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "15px",
                  borderRadius: "5px",
                  overflow: "auto",
                  maxHeight: "600px",
                  marginTop: "20px",
                  fontSize: "13px",
                  fontFamily: "'Courier New', Courier, monospace",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {fileContent.text}
              </pre>
            </div>
          )}

          {fileContent.type === "pdf" && (
            <div style={{ marginTop: "20px" }}>
              <iframe
                src={fileContent.url}
                title={fileName}
                style={{
                  width: "100%",
                  height: "600px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              />
            </div>
          )}

          {fileContent.type === "document" && (
            <p style={{ marginTop: "20px", fontSize: "1.1rem", padding: "20px", backgroundColor: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "5px", color: "#1e40af" }}>
              {fileContent.message}
            </p>
          )}

          {fileContent.type === "unsupported" && (
            <p style={{ marginTop: "20px", fontSize: "1.1rem" }}>{fileContent.message}</p>
          )}
        </>
      )}

      {!loading && !fileContent && !error && (
        <p>No file content available</p>
      )}
    </div>
  );
}

export default FileView;
