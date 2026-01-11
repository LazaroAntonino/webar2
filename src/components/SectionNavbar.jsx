import React from "react";
import "./SectionNavbar.css";

export const SectionNavbar = ({ sections, activeSection, onSelect }) => {
  return (
    <nav className="section-navbar">
      <ul>
        {sections.map((section) => (
          <li key={section.key}>
            <button
              className={
                "section-tab " + (activeSection === section.key ? "is-active" : "")
              }
              onClick={() => onSelect(section.key)}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
