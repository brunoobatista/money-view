import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,

    PanelModule,
    ChartModule,

    SharedModule,
    DashboardRoutingModule
  ],
  providers: [
   DecimalPipe
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
