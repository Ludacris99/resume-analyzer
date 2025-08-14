import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";

const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

    }

    return (
        <main>
            <Navbar />

            <section className="main-section">
                <div className="page-heading">
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" alt="scan-gif" className="w-full" />
                        </>
                    ) : (
                            <h1>Ready to get hired at your dream job?</h1>
                    )}

                    {!isProcessing && (

                        <div className="w-full rounded-2xl mt-5 border-rose-300 border-4 shadow-2xl shadow-gray-800">
                            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 scale-[0.8]">
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input type="text" name="company-name" placeholder='Company Name' id="company-name" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input type="text" name="job-title" placeholder='Job Title' id="job-title" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-description">Job Description</label>
                                    <textarea rows={3} name="job-description" placeholder='Write a clear & concise job description' id="job-description" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="uploader">Upload Resume</label>
                                    <FileUploader />
                                </div>

                                <button className="form-button" type="submit">
                                    Analyze Resume
                                </button>
                            </form>
                        </div>

                    )}
                </div>
            </section>
        </main>
    );
}

export default Upload;