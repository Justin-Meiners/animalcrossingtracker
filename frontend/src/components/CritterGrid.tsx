import "./../Styles/CritterGrid.css"
import { type Critter } from "../types/Critter.ts"
import CritterCard from "./CritterCard.tsx"

function CritterGrid({ 
    critters, 
    caughtCritters, 
    selected,
    onToggleSelect}: {critters: Critter[], caughtCritters: Set<number>, selected: number, onToggleSelect: (id: number) => void} ) {
        return (
            <div className="critter-grid">
                {critters.map((c) => (
                    <CritterCard
                        key={c.id}
                        critter={c}
                        caught={caughtCritters.has(c.id)}
                        selected={selected === c.id}
                        onToggleSelect={() => onToggleSelect(c.id)}
                    />
                ))}
            </div>
        )

}
export default CritterGrid;