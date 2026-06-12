import "./../styles/CritterInfo.css"
import { type Critter } from "../types/Critter.ts";
import { isAvailableNow } from "../tools/Availability.ts";

function CritterInfo({ critter, hemisphere, caught, onToggleCaught }: {
    critter: Critter | null | undefined;
    hemisphere: "northern" | "southern";
    caught: boolean;
    onToggleCaught: () => void;
}) {
    return (
        <div className="critter-info">
            {critter ? (
                <>
                    <img src={critter.render_url} alt={critter.name} className="critter-info-image" />
                    <span className="critter-info-name">{critter.name}</span>
                    <div className="info-row">
                        <span className="info-label">Nook</span>
                        <span className="info-value">{critter.sell_nook} 🛎️</span>
                    </div>
                    {critter.sell_cj && (
                        <div className="info-row">
                            <span className="info-label">CJ</span>
                            <span className="info-value">{critter.sell_cj} 💰</span>
                        </div>
                    )}
                    <div className="info-row">
                        <span className="info-label">Location</span>
                        <span className="info-value">{critter.location}</span>
                    </div>
                    {critter[hemisphere] && (
                        <div className="info-row">
                            <span className="info-label">Time</span>
                            <span className="info-value">
                                {isAvailableNow(critter[hemisphere]!.times_by_month)
                                    ? critter[hemisphere]!.times_by_month[(new Date().getMonth() + 1).toString()]!.label
                                    : "Not available"}
                            </span>
                        </div>
                    )}
                    <button
                        className={"catch-button" + (caught ? " caught" : "")}
                        onClick={onToggleCaught}
                    >
                        {caught ? "Caught ✓" : "Mark as Caught"}
                    </button>
                </>
            ) : (
                <p className="critter-info-empty">Select a critter to view details.</p>
            )}
        </div>
    );
}

export default CritterInfo;
