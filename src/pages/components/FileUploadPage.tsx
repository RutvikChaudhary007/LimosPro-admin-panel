import FilesUpload from "@/components/ui/upload-files";
import ImagesUpload from "@/components/ui/upload-images";
import InlineFileUpload from "@/components/ui/upload-inline-file";
import UploadWithUrl from "@/components/ui/upload-with-url";

function FileUploadPage() {
  return (
    <div className="p-2 space-y-2">
      <FilesUpload maxSize={100} accept={"*"} />
      <ImagesUpload />
      <InlineFileUpload multiple={true} accept={"*"} />
      <UploadWithUrl multiple={true} />
    </div>
  );
}

export default FileUploadPage;
