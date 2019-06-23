import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../service/user.service";
import {User} from "../model/user";
import {DocumentService} from "../service/document.service";
import {Document} from "../model/document";
import {AuthenticationService} from "../service/authentication.service";
import {DocumentVersionService} from "../service/document-version.service";
import {DocumentVersion} from "../model/document-version";
import {FileUploader, FileItem} from 'ng2-file-upload';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  uploader: FileUploader;
  isDropOver: boolean;

  document: Document;
  documentVersion: DocumentVersion;
  fileItem: FileItem;

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
//    this.documentVersion.document = this.document; //TODO ERROR JSON parse error: No _valueDeserializer assigned

    const headers = [{name: 'Accept', value: 'application/json'}];
    this.uploader = new FileUploader({url: 'http://localhost:8080/api/files', headers: headers});

    this.uploader.onAfterAddingFile = (fileItem) => {
      fileItem.withCredentials = false;
      this.fileItem = fileItem;
      console.log(fileItem);
    };

  }

  onSubmit() {
    let name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.fileItem.file.name = name;
    this.documentVersion.filename = name;

    this.uploader.uploadItem(this.fileItem);
    this.uploader.uploadAll();
    this.documentService.save(this.document).subscribe(result => {
      this.documentVersionService.save(this.documentVersion).subscribe(result =>
        this.gotoDocumentList());
    });
  }

  fileOverAnother(e: any): void {
    this.isDropOver = e;
  }

  fileClicked() {
    this.fileInput.nativeElement.click();
  }

  gotoDocumentList() {
    this.router.navigate(['/documents']);
  }

}
