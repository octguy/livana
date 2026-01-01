import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useHomeListingStore } from "@/stores/useHomeListingStore";
import { X, Camera, Upload as UploadIcon } from "lucide-react";

export function HomePhotosPage() {
  const navigate = useNavigate();
  const { photos, setPhotos } = useHomeListingStore();

  const [selectedFiles, setSelectedFiles] = useState<File[]>(
    photos.length > 0 ? photos : []
  );
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Generate previews when files change
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

  const handleUpload = () => {
    setPhotos(selectedFiles);
    setShowUploadDialog(false);
  };

  const handleNext = () => {
    if (selectedFiles.length < 5) {
      alert("Please upload at least 5 photos to continue");
      return;
    }
    setPhotos(selectedFiles);
    navigate("/host/homes/title");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-semibold mb-4">
          Add some photos of your house
        </h1>
        <p className="text-muted-foreground mb-8">
          You'll need 5 photos to get started. You can add more or make changes
          later.
        </p>

        {/* Main photo area */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-16 mb-8 bg-gray-50 flex flex-col items-center justify-center min-h-[400px]">
          {selectedFiles.length === 0 ? (
            <>
              <Camera className="w-16 h-16 text-gray-400 mb-6" />
              <Button
                onClick={() => setShowUploadDialog(true)}
                variant="outline"
                className="font-semibold"
              >
                Add photos
              </Button>
            </>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setShowUploadDialog(true)}
                variant="outline"
                className="w-full"
              >
                Add more photos
              </Button>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-1 bg-foreground rounded"></div>
          <div className="flex-1 h-1 bg-foreground rounded"></div>
          <div className="flex-1 h-1 bg-foreground rounded"></div>
          <div
            className={`flex-1 h-1 rounded ${
              selectedFiles.length >= 5 ? "bg-foreground" : "bg-gray-300"
            }`}
          ></div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} size="lg">
            Back
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            disabled={selectedFiles.length < 5}
          >
            Next
          </Button>
        </div>

        {/* Upload Dialog */}
        {showUploadDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Upload photos</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedFiles.length} items selected
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadDialog(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedFiles.length === 0 ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 mb-6 text-center transition-colors ${
                    isDragging
                      ? "border-foreground bg-muted"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex justify-center mb-4">
                    <UploadIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Drag and drop</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    or browse for photos
                  </p>
                  <Button onClick={handleBrowseClick} className="font-semibold">
                    Browse
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-6 max-h-96 overflow-y-auto">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center hover:bg-black transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                {selectedFiles.length > 0 && (
                  <Button
                    onClick={handleBrowseClick}
                    variant="outline"
                    className="flex-1"
                  >
                    Add more
                  </Button>
                )}
                <Button
                  onClick={handleUpload}
                  className="flex-1"
                  disabled={selectedFiles.length === 0}
                >
                  {selectedFiles.length === 0 ? "Done" : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
