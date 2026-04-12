"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { getProblemsFromAssignmentId } from "@/app/lib/queries/assignments";
import { useParams } from "next/navigation";

import MapHeader from "@/app/components/gamification/MapHeader";
import ProgressBar from "@/app/components/gamification/ProgressBar";
import MapScroller from "@/app/components/gamification/MapScroller";
import ProblemCard from "@/app/components/gamification/ProblemCard";
import ContinueButton from "@/app/components/gamification/ContinueButton";
export default function AssignmentPage() {
  const { id: assignmentId } = useParams();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assignmentId) return;

    (async () => {
      const data = await getProblemsFromAssignmentId(supabase, assignmentId);
      setProblems(data);
      setLoading(false);
    })();
  }, [assignmentId]);

  return (
    <div className="min-h-screen w-full bg-[#F7F8FA] flex flex-col items-center">
      <div className="w-full max-w-[1100px] px-6 py-8 space-y-10">
        <MapHeader />
        <ProgressBar />
        <MapScroller />
        <ProblemCard />
        <ContinueButton />
      </div>
    </div>
  );
}
