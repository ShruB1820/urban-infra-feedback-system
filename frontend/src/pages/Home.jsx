import { Link } from "react-router-dom";
import HomeHero from "../assets/homehero.jpg"

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 text-2xl">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">{n}</div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-gradient-to-br from-indigo-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Brisbane Connect</h1>
            <p className="mt-4 text-lg text-gray-700">Report infrastructure issues, track progress, and help build better cities.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/report" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700">Report an Issue</Link>
              <Link to="/profile" className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-indigo-700 font-medium border border-indigo-200 hover:bg-indigo-50">View My Reports</Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6">
              <div><dt className="text-sm text-gray-500">Issues Reported</dt><dd className="text-2xl font-bold text-gray-900">3,241</dd></div>
              <div><dt className="text-sm text-gray-500">Resolved</dt><dd className="text-2xl font-bold text-gray-900">2,908</dd></div>
              <div><dt className="text-sm text-gray-500">Avg. Resolution</dt><dd className="text-2xl font-bold text-gray-900">3.2 days</dd></div>
            </dl>
          </div>

          <div className="relative">
            <img src={HomeHero} alt="Citizens reporting issues" className="w-full rounded-3xl shadow-lg object-cover" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
          <p className="mt-2 text-gray-600">Built for citizens and city officials.</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={"📍"} title="GPS Location Tagging" desc="Attach accurate coordinates to each report for faster routing." />
            <FeatureCard icon={"🖼️"} title="Photo Evidence" desc="Upload images to help officials assess severity and prioritize." />
            <FeatureCard icon={"🗂️"} title="Smart Categorization" desc="Predefined categories for roads, lighting, sanitation, and more." />
            <FeatureCard icon={"🔔"} title="Real-time Status" desc="Track status updates and notifications as things move." />
            <FeatureCard icon={"🗺️"} title="Admin Map View" desc="Officials get a clustered map and tools to update resolution state." />
            <FeatureCard icon={"📱"} title="Mobile-friendly" desc="Responsive design that works great on phones and tablets." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-12 lg:py-16 border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <Step n={1} title="Report" desc="Log in and submit details, photos, and the exact location." />
            <Step n={2} title="Track"  desc="Follow status updates and notifications as it progresses." />
            <Step n={3} title="Resolve" desc="City teams resolve and close the issue—your report makes a difference." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900">Ready to make Brisbane better?</h3>
          <p className="mt-2 text-gray-600">File your first report in under a minute.</p>
          <Link to="/report" className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700">
            Start Reporting
          </Link>
        </div>
      </section>
    </div>
  );
}
