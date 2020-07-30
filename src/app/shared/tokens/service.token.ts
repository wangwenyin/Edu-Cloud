import { InjectionToken } from '@angular/core';
import {ThsBaseService } from "@shared/components/thsBaseService";
export const ServiceToken = new InjectionToken<ThsBaseService<any>>('');
