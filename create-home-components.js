const fs = require('fs');

const components = [
  'Home.js',
  'MatchedScholarships.js',
  'UpcomingDeadlines.js',
  'SavedScholarships.js',
  'ScholarshipCard.js',
];

components.forEach((componentName) => {
  const componentPath = `src/components/Home/${componentName}`;
  const content = `
import React from 'react';
import './Home.css'; // Assuming shared CSS for Home components

const ${componentName.replace('.js', '')} = () => {
  return (
    <div>
      {/* Content for ${componentName.replace('.js', '')} component */}
    </div>
  );
};

export default ${componentName.replace('.js', '')};
`;

  fs.writeFileSync(componentPath, content);
  console.log(`Created ${componentPath}`);
});

console.log('Home components created successfully!'); 