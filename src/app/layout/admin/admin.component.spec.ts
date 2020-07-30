import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { setUpTestBed } from '@testing/common.spec';

import { LayoutAdminComponent } from './admin.component';

describe('Layout', () => {
  setUpTestBed(<TestModuleMetadata>{
    declarations: [LayoutAdminComponent],
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(LayoutAdminComponent);
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeTruthy();
  });
});
