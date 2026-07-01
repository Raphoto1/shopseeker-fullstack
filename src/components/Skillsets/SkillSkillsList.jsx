'use client';
import { useState } from "react";
import Image from "next/image";

export default function SkillSkillsList(skillsList) {
  const [skills, setSkills] = useState(skillsList.skills);
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
      {skills.map((skill, index) => (
        <Skill key={index} name={skill.name} strenght={skill.strenght} image={skill.image} />
      ))}
    </div>
  );
}

function Skill({ name, strenght, image }) {
  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='radial-progress text-slate-200 shadow-xl' style={{ "--value": strenght }} role='progressbar'>
        <img src={image} alt={name} className='w-12 h-12' />
      </div>
      <h4 className='text-center text-secondary-content'>{name}</h4>
    </div>
  );
}
