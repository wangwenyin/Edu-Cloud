import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { setUpTestBed } from '@testing/common.spec';

import { LayoutCommonComponent } from './common.component';

describe('Layout', () => {
  setUpTestBed(<TestModuleMetadata>{
    declarations: [LayoutCommonComponent],
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(LayoutCommonComponent);
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeTruthy();
  });
});
