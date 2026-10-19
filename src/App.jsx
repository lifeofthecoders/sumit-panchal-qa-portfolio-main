import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import ShinyText from "./components/ShinyText/ShinyText";
import BlurText from "./components/BlurText/BlurText";
import ScrambledText from "./components/ScrambledText/ScrambledText";
import SplitText from "./components/SplitText/SplitText";
import Lanyard from "./components/Lanyard/Lanyard";
import GlassIcons from "./components/GlassIcons/GlassIcons";
import { listTools, listProjects } from "./data";
import ChromaGrid from "./components/ChromaGrid/ChromaGrid";
import ProjectModal from "./components/ProjectModal/ProjectModal"; // <-- IMPORT MODAL
import Aurora from "./components/Aurora/Aurora";
import AOS from 'aos';
import ChatRoom from "./components/ChatRoom";
import 'aos/dist/aos.css'; // You can also use <link> for styles
// EmailJS public configuration is supplied at build time through Vite environment variables.
// The Service ID below is the Portfolio Contact Service created in the EmailJS dashboard.
// The Public Key is intended for browser usage; never place an EmailJS Private Key here.
const EMAILJS_SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_5zm7rwu").trim();
const EMAILJS_TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "").trim();
const EMAILJS_PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "").trim();

// Keep the portfolio source fixed so it cannot be changed by a visitor submitting the form.
const PORTFOLIO_SOURCE = "Sumit Panchal - QA - Portfolio_Main";
const PORTFOLIO_SOURCE_URL = "https://sumit-portfolio-e876a.web.app/";

const getIndiaTimestamp = () => {
  const formatted = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

  return `${formatted} IST`;
};

// ..
AOS.init();

