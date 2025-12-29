import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMatchesComponent } from './group-matches.component';

describe('GroupMatchesComponent', () => {
  let component: GroupMatchesComponent;
  let fixture: ComponentFixture<GroupMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMatchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
