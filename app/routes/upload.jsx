import Navbar from "../components/Navbar";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FileUploader from "../components/FileUploader";
import clsx from "clsx";
// import { prepareInstructions } from "../../constants";
// import { useNavigate } from "react-router";

const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [file, setFile] = useState(null);
    const [fileExists, setFileExists] = useState(false);

    // Zod schema define
    const JobSchema = z.object({
        company: z.string().min(1, "Company name is required"),
        role: z.string().min(1, "Role is required"),
        description: z.string().min(10, "Job description must be at least 10 characters"),
        resume: z
            .custom((file) => file instanceof File, { message: "Resume is required" })
            .refine((file) => file && file.type === "application/pdf", { message: "Only PDF files are accepted" })
            .refine((file) => file && file.size <= 2 * 1024 * 1024, { message: "File size must be less than 2MB" }),
    });

    //integrating schema to form
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(JobSchema),
        mode: "onBlur"
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        alert("Form submitted successfully!");
    };

    const handleFileSelect = (file) => {
        setFile(file);               //so file exists here so we can submit it along with form data
        setFileExists(true);         //so button animation triggers
        setValue("resume", file);    //binds the file to the form so it gets included in the form data
    }

    //     const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}) => {
    //         setIsProcessing(true);
    //         setStatusText('Uploading the file...');
    //         const uploadedFile  = await fs.upload([file]);

    //         if(!uploadedFile) return setStatusText('Error: Failed to upload file');

    //         setStatusText('Converting to image...');
    //         const imageFile = await convertPdfToImage(file);
    //         if(!imageFile.file) return setStatusText('ErrorL Failed to convert PDF to image');

    //         setStatusText('Uploading the iamge...');
    //         const uploadedImage = await fs.upload([imageFile.file]);
    //         if(!uploadedImage) return setStatusText('Error: Failed to upload image');

    //         setStatusText('Preparing data...');

    //         const uuid = () => {crypto.randomUUID();};

    //         const data = {
    //             id: uuid,
    //             resumePath: uploadedFile.path,
    //             imagePath: uploadedImage.path,
    //             companyName, jobTitle, jobDescription,
    //             feedback: '',
    //         }

    //         await kv.set(`resume:${uuid}`, JSON.stringify(data));
    //         setStatusText('Analyzing...');

    //         const feedback = await ai.feedback(
    //             uploadedFile.path,
    //             prepareInstructions({ jobTitle, jobDescription })
    //         )

    //         if(!feedback)   return setStatusText('Error: Failed to analyze resume');

    //         const feedbackText = typeof feedback.message.content === 'string'
    //          ? feedback.message.content 
    //          : feedback.message.content[0].text;

    //          data.feedback = JSON.parse(feedbackText);
    //          await kv.set('resume:${uuid}', JSON.stringify(data));
    //          setStatusText("Analysis complete, redirecting...");
    //          console.log(data); 
    //     }

    //     const handleSubmit = (e) => {
    //         e.preventDefault();
    //         const form = e.currentTarget.closest('form');
    //         if(!form) return;
    //         const formData = new FormData(form);

    //         const companyName = formData.get('company-name');
    //         const jobTitle = formData.get('job-title');
    //         const jobDescription = formData.get('job-description');

    //         if(!file) return;
    //         handleAnalyze({ companyName, jobTitle, jobDescription, file });
    //     }

    return (
        <main>
            <Navbar />

            <section className="main-section">
                <div className="page-heading mt-8">
                    {isProcessing ? (
                        <>
                            <img src="/images/resume-scan.gif" alt="scan-gif" className="w-full" />
                        </>
                    ) : (
                        <h1>Ready to get hired at your dream job?</h1>
                    )}

                    {!isProcessing && (

                        <div className="w-full rounded-2xl border-white border-4 shadow-2xl shadow-gray-800 mt-8">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="bg-[#ff99c8] rounded-2xl flex flex-col p-10 gap-4"
                            >
                                {/* Company Name */}
                                <div className="form-div">
                                    <label className="font-medium mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        {...register("company")}
                                        className="w-full border rounded-lg p-2"
                                        placeholder="eg. Google, Microsoft, etc."
                                    />
                                    {errors.company && (
                                        <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                                    )}
                                </div>

                                {/* Role */}
                                <div className="form-div">
                                    <label className="font-medium mb-1">Role</label>
                                    <input
                                        type="text"
                                        {...register("role")}
                                        className="w-full border rounded-lg p-2"
                                        placeholder="eg. Full-Stack Developer, Software Engineer, etc."

                                    />
                                    {errors.role && (
                                        <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                                    )}
                                </div>

                                {/* Job Description */}
                                <div className="form-div">
                                    <label className="font-medium mb-1">Job Description</label>
                                    <textarea
                                        {...register("description")}
                                        className="w-full border rounded-lg p-2 h-24"
                                        placeholder="Write a clear and concise job description or copy-paste from LinkedIn"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                    )}
                                </div>

                                {/* React Dropzone */}
                                <div className="form-div">
                                    <label htmlFor="uploader">Upload Resume</label>
                                    <input type="hidden" {...register("resume")} />
                                    <FileUploader onFileSelect={handleFileSelect} file={file}/>
                                </div>

                                {/* Submit Button */}
                                <div className="w-full flex justify-end">
                                    <button
                                        type="submit"
                                        className={clsx("flex items-center justify-center rounded-full px-5 py-2 cursor-pointer text-white transition-all hover:scale-[1.1] bg-purple-400",
                                            fileExists && "animate-bounce"
                                        )}>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>

                    )}
                </div>
            </section>
        </main>
    );
}

export default Upload;

//CHAIN OF EVENTS HAPPENING:
// 1. User drags and drops (or selects) a PDF file in the FileUploader component.
// 2. FileUploader captures the file (via input change or drop event).
// 3. FileUploader calls the onFileSelect callback prop passed from the parent,
//    sending the selected file upwards.
// 4. The parent component (Upload) receives the file in its handler
//    and stores it in React state.
// 5. Because the file is now in state, React re-renders and the parent can:
//    - Show a FilePreview component (displaying name, size, remove button, etc.)
//    - Run validation (check file type and size, e.g. PDF ≤ 2MB).
//    - Enable/disable the "Submit" button conditionally.
// 6. On form submission, the parent takes the file from state and appends it
//    to a FormData object.
// 7. The FormData object is sent to the backend via fetch/axios for processing.
// 8. (Optional) If the user clicks "Remove", the parent clears the file from state,
//    which hides the preview and resets the uploader.
