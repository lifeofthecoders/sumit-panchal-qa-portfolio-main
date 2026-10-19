import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import Footer from '../Footer';

const ProjectModal = ({ isOpen, onClose, onNavigate, project }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const detailItems = [
    { label: 'Domain', value: project.domain },
    { label: 'Platform', value: project.platform },
    { label: 'Role', value: project.role },
  ].filter((item) => item.value);

  return createPortal((
    <div className="project-details-overlay fixed inset-0 z-50 h-screen w-screen overflow-y-auto bg-zinc-900 transition-opacity duration-300">
      <div
        className={`min-h-screen w-full bg-zinc-900 transform transition-transform duration-300 ${isClosing ? 'animate-out' : 'animate-in'}`}
      >
        <div className="project-banner-frame w-full max-w-none overflow-hidden bg-transparent">
          <img
            src={project.bannerImage || project.image}
            alt={`${project.title} project banner`}
            className="project-banner-image block h-auto w-full max-w-none object-contain"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-6 md:px-10 md:py-8 lg:px-12">
          <div className="flex items-start gap-4">
            <button
              onClick={handleClose}
              aria-label="Back to projects"
              className="shrink-0 text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-700 -ml-2 -mt-2"
            >
              <FiArrowLeft size={24} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300 mb-2">
                QA Project
              </p>
              <h2 className="text-2xl font-bold text-white leading-tight">
                {project.title}
              </h2>
            </div>
          </div>

          {detailItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detailItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-zinc-700 bg-zinc-800/60 p-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-zinc-100 leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          )}

          {project.overview && (
            <section>
              <h3 className="text-base font-semibold text-white mb-2">Overview</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">{project.overview}</p>
            </section>
          )}

          {project.detailImages?.length > 0 && (
            <section>
              <h3 className="text-base font-semibold text-white mb-3">Project Screens & Key Workflows</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {project.detailImages.map((image) => (
                  <figure key={image.src} className="min-w-0">
                    <div className="project-gallery-frame relative aspect-[8/5] overflow-hidden rounded-xl border border-zinc-700 bg-transparent">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className={`project-gallery-image absolute inset-0 block h-full w-full ${image.fit === "stretch" ? "object-fill" : image.fit === "contain" ? "object-contain" : "object-cover"}`}
                      />
                    </div>
                    <figcaption className="mt-2 text-xs leading-relaxed text-zinc-300">
                      {image.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {project.testingAreas?.length > 0 && (
            <section>
              <h3 className="text-base font-semibold text-white mb-3">Key Testing Areas</h3>
              <div className="flex flex-wrap gap-2">
                {project.testingAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-100"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </section>
          )}

          {project.responsibilities?.length > 0 && (
            <section>
              <h3 className="text-base font-semibold text-white mb-2">Responsibilities</h3>
              <ul className="space-y-2">
                {project.responsibilities.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-zinc-300">
                    <span className="text-violet-400" aria-hidden="true">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.achievements?.length > 0 && (
            <section>
              <h3 className="text-base font-semibold text-white mb-2">Key Achievements</h3>
              <ul className="space-y-2">
                {project.achievements.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-zinc-300">
                    <span className="text-emerald-400" aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <a
            href="https://github.com/lifeofthecoders"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center justify-center gap-2 font-semibold bg-violet-600 p-3 px-5 rounded-full w-full cursor-pointer border border-transparent hover:bg-violet-700 transition-colors"
          >
            <FiExternalLink />
            <span>Explore My GitHub</span>
          </a>
        </div>
        <div className="mx-auto w-full max-w-7xl px-6 pb-10 md:px-10 lg:px-12">
          <Footer
            onNavigate={(sectionId) => {
              if (isClosing) return;
              setIsClosing(true);
              window.setTimeout(() => {
                setIsClosing(false);
                onNavigate?.(sectionId);
              }, 300);
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        @keyframes scaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
        .animate-out {
          animation: scaleOut 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  ), document.body);
};

export default ProjectModal;
