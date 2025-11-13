import FilesUpload from "@/components/ui/upload-files";
import ImagesUpload from "@/components/ui/upload-images";
import InlineFileUpload from "@/components/ui/upload-inline-file";

function FileUploadPage() {
  return (
    <div className="p-2 space-y-2">
      <FilesUpload maxSize={5} />
      <ImagesUpload />
      <InlineFileUpload multiple={true} />
    </div>
  );
}

export default FileUploadPage;
