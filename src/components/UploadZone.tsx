import { useRef, useState } from 'react';
import { validateImageFile } from '../utils/imageUtils';

interface UploadZoneProps {
  onFile: (file: File) => void;
  preview?: string;
}

export default function UploadZone({ onFile, preview }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    const err = validateImageFile(file);
    if (err) { setError(err); return; }
    setError(null);
    onFile(file);
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        style={{
          border: `2px dashed ${dragOver ? '#a855f7' : '#1e1e3a'}`,
          borderRadius: 16, padding: 32, textAlign: 'center', cursor: 'pointer',
          background: dragOver ? 'rgba(168,85,247,0.05)' : '#12122a',
          transition: 'all 0.2s',
          minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {preview ? (
          <img src={preview} alt="Preview" style={{ maxHeight: 240, borderRadius: 12, objectFit: 'cover', marginBottom: 12 }} />
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#e8e8f0', marginBottom: 6 }}>Upload Your Selfie</div>
            <div style={{ fontSize: 13, color: '#888' }}>Drag & drop or click to browse · Max 5MB</div>
          </>
        )}
        {preview && (
          <div style={{ fontSize: 13, color: '#a855f7', marginTop: 8 }}>Click to change photo</div>
        )}
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
