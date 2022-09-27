import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-info-container',
  templateUrl: './page-info-container.component.html',
  styleUrls: ['./page-info-container.component.scss']
})
export class PageInfoContainerComponent implements OnInit {
  public message: string;

  constructor(private route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.message = this.route.snapshot.data['message'];
  }
}
