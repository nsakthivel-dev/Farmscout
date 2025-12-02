import { useState, useRef } from "react";

interface UploadDocsProps {
  onUploadSuccess?: () => void;
}

export default function UploadDocs({ onUploadSuccess }: UploadDocsProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    
    if (!files || files.length === 0) {
      setStatus("Please select files to upload");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    setIsUploading(true);
    setStatus("Uploading...");

    try {
      const res = await fetch("/api/rag/ingest", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok && data.ok) {
        setStatus(`Successfully ingested ${data.inserted} document chunks`);
        setFiles(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        setStatus(data.message || data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={upload} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Upload Documents</label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={(e) => setFiles(e.target.files)}
          className="w-full px-3 py-2 border rounded-md"
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: PDF, DOCX, TXT
        </p>
      </div>
      
      <button
        type="submit"
        disabled={isUploading || !files || files.length === 0}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload & Process"}
      </button>
      
      {status && (
        <div className={`text-sm p-2 rounded ${status.includes("Success") || status.includes("Successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {status}
        </div>
      )}
    </form>
  );
}