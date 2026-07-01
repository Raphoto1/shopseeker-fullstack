import { useState } from "react";
import SkillProject from "./SkillProject";

export default function SkillGeneralProjects(projects) {
  //items title: string;
  // description: string;
  // image: string;
  // link1: string;
  // link1Title: string;
  // link2: string;
  // link2Title: string;
  const [projectsList, setProjectsList] = useState(projects.projects);
  console.log(projectsList);
  return (
    <div>
      <div className='carousel carousel-vertical rounded-box h-96 gap-4'>
        {projectsList.map((project, index) => (
          <div key={index} className='carousel-item h-5/6'>
            <SkillProject
              title={project.title}
              description={project.description}
              image={project.image}
              link1={project.link1}
              link1Title={project.link1Title}
              link2={project.link2}
              link2Title={project.link2Title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
