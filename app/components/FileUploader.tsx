import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = () => {
    const [file, setFile] = useState();
    const onDrop = useCallback(acceptedFiles => {
        //Do something with the files
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (    
        <div className="w-full gradient-border flex justify-center items-center h-40">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                
                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div>

                        </div>
                    ) : (
                        <div>
                            <p className="text-lg text-white">
                                <span className="font-semibold">
                                    Click to upload PDF
                                </span> or drag and drop
                            </p>
                            <p className="text-lg text-white">(max 2 MB)</p>
                        </div>
                    ) }
                </div>
            </div>
        </div>
     );
}
 
export default FileUploader;