import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentVersionFormComponent } from './document-version-form.component';

describe('DocumentVersionFormComponent', () => {
  let component: DocumentVersionFormComponent;
  let fixture: ComponentFixture<DocumentVersionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentVersionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentVersionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
