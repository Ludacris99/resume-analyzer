import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "JobFit" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect( () => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated] ) 

  return <main>

    <Navbar />

    <section className="main-section">
      <div className="page-heading ">
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
  </main>;
}
