import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentVersionFileComponent } from './document-version-file.component';

describe('DocumentVersionFileComponent', () => {
  let component: DocumentVersionFileComponent;
  let fixture: ComponentFixture<DocumentVersionFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentVersionFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentVersionFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
