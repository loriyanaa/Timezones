import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'timezones';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly renderer: Renderer2
  ) { }

  public ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'timezones-theme-default');
  }
}
