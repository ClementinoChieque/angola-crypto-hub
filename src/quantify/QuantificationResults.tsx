
import React from 'react';

interface QuantificationResultsProps {
  results: string[];
}

const QuantificationResults: React.FC<QuantificationResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-3 md:mt-6">
      <h3 className="text-xs md:text-sm font-medium mb-1 md:mb-2">Últimos Ganhos</h3>
      <div className="bg-muted rounded-md p-2 md:p-4">
        <ul className="space-y-1 md:space-y-2">
          {results.map((result, index) => (
            <li key={index} className="text-xs md:text-sm text-green-700 font-medium">
              {result}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuantificationResults;
