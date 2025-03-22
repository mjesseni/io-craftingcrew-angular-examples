import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {use} from 'echarts/core';
import {CanvasRenderer} from "echarts/renderers";
import {GridComponent, TitleComponent, TooltipComponent} from "echarts/components";
import {PieChart} from "echarts/charts";

use(CanvasRenderer);
use([TitleComponent, GridComponent, TooltipComponent, PieChart]);
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
