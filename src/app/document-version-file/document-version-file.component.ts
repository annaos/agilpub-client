import { Component, OnInit } from '@angular/core';
import {Document} from "../model/document";
import {DocumentVersion} from "../model/document-version";
import {DocumentVersionService} from "../service/document-version.service";
import {DocumentService} from "../service/document.service";
import {AuthenticationService} from "../service/authentication.service";
import {ActivatedRoute} from "@angular/router";
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-document-version-file',
  templateUrl: './document-version-file.component.html',
  styleUrls: ['./document-version-file.component.scss']
})
export class DocumentVersionFileComponent implements OnInit {

  version: DocumentVersion;
  file: Object;
  fileURL: String;

  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;

  constructor(private documentVersionService: DocumentVersionService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let documentVersionId = params['id'];
      this.documentVersionService.findById(documentVersionId).subscribe(version => {
        this.version = version;
        this.documentVersionService.getFile(version).subscribe(data => {
          this.file = new Blob([data.body], {type: 'application/pdf'});
          this.fileURL = URL.createObjectURL(this.file);

        });
      });
    });
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  addScore() {
    console.log('add score');
  }

  download() {
    fileSaver.saveAs(this.file, this.version.document.name);
  }

}
