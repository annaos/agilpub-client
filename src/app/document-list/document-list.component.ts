import { Component, OnInit } from '@angular/core';
import {User} from "../model/user";
import {UserService} from "../service/user.service";
import {DocumentService} from "../service/document.service";
import {Document} from "../model/document";
import {AuthenticationService} from "../service/authentication.service";
import {TagService} from "../service/tag.service";
import {Tag} from "../model/tag";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {

  myDocuments: Document[];
  allDocuments: Document[];
  filteredMyDocuments: Document[];
  filteredAllDocuments: Document[];
  tags: Tag[];
  filteredTag: Tag;

  constructor(private documentService: DocumentService,
              private tagService: TagService,
              private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.tagService.findAll().subscribe(tags => {
      this.tags = tags;
    });

    this.documentService.findAll().subscribe(allDocuments => {
      let restDocuments = [];
      let myDocuments = [];
      let self = this;
      allDocuments.forEach( function(value1) {
        if (value1.owner.id != self.authenticationService.currentUserValue.id) {
          restDocuments.push(value1);
        } else {
          myDocuments.push(value1);
        }
      });
      this.myDocuments = this.filteredMyDocuments = myDocuments;
      this.allDocuments = this.filteredAllDocuments = restDocuments;
    });
  }

  filterByTag(tag) {
    if (this.filteredTag == tag) {
      this.filteredMyDocuments = this.myDocuments;
      this.filteredAllDocuments = this.allDocuments;
      this.filteredTag = undefined;
    } else {

      this.filteredTag = tag;

      this.filteredMyDocuments = [];
      this.myDocuments.forEach(value => {
        if (value.tags.find(x => x.id == tag.id) != undefined) {
          this.filteredMyDocuments.push(value);
        }
      });

      this.filteredAllDocuments = [];
      this.allDocuments.forEach(value => {
        if (value.tags.find(x => x.id == tag.id) != undefined) {
          this.filteredAllDocuments.push(value);
        }
      });
    }
  }

}
