import React, { ReactNode } from "react";

interface ContainerAdminProps {
  children: ReactNode;
}

const ContainerAdmin: React.FC<ContainerAdminProps> = ({ children }) => {
  return (
    <>
      <div className="h-full min-h-screen">{children}</div>
    </>
  );
};

export default ContainerAdmin;
