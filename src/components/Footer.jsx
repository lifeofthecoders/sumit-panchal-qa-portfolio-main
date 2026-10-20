import "remixicon/fonts/remixicon.css";
import Dock from "./Dock/Dock";
import { VscHome, VscArchive, VscAccount, VscTools } from "react-icons/vsc";
import { FaQuora } from "react-icons/fa";

const Footer = ({ onNavigate }) => {

  const goToSection = (sectionId) => {
    if (onNavigate) {
      onNavigate(sectionId);
      return;
    }

    const nextHash = `#${sectionId}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState({ ...(window.history.state || {}), portfolioSection: sectionId }, "", nextHash);
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const items = [
    { icon: <VscHome size={24} />, label: "Home", onClick: () => goToSection("home") },
    { icon: <VscAccount size={24} />, label: "About", onClick: () => goToSection("about") },
    { icon: <VscTools size={24} />, label: "Tools", onClick: () => goToSection("tools") },
    { icon: <VscArchive size={24} />, label: "Projects", onClick: () => goToSection("projects") },
  ];

  const socialLinkClass = "flex h-8 w-8 items-center justify-center rounded-full text-zinc-100 transition-colors hover:text-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400";



  return (
    <>
    <footer className="relative z-10 mt-32 w-full pb-8">
      <div className="grid w-full grid-cols-1 items-center gap-y-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end md:gap-x-5">
        <a href="#home" className="portfolio-brand flex items-center justify-self-center gap-2 md:justify-self-start" aria-label="Portfolio home">
          <img
            src="/assets/qa-robot.webp"
            alt=""
            aria-hidden="true"
            className="qa-robot-float h-10 w-10 shrink-0 object-contain"
          />
          <h1 className="text-2xl font-bold">Portfolio</h1>
        </a>

        <p className="max-w-full justify-self-center text-center font-mono text-sm leading-relaxed tracking-wide text-zinc-300 sm:text-base md:whitespace-nowrap md:text-sm xl:text-base">
          📡 ... ..- -- .. - / .--. .- -. -.-. .... .- .-.. 🛰️
        </p>

        <div className="flex min-w-0 flex-col items-center gap-4 md:items-end md:justify-self-end">
          <div className="footer-dock-container max-w-full">
            <Dock
              items={items}
              panelHeight={35}
              baseItemSize={60}
              magnification={100}
              distance={160}
            />
          </div>

          <nav aria-label="Social media" className="flex max-w-full flex-wrap items-center justify-center gap-2 sm:gap-3 md:justify-end">
            <a href="https://github.com/lifeofthecoders" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={socialLinkClass}>
              <i className="ri-github-fill text-2xl" />
            </a>
            <a href="https://www.linkedin.com/in/sumit-panchal-b790a8236/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={socialLinkClass}>
              <i className="ri-linkedin-fill text-2xl" />
            </a>
            <a href="https://www.instagram.com/workhard2livelarge?igsh=MmM0YmZvNHc0bDZ2" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialLinkClass}>
              <i className="ri-instagram-fill text-2xl" />
            </a>
            <a href="https://www.facebook.com/share/1BxMxaQsV8/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={socialLinkClass}>
              <i className="ri-facebook-fill text-2xl" />
            </a>
            <a href="https://www.quora.com/profile/Sumit-Panchal-345" target="_blank" rel="noopener noreferrer" aria-label="Quora" className={socialLinkClass}>
              <FaQuora size={23} />
            </a>
            <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={socialLinkClass}>
              <i className="ri-youtube-fill text-2xl" />
            </a>
          </nav>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
