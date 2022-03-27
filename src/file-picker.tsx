import { useEffect, useRef, useState } from "react";

interface FilePickerProps {
  setImageToRender: (image: HTMLImageElement) => void;
}

export const FilePicker = (props: FilePickerProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [pickedFile, setPickedFile] = useState<File | null>(null);

  const handleReaderLoad = (event: ProgressEvent<FileReader>) => {
    if (event.target?.result) {
      const image = new Image();
      const source = event.target.result as string;
      image.src = source;
      props.setImageToRender(image);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPickedFile(file);
  };

  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener("load", handleReaderLoad);
    if (pickedFile) {
      reader.readAsDataURL(pickedFile);
    }
    return () => reader.removeEventListener("load", handleReaderLoad);
  }, [pickedFile]);

  return (
    <div>
      <input
        ref={fileInputRef}
        onChange={handleFileChange}
        type="file"
        id="file"
        accept=".png, .jpeg, .jpg"
      />
    </div>
  );
};
