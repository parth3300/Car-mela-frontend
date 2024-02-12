// About.jsx

import React from 'react';

const About = () => {
  const containerStyle = {
    textAlign: 'center',
    margin: '20px',
  };

  const featuresStyle = {
    marginTop: '20px',
  };

  const teamMemberStyle = {
    display: 'inline-block',
    margin: '10px',
    maxWidth: '200px',
  };

  return (
    <div style={containerStyle}>
      <h2>About Our Car Project</h2>
      <p>
        Welcome to our car project! Here, we strive to provide the best information and reviews about various cars in the market.
      </p>

      <div style={featuresStyle}>
        <h3>Key Features</h3>
        <ul>
          <li>Comprehensive car reviews</li>
          <li>User ratings and feedback</li>
          <li>Explore a wide range of car models</li>
        </ul>
      </div>

      <div style={featuresStyle}>
        <h3>Meet the Team</h3>
        <div style={teamMemberStyle}>
          <img className=' w-[100px] h-[100px] rounded-[50%] object-cover '  src="images/team-member-1.jpeg" alt="Team Member 1" />
          <p>Parth Singal</p>
          <p>Frontend Developer</p>
        </div>

        <div style={teamMemberStyle}>
          <img className=' w-[100px] h-[100px] rounded-[50%] object-cover' src="images/team-member-2.jpg" alt="Team Member 2" />
          <p>Nrushank Bodar</p>
          <p>Backend Developer</p>
        </div>
      </div>
    </div>
  );
}

export default About;
