import Navbar from "../components/Navbar";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FileUploader from "../components/FileUploader";
import clsx from "clsx";
import { useNavigate } from "react-router";
import { prepareInstructions } from "../../constants";
// import { prepareInstructions } from "../../constants";

const Upload = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [file, setFile] = useState(null);
    const [fileExists, setFileExists] = useState(false);
    const [statusText, setStatusText] = useState("");

    // Zod schema define
    const JobSchema = z.object({
        company: z.string().min(1, "Company name is required"),
        role: z.string().min(1, "Role is required"),
        description: z.string().min(10, "Job description must be at least 10 characters"),
        resume: z
            .custom((file) => file !== null, { message: "Resume is required" })
            .refine((file) => file && file.type === "application/pdf", { message: "Only PDF files are accepted" })
            .refine((file) => file && file.size <= 2 * 1024 * 1024, { message: "File size must be less than 2MB" }),
    });

    //integrating schema to form
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(JobSchema),
        mode: "onBlur"
    });

    const handleAnalyze = async ({ company, job, description, resume }) => {
        setIsProcessing(true);

        //upload resume to cloud
        setStatusText('Uploading the resume...');
        const uploadedResume = await puter.fs.upload([resume]);
        if (!uploadedResume) return setStatusText('Error: Failed to upload resume');

        //store user data in cloud
        setStatusText('Analyzing...');
        const uuid = () => { crypto.randomUUID(); };
        const data = {
            id: uuid,
            resumePath: uploadedResume.path,
            company,
            job,
            description,
            feedback: '',
        }
        await puter.kv.set(`resume:${uuid}`, JSON.stringify(data));
        
        //Sending pdf + prompt to AI and getting its response
        setStatusText('Generating feedback...');
        const feedback = await puter.ai.chat(
            [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'file',
                            puter_path: uploadedResume.path
                        },
                        {
                            type: 'text',
                            text: prepareInstructions({ job, description }) 
                        }
                    ]
                }
            ], { model: 'claude-sonnet-4'});
        if (!feedback) return setStatusText('Error: Failed to generate feedback');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await puter.kv.set('resume:${uuid}', JSON.stringify(data));
        setStatusText("Analysis complete, redirecting...");
        console.log(data);
    }

    const onSubmit = (data) => {
        handleAnalyze(data);
    };

    const handleFileSelect = (file) => {
        setFile(file);               //so file exists here so we can submit it along with form data
        setFileExists(true);         //so button animation triggers
        setValue("resume", file);    //binds the file to the form so it gets included in the form data
    }

    return (
        <main>
            <Navbar />

            <section className="main-section">
                <div className="page-heading mt-8">
                    {isProcessing ? (
                        <>
                            <div className="flex flex-col justify-center items-center h-[700px] p-5">
                                <h1 className="animate-pulse mt-8">{statusText}</h1>
                                <img src="/images/resume-scan.gif" alt="scan-gif" width={500} />
                            </div>
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
                                    <FileUploader onFileSelect={handleFileSelect} file={file} />
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
