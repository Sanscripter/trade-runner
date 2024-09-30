import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../shared/game.service';
import ICity from '../../utils/ICity.interface';
import { SoundService } from '../../shared/sound.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationComponent implements OnInit {

  locationId!: number;
  selectedOption: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute, public gameService: GameService, private cdr: ChangeDetectorRef, private soundService: SoundService) { }

  ngOnInit() {
    this.gameService.loadGame();
    this.route.queryParams.subscribe((qp: any) => {
      this.locationId = qp['id'];
    });
    this.trader = this.gameService.getCurrentLocalEconomy(this.trader);
    this.cdr.detectChanges();
  }

  get trader() {
    return this.gameService.cities.find(c => c.id == this.locationId)!;
  };

  set trader(trader: ICity) {
    this.gameService.cities = this.gameService.cities.map(c => c.id === trader.id ? trader : c);
  };

  selectOption(option: string|null) {
    this.selectedOption = option;
  }

  handleGoBack() {
    if (this.gameService.isGameOver()) {
      this.router.navigate(['end']);
      return;
    }
    this.router.navigate(['map']);
  }

}
