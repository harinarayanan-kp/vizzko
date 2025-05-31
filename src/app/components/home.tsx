// components/LandingPage.tsx
'use client';

export default function Unda() {
  return (
    <div className="bg-gradient-to-b from-[#30717A] to-[#1B232B] min-h-screen text-white font-sans">
      {/* Hero Section */}
      <section className="pt-20 pb-16 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Unleash Your Creative Power
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          Magical design tools, highly professional templates, precision editing, and more.<br />
          Your next-generation design creation platform.
        </p>
        <button className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg shadow hover:bg-blue-100 transition">
          Try for free
        </button>
      </section>

      {/* Main Feature/Mockup */}
      <section className="flex flex-col items-center justify-center mb-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-[700px] max-w-full h-[340px] mb-8 flex items-center justify-center">
          <span className="text-3xl text-gray-400 font-bold">[Feature Mockup Image]</span>
        </div>
      </section>

      {/* Trusted by Logos */}
      <section className="flex flex-col items-center mb-14">
        <div className="text-gray-300 mb-2">Trusted by top brands</div>
        <div className="flex flex-wrap gap-10 justify-center opacity-80">
          <div className="w-28 h-10 bg-gray-700 rounded" />
          <div className="w-28 h-10 bg-gray-700 rounded" />
          <div className="w-28 h-10 bg-gray-700 rounded" />
          <div className="w-28 h-10 bg-gray-700 rounded" />
          <div className="w-28 h-10 bg-gray-700 rounded" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="flex flex-wrap justify-center gap-8 mb-20 px-4">
        {[1,2,3].map(n => (
          <div key={n} className="bg-[#222935] rounded-xl p-8 max-w-xs shadow text-center">
            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full mb-4" />
            <div className="font-bold mb-2">Testimonial Name</div>
            <div className="text-gray-300 text-sm">Short quote from a happy user or influencer goes here.</div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className="flex flex-col items-center mb-20 px-4">
        <h2 className="text-3xl font-bold mb-10">Create graphics in seconds. Powered by mind-blowing tools.</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {/* Feature Card */}
          <div className="bg-[#293041] rounded-2xl p-8 shadow flex flex-col items-center text-center">
            <div className="w-56 h-32 bg-gray-700 rounded mb-4 flex items-center justify-center text-gray-300">[Feature Image]</div>
            <div className="font-bold mb-2">Advanced Text Editing</div>
            <div className="text-gray-300 text-sm mb-2">Details about advanced text features.</div>
            <button className="bg-white text-blue-700 font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition text-sm">
              Try this feature
            </button>
          </div>
          {/* More feature cards... */}
          <div className="bg-[#293041] rounded-2xl p-8 shadow flex flex-col items-center text-center">
            <div className="w-56 h-32 bg-gray-700 rounded mb-4 flex items-center justify-center text-gray-300">[Feature Image]</div>
            <div className="font-bold mb-2">Magic Recoloring</div>
            <div className="text-gray-300 text-sm mb-2">Recolor any part of your art in one click.</div>
            <button className="bg-white text-blue-700 font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition text-sm">
              Try this feature
            </button>
          </div>
          <div className="bg-[#293041] rounded-2xl p-8 shadow flex flex-col items-center text-center">
            <div className="w-56 h-32 bg-gray-700 rounded mb-4 flex items-center justify-center text-gray-300">[Feature Image]</div>
            <div className="font-bold mb-2">Innovative Texture Clipping</div>
            <div className="text-gray-300 text-sm mb-2">Super-easy cropping and effects.</div>
            <button className="bg-white text-blue-700 font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition text-sm">
              Try this feature
            </button>
          </div>
        </div>
      </section>

      {/* Unlimited Content */}
      <section className="flex flex-col items-center mb-20 px-4">
        <h2 className="text-3xl font-bold mb-8">Unlimited Content</h2>
        <div className="grid md:grid-cols-3 gap-8 w-full">
          <div className="bg-[#293041] rounded-2xl p-6 text-center">Content Type 1</div>
          <div className="bg-[#293041] rounded-2xl p-6 text-center">Content Type 2</div>
          <div className="bg-[#293041] rounded-2xl p-6 text-center">Content Type 3</div>
        </div>
      </section>

      {/* Gallery/Design Templates */}
      <section className="mb-20 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Beautifully crafted design templates</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {Array.from({length: 32}).map((_,i)=>(
            <div key={i} className="aspect-[2/3] bg-gray-700 rounded-lg shadow"></div>
          ))}
        </div>
      </section>

      {/* Tool grid section */}
      <section className="mb-20 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">All you need in one tool</h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {["Fonts", "Text", "Elements", "Photos"].map((tool,i) => (
            <div key={i} className="bg-[#293041] rounded-xl py-6 px-3 font-bold">{tool} collection</div>
          ))}
        </div>
      </section>

      {/* Tutorials/Videos */}
      <section className="mb-20 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">We help you grow</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-[#222935] rounded-xl p-4 flex flex-col items-center">
              <div className="w-full aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-gray-300">[Video]</div>
              <div className="font-bold mb-1">Tutorial Title</div>
              <div className="text-gray-300 text-sm text-center">Description of the tutorial or lesson.</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#171D23] py-10 px-4 flex flex-col items-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Unleash Your Creative Power</h2>
        <button className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg shadow hover:bg-blue-100 transition">
          Try for free
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#101419] py-12 px-4 text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
          <div>
            <div className="font-bold text-xl text-white mb-3">Vizzko</div>
            <div className="text-sm mb-2">© {new Date().getFullYear()} Vizzko. All rights reserved.</div>
            <div className="flex gap-3 text-lg">
              <span className="w-8 h-8 bg-gray-700 rounded-full inline-block" />
              <span className="w-8 h-8 bg-gray-700 rounded-full inline-block" />
              <span className="w-8 h-8 bg-gray-700 rounded-full inline-block" />
            </div>
          </div>
          {/* Footer Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
            {["Product", "Templates", "Resources", "Company"].map((section, idx) => (
              <div key={idx}>
                <div className="font-semibold text-white mb-2">{section}</div>
                <ul className="space-y-1">
                  <li><a href="#" className="hover:underline">Link 1</a></li>
                  <li><a href="#" className="hover:underline">Link 2</a></li>
                  <li><a href="#" className="hover:underline">Link 3</a></li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
