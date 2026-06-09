import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useScrollSpy } from '@/hooks/useScrollSpy';

interface Section {
  id: string;
  label: string;
}

interface SecondaryNavProps {
  sections: Section[];
}

export function SecondaryNav({ sections }: SecondaryNavProps) {
  const activeId = useScrollSpy(sections.map((s) => s.id));

  return (
    <nav className="hidden lg:block w-full">
      {/* Removed the background and border to let it breathe. 
          The padding and gap are increased for a "premium" spatial feel. 
      */}
      <div className="flex flex-col gap-y-1 relative py-4">

        {/* Progress Bar Track - Centered behind the dots */}
        <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-slate-100" />

        {sections.map((section) => (
          <SectionItem
            key={section.id}
            section={section}
            isActive={activeId === section.id}
          />
        ))}
      </div>
    </nav>
  );
}

function SectionItem({ section, isActive }: { section: Section; isActive: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={`#${section.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative pl-8 py-4 text-[9px] tracking-[0.25em] uppercase transition-all duration-500 flex items-center group",
        isActive ? "text-emerald-900 font-black" : "text-slate-400 font-medium hover:text-slate-600"
      )}
      // Smooth subtle slide on hover for unselected items
      animate={{ x: isHovered && !isActive ? 4 : 0 }}
    >
      {/* Vertical Indicator Dot */}
      <div className="absolute left-0 flex items-center justify-center w-[7px]">
        {/* Background Dot (Static) */}
        <div className={cn(
          "w-1 h-1 rounded-full transition-all duration-500",
          isActive ? "bg-emerald-600 scale-150" : "bg-slate-200 group-hover:bg-slate-400"
        )} />

        {/* Active Glow/Ring */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="nav-dot-glow"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute w-4 h-4 rounded-full border border-emerald-200 bg-emerald-50/50 -z-10"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Label with staggered opacity */}
      <span className="relative z-10">
        {section.label}
        {isActive && (
          <motion.span
            layoutId="active-underline"
            className="absolute -bottom-1 left-0 right-0 h-[1px] bg-emerald-800/20"
          />
        )}
      </span>
    </motion.a>
  );
}