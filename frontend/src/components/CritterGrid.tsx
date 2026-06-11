import "./../Styles/CritterGrid.css"
import { type Critter } from "../types/Critter.ts"
import CritterCard from "./CritterCard.tsx"

function CritterGrid({ 
    critters, 
    caughtCritters, 
    onToggleCaught}: {critters: Critter[], caughtCritters: Set<number>, onToggleCaught: (id: number) => void} ) {
        return (
            <div className="critter-grid">
                {critters.map((c) => (
                    <CritterCard
                        key={c.id}
                        critter={c}
                        caught={caughtCritters.has(c.id)}
                        onToggleCaught={() => onToggleCaught(c.id)}
                    />
                ))}
            </div>
        )

}
export default CritterGrid;