import { Component, OnInit } from '@angular/core';
import {Document} from "../model/document";
import {DocumentVersion} from "../model/document-version";
import {ActivatedRoute, Router} from "@angular/router";
import {DocumentService} from "../service/document.service";
import {DocumentVersionService} from "../service/document-version.service";
import {AuthenticationService} from "../service/authentication.service";

@Component({
  selector: 'app-document-version-form',
  templateUrl: './document-version-form.component.html',
  styleUrls: ['./document-version-form.component.scss']
})
export class DocumentVersionFormComponent implements OnInit {

  document: Document;
  documentVersion: DocumentVersion;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private documentService: DocumentService,
              private documentVersionService: DocumentVersionService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.documentVersion = new DocumentVersion();

    this.route.params.subscribe(params => {
      let documentId = params['id'];
      this.documentService.findById(documentId).subscribe(document => {
        this.document = document;

//        if (document.owner != this.authenticationService.currentUserValue) {
//          //TODO error message
//          this.router.navigate(['/documents']);
//        }
        this.documentVersion.document = document;
        this.documentVersion.version = document.versions.length + 1;
        });
    });


  }

  onSubmit() {
    this.documentVersionService.save(this.documentVersion).subscribe(result =>
      this.gotoDocumentList()
    );
  }

  gotoDocumentList() {
    this.router.navigate(['/documents']);
  }

}
