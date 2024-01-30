import { Inventory } from "../game/Inventory";

export default interface ICity {
  id: number;
  x: number;
  y:number;
  name: string;
  size: number;
  inventory?: Inventory;
  money?: number;
  health?: number;
}
