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
              private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.documentService.findByOwner(this.authenticationService.currentUserValue).subscribe(myDocuments => {
      this.myDocuments = myDocuments;

      this.documentService.findAll().subscribe(data => {
        let restDocuments = [];
        data.forEach( function(value1) {
          let exist = false;
          myDocuments.forEach( function(value2) {
            if (value1.id === value2.id) {
              exist = true;
            }
          });
          if (!exist) {
            restDocuments.push(value1);
          }
        });

        this.allDocuments = restDocuments;
      });
    });

  }

}
