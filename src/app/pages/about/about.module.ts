import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AboutComponent } from './about.component';
import { routing } from './about.routing';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        routing,
        SharedModule,
        InfiniteScrollModule
    ],
    declarations: [
        AboutComponent
    ]
})
export class AboutModule { }
