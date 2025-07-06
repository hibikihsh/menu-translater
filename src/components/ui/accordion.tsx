"use client";

import { useState, useRef, useEffect } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function Accordion({
  title,
  children,
  className = "",
  defaultOpen = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`bg-white backdrop-blur-sm rounded-lg border border-white/20 shadow-sm overflow-hidden w-full sm:w-[400px] mx-auto ${className}`}
    >
      <button
        onClick={toggleAccordion}
        className="flex items-center justify-between px-4 py-2 cursor-pointer text-left w-full sm:w-[400px] mx-auto"
      >
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        <span
          className={`transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out w-full sm:w-[400px] mx-auto ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{
          maxHeight: isOpen ? `${height}px` : "0px",
        }}
      >
        <div
          ref={contentRef}
          className="px-4 pb-4 bg-white rounded-b backdrop-blur-sm border-t border-white/20"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
