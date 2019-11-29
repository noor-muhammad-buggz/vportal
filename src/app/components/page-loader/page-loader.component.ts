import { Component, OnInit, Input } from '@angular/core';
import { CommonModule }  from '@angular/common';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss']
})
export class PageLoaderComponent implements OnInit {

  @Input() showOverlay: boolean;

  constructor() {
    this.showOverlay = false;
   }

  ngOnInit() {
  }

}
