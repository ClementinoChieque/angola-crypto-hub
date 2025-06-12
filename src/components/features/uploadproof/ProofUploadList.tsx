
import React from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProofUpload {
  imageUrl: string;
  timestamp: Date;
  verified: boolean;
}

interface ProofUploadListProps {
  proofUploads: ProofUpload[];
}

const ProofUploadList: React.FC<ProofUploadListProps> = ({ proofUploads }) => {
  const isMobile = useIsMobile();
  
  if (proofUploads.length === 0) return null;

  return (
    <div className="mt-4 md:mt-6">
      <h3 className="text-xs md:text-sm font-medium mb-2">Comprovativos Enviados</h3>
      <div className="space-y-2">
        {proofUploads.map((upload, index) => (
          <Card key={index} className="p-2 md:p-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded bg-muted overflow-hidden mr-2 md:mr-3">
                <img src={upload.imageUrl} alt="Comprovativo" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium">
                  Comprovativo #{index + 1}
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  {isMobile 
                    ? new Date(upload.timestamp).toLocaleDateString() 
                    : new Date(upload.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${
              upload.verified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {upload.verified ? 'Verificado' : 'Pendente'}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProofUploadList;