function App() {
  const aboutRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState({ type: "idle", message: "" });

  const [selectedProject, setSelectedProject] = useState(null);
  const selectedProjectRef = useRef(null);

  useEffect(() => {
    selectedProjectRef.current = selectedProject;
  }, [selectedProject]);

  const scrollToProjectListing = () => {
    window.requestAnimationFrame(() => {
      document.getElementById("project")?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  };

  const handleProjectClick = (project) => {
    const nextUrl = `${window.location.pathname}${window.location.search}#project/${project.id}`;
    window.history.pushState(
      { ...(window.history.state || {}), portfolioProjectId: project.id },
      "",
      nextUrl
    );
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    if (!selectedProject) return;

    if (/^#project\/\d+$/.test(window.location.hash) && window.history.state?.portfolioProjectId) {
      window.history.back();
      return;
    }

    // For a directly opened project URL, close in-place instead of navigating away.
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#project`);
    setSelectedProject(null);
    scrollToProjectListing();
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    if (isContactSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const honeypot = String(formData.get("_honey") || "").trim();

    if (!name || !email || !subject || !message) {
      setContactStatus({
        type: "error",
        message: "Please complete all fields before sending your message.",
      });
      return;
    }

    // Ignore automated form fills without sending any email.
    if (honeypot) {
      setContactStatus({ type: "idle", message: "" });
      form.reset();
      return;
    }

    if (!EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setContactStatus({
        type: "error",
        message: "The contact form is not fully configured yet. Please try again later.",
      });
      console.error(
        "EmailJS is not configured. Set VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY in .env.local before building."
      );
      return;
    }

    setIsContactSubmitting(true);
    setContactStatus({ type: "loading", message: "Sending your message securely…" });

    const templateParams = {
      name,
      email,
      subject,
      message,
      submitted_at: getIndiaTimestamp(),
      source_name: PORTFOLIO_SOURCE,
      source_url: PORTFOLIO_SOURCE_URL,
    };

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      if (response?.status !== 200) {
        throw new Error(`EmailJS returned an unexpected status: ${response?.status ?? "unknown"}`);
      }

      form.reset();
      setContactStatus({
        type: "success",
        message: "Thank you for reaching out. Your message has been submitted successfully. I appreciate your interest and will review your enquiry.",
      });
    } catch (error) {
      console.error("EmailJS contact form submission failed:", error);
      setContactStatus({
        type: "error",
        message: "We couldn’t send your message just now. Please check your connection and try again. Your entered details are still here.",
      });
    } finally {
      setIsContactSubmitting(false);
    }
  };

  useEffect(() => {
    const syncProjectFromLocation = () => {
      const match = window.location.hash.match(/^#project\/(\d+)$/);

      if (match) {
        const project = listProjects.find((item) => String(item.id) === match[1]);
        setSelectedProject(project || null);
        return;
      }

      const wasProjectOpen = selectedProjectRef.current !== null;
      setSelectedProject(null);
      if (wasProjectOpen) {
        const requestedSection = window.location.hash.replace(/^#/, "");
        const validSections = new Set(["home", "about", "tools", "project", "contact"]);
        const targetSection = validSections.has(requestedSection) ? requestedSection : "project";
        window.requestAnimationFrame(() => {
          document.getElementById(targetSection)?.scrollIntoView({ behavior: "auto", block: "start" });
        });
      }
    };

    window.addEventListener("popstate", syncProjectFromLocation);
    window.addEventListener("hashchange", syncProjectFromLocation);
    syncProjectFromLocation();

    return () => {
      window.removeEventListener("popstate", syncProjectFromLocation);
      window.removeEventListener("hashchange", syncProjectFromLocation);
    };
  }, []);
  // -------------------------

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full -z-10 ">
        <Aurora
          colorStops={["#577870", "#1F97A6", "#127B99"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="hero grid md:grid-cols-2 items-center pt-10 xl:gap-0 gap-6 grid-cols-1" id="home">
          <div className="animate__animated animate__fadeInUp animate__delay-3s">
            <div className="flex items-center gap-3 mb-6 bg bg-zinc-800 w-fit p-4 rounded-2xl">
              <img src="./assets/Sumit_Panchal1.png" className="w-10 rounded-md" />
              <q>Driving Software Quality Through Thorough Testing, Precision, and a User-First Mindset.</q>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              <ShinyText
                text="Hi, I'm Sumit Panchal"
                disabled={false}
                speed={3}
                className="custom-class"
              />
            </h1>
            <BlurText
              text="A passionate application and web developer dedicated to crafting modern, high-performance digital experiences through innovative and user-friendly solutions."
              delay={150}
              animateBy="words"
              direction="top"
              className=" mb-6"
            />
            <div className="flex items-center sm:gap-4 gap-2">
              <a
                href="/assets/Sumit_Panchal_QA_Resume.pdf"
                download="Sumit_Panchal_QA_Resume.pdf"
                className="font-semibold bg-[#1a1a1a] p-4 px-6 rounded-full border border-gray-700 hover:bg-[#222] transition-colors"
              >
                <ShinyText text="Download Resume" disabled={false} speed={3} className="custom-class" />
              </a>

              <a href="#project" className="font-semibold bg-[#1a1a1a] p-4 px-6 rounded-full border border-gray-700 hover:bg-[#222] transition-colors">
                <ShinyText text="Explore My Projects" disabled={false} speed={3} className="custom-class" />
              </a>
            </div>

          </div>
          <div className="md:ml-auto animate__animated animate__fadeInUp animate__delay-4s">
            <ProfileCard
              name="Sumit Panchal"
              title="Quality Analyst"
              handle="sumitpanchal"
              status="Online"
              contactText="Let's Connect"
              avatarUrl="/assets/Sumit_Panchal1.png"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => console.log('Contact clicked')}
            />
          </div>
        </div>
        {/* About Me */}
        <div className="mt-15 mx-auto w-full max-w-[1600px] rounded-3xl border-[5px] border-violet-500/40 shadow-[0_0_30px_rgba(168,85,247,0.4)] bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] p-6" id="about">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-0 px-8" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
            <div className="basis-full md:basis-7/12 min-w-0 pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-violet-500/30 overflow-hidden">
              {/* Left Column */}
              <div className="flex-1 min-w-0 text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
                  About Me
                </h2>

                <div className="max-w-full overflow-hidden mb-10">
                  <BlurText
                    text="I’m Sumit Panchal, a Quality Analyst passionate about ensuring software is reliable, user-friendly, and built to deliver a seamless experience. I specialize in Manual Testing, functional testing, UI/UX validation, regression testing, and identifying real-world issues before they reach users. With 5+ years of experience in Quality Assurance, I focus on understanding requirements, exploring different user scenarios, finding edge cases, and reporting bugs with clear and actionable details. I believe QA is more than finding defects. It’s about understanding how users interact with a product and helping teams build better software. I enjoy working closely with developers and product teams to improve product quality, usability, and overall performance. My goal is to combine a strong testing mindset with attention to detail and user-focused thinking to deliver reliable, high-quality digital products."
                    delay={120}
                    animateBy="words"
                    direction="top"
                    className="text-base md:text-lg leading-8 text-gray-300 text-justify break-words [word-spacing:0.02em]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">

                  {/* Years of Experience */}
                  <div className="flex h-[120px] flex-col items-start justify-start rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-slate-900 to-slate-950 p-4 text-left shadow-[0_0_25px_rgba(139,92,246,0.12)] transition-transform duration-300 hover:-translate-y-1">
                    <h3 className="h-[36px] w-full text-[15px] font-black leading-[1.2] text-violet-400">
                      5<span className="text-violet-200">+</span>
                    </h3>

                    <p className="mt-2 w-full text-[10px] font-medium uppercase tracking-[2px] leading-4 text-violet-100/80">
                      Years of Experience
                    </p>
                  </div>


                  {/* Core Focus */}
                  <div className="flex h-[120px] flex-col items-start justify-start rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-4 text-left shadow-[0_0_25px_rgba(34,211,238,0.12)] transition-transform duration-300 hover:-translate-y-1">
                    <h3 className="h-[36px] w-full text-[15px] font-black leading-[1.2] text-cyan-300 break-words">
                      QA + Development
                    </h3>

                    <p className="mt-2 w-full text-[10px] font-medium uppercase tracking-[2px] leading-4 text-cyan-100/80">
                      Core Focus
                    </p>
                  </div>


                  {/* Projects Delivered */}
                  <div className="flex h-[120px] flex-col items-start justify-start rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-slate-900 to-slate-950 p-4 text-left shadow-[0_0_25px_rgba(168,85,247,0.12)] transition-transform duration-300 hover:-translate-y-1">
                    <h3 className="h-[36px] w-full text-[15px] font-black leading-[1.2] text-violet-300 break-words">
                      Multiple
                    </h3>

                    <p className="mt-2 w-full text-[10px] font-medium uppercase tracking-[2px] leading-4 text-violet-100/80">
                      Projects Delivered
                    </p>
                  </div>

                </div>
                <ShinyText
                  text="Working with heart, testing with mind, and creating with soul and delivering with exceptional quality."
                  disabled={false}
                  speed={3}
                  className="text-sm md:text-base text-violet-700"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="basis-full md:basis-5/12 pl-0 md:pl-8 max-w-full flex justify-center items-center self-stretch overflow-visible">
              <Lanyard position={[0, 0, 30]} gravity={[0, -40, 0]} />
            </div>
          </div>

        </div>
        <div className="tools mt-32" id="tools">
          <h1 className="text-4xl/snug font-bold mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true" >Tools & Technologies</h1>
          <p className="w-2/5 text-base/loose opacity-50" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-once="true">My Profesional Skills</p>
          <div className="tools-box mt-14 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">

            {listTools.map((tool) => (
              <div
                key={tool.id} data-aos="fade-up" data-aos-duration="1000" data-aos-delay={tool.dad} data-aos-once="true"
                className="flex items-center gap-4 p-4 border border-zinc-700 rounded-xl bg-zinc-900/60 backdrop-blur-md hover:bg-zinc-800/80 transition-all duration-300 group shadow-lg"
              >
                <img
                  src={tool.image}
                  alt="Tools Image"
                  className="w-16 h-16 object-contain bg-zinc-800 p-2 rounded-lg group-hover:bg-zinc-900 transition-all duration-300"
                />
                <div className="flex flex-col overflow-hidden">
                  <div className="truncate">
                    <ShinyText
                      text={tool.name}
                      disabled={false}
                      speed={3}
                      className="text-lg font-semibold block"
                    />
                  </div>
                  <p className="text-sm text-zinc-400 truncate">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* About Me */}

        {/* Projects */}
        <div className="projects mt-32 py-10" id="project" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true"></div>
        <h1 className="text-center text-4xl font-bold mb-2" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">Projects</h1>
        <p className="text-base/loose text-center opacity-50" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-once="true">A selection of QA projects showcasing functional validation, regression coverage, release readiness, and a user-first quality mindset.</p>
        <div className="projects-box mt-14" >

          <div style={{ height: 'auto', position: 'relative' }} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-aos-once="true" >
            <ChromaGrid
              items={listProjects}
              onItemClick={handleProjectClick} // Send the click handler function
              radius={500}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </div>
        </div>
        {/* Projects */}


        {/* Contact */}
        <div className="contact mt-32 sm:p-10 p-0" id="contact">
          <h1
            className="text-4xl mb-2 font-bold text-center"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            Contact & Chat
          </h1>
          <p
            className="text-base/loose text-center mb-10 opacity-50"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="300"
            data-aos-once="true"
          >
            Get in touch with me or chat in real-time
          </p>

          {/* Two-column container */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Chat room on the left */}
            <div className="flex-1 bg-zinc-800 p-6 rounded-md" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-aos-once="true">
              <ChatRoom />
            </div>

            {/* Contact form on the right */}
            <div className="flex-1">
              <form
                onSubmit={handleContactSubmit}
                className="bg-zinc-800 p-10 w-full rounded-md"
                autoComplete="off"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="500"
                data-aos-once="true"
              >
                {contactStatus.type !== "idle" && (
                  <div
                    className={`mb-6 rounded-xl border p-4 ${
                      contactStatus.type === "success"
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                        : contactStatus.type === "error"
                          ? "border-rose-500/50 bg-rose-500/10 text-rose-200"
                          : "border-cyan-500/40 bg-cyan-500/10 text-cyan-100"
                    }`}
                    role={contactStatus.type === "error" ? "alert" : "status"}
                    aria-live="polite"
                  >
                    <p className="font-semibold mb-1">
                      {contactStatus.type === "success"
                        ? "Message sent successfully!"
                        : contactStatus.type === "error"
                          ? "We couldn’t send your message"
                          : "Sending your message…"}
                    </p>
                    <p className="text-sm leading-relaxed">{contactStatus.message}</p>
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="font-semibold">Full Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      className="border border-zinc-500 bg-zinc-900/50 p-3 rounded-md focus:outline-none focus:border-cyan-400 transition-colors"
                      autoComplete="name"
                      maxLength={120}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="font-semibold">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="border border-zinc-500 bg-zinc-900/50 p-3 rounded-md focus:outline-none focus:border-cyan-400 transition-colors"
                      autoComplete="email"
                      maxLength={254}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-subject" className="font-semibold">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      placeholder="What would you like to discuss?"
                      className="border border-zinc-500 bg-zinc-900/50 p-3 rounded-md focus:outline-none focus:border-cyan-400 transition-colors"
                      maxLength={180}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="font-semibold">Message</label>
                    <textarea
                      name="message"
                      id="message"
                      cols="45"
                      rows="7"
                      placeholder="Tell me a little about your enquiry…"
                      className="border border-zinc-500 bg-zinc-900/50 p-3 rounded-md focus:outline-none focus:border-cyan-400 transition-colors resize-y"
                      maxLength={5000}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    name="_honey"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isContactSubmitting}
                      className="font-semibold bg-[#1a1a1a] p-4 px-6 rounded-full w-full cursor-pointer border border-gray-700 hover:bg-[#222] hover:border-cyan-500/60 transition-colors disabled:opacity-60 disabled:cursor-wait"
                    >
                      <ShinyText
                        text={isContactSubmitting ? "Sending…" : "Send Message"}
                        disabled={isContactSubmitting}
                        speed={3}
                        className="custom-class"
                      />
                    </button>
                    <p className="mt-4 text-xs text-zinc-400">
                      Your details are used only to respond to this enquiry.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Contact */}
      </main>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
        onNavigate={(sectionId) => {
          const nextHash = `#${sectionId}`;
          window.history.pushState(
            { ...(window.history.state || {}), portfolioSection: sectionId },
            "",
            `${window.location.pathname}${window.location.search}${nextHash}`
          );
          setSelectedProject(null);
          document.body.style.overflow = "auto";
          window.requestAnimationFrame(() => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }}
        project={selectedProject}
      />
    </>
  )
}

export default App
