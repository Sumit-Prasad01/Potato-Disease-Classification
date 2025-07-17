import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileSelected }: { onFileSelected: (file: File) => void }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-6 text-center rounded-lg cursor-pointer ${
        isDragActive ? 'bg-blue-100' : 'bg-white'
      }`}
    >
      <input {...getInputProps()} />
      <p>Drag & drop an image here, or click to select</p>
    </div>
  );
};

export default FileUpload;
