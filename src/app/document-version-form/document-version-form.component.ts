import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Document} from "../model/document";
import {DocumentVersion} from "../model/document-version";
import {ActivatedRoute, Router} from "@angular/router";
import {DocumentService} from "../service/document.service";
import {DocumentVersionService} from "../service/document-version.service";
import {AuthenticationService} from "../service/authentication.service";
import {FileUploader, FileItem} from 'ng2-file-upload';
import {FlashMessagesService} from "angular2-flash-messages";

@Component({
  selector: 'app-document-version-form',
  templateUrl: './document-version-form.component.html',
  styleUrls: ['./document-version-form.component.scss']
})
export class DocumentVersionFormComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  uploader: FileUploader;
  isDropOver: boolean;
  fileItem: FileItem;
  originalName: String;

  document: Document;
  documentVersion: DocumentVersion;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private documentService: DocumentService,
              private documentVersionService: DocumentVersionService,
              private authenticationService: AuthenticationService,
              private _flashMessagesService: FlashMessagesService) {
  }

  ngOnInit() {
    this.documentVersion = new DocumentVersion();

    this.route.params.subscribe(params => {
      let documentId = params['id'];
      this.documentService.findById(documentId).subscribe(document => {
        this.document = document;

        if (document.owner.id != this.authenticationService.currentUserValue.id) {
          this._flashMessagesService.show('It is allowed to load a new version only for your documents', { cssClass: 'alert-danger' });
          this.router.navigate(['/documents']);
        }
        this.documentVersion.version = document.versions.length + 1;
        this.documentVersion.document = document;
      });

      const headers = [{name: 'Accept', value: 'application/json'}];
      this.uploader = new FileUploader({url: 'http://localhost:8080/api/files', headers: headers});

      this.uploader.onAfterAddingFile = (fileItem) => {
        this.originalName = fileItem.file.name;
        fileItem.withCredentials = false;
        this.fileItem = fileItem;
      };
    });
  }

  onSubmit() {
    let name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.fileItem.file.name = name;
    this.documentVersion.filename = name;

    this.uploader.uploadItem(this.fileItem);
    this.uploader.uploadAll();

    this.documentVersionService.save(this.documentVersion).subscribe(result =>
      this.gotoDocumentList()
    );
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
