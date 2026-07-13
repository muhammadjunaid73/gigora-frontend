
const Landing = () => {
  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#111827]">
      

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#EFF6FF] to-[#FFFFFF] py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-[#1E3A5F] leading-tight mb-6">
            Win Every Gig with <span className="text-[#1A56DB]">AI</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Optimize your freelance profiles, generate winning proposals, and rank your gigs higher using advanced AI intelligence.
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
        <h2 className="text-3xl font-bold text-center text-[#1E3A5F] mb-12">The Freelancer Struggles</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-[#EFF6FF] bg-[#FFFFFF] p-8 rounded-xl shadow-sm">
            <div className="text-[#1A56DB] text-3xl mb-4">😔</div>
            <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">No Clients</h3>
            <p className="text-[#6B7280]">Sitting idle for weeks without getting a single message or order from potential buyers.</p>
          </div>
          <div className="border border-[#EFF6FF] bg-[#FFFFFF] p-8 rounded-xl shadow-sm">
            <div className="text-[#1A56DB] text-3xl mb-4">📉</div>
            <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">Gig Not Ranking</h3>
            <p className="text-[#6B7280]">Your gig is buried deep inside page 10 where buyers never reach.</p>
          </div>
          <div className="border border-[#EFF6FF] bg-[#FFFFFF] p-8 rounded-xl shadow-sm">
            <div className="text-[#1A56DB] text-3xl mb-4">❌</div>
            <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">Proposals Rejected</h3>
            <p className="text-[#6B7280]">Writing long proposals manually just to get ignored by the clients every single time.</p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="bg-[#EFF6FF] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1E3A5F] mb-12">Our AI Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#FFFFFF] p-8 rounded-xl shadow-md border border-[#EFF6FF]">
              <div className="bg-[#EFF6FF] text-[#1A56DB] w-12 h-12 flex items-center justify-center rounded-lg text-2xl mb-4 font-bold">🔍</div>
              <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">Profile Analyzer</h3>
              <p className="text-[#6B7280]">Get deep insights and a solid score on how to transform your profile into a client magnet.</p>
            </div>
            <div className="bg-[#FFFFFF] p-8 rounded-xl shadow-md border border-[#EFF6FF]">
              <div className="bg-[#EFF6FF] text-[#1A56DB] w-12 h-12 flex items-center justify-center rounded-lg text-2xl mb-4 font-bold">🚀</div>
              <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">Gig SEO</h3>
              <p className="text-[#6B7280]">Optimize your keywords, titles, and descriptions to shoot up straight to page 1.</p>
            </div>
            <div className="bg-[#FFFFFF] p-8 rounded-xl shadow-md border border-[#EFF6FF]">
              <div className="bg-[#EFF6FF] text-[#1A56DB] w-12 h-12 flex items-center justify-center rounded-lg text-2xl mb-4 font-bold">✍️</div>
              <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">Proposal Generator</h3>
              <p className="text-[#6B7280]">Generate high-converting, personalized job proposals under 200 words in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A5F] text-[#FFFFFF] py-12 px-4 border-t border-[#EFF6FF]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-2xl font-black tracking-wider">GIGORA</span>
          <div className="flex space-x-6 text-[#FFFFFF]">
            <a href="#features" className="hover:text-[#EFF6FF] transition">Features</a>
            <a href="#pricing" className="hover:text-[#EFF6FF] transition">Pricing</a>
          </div>
          <p className="text-[#EFF6FF] text-sm">
            &copy; {new Date().getFullYear()} Mufsa Developers. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
