import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = ({ onFileSelect }) => {

    //Accept the file and send it to parent to display in form
    const onDrop = useCallback(() => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    //Schema for accepting single PDF file (<2MB) only
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: 2 * 1024 * 1024
    })

    const file = acceptedFiles[0] || null;

    //     // function to convert file size to human readable format (bytes->KB/MB)
        function formatFileSize(bytes) {
            if (bytes === 0) return "0 Bytes";
            const sizes = ["Bytes", "KB", "MB"];
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            const size = bytes / Math.pow(1024, i);
            return `${size.toFixed(2)} ${sizes[i]}`;
        }

    return (
        <div className="w-full gradient-border flex justify-center items-center h-40">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="cursor-pointer">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center space-x-3">
                                <img src="/images/pdf.png" alt="pdf" className="size-10" />
                                <div>
                                    <p className="text-sm text-gray-700 font-medium truncate max-w-xs">{file.name}</p>
                                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                            </div>

                            <button className="p-2 cursor-pointer" onClick={(e)=>{
                                onFileSelect?.(null)
                            }}>
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div> 
                ) : (
                    <div className="flex justify-center items-center gap-8">
                        <img src="./upload.gif" alt="upload-gif" height={150} width={150} className="max-sm:hidden"/>

                        <div>
                            <p className="text-lg text-white">
                                <span className="font-semibold">
                                    Click to upload PDF
                                </span> or drag and drop
                            </p>
                            <p className="text-md text-white">(max 2 MB)</p>
                        </div>
                    </div>
                )}

                </div>
            </div>
        </div>
    );
}

export default FileUploader;