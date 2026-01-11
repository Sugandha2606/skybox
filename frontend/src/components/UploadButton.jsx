import { uploadFile } from "../services/api";
import { useState } from "react";

function UploadButton({ onUploadSuccess }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [supportedFormats, setSupportedFormats] = useState([]);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Selected file:", file);

    try {
      await uploadFile(file);
      console.log("Upload success");
      onUploadSuccess();
      e.target.value = "";
      alert("File uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      
      // Check if error has structured response with supported formats
      if (err.response?.data?.supportedFormats) {
        setErrorMessage(err.response.data.message);
        setSupportedFormats(err.response.data.supportedFormats);
        setShowError(true);
      } else {
        setErrorMessage("Upload failed. Check backend logs.");
        setSupportedFormats([]);
        setShowError(true);
      }
    }
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage("");
    setSupportedFormats([]);
  };

  return (
    <>
      <input
        id="file-upload"
        type="file"
        accept=".txt,.csv,.xml,.md,.html,.png,.jpg,.jpeg,.pdf,.doc,.docx"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <label htmlFor="file-upload" className="upload-button">
        Upload File
      </label>

      {showError && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeError}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "30px",
              maxWidth: "500px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#ef4444", marginTop: 0 }}>❌ Upload Failed</h3>
            <p style={{ fontSize: "1rem", color: "#333", marginBottom: "15px" }}>
              {errorMessage}
            </p>

            {supportedFormats.length > 0 && (
              <div style={{ backgroundColor: "#f3f4f6", padding: "15px", borderRadius: "6px", marginBottom: "15px" }}>
                <p style={{ fontWeight: "bold", color: "#1f2937", marginTop: 0, marginBottom: "10px" }}>
                  Supported File Types:
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    color: "#374151",
                    fontSize: "0.95rem",
                  }}
                >
                  {supportedFormats.map((format, index) => (
                    <li key={index} style={{ marginBottom: "5px" }}>
                      {format}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={closeError}
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadButton;
