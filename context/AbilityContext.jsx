"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createMongoAbility } from "@casl/ability"; // Use the updated method
import { defineAbilitiesFor } from "@/lib/ability";
import { useSession } from "next-auth/react";

// Create the context for Ability
const AbilityContext = createContext();

// AbilityProvider component to provide Ability instance to your application
export function AbilityProvider({ children }) {
  const { data: session, status } = useSession();

  // Use createMongoAbility instead of new Ability()
  const [ability, setAbility] = useState(createMongoAbility([]));

  useEffect(() => {
    if (session?.user) {
      const userAbility = defineAbilitiesFor(session.user);
      setAbility(userAbility); // Update the ability when user changes
    } else {
      setAbility(createMongoAbility([])); // Reset ability when there's no user
    }
  }, [session]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

// Custom hook to use Ability in components
export const useAbility = () => useContext(AbilityContext);
