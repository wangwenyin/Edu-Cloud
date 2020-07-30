import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { setUpTestBed } from '@testing/common.spec';

import { LayoutPassportComponent } from './passport.component';

describe('Layout', () => {
  setUpTestBed(<TestModuleMetadata>{
    declarations: [LayoutPassportComponent],
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(LayoutPassportComponent);
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeTruthy();
  });
});
