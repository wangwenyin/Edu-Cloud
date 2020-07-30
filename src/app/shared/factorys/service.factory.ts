import { ServiceToken } from '@shared/tokens/service.token';
import { Inject, Injectable } from '@angular/core';
import { ServiceEnum } from '@shared/enums/service.enum';
import {ThsBaseService } from "@shared/components/thsBaseService";
@Injectable()
export class ServiceFactory {
  constructor(@Inject(ServiceToken) private services: ThsBaseService<any>[]) {
  }

  createService(name: ServiceEnum): ThsBaseService<any> {
    return this.services.filter(item=>item.constructor.name===name)[0];
  }
}
