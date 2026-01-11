import { useNavigate } from "react-router-dom";
import { deleteFile } from "../services/api";

function FileList({ files, onFileDeleted }) {
  const navigate = useNavigate();

  const handleDelete = async (e, fileId, fileName) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      try {
        await deleteFile(fileId);
        console.log("File deleted successfully");
        if (onFileDeleted) {
          onFileDeleted();
        }
        alert("File deleted successfully");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete file");
      }
    }
  };

  if (!files || files.length === 0) {
    return <p>No files uploaded yet.</p>;
  }

  return (
    <ul className="file-list">
      {files.map((file) => (
        <li
          key={file.id}
          className="file-item"
          onClick={() => navigate(`/file/${file.id}`)}
        >
          <div>
            <strong>{file.originalFileName}</strong>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
              Size: {(file.size / 1024).toFixed(2)} KB
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={(e) => handleDelete(e, file.id, file.originalFileName)}
              style={{
                padding: '6px 8px',
                backgroundColor: '#f3f4f6',
                color: '#ef4444',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fee2e2';
                e.target.style.borderColor = '#fca5a5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.borderColor = '#e5e7eb';
              }}
              title="Delete file"
            >
              🗑
            </button>
            <span style={{ color: '#4f46e5', fontSize: '1.2rem' }}>📁</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default FileList;
