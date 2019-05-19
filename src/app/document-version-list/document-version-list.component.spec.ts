import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentVersionListComponent } from './document-version-list.component';

describe('DocumentVersionListComponent', () => {
  let component: DocumentVersionListComponent;
  let fixture: ComponentFixture<DocumentVersionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentVersionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentVersionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
