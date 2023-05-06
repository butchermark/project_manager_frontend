import { createContext, useState } from "react";
import { IContextData } from "../interface/IContextData.interface";

const ProjectManagerContext = createContext({} as IContextData);

export const ProjectManagerProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [username, setUsername] = useState("");

  return (
    <ProjectManagerContext.Provider
      value={{
        accessToken,
        setAccessToken,
        loading,
        setLoading,
        username,
        setUsername,
      }}
    >
      {children}
    </ProjectManagerContext.Provider>
  );
};
export default ProjectManagerContext;
