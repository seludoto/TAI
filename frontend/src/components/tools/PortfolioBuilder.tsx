'use client';

import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Award, Code, Download, Eye, Plus, Trash2, Edit } from 'lucide-react';

interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  technologies: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

interface Skill {
  name: string;
  level: number; // 1-5
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'soft';
}

export default function PortfolioBuilder() {
  const [activeSection, setActiveSection] = useState('personal');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  });
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  
  const [showPreview, setShowPreview] = useState(false);

  // Form states for adding/editing
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'skills', label: 'Skills', icon: Award },
  ];

  // Helper function to generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Personal Info handlers
  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  // Experience handlers
  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      technologies: []
    };
    setEditingExperience(newExperience);
  };

  const saveExperience = (exp: Experience) => {
    if (experiences.find(e => e.id === exp.id)) {
      setExperiences(prev => prev.map(e => e.id === exp.id ? exp : e));
    } else {
      setExperiences(prev => [...prev, exp]);
    }
    setEditingExperience(null);
  };

  const deleteExperience = (id: string) => {
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  // Similar handlers for education and projects...
  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setEditingEducation(newEducation);
  };

  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: '',
      description: '',
      technologies: []
    };
    setEditingProject(newProject);
  };

  // Add skill
  const addSkill = (skill: Skill) => {
    setSkills(prev => [...prev, skill]);
  };

  const removeSkill = (skillName: string) => {
    setSkills(prev => prev.filter(s => s.name !== skillName));
  };

  // Generate portfolio HTML
  const generatePortfolioHTML = () => {
    // This would generate a complete HTML portfolio
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Portfolio</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { border-bottom: 2px solid #333; padding-bottom: 10px; }
        .project, .experience { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #007acc; color: white; padding: 5px 10px; border-radius: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${personalInfo.fullName}</h1>
            <h2>${personalInfo.title}</h2>
            <p>${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}</p>
            <p>${personalInfo.summary}</p>
        </header>
        
        <section class="section">
            <h2>Experience</h2>
            ${experiences.map(exp => `
                <div class="experience">
                    <h3>${exp.position} at ${exp.company}</h3>
                    <p>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
                    <p>${exp.description}</p>
                    <div class="skills">
                        ${exp.technologies.map(tech => `<span class="skill">${tech}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        </section>
        
        <section class="section">
            <h2>Projects</h2>
            ${projects.map(project => `
                <div class="project">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <div class="skills">
                        ${project.technologies.map(tech => `<span class="skill">${tech}</span>`).join('')}
                    </div>
                    ${project.githubUrl ? `<p><a href="${project.githubUrl}">GitHub</a></p>` : ''}
                    ${project.liveUrl ? `<p><a href="${project.liveUrl}">Live Demo</a></p>` : ''}
                </div>
            `).join('')}
        </section>
        
        <section class="section">
            <h2>Skills</h2>
            <div class="skills">
                ${skills.map(skill => `<span class="skill">${skill.name}</span>`).join('')}
            </div>
        </section>
    </div>
</body>
</html>`;
  };

  const downloadPortfolio = () => {
    const html = generatePortfolioHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.fullName.replace(/\s+/g, '_')}_Portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={personalInfo.fullName}
          onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Professional Title"
          value={personalInfo.title}
          onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={personalInfo.email}
          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={personalInfo.phone}
          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Location"
          value={personalInfo.location}
          onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="url"
          placeholder="Website"
          value={personalInfo.website}
          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="url"
          placeholder="LinkedIn URL"
          value={personalInfo.linkedin}
          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="url"
          placeholder="GitHub URL"
          value={personalInfo.github}
          onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <textarea
        placeholder="Professional Summary"
        value={personalInfo.summary}
        onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>
      
      {experiences.map(exp => (
        <div key={exp.id} className="p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{exp.position}</h4>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </p>
              <p className="mt-2">{exp.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {exp.technologies.map(tech => (
                  <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingExperience(exp)}
                className="p-1 text-gray-600 hover:text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteExperience(exp.id)}
                className="p-1 text-gray-600 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h1 className="text-3xl font-bold">Portfolio Builder</h1>
          <p className="text-blue-100 mt-2">Create a professional developer portfolio</p>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 bg-gray-50 border-r border-gray-200">
            <nav className="p-4">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-md text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'Hide Preview' : 'Preview'}
                </button>
                <button
                  onClick={downloadPortfolio}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            {/* Content based on active section */}
            {activeSection === 'personal' && renderPersonalInfo()}
            {activeSection === 'experience' && renderExperience()}
            {/* Add other sections as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}