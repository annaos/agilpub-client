import { Component, OnInit } from '@angular/core';
import {User} from "../model/user";
import {UserService} from "../service/user.service";
import {DocumentService} from "../service/document.service";
import {Document} from "../model/document";
import {AuthenticationService} from "../service/authentication.service";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {

  myDocuments: Document[];
  allDocuments: Document[];

  constructor(private documentService: DocumentService,
              private authentificationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.documentService.findByOwner(this.authentificationService.currentUserValue).subscribe(data => {
      this.myDocuments = data;
    });

    this.documentService.findAll().subscribe(data => {
      this.allDocuments = data;//TODO without myDouments
    });
  }

}
