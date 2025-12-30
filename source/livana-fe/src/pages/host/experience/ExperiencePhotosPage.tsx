import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router";
import { useExperienceListingStore } from "@/stores/useExperienceListingStore";
import { X, Camera } from "lucide-react";

export function ExperiencePhotosPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const { photos, setPhotos } = useExperienceListingStore();

  const [selectedFiles, setSelectedFiles] = useState<File[]>(
    photos.length > 0 ? photos : []
  );
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const generatePreviews = useCallback((files: File[]) => {
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // Generate previews for existing photos when component mounts
  useEffect(() => {
    if (photos.length > 0 && previews.length === 0) {
      generatePreviews(photos);
    }
  }, [photos, previews.length, generatePreviews]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const newFiles = [...selectedFiles, ...fileArray];
    setSelectedFiles(newFiles);
    generatePreviews(newFiles);
  };

  const handleBrowseClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFileSelect(target.files);
    };
    input.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemovePhoto = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleNext = () => {
    if (selectedFiles.length < 3) {
      alert("Please upload at least 3 photos to continue");
      return;
    }
    setPhotos(selectedFiles);
    navigate(
      isEditMode ? "/host/experiences/review" : "/host/experiences/title"
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-semibold mb-4">
          Add photos of your experience
        </h1>
        <p className="text-muted-foreground mb-8">
          You'll need at least 3 photos to get started. Show guests what makes
          your experience special!
        </p>

        <div
          className={`relative border-2 border-dashed rounded-xl p-16 mb-8 flex flex-col items-center justify-center min-h-[400px] transition-colors ${
            isDragging
              ? "border-foreground bg-muted/50"
              : "border-gray-300 bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFiles.length === 0 ? (
            <>
              <Camera className="w-16 h-16 text-gray-400 mb-6" />
              <p className="text-lg font-medium mb-4">Drag your photos here</p>
              <p className="text-sm text-muted-foreground mb-6">
                Choose at least 3 photos
              </p>
              <Button onClick={handleBrowseClick} variant="outline">
                Upload from your device
              </Button>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-4 w-full">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-medium">
                      Cover photo
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={handleBrowseClick}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center"
              >
                <div className="text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Add more</p>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> The first photo will be your cover image. Drag
            to reorder photos if needed.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} size="lg">
            Back
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            disabled={selectedFiles.length < 3}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
