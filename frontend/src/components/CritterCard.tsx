import "./../styles/CritterCard.css"
import { isAvailableNow } from '../tools/Availability.ts';
import { type Critter } from '../types/Critter.ts';
function CritterCard( { critter, caught, selected, onToggleSelect }: { critter: Critter, caught: boolean, selected: boolean, onToggleSelect: () => void } ) {
    const available = isAvailableNow(critter.northern.times_by_month);

    return (
        <div className={"critter-card" + (selected ? " selected" : (caught ? " caught" : "") + (!available ? " unavailable" : ""))} onClick={onToggleSelect}>
            { available &&  (<div className="available-dot" /> )}

            <img src={critter.image_url} alt={critter.name} className="critter-image" />
            <span className="critter-name">{critter.name}</span>
            <span className="critter-price">{critter.sell_nook}🛎️</span>
        </div>
    )
}

export default CritterCard;