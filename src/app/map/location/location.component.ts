import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GameService } from '../../shared/game.service';
import ICity from '../../utils/ICity.interface';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent implements OnInit {

  locationId!: number;
  location!: ICity;

  constructor(private router: Router, private route: ActivatedRoute, public gameService: GameService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(qp => {
      this.locationId = qp['id'];
      console.log(this.gameService);
      console.log(this.locationId);
      this.location = this.gameService.cities.find(c => c.id == this.locationId)!;
      console.log(this.location);
    });

  }

  handleGoBack() {
    this.gameService.advanceDay();
    this.router.navigate(['map']);
  }

}
