export interface TimeWindow {
  start: number;
  end: number;
  label: string;
}

export interface TimesByMonth {
  [month: string]: TimeWindow | null;
}

export interface Critter {
  id: number;
  name: string;
  location: string;
  sell_nook: number;
  image_url: string;
  render_url: string;
  northern: { times_by_month: TimesByMonth };
  shadow_size?: string;
  sell_cj?: number;
  sell_flick?: number;
}