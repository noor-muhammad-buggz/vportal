import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryManagerComponent } from './library-manager.component';
import { routing } from './library-manager.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    routing,
    SharedModule
  ],
  declarations: [LibraryManagerComponent]
})
export class LibraryManagerModule { }
