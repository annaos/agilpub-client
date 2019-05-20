import { Component, OnInit } from '@angular/core';
import {DocumentService} from "../service/document.service";
import {AuthenticationService} from "../service/authentication.service";
import {DocumentVersionService} from "../service/document-version.service";
import {Document} from "../model/document";
import {DocumentVersion} from "../model/document-version";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-document-version-list',
  templateUrl: './document-version-list.component.html',
  styleUrls: ['./document-version-list.component.scss']
})
export class DocumentVersionListComponent implements OnInit {

  document: Document;
  versions: DocumentVersion[];

  constructor(private documentVersionService: DocumentVersionService,
              private documentService: DocumentService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let documentId = params['id']; // (+) converts string 'id' to a number
      this.documentService.findById(documentId).subscribe(document => {
        this.document = document;
        this.documentVersionService.findByDocument(document).subscribe(data => {
          this.versions = data;
        })});
    });

  }

}
