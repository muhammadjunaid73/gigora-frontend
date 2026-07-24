import React, { useState } from "react";

const Landing = () => {
  const [showBetaBanner, setShowBetaBanner] = useState(true);

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#111827]">
      {/* Beta Banner */}
      {showBetaBanner && (
        <div className="bg-[#1A56DB] text-white text-sm font-semibold px-4 py-3 flex items-center justify-center gap-3 relative">
          <span>
            🚀 We're in Beta — join now and get{" "}
            <span className="underline">free Pro access</span>!
          </span>
          <button
            onClick={() => setShowBetaBanner(false)}
            aria-label="Dismiss beta banner"
            className="absolute right-4 text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#EFF6FF] to-[#FFFFFF] py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-[#1E3A5F] leading-tight mb-6">
            Win Every Gig with <span className="text-[#1A56DB]">AI</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Optimize your freelance profiles, generate winning proposals, and
            rank your gigs higher using advanced AI intelligence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto bg-[#1A56DB] text-[#FFFFFF] font-bold px-8 py-4 rounded-lg hover:bg-[#1E3A5F] shadow-lg transition">
              Get Started Free
            </button>
            <button className="w-full sm:w-auto bg-[#1A56DB] border-2 border-[#1A56DB] text-[#FFFFFF] font-bold px-8 py-4 rounded-lg hover:bg-[#1E3A5F] transition">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#1E3A5F] mb-12">
          The Freelancer Struggles
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-[#EFF6FF] bg-[#FFFFFF] p-8 rounded-xl shadow-sm">
            <div className="text-[#1A56DB] text-3xl mb-4">😔</div>
            <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">
              No Clients
            </h3>
            <p className="text-[#6B7280]">
              Sitting idle for weeks without getting a single message or order
              from potential buyers.
            </p>
          </div>
          <div className="border border-[#EFF6FF] bg-[#FFFFFF] p-8 rounded-xl shadow-sm">
            <div className="text-[#1A56DB] text-3xl mb-4">📉</div>
            <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">
              Gig Not Ranking
            </h3>
            <p className="text-[#6B7280]">
              Your gig is buried deep inside page 10 where buyers never reach.
            </p>
          </div>
          <div className="border border-[#EFF6FF] bg-[#FFFFFF] p-8 rounded-xl shadow-sm">
            <div className="text-[#1A56DB] text-3xl mb-4">❌</div>
            <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">
              Proposals Rejected
            </h3>
            <p className="text-[#6B7280]">
              Writing long proposals manually just to get ignored by the clients
              every single time.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="bg-[#EFF6FF] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1E3A5F] mb-12">
            Our AI Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#FFFFFF] p-8 rounded-xl shadow-md border border-[#EFF6FF]">
              <div className="bg-[#EFF6FF] text-[#1A56DB] w-12 h-12 flex items-center justify-center rounded-lg text-2xl mb-4 font-bold">
                🔍
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">
                Profile Analyzer
              </h3>
              <p className="text-[#6B7280]">
                Get deep insights and a solid score on how to transform your
                profile into a client magnet.
              </p>
            </div>
            <div className="bg-[#FFFFFF] p-8 rounded-xl shadow-md border border-[#EFF6FF]">
              <div className="bg-[#EFF6FF] text-[#1A56DB] w-12 h-12 flex items-center justify-center rounded-lg text-2xl mb-4 font-bold">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">Gig SEO</h3>
              <p className="text-[#6B7280]">
                Optimize your keywords, titles, and descriptions to shoot up
                straight to page 1.
              </p>
            </div>
            <div className="bg-[#FFFFFF] p-8 rounded-xl shadow-md border border-[#EFF6FF]">
              <div className="bg-[#EFF6FF] text-[#1A56DB] w-12 h-12 flex items-center justify-center rounded-lg text-2xl mb-4 font-bold">
                ✍️
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">
                Proposal Generator
              </h3>
              <p className="text-[#6B7280]">
                Generate high-converting, personalized job proposals under 200
                words in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A5F] text-[#FFFFFF] py-12 px-4 border-t border-[#EFF6FF]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-2xl font-black tracking-wider">GIGORA</span>
          <div className="flex space-x-6 text-[#FFFFFF]">
            <a href="#features" className="hover:text-[#EFF6FF] transition">
              Features
            </a>
            <a href="#pricing" className="hover:text-[#EFF6FF] transition">
              Pricing
            </a>
          </div>
          <p className="text-[#EFF6FF] text-sm">
            &copy; {new Date().getFullYear()} Mufsa Developers. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Post-signup Onboarding Flow: Welcome -> Choose Platform -> Generate First Proposal
export const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState("");

  const steps = ["Welcome", "Choose Platform", "Generate First Proposal"];

  const next = () => {
    if (step < 3) setStep(step + 1);
    else onComplete?.(platform);
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full p-8 text-center">
        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-10 rounded-full ${
                i + 1 <= step ? "bg-[#1A56DB]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <h2 className="text-2xl font-black text-[#1E3A5F] mb-3">
              Welcome to GIGORA! 👋
            </h2>
            <p className="text-gray-600 mb-8">
              Let's get you set up in a few quick steps so you can start winning
              gigs with AI.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-black text-[#1E3A5F] mb-3">
              Choose Your Platform
            </h2>
            <p className="text-gray-600 mb-6">
              Which platform do you mainly freelance on?
            </p>
            <div className="flex gap-3 justify-center mb-2">
              {["Upwork", "Fiverr", "Freelancer"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm border transition ${
                    platform === p
                      ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-black text-[#1E3A5F] mb-3">
              Generate Your First Proposal
            </h2>
            <p className="text-gray-600 mb-8">
              You're all set! Head to the Proposal Generator and create your
              first AI-powered proposal in seconds.
            </p>
          </>
        )}

        <button
          onClick={next}
          disabled={step === 2 && !platform}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#1A56DB] text-white font-bold shadow-md hover:shadow-lg transition min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step < 3 ? "Continue" : "Go to Dashboard"}
        </button>
      </div>
    </div>
  );
};

export default Landing;
