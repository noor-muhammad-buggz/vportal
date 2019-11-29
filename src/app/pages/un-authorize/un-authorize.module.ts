import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { UnAuthorizeComponent } from "./un-authorize.component";
import { routing } from "./un-authorize.routing";

import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, routing, SharedModule],
  declarations: [UnAuthorizeComponent]
})
export class UnAuthorizeModule {}
