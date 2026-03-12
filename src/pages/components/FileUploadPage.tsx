import FilesUpload from "@/components/ui/upload-files";
import ImagesUpload from "@/components/ui/upload-images";
import InlineFileUpload from "@/components/ui/upload-inline-file";
import UploadWithUrlV2 from "@/components/ui/upload-with-url-v2";

function FileUploadPage() {
  return (
    <div className="p-2 space-y-2">
      <FilesUpload maxSize={100} accept={"*"} />
      <ImagesUpload />
      <InlineFileUpload multiple={true} accept={"*"} />
      <UploadWithUrlV2 multiple={true} />
    </div>
  );
}

export default FileUploadPage;
