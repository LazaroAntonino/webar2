import React, { useState } from "react";
import "./SectionNavbar.css";
import { List } from "phosphor-react";

export const SectionNavbar = ({ sections, activeSection, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (key) => {
    onSelect(key);
    setIsOpen(false);
  };

  return (
    <nav className="section-navbar">
      <div className="section-navbar__inner">
        <button
          type="button"
          className="section-navbar__toggle"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <List size={22} weight="bold" />
          <span>Secnes</span>
        </button>

        <ul className={"section-navbar__list " + (isOpen ? "is-open" : "")}> 
          {sections.map((section) => (
            <li key={section.key}>
              <button
                className={
                  "section-tab " + (activeSection === section.key ? "is-active" : "")
                }
                onClick={() => handleSelect(section.key)}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
