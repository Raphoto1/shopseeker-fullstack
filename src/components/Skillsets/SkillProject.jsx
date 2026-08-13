import React from "react";

export default function SkillProject(props) {
  return (
    <div className='card bg-base-100 image-full w-fit shadow-xl'>
      <figure>
        <img src={props.image} alt={props.title} />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{props.title}</h2>
        <p>{props.description}</p>
        <div className='card-actions justify-end'>
          {props.link1Title !== "null" ? (
            <a href={props.link1} className='btn btn-primary' target='_blank' rel='noopener noreferrer'>
              {props.link1Title}
            </a>
          ) : null}
          {props.link2Title !== "null" ? (
            <a href={props.link2} className='btn btn-secondary' target='_blank' rel='noopener noreferrer'>
              {props.link2Title}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
