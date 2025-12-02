import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { firebaseService } from "@/lib/firebase";

// Types for our content
interface ContentItem {
  id: string;
  title: string;
  content: string;
  createdAt: any; // Firebase timestamp
}

export default function DataStorage() {
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch content from Firebase
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await firebaseService.getContent();
      setContentList(data);
    } catch (error: any) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to fetch content: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Data Storage</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading content...</p>
          ) : contentList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No content available at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contentList.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created: {item.createdAt instanceof Date ? item.createdAt.toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <pre className="mt-2 bg-muted p-4 rounded max-h-40 overflow-auto whitespace-pre-wrap">
                      {item.content}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}