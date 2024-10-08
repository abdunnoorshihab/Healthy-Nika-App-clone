import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BottomNavModule } from './../../shared/components/bottom-nav/bottom-nav.module';
import { IonicModule } from '@ionic/angular';
import { SearchPageRoutingModule } from './search-routing.module';
import { SearchMainComponent } from './search-main/search-main.component';
import { SearchPage } from './search.page';
import {ProfileListPartCardModule} from "../../shared/components/profile-list-part-card/profile-list-part-card.module";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SearchPageRoutingModule,
        ReactiveFormsModule,
        BottomNavModule,
        ProfileListPartCardModule,
    ],
  declarations: [SearchPage, SearchMainComponent]
})
export class SearchPageModule {
}
