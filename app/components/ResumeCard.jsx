import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback } }) => {

    return (
        <Link
            to={`/resume/${id}`}
            className="resume-card animate-in fade-in duration-300 group relative hover:scale-[1.1]"
        >
            <div className="resume-card-header ">
                <div className="flex flex-col gap-2">
                    <h2 className="!text-black font-bold break-words">{companyName}</h2>
                    <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            <div className="opacity-0 underline absolute bottom-0 left-[50%] -translate-x-[50%] h-10 w-fit transition-all ease-in-out duration-500 group-hover:opacity-100 max-sm:text-[10px]">
                View Detailed Analysis <span className="inline-block max-sm:scale-[0.7]"><img src="/icons/arrow.png" alt="arrow" height={20} width={20} /></span>
            </div>
        </Link>
    );
}

export default ResumeCard;