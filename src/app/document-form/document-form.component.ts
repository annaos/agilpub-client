import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../service/user.service";
import {User} from "../model/user";
import {DocumentService} from "../service/document.service";
import {Document} from "../model/document";
import {AuthenticationService} from "../service/authentication.service";
import {DocumentVersionService} from "../service/document-version.service";
import {DocumentVersion} from "../model/document-version";

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent implements OnInit {

  document: Document;
  documentVersion: DocumentVersion;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private documentService: DocumentService,
              private documentVersionService: DocumentVersionService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.document = new Document();
    this.document.owner = this.authenticationService.currentUserValue;
    this.documentVersion = new DocumentVersion();
    this.documentVersion.document = this.document;
  }

  onSubmit() {
    this.documentService.save(this.document).subscribe(result =>
      this.documentVersionService.save(this.documentVersion).subscribe(result =>
        this.gotoDocumentList())
    );
  }

  gotoDocumentList() {
    this.router.navigate(['/documents']);
  }

}
