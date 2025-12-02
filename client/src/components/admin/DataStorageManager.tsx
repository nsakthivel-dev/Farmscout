import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { firebaseService } from "@/lib/firebase";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  createdAt: any; // Firebase timestamp
}

import { Upload, FileText, Save, X, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function DataStorageManager() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extractedContent, setExtractedContent] = useState<{ filename: string; content: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Save to Firebase
      const newContent = await firebaseService.addContent({ title, content });
      
      setTitle("");
      setContent("");
      setExtractedContent(null);
      
      toast({
        title: "Success",
        description: "Content saved successfully!",
      });
    } catch (error: any) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save content: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setExtractedContent(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      
      // Set extracted content to display in editor (not auto-saving)
      setExtractedContent({
        filename: result.filename,
        content: result.content,
      });
      
      // Populate the form fields with extracted content
      setTitle(result.filename);
      setContent(result.content);

      toast({
        title: "Success",
        description: `File "${result.filename}" uploaded and processed successfully! You can now edit the content before saving.`,
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Error uploading file: " + error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Function to save the extracted content after editing
  const saveExtractedContent = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Save to Firebase
      await firebaseService.addContent({ title, content });
      
      setTitle("");
      setContent("");
      setExtractedContent(null); // Clear the extracted content section
      
      toast({
        title: "Success",
        description: "Extracted content saved successfully!",
      });
    } catch (error: any) {
      console.error("Error saving extracted content:", error);
      toast({
        title: "Error",
        description: "Failed to save extracted content: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Manual Entry Form */}
          <Card className="border-card-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Manual Entry</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Create content manually</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                Title
                <Badge variant="outline" className="text-xs">Required</Badge>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter content title"
                disabled={loading}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium flex items-center gap-2">
                Content
                <Badge variant="outline" className="text-xs">Required</Badge>
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your content here..."
                rows={8}
                disabled={loading}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {content.length} characters
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Content"}
              </Button>
              
              {extractedContent && (
                <Button 
                  type="button" 
                  onClick={saveExtractedContent}
                  disabled={loading}
                  variant="secondary"
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Extracted"}
                </Button>
              )}
            </div>
          </form>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="border-card-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Upload Document</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Import from file</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={triggerFileInput}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 sm:p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {uploading ? "Uploading..." : "Click to upload file"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        or drag and drop
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      <Badge variant="outline" className="text-xs">PDF</Badge>
                      <Badge variant="outline" className="text-xs">DOCX</Badge>
                      <Badge variant="outline" className="text-xs">TXT</Badge>
                    </div>
                  </div>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Supported formats:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>PDF documents (.pdf)</li>
                        <li>Word documents (.docx)</li>
                        <li>Text files (.txt)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Display extracted content */}
        {extractedContent && (
          <Card className="mt-6 border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Extracted Content Preview</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      File: <span className="font-medium text-foreground">{extractedContent.filename}</span>
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExtractedContent(null)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-900 dark:text-amber-100">
                    <p className="font-medium mb-1">Content Ready for Editing</p>
                    <p className="text-xs">
                      The extracted content has been populated in the form above. 
                      You can modify it before saving.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Preview</label>
                <div className="bg-muted/50 p-4 rounded-lg max-h-60 overflow-auto border border-border">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {extractedContent.content}
                  </pre>
                </div>
              </div>

              <Separator />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={saveExtractedContent}
                  disabled={loading}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Extracted Content"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setExtractedContent(null)}
                  disabled={loading}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}