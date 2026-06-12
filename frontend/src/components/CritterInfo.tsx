import { type Critter } from "../types/Critter.ts";
import { isAvailableNow } from "../tools/Availability.ts";

function CritterInfo({ critter, hemisphere }: { critter: Critter; hemisphere: "northern" | "southern" }) {
    return (
        <div className="critter-info">
            <img src={critter.render_url} alt={critter.name} />
            <h2>{critter.name}</h2>
            <p>Nook Price: {critter.sell_nook}🛎️</p>
            <p>CJ Price: {critter.sell_cj}💰</p>
            <p>Location: {critter.location}</p>
            {isAvailableNow(critter[hemisphere].times_by_month) ? (
                <p>Time: {critter[hemisphere].times_by_month[(new Date().getMonth() + 1).toString()]!.label}</p>
            ) : (
                <p>Not available now.</p>
            )}
        </div>
    );
}