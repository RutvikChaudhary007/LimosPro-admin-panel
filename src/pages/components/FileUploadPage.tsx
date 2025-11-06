import FilesUpload from "@/components/ui/upload-files";
import ImagesUpload from "@/components/ui/upload-images";

function FileUploadPage() {
	return (
		<div className="">
			<FilesUpload maxSize={5} />
			<ImagesUpload />
		</div>
	);
}

export default FileUploadPage;
