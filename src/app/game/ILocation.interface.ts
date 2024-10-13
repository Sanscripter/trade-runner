import { Inventory } from "./Inventory";

export default interface ILocation {
  id: number;
  x: number;
  y:number;
  name: string;
  size: number;
  inventory?: Inventory | any;
  money?: number;
  health?: number;
  traderMugshot?: string;
  background?: string;
  description?: string;
  barks?: string[];
  distance?: number; //distaqnce in travel days
  mobile?: boolean;
  speed?: number;
}
