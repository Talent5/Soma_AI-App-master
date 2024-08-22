const fs = require('fs');

for (let i = 1; i <= 27; i++) {
  const componentName = `Onboarding${i}`;
  const content = `
import React from 'react';
import './Onboarding.css'; 

const ${componentName} = () => {
  return (
    <div className="onboarding-container">
      {/* Content for Onboarding Screen ${i} */}
    </div>
  );
};

export default ${componentName};
`;

  fs.writeFileSync(`src/components/Onboarding/${componentName}.js`, content);
  console.log(`Created ${componentName}.js`);
}