import Navbar from "../components/Navbar";
import ResumeCard from "../components/ResumeCard";
import { resumes } from "../../constants";

export function meta() {
  return [
    { title: "JobFit" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  return <main>

    <Navbar />

    <section className="main-section">
      <div className="page-heading">
        <h1>Discover Powerful Insights In Your Resume With AI</h1>
        <h2>Track your applications & resume ratings</h2>
      </div>

      {resumes.length > 0 && (

        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </section>
  </main>
}
