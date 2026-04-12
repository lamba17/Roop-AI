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
      {/* Drop zone */}
      <div
        className={dragOver ? 'upload-drag-active' : ''}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        style={{
          border: `1.5px dashed ${dragOver ? 'rgba(168,85,247,0.8)' : 'rgba(124,58,237,0.35)'}`,
          borderRadius: 20,
          padding: preview ? 16 : 36,
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver
            ? 'rgba(124,58,237,0.10)'
            : 'var(--bg-card2)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: dragOver
            ? '0 0 30px rgba(124,58,237,0.2), inset 0 0 20px rgba(124,58,237,0.05)'
            : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle inner glow when dragging */}
        {dragOver && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxHeight: 220,
                maxWidth: '100%',
                borderRadius: 14,
                objectFit: 'cover',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 2px rgba(168,85,247,0.3)',
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: '#a855f7',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                letterSpacing: 0.5,
                marginTop: 4,
              }}
            >
              ↑ Click to change photo
            </span>
          </>
        ) : (
          <>
            {/* Camera icon with float animation */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(168,85,247,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                animation: 'float 4s ease-in-out infinite',
                boxShadow: '0 0 20px rgba(124,58,237,0.15)',
              }}
            >
              📸
            </div>

            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 5,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '-0.2px',
                }}
              >
                Upload Your Selfie
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Drag & drop or click to browse · Max 5MB
              </div>
            </div>

            {/* Supported formats */}
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {['JPG', 'PNG', 'WEBP', 'HEIC'].map(fmt => (
                <span
                  key={fmt}
                  style={{
                    fontSize: 10,
                    color: 'var(--text-hint)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: '2px 6px',
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: 0.5,
                  }}
                >
                  {fmt}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Tip box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 12,
          padding: '10px 14px',
          background: 'rgba(245,158,11,0.07)',
          borderRadius: 12,
          border: '1px solid rgba(245,158,11,0.18)',
        }}
      >
        <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
        <span
          style={{
            fontSize: 12,
            color: 'var(--gold)',
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.5,
          }}
        >
          For best results, use natural light and look directly at the camera.
        </span>
      </div>

      {/* Validation error */}
      {error && (
        <p
          style={{
            color: '#f87171',
            fontSize: 13,
            marginTop: 10,
            padding: '8px 12px',
            background: 'rgba(239,68,68,0.08)',
            borderRadius: 8,
            border: '1px solid rgba(239,68,68,0.2)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {error}
        </p>
      )}

      {/* Hidden input */}
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
