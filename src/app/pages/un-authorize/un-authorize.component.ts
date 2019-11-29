import { Component, OnInit } from '@angular/core';
import { GlobalState } from '../../global.state';

@Component({
  selector: 'app-un-authorize',
  templateUrl: './un-authorize.component.html',
  styleUrls: ['./un-authorize.component.scss']
})
export class UnAuthorizeComponent implements OnInit {

  constructor(public globalState: GlobalState) {
    console.log('in un-auhtorize component');
   }

  ngOnInit() {
    this.globalState.showSidebar = false;
  }

}
