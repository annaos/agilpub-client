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
import {Tag} from "../model/tag";

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  uploader: FileUploader;
  isDropOver: boolean;

  documentVersion: DocumentVersion;
  fileItem: FileItem;
  originalName: String;
  tags: String;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private documentService: DocumentService,
              private documentVersionService: DocumentVersionService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.documentVersion = new DocumentVersion();
    this.documentVersion.document = new Document();
    this.documentVersion.document.owner = this.authenticationService.currentUserValue;

    const headers = [{name: 'Accept', value: 'application/json'}];
    this.uploader = new FileUploader({url: this.documentVersionService.getFileUploadUrl(), headers: headers});

    this.uploader.onAfterAddingFile = (fileItem) => {
      this.originalName = fileItem.file.name;
      fileItem.withCredentials = false;
      this.fileItem = fileItem;
    };

  }

  onSubmit() {
    let name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.fileItem.file.name = name;
    this.documentVersion.filename = name;

    this.uploader.uploadItem(this.fileItem);
    this.uploader.uploadAll();

    if (this.tags != undefined && this.tags != '') {
      let tags: Array<Tag> = new Array<Tag>();
      this.tags.split(',').forEach(function (value) {
        if (value.trim() != '') {
          let tag = new Tag();
          tag.name = value.trim();
          tags.push(tag);
        }
      });
      this.documentVersion.document.tags = tags;
    }
    this.documentVersionService.save(this.documentVersion).subscribe(result => this.gotoDocumentList());
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
