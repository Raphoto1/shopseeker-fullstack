import React from "react";
import TabsSkills from "../shared/TabsSkills";
import SkillGeneralDescription from "../Skillsets/SkillGeneralDescription";
import SkillSkillsList from "../Skillsets/SkillSkillsList";
import SkillGeneralProjects  from "../Skillsets/SkillGeneralProjects";
import { skills, skillsCreative, skillsDev, skillsGeneral, skillsVfx } from "@/staticData/skillset";
import {projectsGeneralList, projectsArtsList, projectsDevList, projectsVfxList} from "@/staticData/projects";

export default function Hello() {
  return (
    <div className='w-full px-4'>
      <h2 className='text-5xl font-bold text-center my-8'>Hi I'm Rafa</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 transition-all'>
        <div className='bg-gray-100 p-4 rounded-lg flex flex-col justify-center h-full items-center transition-all'>
          <h3 className='text-3xl font-semibold text-center'>Bio</h3>
          <p>
            Professional Visual Artist far interested in cross-bounds between tech, creativity and marketing with Wide experience in creation, planning and
            execution of digital and interactive products for high scale projects in broadcast, live-shows, education and marketing (direction, execution, team
            leadership and budged projections). Developing new skills on web and software development. Commited to be envolved in great team work enviroment
            focused in goals. Open to relocate.
          </p>
        </div>
        <div className='bg-gray-100 p-4 rounded-lg flex flex-col justify-center min-h-full items-center transition-all'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full'>
            <TabsSkills
              Title={skills[0].name}
              GeneralContent={<SkillGeneralDescription title={skills[0].name} description={skills[0].description} />}
              SkillsContent={<SkillSkillsList skills={skillsCreative} />}
              ProjectsContent={<SkillGeneralProjects projects={projectsArtsList} />}
              useId={1}
              activeBg='bg-blue-500' // Color de fondo para la pestaña activa
              inactiveBg='bg-gray-300' // Color de fondo para las pestañas inactivas
            />
            <TabsSkills
              Title={skills[1].name}
              GeneralContent={<SkillGeneralDescription title={skills[1].name} description={skills[1].description} />}
              SkillsContent={<SkillSkillsList skills={skillsDev} />}
              ProjectsContent={<SkillGeneralProjects projects={projectsDevList} />}
              useId={2}
              activeBg='bg-yellow-500' // Color de fondo para la pestaña activa
              inactiveBg='bg-gray-300' // Color de fondo para las pestañas inactivas
            />
            <TabsSkills
              Title={skills[2].name}
              GeneralContent={<SkillGeneralDescription title={skills[2].name} description={skills[2].description} />}
              SkillsContent={<SkillSkillsList skills={skillsVfx} />}
              ProjectsContent={<SkillGeneralProjects projects={projectsVfxList} />}
              useId={3}
              activeBg='bg-pink-500' // Color de fondo para la pestaña activa
              inactiveBg='bg-gray-300' // Color de fondo para las pestañas inactivas
            />
            <TabsSkills
              Title={skills[3].name}
              GeneralContent={<SkillGeneralDescription title={skills[3].name} description={skills[3].description} />}
              SkillsContent={<SkillSkillsList skills={skillsGeneral} />}
              ProjectsContent={<SkillGeneralProjects projects={projectsGeneralList} />}
              useId={4}
              activeBg='bg-green-600' // Color de fondo para la pestaña activa
              inactiveBg='bg-gray-300' // Color de fondo para las pestañas inactivas
            />
          </div>
        </div>
      </div>
    </div>
  );
}
